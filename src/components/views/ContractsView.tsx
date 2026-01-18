"use client";
import React, { useState } from 'react';
import { FileText, Download, Calendar, Search, Filter, ChevronRight } from 'lucide-react';

const MOCK_CONTRACTS = [
  { 
    id: 'CTR-2025-001', 
    student: 'Lucas Oliveira', 
    locker: '114', 
    year: '2025', 
    status: 'Ativo', 
    date: '15/01/2025' 
  },
  { 
    id: 'CTR-2025-089', 
    student: 'Sofia Oliveira', 
    locker: '205', 
    year: '2025', 
    status: 'Ativo', 
    date: '15/01/2025' 
  },
  { 
    id: 'CTR-2024-112', 
    student: 'Lucas Oliveira', 
    locker: '102', 
    year: '2024', 
    status: 'Expirado', 
    date: '10/01/2024' 
  },
  { 
    id: 'CTR-2023-055', 
    student: 'Sofia Oliveira', 
    locker: '055', 
    year: '2023', 
    status: 'Expirado', 
    date: '05/02/2023' 
  }
];

export function ContractsView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = MOCK_CONTRACTS.filter(contract => 
    contract.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.locker.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Meus Contratos</h2>
          <p className="text-slate-600 font-medium text-sm mt-1">Histórico completo de adesão dos armários.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome do aluno, número do contrato ou armário..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-[#f16137] transition-all placeholder:font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Filter size={18} /> Filtros
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contrato</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Aluno</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Armário</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <FileText size={18} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{contract.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900 text-sm">{contract.student}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-black">Box {contract.locker}</span>
                  </td>
                  <td className="px-6 py-4">
                    {contract.status === 'Ativo' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-500 tracking-wide">
                        Expirado
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar size={14} /> {contract.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#f16137] hover:bg-[#f16137]/10 p-2 rounded-lg transition-colors" title="Baixar PDF">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredContracts.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-sm">Nenhum contrato encontrado para "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}