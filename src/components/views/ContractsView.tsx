import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Download, AlertCircle, Loader2 } from 'lucide-react';

export function ContractsView() {
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('escaninho_user') || '{}');
        if (user.email) {
            fetch(`http://localhost:3001/api/minhas-reservas?email=${user.email}`)
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setContracts(data); })
                .finally(() => setLoading(false));
        }
    }, []);

    const handleDirectDownload = async (reserva: any) => {
        setDownloadingId(reserva.id);
        let tempContainer: HTMLElement | null = null;

        try {
            // 1. Carrega biblioteca
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;

            // 2. Busca dados
            const res = await fetch('http://localhost:3001/api/contrato-atual');
            const data = await res.json();
            const textoContrato = data.texto;

            // 3. CRIA ELEMENTO TEMPORÁRIO FORA DO REACT (DOM PURO)
            tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '210mm'; // Largura A4
            tempContainer.style.backgroundColor = 'white'; // Garante fundo branco

            // Injeta o HTML
            tempContainer.innerHTML = `
            <div style="padding: 40px; font-family: 'Times New Roman', serif; color: #000;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="/logo.svg" style="height: 60px; margin-bottom: 10px;" />
                    <h1 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 10px;">Contrato de Locação</h1>
                </div>
                <div style="font-size: 12px; margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px;">
                    <p><strong>CONTRATANTE:</strong> ${reserva.nome_responsavel}</p>
                    <p><strong>ALUNO:</strong> ${reserva.nome_aluno} (RA: ${reserva.ra})</p>
                    <p><strong>ARMÁRIO:</strong> ${reserva.locker_number}</p>
                    <p><strong>VALOR:</strong> R$ 250,00</p>
                </div>
                <div style="font-size: 12px; text-align: justify; line-height: 1.5;">${textoContrato}</div>
                <div style="margin-top: 40px; padding: 15px; border: 1px solid #ccc; background: #f9f9f9; font-size: 10px;">
                    <p><strong>ASSINATURA DIGITAL</strong></p>
                    <p>Assinado eletronicamente em: ${new Date(reserva.data_assinatura).toLocaleString()}</p>
                </div>
            </div>
        `;

            // Adiciona ao corpo da página
            document.body.appendChild(tempContainer);

            // 4. Configura e Gera PDF
            const opt = {
                margin: 10,
                filename: `Contrato_IASC_Box${reserva.locker_number}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
            };

            await html2pdf().set(opt).from(tempContainer).save();

        } catch (error) {
            console.error("Erro PDF:", error);
            alert('Erro ao gerar arquivo. Tente novamente.');
        }
        finally {
            // 5. LIMPEZA OBRIGATÓRIA
            if (tempContainer && document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
            setDownloadingId(null);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400 font-bold">Carregando...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in">
            {/* NÃO EXISTE MAIS A DIV print-area-pai AQUI */}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Meus Contratos</h2>
                <div className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                    {contracts.length} registro(s)
                </div>
            </div>

            {contracts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><FileText size={32} /></div>
                    <p className="text-slate-500 font-medium">Você ainda não possui locações.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {contracts.map((contract) => (
                        <ContractCard
                            key={contract.id}
                            data={contract}
                            downloading={downloadingId === contract.id}
                            onDownload={() => handleDirectDownload(contract)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ContractCard({ data, onDownload, downloading }: any) {
    const isPending = data.status === 'PENDING';
    const isAwaiting = data.status === 'AWAITING_PAYMENT';
    const date = new Date(data.data_reserva).toLocaleDateString('pt-BR');

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${data.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-amber-400'}`} />

            <div className="pl-4 flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-2xl text-slate-800">#{data.locker_number}</span>
                    <StatusBadge status={data.status} />
                </div>
                <div className="text-sm text-slate-500 space-y-1">
                    <p>Aluno: <strong className="text-slate-700">{data.nome_aluno}</strong></p>
                    <p>Assinado em: {date}</p>
                    {(isPending || isAwaiting) && (
                        <div className="mt-3 bg-amber-50 border border-amber-100 p-3 rounded-lg flex gap-3 items-start">
                            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 leading-relaxed">
                                {isPending ? 'Aguarde a liberação do boleto.' : 'Boleto disponível no Portal do Aluno.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-3 pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                <button onClick={onDownload} disabled={downloading} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {downloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                    Baixar Contrato
                </button>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'PENDING') return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100"><Clock size={10} /> Em Análise</span>
    if (status === 'AWAITING_PAYMENT') return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100"><AlertCircle size={10} /> Aguardando Pagamento</span>
    if (status === 'ACTIVE') return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle size={10} /> Ativo</span>
    return <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100"><XCircle size={10} /> Cancelado</span>
}