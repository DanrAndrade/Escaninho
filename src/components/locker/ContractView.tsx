"use client";
import React, { useState } from 'react';
import { FileText, Download, Check, ShieldCheck, ChevronRight } from 'lucide-react';

interface ContractViewProps {
  studentName: string;
  lockerNumber: string;
  onBack: () => void;
  onConfirm: () => void;
}

export function ContractView({ studentName, lockerNumber, onBack, onConfirm }: ContractViewProps) {
  const [accepted, setAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Visualização do Contrato */}
      <div className="flex-1 bg-white rounded-[24px] shadow-xl border border-slate-200 overflow-hidden w-full">
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <FileText size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Minuta do Contrato</span>
          </div>
          <button className="text-slate-400 hover:text-[#f16137] transition-colors">
            <Download size={18} />
          </button>
        </div>
        
        <div className="p-8 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent text-justify text-slate-600 text-sm leading-relaxed space-y-4 font-medium">
          <div className="text-center mb-6">
            <h3 className="text-lg font-black text-slate-900 uppercase">Termo de Adesão de Uso de Armário Escolar</h3>
            <p className="text-xs text-slate-500 font-bold mt-1">Ano Letivo 2025</p>
          </div>

          <p>
            Pelo presente instrumento particular, de um lado a <strong>INSTITUIÇÃO DE ENSINO</strong>, e de outro lado, 
            o responsável financeiro, doravante denominado <strong>LOCATÁRIO</strong>, identificado abaixo:
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 my-4 text-xs">
            <p><strong>Responsável:</strong> Roberto Oliveira</p> {/* NOME FICTÍCIO ATUALIZADO */}
            <p><strong>Aluno(a):</strong> {studentName}</p>
            <p><strong>Armário Nº:</strong> {lockerNumber}</p>
            <p><strong>Vigência:</strong> 01/02/2025 a 15/12/2025</p>
          </div>

          <p><strong>CLÁUSULA PRIMEIRA - DO OBJETO</strong><br/>
          O presente contrato tem por objeto a cessão de uso do armário escolar (box) acima identificado, localizado nas dependências da escola, para uso exclusivo do aluno indicado para guarda de material escolar.</p>

          <p><strong>CLÁUSULA SEGUNDA - DA UTILIZAÇÃO</strong><br/>
          O armário destina-se exclusivamente à guarda de livros, cadernos e materiais didáticos. É expressamente proibida a guarda de alimentos perecíveis, materiais ilícitos, inflamáveis ou de valor excessivo.</p>

          <p><strong>CLÁUSULA TERCEIRA - DAS CHAVES E CADEADOS</strong><br/>
          O aluno receberá uma cópia da chave ou senha de acesso. Em caso de perda da chave, será cobrada uma taxa de substituição do miolo/cadeado vigente na tabela da secretaria.</p>

          <p><strong>CLÁUSULA QUARTA - DA RESPONSABILIDADE</strong><br/>
          A escola não se responsabiliza por objetos de valor (celulares, eletrônicos, dinheiro, joias) deixados no interior do armário. O uso é de inteira responsabilidade do aluno.</p>
          
          <p><strong>CLÁUSULA QUINTA - DA DEVOLUÇÃO</strong><br/>
          Ao final do ano letivo, o armário deverá ser desocupado e a chave devolvida à secretaria até a data limite estipulada no calendário escolar, sob pena de multa diária.</p>

          <p className="text-center mt-8 text-slate-400 text-xs">
            Li e concordo com todos os termos acima descritos.
          </p>
        </div>
      </div>

      {/* Painel de Assinatura */}
      <div className="w-full lg:w-80 flex flex-col gap-6 sticky top-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-lg">
          <h3 className="text-xl font-black text-slate-900 mb-2">Confirmação</h3>
          <p className="text-sm text-slate-500 font-medium mb-6">Para finalizar a reserva do armário <strong>#{lockerNumber}</strong>, aceite os termos.</p>

          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors mb-6 group">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5 ${accepted ? 'bg-[#f16137] border-[#f16137] text-white' : 'border-slate-300 group-hover:border-[#f16137]'}`}>
              {accepted && <Check size={14} strokeWidth={4} />}
            </div>
            <input type="checkbox" className="hidden" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
            <span className="text-xs font-bold text-slate-600 select-none">
              Declaro que li e aceito os termos do contrato de locação.
            </span>
          </label>

          <button 
            onClick={handleSign}
            disabled={!accepted || isSigning}
            className="w-full bg-gradient-to-r from-[#f16137] to-[#d14d2a] text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSigning ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                Assinar e Reservar <ShieldCheck size={18} />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-center text-slate-400 mt-4 px-4">
            Ao clicar em reservar, você concorda com o débito do valor na fatura escolar.
          </p>
        </div>
      </div>
    </div>
  );
}