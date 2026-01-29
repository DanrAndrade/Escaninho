import React, { useEffect, useState } from 'react';
import { User, ChevronRight, Loader2, GraduationCap } from 'lucide-react';

interface Student {
  id: number;
  nome: string;
  ra: string;
}

interface StudentSelectionViewProps {
  onSelect: (studentId: number, studentName: string) => void; // Recebe ID e Nome
  userEmail: string;
}

export function StudentSelectionView({ onSelect, userEmail }: StudentSelectionViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(`http://localhost:3001/api/meus-alunos?email=${userEmail}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Erro ao buscar alunos');
        
        setStudents(data);
      } catch (err: any) {
        setError('Não foi possível carregar os alunos.');
      } finally {
        setLoading(false);
      }
    }

    if (userEmail) {
      fetchStudents();
    }
  }, [userEmail]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <Loader2 className="animate-spin mb-2" />
        <p className="text-xs font-bold">Buscando alunos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-sm font-bold bg-red-50 p-4 rounded-xl">{error}</div>;
  }

  if (students.length === 0) {
    return <div className="text-slate-500 text-center p-6">Nenhum aluno vinculado a este responsável.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-black text-slate-800 mb-1 text-center">Quem vai usar o armário?</h3>
      <p className="text-slate-400 text-xs font-bold text-center mb-6 uppercase tracking-wider">Selecione o aluno</p>
      
      <div className="space-y-3">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => onSelect(student.id, student.nome)} // Passa ID e Nome
            className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-[#f16137] hover:shadow-md transition-all group flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-[#f16137] group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{student.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <GraduationCap size={10} />
                      RA: {student.ra}
                   </span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-[#f16137] transition-colors" size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}