"use client";
import React from 'react';
import { CreditCard, Download, Check, AlertCircle } from 'lucide-react';

export function FinancialView() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Financeiro</h2>
        <p className="text-slate-600 font-medium text-sm mt-1">Gerencie faturas e comprovantes de pagamento.</p>
      </div>

      <div className="bg-white border-l-4 border-l-amber-500 rounded-r-2xl border-y border-r border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Fatura Pendente</h3>
            <p className="text-slate-500 text-sm">Referente à locação do Box #114 (2025)</p>
            <p className="text-amber-600 font-bold text-xs mt-2 uppercase tracking-wide">Vence em 2 dias</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-3 w-full md:w-auto">
          <span className="text-3xl font-black text-slate-900">R$ 250,00</span>
          <button className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm">
            <CreditCard size={16} /> Pagar Agora
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.25em] ml-2">Histórico de Pagamentos</h3>
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">Renovação Anual 2024</td>
                <td className="px-6 py-4 text-sm text-slate-500">10/02/2024</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600">
                    <Check size={10} /> Pago
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-black text-slate-800">R$ 250,00</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-[#f16137] transition-colors"><Download size={16} /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}