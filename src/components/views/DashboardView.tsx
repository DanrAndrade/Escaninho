import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { Student, Rental } from '@/types';

interface DashboardViewProps {
  students: Student[];
  rentals: Rental[];
  onNewRental: () => void;
}

export const DashboardView = ({ students, rentals, onNewRental }: DashboardViewProps) => {
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
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#f16137]" /> Alunos Vinculados
          </p>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {students.map(student => (
                <div key={student.id} className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-2xl group cursor-pointer hover:border-[#f16137] hover:bg-white transition-all shadow-sm">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#f16137] border border-slate-100 shadow-sm group-hover:bg-[#f16137] group-hover:text-white transition-all mb-3">
                    {student.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-900 text-sm leading-tight truncate">{student.name}</p>
                    <p className="text-[10px] text-slate-700 font-bold mt-1 uppercase tracking-wider">{student.grade}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Locações */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#78865c]" /> Locações Ativas
          </p>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rentals.map(rental => (
                <div key={rental.id} className="flex items-center gap-3 p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-[#78865c] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#78865c]/20 shrink-0">
                      <Lock size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-[#78865c] uppercase tracking-widest truncate">Box #{rental.locker}</p>
                    <p className="text-sm font-black text-slate-900 leading-none mt-1 truncate">{rental.student}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de Histórico (Pode ser outro componente, mas deixei aqui por brevidade) */}
      <div className="space-y-3 pt-2">
         <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Histórico de Locações
         </h3>
         <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-800 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        <th className="px-8 py-4">Aluno</th>
                        <th className="px-8 py-4">Tempo Total</th>
                        <th className="px-8 py-4">Valor Pago</th>
                        <th className="px-8 py-4 text-right">Ano Letivo</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     <tr className="text-sm hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-black text-slate-900">Pedro Peixoto</td>
                        <td className="px-8 py-5 text-slate-700 font-bold text-xs uppercase tracking-wide">12 Meses</td>
                        <td className="px-8 py-5 font-black text-slate-900">R$ 450,00</td>
                        <td className="px-8 py-5 text-right">
                           <span className="px-3 py-1 bg-[#78865c]/10 text-[#78865c] rounded-full text-[10px] font-black border border-[#78865c]/20">2025</span>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
};
