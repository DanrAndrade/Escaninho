export interface Student {
  id: string;
  name: string;
  grade: string;
  matricula: string;
}

export interface Rental {
  id: string;
  locker: string;
  student: string;
  status: 'Ativo' | 'Pendente';
}