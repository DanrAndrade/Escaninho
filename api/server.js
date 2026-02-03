require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONEXÃO COM POOL ---
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'escola_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// --- CONFIGURAÇÃO DE EMAIL ---
const transporter = nodemailer.createTransport({
    // Ajuste conforme seu provedor (HostGator, Gmail, etc)
    service: 'gmail', // ou remova esta linha e use host/port/secure
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const enviarEmailReal = (destinatario, assunto, texto) => {
    const mailOptions = { 
        from: `Secretaria IASC (Não Responder) <${process.env.EMAIL_USER}>`, 
        to: destinatario, 
        subject: assunto, 
        text: texto 
    };
    transporter.sendMail(mailOptions, (err, info) => { 
        if(err) console.log('⚠️ Erro Email:', err.message);
        else console.log('✅ Email enviado:', info.response);
    });
};

// --- FUNÇÃO AUXILIAR DE LIMPEZA (PRAZO DE 48H) ---
const limparReservasExpiradas = (callback) => {
    const sql = `UPDATE locacoes SET status = 'EXPIRED' WHERE status = 'AWAITING_PAYMENT' AND data_limite_pagamento < NOW()`;
    db.query(sql, (err, result) => {
        if(callback) callback();
    });
};

// ==========================================
// ROTAS
// ==========================================

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM sistema_usuarios WHERE email = ?', [email], (err, resAdmin) => {
        if (err) return res.status(500).json({ error: 'Erro interno' });
        if (resAdmin && resAdmin.length > 0) {
            if (resAdmin[0].password === password) return res.json({ id: resAdmin[0].id, name: resAdmin[0].name, email: resAdmin[0].email, role: resAdmin[0].role });
            else return res.status(401).json({ error: 'Senha incorreta' });
        }
        const queryPai = `SELECT r.id, r.nome, r.email, s.senha FROM responsaveis r JOIN sistema_acessos_pais s ON r.id = s.responsavel_id WHERE r.email = ?`;
        db.query(queryPai, [email], (err, resPai) => {
            if (resPai && resPai.length > 0) {
                if (resPai[0].senha === password) return res.json({ id: resPai[0].id, name: resPai[0].nome, email: resPai[0].email, role: 'PAI' });
                else return res.status(401).json({ error: 'Senha incorreta' });
            }
            res.status(401).json({ error: 'Usuário não encontrado.' });
        });
    });
});

// 2. MEUS ALUNOS
app.get('/api/meus-alunos', (req, res) => {
    if (!req.query.email) return res.status(400).json([]);
    db.query('SELECT a.* FROM alunos a JOIN responsaveis r ON a.id = r.aluno_id WHERE r.email = ?', [req.query.email], (err, results) => res.json(results || []));
});

// 3. MAPA DE ARMÁRIOS
app.get('/api/armarios', (req, res) => {
    limparReservasExpiradas(() => {
        db.query("SELECT locker_number FROM locacoes WHERE status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT') AND ano_letivo = '2025'", (err, results) => {
            res.json(results ? results.map(r => r.locker_number) : []);
        });
    });
});

// 4. RESERVAR
app.post('/api/reservar', (req, res) => {
    const { aluno_id, responsavel_id, locker_number, valor, ano_letivo } = req.body;
    limparReservasExpiradas(() => {
        db.query("SELECT id FROM locacoes WHERE locker_number = ? AND ano_letivo = ? AND status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT')", [locker_number, ano_letivo], (err, results) => {
            if (results && results.length > 0) return res.status(409).json({ error: 'Armário indisponível.' });
            db.query("INSERT INTO locacoes (aluno_id, responsavel_id, locker_number, status, valor, ano_letivo, data_reserva) VALUES (?, ?, ?, 'PENDING', ?, ?, NOW())", 
                [aluno_id, responsavel_id, locker_number, valor, ano_letivo], 
                (err, result) => res.json({ success: true, reservationId: result.insertId })
            );
        });
    });
});

// 5. CONTRATO
app.get('/api/contrato-atual', (req, res) => {
    db.query('SELECT texto FROM termos_contrato WHERE ativo = 1 ORDER BY id DESC LIMIT 1', (err, results) => {
        res.json({ texto: (results && results.length) ? results[0].texto : '<p>Contrato indisponível.</p>' });
    });
});

// 6. ASSINAR
app.post('/api/assinar', (req, res) => {
    const { reservation_id, ip_address, user_agent } = req.body;
    db.query("INSERT INTO assinaturas_contratos (locacao_id, ip_address, user_agent, versao_contrato) VALUES (?, ?, ?, 'v1.0')", 
        [reservation_id, ip_address, user_agent], 
        () => res.json({ success: true })
    );
});

