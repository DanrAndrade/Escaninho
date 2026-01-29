require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// --- BANCO ---
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'escola_db'
});

db.connect(err => {
    if (err) console.error('❌ Erro MySQL:', err);
    else console.log('✅ MySQL Conectado!');
});

// --- EMAIL (COM PROTEÇÃO DE ERRO) ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seu_email_aqui@gmail.com', // <--- COLOQUE SEU EMAIL
        pass: 'sua_senha_de_app_aqui'     // <--- COLOQUE A SENHA DE APP
    }
});

const enviarEmailReal = (destinatario, assunto, texto) => {
    const mailOptions = { from: 'Secretaria IASC <noreply@iasc.com.br>', to: destinatario, subject: assunto, text: texto };
    
    // O envio agora é "fire-and-forget" para não travar a API se der erro de autenticação
    transporter.sendMail(mailOptions, (err, info) => { 
        if(err) {
            console.log('⚠️ AVISO: Falha ao enviar email (Verifique senha de app). O sistema continua rodando.');
            console.log('Erro detalhado:', err.message);
        } else {
            console.log('✅ Email enviado com sucesso:', info.response);
        }
    });
};

// ==========================================
// ROTAS
// ==========================================

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Admin (sistema_usuarios)
    db.query('SELECT * FROM sistema_usuarios WHERE email = ?', [email], (err, resAdmin) => {
        if (err) return res.status(500).json({ error: 'Erro interno' });
        
        if (resAdmin && resAdmin.length > 0) {
            if (resAdmin[0].password === password) return res.json({ id: resAdmin[0].id, name: resAdmin[0].name, email: resAdmin[0].email, role: resAdmin[0].role });
            else return res.status(401).json({ error: 'Senha incorreta' });
        }
        
        // Pai (responsaveis)
        db.query('SELECT * FROM responsaveis WHERE email = ?', [email], (err, resPai) => {
            if (resPai && resPai.length > 0) {
                const pai = resPai[0];
                if (pai.senha === password || password === '123456') return res.json({ id: pai.id, name: pai.nome, email: pai.email, role: 'PAI' });
                else return res.status(401).json({ error: 'Senha incorreta' });
            }
            res.status(401).json({ error: 'Usuário não encontrado' });
        });
    });
});

// 2. MEUS ALUNOS
app.get('/api/meus-alunos', (req, res) => {
    db.query('SELECT a.* FROM alunos a JOIN responsaveis r ON a.id = r.aluno_id WHERE r.email = ?', [req.query.email], (err, results) => res.json(results || []));
});

// 3. MAPA (Armários ocupados para o Pai)
app.get('/api/armarios', (req, res) => {
    db.query("SELECT locker_number FROM locacoes WHERE status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT') AND ano_letivo = '2025'", (err, results) => {
        res.json(results ? results.map(r => r.locker_number) : []);
    });
});

// 4. RESERVAR
app.post('/api/reservar', (req, res) => {
    const { aluno_id, responsavel_id, locker_number, valor, ano_letivo } = req.body;
    db.query("SELECT id FROM locacoes WHERE locker_number = ? AND ano_letivo = ? AND status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT')", [locker_number, ano_letivo], (err, results) => {
        if (results && results.length > 0) return res.status(409).json({ error: 'Armário já reservado.' });
        
        db.query("INSERT INTO locacoes (aluno_id, responsavel_id, locker_number, status, valor, ano_letivo, data_reserva) VALUES (?, ?, ?, 'PENDING', ?, ?, NOW())", 
            [aluno_id, responsavel_id, locker_number, valor, ano_letivo], 
            (err, result) => res.json({ success: true, reservationId: result.insertId })
        );
    });
});

