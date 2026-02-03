import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/api'; // Importa a URL inteligente

interface ContractViewProps {
  studentName: string;
  lockerNumber: string;
  reservationId: number;
  onBack: () => void;
  onConfirm: () => void;
}

export const ContractView = ({ studentName, lockerNumber, onConfirm }: ContractViewProps) => {
  const [contractText, setContractText] = useState('Carregando contrato...');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // USA API_URL
    fetch(`${API_URL}/api/contrato-atual`)
      .then(res => res.json())
      .then(data => setContractText(data.texto))
      .catch(() => setContractText('<p>Erro ao carregar o contrato.</p>'));
  }, []);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <FileText size={24} />
        </div>
        <div>
            <h2 className="text-xl font-black text-slate-900">Contrato de Locação</h2>
            <p className="text-sm text-slate-500">Leia atentamente os termos abaixo.</p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-xl h-96 overflow-y-auto border border-slate-200 mb-6 text-sm text-slate-700 leading-relaxed font-serif shadow-inner custom-scrollbar">
         <div dangerouslySetInnerHTML={{ __html: contractText }} />
      </div>

      <div className="space-y-6">
        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors select-none">
            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${agreed ? 'bg-[#f16137] border-[#f16137] text-white' : 'border-slate-300 bg-white'}`}>
                {agreed && <CheckCircle size={14} />}
            </div>
            <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <div className="flex-1">
                <span className="font-bold text-slate-800 text-sm">Li e concordo com os termos</span>
                <p className="text-xs text-slate-500 mt-0.5">Ao marcar esta opção, você aceita digitalmente o contrato vinculado ao aluno <strong>{studentName}</strong> para o armário <strong>{lockerNumber}</strong>.</p>
            </div>
        </label>

        <button 
            onClick={onConfirm} 
            disabled={!agreed}
            className="w-full bg-gradient-to-br from-[#c84622] to-[#f16137] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[#f16137]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
        >
            <CheckCircle size={20} strokeWidth={3} /> Assinar e Reservar
        </button>
      </div>
    </div>
  );
};