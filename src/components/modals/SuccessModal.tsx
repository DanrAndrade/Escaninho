"use client";
import React from 'react';
import { X, Printer, CheckCircle2, FileText } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void; // Nova função para baixar
}

export function SuccessModal({ isOpen, onClose, onDownload }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-emerald-500 h-32 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={3} />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reserva Realizada!</h2>
            <p className="text-slate-500 mt-2 text-sm">O armário foi reservado com sucesso.</p>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left">
            <p className="font-bold text-slate-700 text-xs uppercase tracking-wide mb-1">Próximos Passos</p>
            <p className="text-slate-500 text-xs leading-relaxed">
              O boleto será gerado pela secretaria e disponibilizado no Portal do Aluno em breve. Fique atento ao seu e-mail.
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={onDownload}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 active:scale-95 cursor-pointer"
            >
              <FileText size={18} />
              Baixar Cópia do Contrato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}