import React, { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Download, AlertCircle, Loader2 } from 'lucide-react';
import { generateContractPDF } from '@/utils/contractGenerator';
import { API_URL } from '@/lib/api';

export function ContractsView() {
    const [contracts, setContracts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('escaninho_user') || '{}');
        if (user.email) {
            fetch(`${API_URL}/api/minhas-reservas?email=${user.email}`)
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setContracts(data); })
                .finally(() => setLoading(false));
        }
    }, []);

    const handleDownload = (reserva: any) => {
        generateContractPDF(reserva);
    };

    if (loading) return <div className="p-8 text-center text-slate-400 font-bold">Carregando...</div>;

    return (
        <div className="space-y-6 pb-20 animate-in fade-in">
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
                            onDownload={() => handleDownload(contract)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ContractCard({ data, onDownload }: any) {
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
                                {isPending 
                                    ? 'Aguarde a liberação do boleto.' 
                                    : 'Boleto disponível no Portal do Aluno. (Caso já tenha pago, desconsidere).'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-3 pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                <button onClick={onDownload} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2 w-full md:w-auto justify-center cursor-pointer active:scale-95">
                    <Download size={16} />
                    Baixar PDF
                </button>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const badges: any = {
        'PENDING': <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1"><Clock size={10} /> Em Análise</span>,
        'AWAITING_PAYMENT': <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1"><AlertCircle size={10} /> Aguardando Pagamento</span>,
        'ACTIVE': <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><CheckCircle size={10} /> Ativo</span>,
        'EXPIRED': <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">Expirado</span>,
        'CANCELLED': <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Cancelado</span>
    };
    return badges[status] || badges['CANCELLED'];
}