// 7. MINHAS RESERVAS
app.get('/api/minhas-reservas', (req, res) => {
    limparReservasExpiradas(() => {
        if (!req.query.email) return res.status(400).json([]);
        const query = `SELECT l.*, a.nome as nome_aluno, a.ra, r.nome as nome_responsavel, r.email as email_responsavel, s.ip_address, s.data_assinatura FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id JOIN alunos a ON l.aluno_id = a.id LEFT JOIN assinaturas_contratos s ON l.id = s.locacao_id WHERE r.email = ? ORDER BY l.data_reserva DESC`;
        db.query(query, [req.query.email], (err, results) => res.json(results || []));
    });
});

// 8. ADMIN LISTA GERAL
app.get('/api/admin/reservas-geral', (req, res) => {
    limparReservasExpiradas(() => {
        const query = `SELECT l.id, l.locker_number, l.status, l.data_reserva, l.valor, l.data_limite_pagamento, r.nome as nome_responsavel, r.email as email_responsavel, a.nome as nome_aluno, a.ra, s.ip_address, s.data_assinatura FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id JOIN alunos a ON l.aluno_id = a.id LEFT JOIN assinaturas_contratos s ON l.id = s.locacao_id ORDER BY l.data_reserva DESC`;
        db.query(query, (err, results) => res.json(results || []));
    });
});

// 9. ADMIN MAPA
app.get('/api/admin/mapa-detalhado', (req, res) => {
    limparReservasExpiradas(() => {
        const query = `SELECT l.locker_number, l.status, a.nome as aluno FROM locacoes l JOIN alunos a ON l.aluno_id = a.id WHERE l.status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT') AND l.ano_letivo = '2025'`;
        db.query(query, (err, results) => {
            const mapData = {};
            if (results) results.forEach(r => { mapData[r.locker_number] = { status: r.status, aluno: r.aluno }; });
            res.json(mapData);
        });
    });
});

// 10. LIBERAR BOLETO (MENSAGEM AJUSTADA)
app.post('/api/admin/liberar-boleto', (req, res) => {
    const { reservation_id } = req.body;
    db.query(`SELECT r.email, r.nome, l.locker_number FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id WHERE l.id = ?`, [reservation_id], (err, results) => {
        if(results && results.length > 0) {
            const { email, nome, locker_number } = results[0];
            db.query(`UPDATE locacoes SET status = 'AWAITING_PAYMENT', data_limite_pagamento = DATE_ADD(NOW(), INTERVAL 48 HOUR) WHERE id = ?`, [reservation_id], () => {
                const assunto = 'IASC - Boleto Disponível';
                
                // MENSAGEM ESPECÍFICA SOBRE RESPONSÁVEL FINANCEIRO
                const mensagem = `Olá ${nome},\n\nO pagamento do armário #${locker_number} foi liberado.\n\nO boleto já está disponível no Portal IASC.\nIMPORTANTE: Acesse pelo perfil do Responsável Financeiro para visualizar a cobrança.\n\n(Caso já tenha efetuado o pagamento, por favor, desconsidere esta mensagem).\n\nAtenciosamente,\nSecretaria IASC`;
                
                enviarEmailReal(email, assunto, mensagem);
                res.json({ success: true });
            });
        } else { res.status(404).json({error: 'Não encontrado'}); }
    });
});

// 11. CONFIRMAR PAGAMENTO
app.post('/api/admin/confirmar-pagamento', (req, res) => {
    const { reservation_id } = req.body;
    db.query(`SELECT r.email, r.nome, l.locker_number FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id WHERE l.id = ?`, [reservation_id], (err, results) => {
        if(results && results.length > 0) {
            const { email, nome, locker_number } = results[0];
            db.query("UPDATE locacoes SET status = 'ACTIVE', data_pagamento = NOW() WHERE id = ?", [reservation_id], () => {
                enviarEmailReal(email, 'IASC - Armário Liberado', `Olá ${nome}, o pagamento foi confirmado e o armário #${locker_number} está liberado para uso.`);
                res.json({ success: true });
            });
        }
    });
});

// 12. CANCELAR RESERVA
app.post('/api/admin/cancelar-reserva', (req, res) => {
    const { reservation_id } = req.body;
    db.query(`SELECT r.email, r.nome, l.locker_number FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id WHERE l.id = ?`, [reservation_id], (err, results) => {
        if(results && results.length > 0) {
            const { email, nome, locker_number } = results[0];
            db.query("UPDATE locacoes SET status = 'CANCELLED' WHERE id = ?", [reservation_id], () => {
                enviarEmailReal(email, 'IASC - Cancelamento de Reserva', `Olá ${nome},\n\nA reserva do armário #${locker_number} foi cancelada pela secretaria.\n\nCaso tenha dúvidas, entre em contato.`);
                res.json({ success: true });
            });
        } else {
            res.status(404).json({error: 'Reserva não encontrada'});
        }
    });
});

app.listen(3001, () => console.log(`🚀 API rodando na porta 3001`));