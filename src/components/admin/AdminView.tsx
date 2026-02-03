import React, { useEffect, useState } from 'react';
import { Check, Loader2, User, Lock, FileText, Clock, AlertCircle, LayoutGrid, List, History, Download, X, Trash2, AlertTriangle } from 'lucide-react';
import { generateContractPDF } from '@/utils/contractGenerator';
import { API_URL } from '@/lib/api';

export function AdminView() {
    const [activeTab, setActiveTab] = useState<'pendentes' | 'historico' | 'mapa'>('pendentes');
    const [reservas, setReservas] = useState<any[]>([]);
    const [mapaData, setMapaData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Estados para o Modal de Cancelamento
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [reservaToCancel, setReservaToCancel] = useState<any>(null);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/reservas-geral`);
            const data = await res.json();
            if (Array.isArray(data)) setReservas(data);

            const resMapa = await fetch(`${API_URL}/api/admin/mapa-detalhado`);
            const dataMapa = await resMapa.json();
            setMapaData(dataMapa);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 4000);
    };

    const handleDownload = (reserva: any) => {
        generateContractPDF(reserva);
    };

    const handleAction = async (action: 'liberar' | 'confirmar', id: number) => {
        setProcessingId(id);
        const endpoint = action === 'liberar' ? 'liberar-boleto' : 'confirmar-pagamento';
        try {
            await fetch(`${API_URL}/api/admin/${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reservation_id: id })
            });
            showToast('✅ Operação realizada com sucesso!');
            fetchData();
        } catch (e) { alert("Erro na operação"); }
        finally { setProcessingId(null); }
    };

    // Abre o modal de confirmação
    const openCancelModal = (reserva: any) => {
        setReservaToCancel(reserva);
        setCancelModalOpen(true);
    };

    // Executa o cancelamento de fato
    const confirmCancel = async () => {
        if (!reservaToCancel) return;
        setProcessingId(reservaToCancel.id);
        setCancelModalOpen(false); // Fecha modal

        try {
            await fetch(`${API_URL}/api/admin/cancelar-reserva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reservation_id: reservaToCancel.id })
            });
            showToast('🚫 Reserva cancelada com sucesso.');
            fetchData();
        } catch (error) {
            alert('Erro ao cancelar.');
        } finally {
            setProcessingId(null);
            setReservaToCancel(null);
        }
    };

    const pendentes = reservas.filter(r => ['PENDING', 'AWAITING_PAYMENT'].includes(r.status));
    const historico = reservas.filter(r => ['ACTIVE', 'EXPIRED', 'CANCELLED'].includes(r.status));

    const mapaUnificado = () => {
        const lista = [];
        for (let i = 0; i < 12; i++) {
            const num = (3320 + i).toString();
            lista.push({ num, data: mapaData[num] || null });
        }
        return lista;
    };

    if (loading && reservas.length === 0) return <div className="p-10 text-center text-slate-400 flex justify-center"><Loader2 className="animate-spin mr-2" /> Carregando...</div>;

    return (
        <div className="pb-20 animate-in fade-in relative">
            {/* TOAST DE SUCESSO */}
            {toastMessage && (
                <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white pl-6 pr-3 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom">
                    <div className="flex items-center gap-3">
                        <Check className="text-emerald-400" /> <span className="font-bold text-sm">{toastMessage}</span>
                    </div>
                    <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={16} className="text-slate-400 hover:text-white" /></button>
                </div>
            )}

            {/* MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
            {cancelModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="bg-red-50 p-3 rounded-full"><AlertTriangle size={24} /></div>
                            <h3 className="text-lg font-black text-slate-900">Cancelar Reserva?</h3>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">
                            Você tem certeza que deseja cancelar a reserva do armário <strong>#{reservaToCancel?.locker_number}</strong>? 
                            <br/><br/>Essa ação não pode ser desfeita e o aluno perderá o armário.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setCancelModalOpen(false)} className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Voltar</button>
                            <button onClick={confirmCancel} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200">Sim, Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-black text-slate-900">Gestão de Reservas</h2>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <TabButton active={activeTab === 'pendentes'} onClick={() => setActiveTab('pendentes')} icon={<List size={16} />} label={`Pendentes (${pendentes.length})`} />
                    <TabButton active={activeTab === 'historico'} onClick={() => setActiveTab('historico')} icon={<History size={16} />} label="Histórico" />
                    <TabButton active={activeTab === 'mapa'} onClick={() => setActiveTab('mapa')} icon={<LayoutGrid size={16} />} label="Status Geral" />
                </div>
            </div>

            {activeTab === 'pendentes' && (
                <div className="grid gap-4">
                    {pendentes.length === 0 && <EmptyState msg="Nenhuma pendência." />}
                    {pendentes.map((reserva) => (
                        <ReservaCard
                            key={reserva.id} reserva={reserva} loading={processingId === reserva.id}
                            onBoleto={() => handleAction('liberar', reserva.id)}
                            onConfirm={() => handleAction('confirmar', reserva.id)}
                            onDownload={() => handleDownload(reserva)}
                            onCancel={() => openCancelModal(reserva)} // Botão Cancelar
                        />
                    ))}
                </div>
            )}

            {activeTab === 'historico' && (
                <div className="grid gap-4">
                    {historico.length === 0 && <EmptyState msg="Histórico vazio." />}
                    {historico.map((reserva) => (
                        <ReservaCard key={reserva.id} reserva={reserva} isHistory onDownload={() => handleDownload(reserva)} />
                    ))}
                </div>
            )}

            {activeTab === 'mapa' && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Armário</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Ocupante (Aluno)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mapaUnificado().map(({ num, data }) => {
                                    let statusBadge = <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">Livre</span>;
                                    let rowClass = "hover:bg-slate-50";

                                    if (data) {
                                        if (data.status === 'ACTIVE') {
                                            statusBadge = <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Check size={12} /> Locado / Pago</span>;
                                            rowClass = "bg-emerald-50/30 hover:bg-emerald-50/50";
                                        } else if (['PENDING', 'AWAITING_PAYMENT'].includes(data.status)) {
                                            statusBadge = <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={12} /> Reservado</span>;
                                            rowClass = "bg-amber-50/30 hover:bg-amber-50/50";
                                        }
                                    }

                                    return (
                                        <tr key={num} className={`transition-colors ${rowClass}`}>
                                            <td className="px-6 py-4 font-black text-slate-800 text-lg">#{num}</td>
                                            <td className="px-6 py-4">{statusBadge}</td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                {data ? data.aluno : <span className="text-slate-300 italic">Disponível</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>{icon} {label}</button>
}

function ReservaCard({ reserva, loading, onBoleto, onConfirm, onDownload, onCancel, isHistory }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-black text-sm">Box {reserva.locker_number}</span>
                    <StatusBadge status={reserva.status} />
                </div>
                <div className="text-sm space-y-1 text-slate-600">
                    <p className="flex items-center gap-2"><User size={14} /> Resp: <strong>{reserva.nome_responsavel}</strong></p>
                    <p className="flex items-center gap-2"><Lock size={14} /> Aluno: {reserva.nome_aluno} (RA: {reserva.ra})</p>
                    <p className="text-xs text-slate-400 mt-1">Data: {new Date(reserva.data_reserva).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-2">
                <button onClick={onDownload} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 flex items-center justify-center gap-2 min-w-[100px] cursor-pointer active:scale-95">
                    <Download size={16} /> PDF
                </button>
                {!isHistory && (
                    <>
                        {/* BOTÃO DE CANCELAR (Apenas para não-histórico) */}
                        <button onClick={onCancel} disabled={loading} className="px-3 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors flex items-center justify-center disabled:opacity-50" title="Cancelar Reserva">
                            <Trash2 size={16} />
                        </button>

                        {reserva.status === 'PENDING' && (
                            <button onClick={onBoleto} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 min-w-[180px]">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />} Liberar Boleto
                            </button>
                        )}
                        {reserva.status === 'AWAITING_PAYMENT' && (
                            <button onClick={onConfirm} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 min-w-[180px]">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} strokeWidth={3} />} Baixar (Pago)
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const badges: any = {
        'PENDING': <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1"><Clock size={12} /> Aguardando Admin</span>,
        'AWAITING_PAYMENT': <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1"><AlertCircle size={12} /> Aguardando Pagamento</span>,
        'ACTIVE': <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center gap-1"><Check size={12} /> Pago / Ativo</span>,
        'EXPIRED': <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">Expirado (48h)</span>,
        'CANCELLED': <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Cancelado</span>
    };
    return badges[status] || null;
}

function EmptyState({ msg }: { msg: string }) {
    return <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">{msg}</div>
}