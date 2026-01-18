"use client";
import React, { useState } from 'react';
import { Search, Filter, User, FileText, LockOpen, Lock, AlertCircle } from 'lucide-react';

// --- MOCK DATABASE SIMPLIFICADO ---
const LOCKER_DATABASE = [
  { id: '101', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '102', status: 'ocupado', student: 'João da Silva', parent: 'Carlos Silva', class: '9º Ano A', date: '10/01/2025' },
  { id: '103', status: 'pendente', student: 'Mariana Souza', parent: 'Fernanda Souza', class: '7º Ano B', date: '16/01/2025' }, // Pendente = Reservado (não está vago)
  { id: '104', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '105', status: 'ocupado', student: 'Lucas Oliveira', parent: 'Roberto Oliveira', class: '6º Ano A', date: '15/01/2025' },
  { id: '106', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '107', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '108', status: 'ocupado', student: 'Beatriz Costa', parent: 'Amanda Costa', class: '1ª Série EM', date: '18/01/2025' },
  { id: '109', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '110', status: 'disponivel', student: null, parent: null, class: null, date: null },
  { id: '114', status: 'ocupado', student: 'Sofia Oliveira', parent: 'Roberto Oliveira', class: '9º Ano B', date: '15/01/2025' },
  { id: '115', status: 'pendente', student: 'Enzo Ferreira', parent: 'Marcos Ferreira', class: '2ª Série EM', date: '19/01/2025' },
];

export function AdminView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'disponivel' | 'ocupado' | 'pendente'>('todos');

  // Lógica de Filtragem
  const filteredLockers = LOCKER_DATABASE.filter(locker => {
    const matchesSearch = 
      locker.id.includes(searchTerm) ||
      (locker.student && locker.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (locker.parent && locker.parent.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'todos' || locker.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Contadores
  const totalFree = LOCKER_DATABASE.filter(l => l.status === 'disponivel').length;
  const totalOccupied = LOCKER_DATABASE.filter(l => l.status === 'ocupado').length;
  const totalPending = LOCKER_DATABASE.filter(l => l.status === 'pendente').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Cabeçalho Simplificado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Gestão de Armários</h2>
          <p className="text-slate-600 font-medium text-sm mt-1">Controle de disponibilidade e ocupação.</p>
        </div>
        {/* Botão de Relatório Removido */}
      </div>

      {/* Cards de Resumo Rápido */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setStatusFilter('todos')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'todos' ? 'bg-slate-800 text-white border-slate-800 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Total</div>
          <div className="text-3xl font-black mt-1">{LOCKER_DATABASE.length}</div>
        </button>
        <button onClick={() => setStatusFilter('disponivel')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'disponivel' ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-white border-slate-200 hover:border-emerald-200'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Livres</div>
          <div className={`text-3xl font-black mt-1 ${statusFilter === 'disponivel' ? 'text-white' : 'text-emerald-600'}`}>{totalFree}</div>
        </button>
        <button onClick={() => setStatusFilter('ocupado')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'ocupado' ? 'bg-[#f16137] text-white border-[#f16137] shadow-lg shadow-orange-500/30' : 'bg-white border-slate-200 hover:border-orange-200'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Ocupados</div>
          <div className={`text-3xl font-black mt-1 ${statusFilter === 'ocupado' ? 'text-white' : 'text-[#f16137]'}`}>{totalOccupied}</div>
        </button>
        <button onClick={() => setStatusFilter('pendente')} className={`p-4 rounded-2xl border text-left transition-all ${statusFilter === 'pendente' ? 'bg-amber-400 text-white border-amber-400 shadow-lg shadow-amber-400/30' : 'bg-white border-slate-200 hover:border-amber-200'}`}>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Reservados</div>
          <div className={`text-3xl font-black mt-1 ${statusFilter === 'pendente' ? 'text-white' : 'text-amber-500'}`}>{totalPending}</div>
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <Search size={20} className="text-slate-400 ml-2" />
        <input 
          type="text" 
          placeholder="Buscar por box, aluno ou responsável..." 
          className="w-full bg-transparent font-bold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="h-6 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 whitespace-nowrap pr-2">
           <Filter size={16} /> {filteredLockers.length}
        </div>
      </div>

      {/* Tabela de Inventário */}
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Box</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Aluno / Turma</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Responsável</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLockers.map((locker) => (
                <tr key={locker.id} className="hover:bg-slate-50/80 transition-colors group">
                  
                  {/* Coluna Box */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm border ${
                        locker.status === 'disponivel' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        locker.status === 'ocupado' ? 'bg-slate-800 border-slate-800 text-white' :
                        'bg-amber-50 border-amber-100 text-amber-600'
                      }`}>
                        {locker.id}
                      </div>
                    </div>
                  </td>

                  {/* Coluna Status */}
                  <td className="px-6 py-4">
                    {locker.status === 'disponivel' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 tracking-wide">
                        <LockOpen size={12} strokeWidth={3} /> Livre
                      </span>
                    )}
                    {locker.status === 'ocupado' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 tracking-wide">
                        <Lock size={12} strokeWidth={3} /> Ocupado
                      </span>
                    )}
                    {locker.status === 'pendente' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-700 tracking-wide">
                        <AlertCircle size={12} strokeWidth={3} /> Reservado
                      </span>
                    )}
                  </td>

                  {/* Coluna Aluno */}
                  <td className="px-6 py-4">
                    {locker.student ? (
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{locker.student}</p>
                        <span className="text-[10px] font-bold uppercase text-slate-400">{locker.class}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs font-medium italic">-</span>
                    )}
                  </td>

                  {/* Coluna Responsável */}
                  <td className="px-6 py-4">
                     {locker.parent ? (
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{locker.parent}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Desde {locker.date}</p>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-xs font-medium italic">-</span>
                    )}
                  </td>

                  {/* Coluna Ações */}
                  <td className="px-6 py-4 text-right">
                    {locker.status === 'disponivel' ? (
                      <button className="text-emerald-600 font-black text-[10px] uppercase tracking-wider hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        Alocar
                      </button>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-[#f16137] hover:bg-orange-50 rounded-lg transition-all" title="Ver Detalhes">
                        <FileText size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLockers.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-sm">Nenhum armário encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}