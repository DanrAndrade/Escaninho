"use client";
import React from 'react';
import { X, Download, Printer, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Decorativo */}
        <div className="bg-emerald-500 h-32 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={3} />
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reserva Confirmada!</h2>
            <p className="text-slate-500 mt-2 text-sm">O armário foi pré-reservado com sucesso.</p>
          </div>

          {/* Aviso Importante */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 text-left">
            <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 text-xs uppercase tracking-wide mb-1">Atenção ao Pagamento</p>
              <p className="text-amber-700/80 text-xs leading-relaxed">
                Você tem <strong className="text-amber-800">1 dia útil</strong> para realizar o pagamento. Após esse prazo, a reserva será cancelada automaticamente.
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3 pt-2">
            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-200 active:scale-95">
              <Download size={18} />
              Gerar Boleto Bancário
            </button>
            
            <button className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-600 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-50">
              <Printer size={18} />
              Imprimir Contrato
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-[10px] text-slate-400">O boleto também estará disponível no menu <strong>Financeiro</strong>.</p>
        </div>
      </div>
    </div>
  );
}