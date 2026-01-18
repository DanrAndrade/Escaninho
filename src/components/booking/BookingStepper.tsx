import React from 'react';
import { Check } from 'lucide-react';
import { ViewState } from '@/types';

const STEPS = [
  { id: 'select-student', label: 'Selecionar Aluno', number: 1 },
  { id: 'select-locker', label: 'Escolher Escaninho', number: 2 },
  { id: 'contract', label: 'Confirmar Reserva', number: 3 },
];

interface StepperProps {
  currentView: ViewState;
}

export const BookingStepper = ({ currentView }: StepperProps) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentView);

  return (
    <div className="w-full mb-10 pt-4 px-4">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div className={`w-12 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-[#f16137]' : 'bg-slate-200'}`} />
              )}
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all duration-500 z-10
                  ${isActive 
                    ? 'bg-[#f16137] border-[#f16137]/30 text-white scale-110 shadow-lg shadow-orange-500/30' 
                    : isCompleted 
                      ? 'bg-[#f16137] border-[#f16137] text-white' 
                      : 'bg-slate-100 border-slate-200 text-slate-500'} 
                `}>
                  {isCompleted ? <Check size={16} strokeWidth={4} /> : step.number}
                </div>
                <span className={`
                  absolute top-12 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-300
                  ${isActive ? 'text-[#f16137]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}
                `}>
                  {step.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};