import React from 'react';

export const HistoryTable = () => {
  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Histórico de Reservas
      </h3>
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Aluno</th>
                <th className="px-8 py-5">Período</th>
                <th className="px-8 py-5">Valor</th>
                <th className="px-8 py-5 text-right">Ano Letivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="text-sm hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6 font-black text-slate-900">Pedro Peixoto</td>
                <td className="px-8 py-6 text-slate-600 font-bold uppercase text-xs tracking-wide">12 Meses</td>
                <td className="px-8 py-6 font-black text-slate-900">R$ 450,00</td>
                <td className="px-8 py-6 text-right">
                  <span className="px-3 py-1 bg-[#78865c]/10 text-[#78865c] rounded-lg text-[10px] font-black border border-[#78865c]/20">2025</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};