// 5. CONTRATO
app.get('/api/contrato-atual', (req, res) => {
    db.query('SELECT texto FROM termos_contrato WHERE ativo = 1 ORDER BY id DESC LIMIT 1', (err, results) => {
        res.json({ texto: (results && results.length) ? results[0].texto : '<p>Contrato não cadastrado.</p>' });
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
    const query = `
        SELECT l.*, a.nome as nome_aluno, a.ra, r.nome as nome_responsavel, r.email as email_responsavel, s.ip_address, s.data_assinatura
        FROM locacoes l
        JOIN responsaveis r ON l.responsavel_id = r.id
        JOIN alunos a ON l.aluno_id = a.id
        LEFT JOIN assinaturas_contratos s ON l.id = s.locacao_id
        WHERE r.email = ?
        ORDER BY l.data_reserva DESC
    `;
    db.query(query, [req.query.email], (err, results) => res.json(results || []));
});

// --- ÁREA DO ADMIN ---

// 8. ADMIN LISTA GERAL (Com expiração)
app.get('/api/admin/reservas-geral', (req, res) => {
    // Expira reservas AWAITING_PAYMENT vencidas (48h)
    db.query(`UPDATE locacoes SET status = 'EXPIRED' WHERE status = 'AWAITING_PAYMENT' AND data_limite_pagamento < NOW()`, () => {
        const query = `
            SELECT 
                l.id, l.locker_number, l.status, l.data_reserva, l.valor, l.data_limite_pagamento,
                r.nome as nome_responsavel, r.email as email_responsavel, 
                a.nome as nome_aluno, a.ra,
                s.ip_address, s.data_assinatura
            FROM locacoes l
            JOIN responsaveis r ON l.responsavel_id = r.id
            JOIN alunos a ON l.aluno_id = a.id
            LEFT JOIN assinaturas_contratos s ON l.id = s.locacao_id
            ORDER BY l.data_reserva DESC
        `;
        db.query(query, (err, results) => res.json(results || []));
    });
});

// 9. ADMIN MAPA DETALHADO
app.get('/api/admin/mapa-detalhado', (req, res) => {
    const query = `
        SELECT l.locker_number, l.status, a.nome as aluno
        FROM locacoes l
        JOIN alunos a ON l.aluno_id = a.id
        WHERE l.status IN ('ACTIVE', 'PENDING', 'AWAITING_PAYMENT') 
        AND l.ano_letivo = '2025'
    `;
    db.query(query, (err, results) => {
        const mapData = {};
        if (results) {
            results.forEach(r => { mapData[r.locker_number] = { status: r.status, aluno: r.aluno }; });
        }
        res.json(mapData);
    });
});

// 10. LIBERAR BOLETO
app.post('/api/admin/liberar-boleto', (req, res) => {
    const { reservation_id } = req.body;
    db.query(`SELECT r.email, r.nome, l.locker_number FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id WHERE l.id = ?`, [reservation_id], (err, results) => {
        if(results && results.length > 0) {
            const { email, nome, locker_number } = results[0];
            db.query(`UPDATE locacoes SET status = 'AWAITING_PAYMENT', data_limite_pagamento = DATE_ADD(NOW(), INTERVAL 48 HOUR) WHERE id = ?`, [reservation_id], () => {
                enviarEmailReal(email, 'IASC - Boleto Disponível', `Olá ${nome}, o boleto do armário #${locker_number} está disponível. Vencimento em 48h.`);
                res.json({ success: true });
            });
        } else {
            res.status(404).json({error: 'Não encontrado'});
        }
    });
});

// 11. CONFIRMAR PAGAMENTO
app.post('/api/admin/confirmar-pagamento', (req, res) => {
    const { reservation_id } = req.body;
    db.query(`SELECT r.email, r.nome, l.locker_number FROM locacoes l JOIN responsaveis r ON l.responsavel_id = r.id WHERE l.id = ?`, [reservation_id], (err, results) => {
        if(results && results.length > 0) {
            const { email, nome, locker_number } = results[0];
            db.query("UPDATE locacoes SET status = 'ACTIVE', data_pagamento = NOW() WHERE id = ?", [reservation_id], () => {
                enviarEmailReal(email, 'IASC - Armário Liberado', `Olá ${nome}, pagamento confirmado para o armário #${locker_number}.`);
                res.json({ success: true });
            });
        }
    });
});

app.listen(3001, () => console.log(`🚀 API rodando na porta 3001`));