import React, { useEffect, useState } from 'react';
import { Plus, Lock, Loader2, Clock, AlertCircle } from 'lucide-react';

interface AlunoDoBanco {
  id: number;
  nome: string;
  ra: string;
}

interface ReservaDoBanco {
  id: number;
  locker_number: string;
  status: 'PENDING' | 'AWAITING_PAYMENT' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  data_reserva: string;
  ano_letivo: string;
  nome_aluno: string;
  valor: string;
}

interface DashboardViewProps {
  onNewRental: () => void;
  userEmail: string;
}

export const DashboardView = ({ onNewRental, userEmail }: DashboardViewProps) => {
  const [students, setStudents] = useState<AlunoDoBanco[]>([]);
  const [reservas, setReservas] = useState<ReservaDoBanco[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userEmail) return;
        const resAlunos = await fetch(`http://localhost:3001/api/meus-alunos?email=${userEmail}`);
        const dataAlunos = await resAlunos.json();
        if (Array.isArray(dataAlunos)) setStudents(dataAlunos);

        const resReservas = await fetch(`http://localhost:3001/api/minhas-reservas?email=${userEmail}`);
        const dataReservas = await resReservas.json();
        if (Array.isArray(dataReservas)) setReservas(dataReservas);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [userEmail]);

  const locacoesAtivas = reservas.filter(r => r.status === 'ACTIVE');

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Central de Reservas</h2>
          <p className="text-slate-600 font-medium text-sm mt-1">Gerencie os acessos e escaninhos da sua família.</p>
        </div>
        
        <button 
          onClick={onNewRental}
          className="w-auto bg-gradient-to-br from-[#c84622] to-[#f16137] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#f16137]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> Nova Locação
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Card Alunos */}
        <div className="space-y-3">
          {/* CORREÇÃO DO HTML AQUI: Era <p>, virou <div> */}
          <div className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f16137]" /> Alunos Vinculados
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
            {loading && <div className="flex justify-center items-center h-full text-slate-400"><Loader2 className="animate-spin mr-2"/> Carregando...</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map(student => (
                <div key={student.id} className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#f16137] border border-slate-100 shadow-sm mb-3">
                    {student.nome.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-sm leading-tight truncate">{student.nome}</p>
                    <p className="text-[10px] text-slate-700 font-bold mt-1 uppercase tracking-wider">RA: {student.ra}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Locações Ativas */}
        <div className="space-y-3">
          {/* CORREÇÃO DO HTML AQUI TAMBÉM */}
          <div className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#78865c]" /> Locações Ativas
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
            {!loading && locacoesAtivas.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full py-6 text-center text-slate-400 text-sm">
                  Nenhuma locação ativa no momento.
               </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locacoesAtivas.map(rental => (
                <div key={rental.id} className="flex items-center gap-3 p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl">
                  <div className="w-10 h-10 bg-[#78865c] text-white rounded-xl flex items-center justify-center shadow-lg shrink-0"><Lock size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-[#78865c] uppercase tracking-widest truncate">Box #{rental.locker_number}</p>
                    <p className="text-sm font-black text-slate-900 leading-none mt-1 truncate">{rental.nome_aluno}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de Histórico (Sem Valor) */}
      <div className="space-y-3 pt-2">
         <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Histórico e Status
         </h3>
         <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-800 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                         <th className="px-8 py-4">Status</th>
                         <th className="px-8 py-4">Armário</th>
                         <th className="px-8 py-4">Aluno</th>
                         <th className="px-8 py-4 text-right">Data Reserva</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {reservas.map((reserva) => (
                        <tr key={reserva.id} className="text-sm hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5">
                              {reserva.status === 'ACTIVE' && <StatusTag color="emerald" text="Ativo / Pago" />}
                              {reserva.status === 'PENDING' && <StatusTag color="amber" text="Aguard. Liberação" icon={<Clock size={10}/>} />}
                              {reserva.status === 'AWAITING_PAYMENT' && <StatusTag color="blue" text="Boleto Disponível (24h)" icon={<AlertCircle size={10}/>} />}
                              {reserva.status === 'EXPIRED' && <StatusTag color="red" text="Suspenso / Expirado" />}
                          </td>
                          <td className="px-8 py-5 font-black text-slate-900">#{reserva.locker_number}</td>
                          <td className="px-8 py-5 text-slate-700 font-medium">{reserva.nome_aluno}</td>
                          <td className="px-8 py-5 text-right text-slate-500 text-xs">{new Date(reserva.data_reserva).toLocaleDateString()}</td>
                        </tr>
                      ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};

function StatusTag({ color, text, icon }: any) {
    const styles: any = {
        emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
        amber: "bg-amber-100 text-amber-700 border-amber-200",
        blue: "bg-blue-100 text-blue-700 border-blue-200",
        red: "bg-red-100 text-red-700 border-red-200"
    };
    return (
        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black border uppercase flex items-center gap-1 w-fit ${styles[color]}`}>
            {icon} {text}
        </span>
    );
}