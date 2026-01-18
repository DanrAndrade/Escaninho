"use client";
import React, { useState } from 'react';
import { History, Search, Filter, Calendar, Archive, CheckCircle2, Clock } from 'lucide-react';

// DADOS FICTÍCIOS DE HISTÓRICO DE LOCAÇÃO
const MOCK_USAGE_HISTORY = [
  { 
    id: 1, 
    year: '2025',
    student: 'Lucas Oliveira', 
    locker: '114', 
    period: '01/02/2025 a 15/12/2025',
    status: 'Em Uso',
    description: 'Locação anual vigente'
  },
  { 
    id: 2, 
    year: '2025',
    student: 'Sofia Oliveira', 
    locker: '205', 
    period: '01/02/2025 a 15/12/2025',
    status: 'Em Uso',
    description: 'Locação anual vigente'
  },
  { 
    id: 3, 
    year: '2024',
    student: 'Lucas Oliveira', 
    locker: '102', 
    period: '01/02/2024 a 10/12/2024',
    status: 'Concluído',
    description: 'Período encerrado. Chaves devolvidas.'
  },
  { 
    id: 4, 
    year: '2023',
    student: 'Lucas Oliveira', 
    locker: '098', 
    period: '05/02/2023 a 10/12/2023',
    status: 'Concluído',
    description: 'Período encerrado.'
  },
  { 
    id: 5, 
    year: '2023',
    student: 'Sofia Oliveira', 
    locker: '055', 
    period: '05/02/2023 a 10/12/2023',
    status: 'Concluído',
    description: 'Período encerrado.'
  },
];

export function UsageLogsView() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra por aluno, armário ou ano
  const filteredHistory = MOCK_USAGE_HISTORY.filter(item => 
    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.locker.includes(searchTerm) ||
    item.year.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Extrato de Uso</h2>
          <p className="text-slate-600 font-medium text-sm mt-1">Histórico de armários utilizados pela família ao longo dos anos.</p>
        </div>
      </div>

      {/* BARRA DE BUSCA E FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por ano (ex: 2024), aluno ou número do box..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-[#f16137] transition-all placeholder:font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Filter size={18} /> <span className="hidden sm:inline">Filtrar Ano</span>
        </button>
      </div>

      {/* LISTA DE HISTÓRICO */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow group">
              
              {/* Coluna 1: Ano / Destaque */}
              <div className={`w-full md:w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2 ${item.status === 'Em Uso' ? 'bg-[#f16137]/10 border-[#f16137]/20 text-[#f16137]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest">Ano</span>
                <span className="text-2xl font-black">{item.year}</span>
              </div>

              {/* Coluna 2: Detalhes Principais */}
              <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-xl font-black text-slate-900 mb-1">{item.student}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-slate-700 font-bold">
                    <Archive size={14} /> Box {item.locker}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {item.period}
                  </span>
                </div>
              </div>

              {/* Coluna 3: Status */}
              <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-2">
                {item.status === 'Em Uso' ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-700 tracking-wide">
                    <Clock size={14} /> Em Uso
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase bg-slate-100 text-slate-500 tracking-wide">
                    <CheckCircle2 size={14} /> Concluído
                  </span>
                )}
                <p className="text-[10px] font-bold text-slate-400 text-center md:text-right max-w-[200px]">
                  {item.description}
                </p>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-[24px] border border-slate-200 text-center text-slate-400">
            <History size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold text-sm">Nenhum histórico encontrado para "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}