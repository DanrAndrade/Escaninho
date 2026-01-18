import React from 'react';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { Student } from '@/types';

interface StudentSelectionProps {
  students: Student[];
  onSelect: (studentId: string) => void;
  onCancel: () => void;
}

export const StudentSelectionView = ({ students, onSelect, onCancel }: StudentSelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-center animate-in zoom-in duration-300">
      <div className="flex justify-start px-2">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 font-black hover:text-red-500 transition-all text-[10px] tracking-[0.2em] uppercase p-3 hover:bg-red-50 rounded-xl">
          <ArrowLeft size={16} strokeWidth={3} /> Cancelar Reserva
        </button>
      </div>
      
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Quem é o aluno?</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {students.map(student => (
          <div 
            key={student.id}
            onClick={() => onSelect(student.id)} 
            className="bg-white p-8 rounded-[32px] border-4 border-slate-50 hover:border-[#f16137] cursor-pointer shadow-lg transition-all group flex flex-col items-center hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Efeito Hover */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f16137]/5 rounded-bl-[100px] transition-transform group-hover:scale-150" />

            <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[28px] mb-6 flex items-center justify-center shadow-inner group-hover:from-[#f16137] group-hover:to-[#d14d2a] transition-all duration-300 border-2 border-slate-100 group-hover:border-[#f16137]">
               <GraduationCap size={40} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 tracking-tight z-10">{student.name}</h3>
            <div className="mt-2 px-3 py-1 bg-slate-100 rounded-full group-hover:bg-orange-100 transition-colors z-10">
               <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em] group-hover:text-[#d14d2a] transition-colors">{student.grade}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};