"use client";
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Receipt, CreditCard, LogOut, 
  Plus, ArrowLeft, Menu, X, Lock, Check, GraduationCap, ChevronRight, LockOpen, Users 
} from 'lucide-react';
import { Locker } from '@/components/locker/Locker';
import { ContractView } from '@/components/locker/ContractView';
import { HistoryTable } from '@/components/dashboard/HistoryTable'; 
import { SuccessModal } from '@/components/modals/SuccessModal';
import { ContractsView } from '@/components/views/ContractsView';
import { FinancialView } from '@/components/views/FinancialView';
import { UsageLogsView } from '@/components/views/UsageLogsView';
import { AdminView } from '@/components/admin/AdminView';
import { LoginPage } from '@/components/auth/LoginPage';
import gsap from 'gsap';

// --- DADOS MOCKADOS (ALTERADOS PARA FICTÍCIOS) ---
const MOCK_STUDENTS = [
  { id: '1', name: 'Lucas Oliveira', grade: '6º Ano A', matricula: '2025.101' },
  { id: '2', name: 'Sofia Oliveira', grade: '9º Ano B', matricula: '2025.102' },
  { id: '3', name: 'Enzo Oliveira', grade: '2ª Série EM', matricula: '2025.103' },
];

const MOCK_ACTIVE_RENTALS = [
  { id: 'r1', locker: '114', student: 'Lucas Oliveira', status: 'Ativo' },
  { id: 'r2', locker: '205', student: 'Sofia Oliveira', status: 'Ativo' },
];

const STEPS = [
  { id: 'select-student', label: 'Identificação', number: 1 },
  { id: 'select-locker', label: 'Escaninho', number: 2 },
  { id: 'contract', label: 'Confirmação', number: 3 },
];

// --- STEPPER ---
const BookingStepper = ({ currentView }: { currentView: string }) => {
  const currentStepIndex = STEPS.findIndex(s => s.id === currentView);
  if (currentStepIndex === -1) return null;

  return (
    <div className="w-full flex justify-center mb-8 pt-4">
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          return (
            <React.Fragment key={step.id}>
              {index > 0 && ( <div className={`w-12 md:w-24 h-1 mx-2 rounded-full transition-all duration-500 ${isCompleted ? 'bg-[#f16137]' : 'bg-slate-200'}`} /> )}
              <div className="flex flex-col items-center gap-2 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-4 transition-all duration-500 z-10 ${isActive ? 'bg-[#f16137] border-[#f16137]/30 text-white scale-110 shadow-lg' : isCompleted ? 'bg-[#f16137] border-[#f16137] text-white' : 'bg-slate-100 border-slate-200 text-slate-500'} `}>
                  {isCompleted ? <Check size={16} strokeWidth={4} /> : step.number}
                </div>
                <span className={`absolute top-12 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-[#f16137]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
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

// --- TIPOS ---
type ViewType = 'reservas' | 'select-student' | 'select-locker' | 'contract' | 'my-contracts' | 'usage-logs' | 'financial' | 'admin';

export default function IascPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [view, setView] = useState<ViewType>('reservas');
  const [selectedLocker, setSelectedLocker] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      gsap.fromTo(".view-content", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    }
  }, [view, isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdminMode(false);
    setView('reservas');
    setSelectedLocker('');
  };

  const handleLogin = () => {
    setIsAdminMode(false);
    setIsLoggedIn(true);
    setView('reservas');
  };

  const handleAdminLogin = () => {
    setIsAdminMode(true);
    setIsLoggedIn(true);
    setView('admin');
  };

  const handleSelectStudent = (name: string) => {
    setSelectedStudentName(name);
    setView('select-locker');
  };

  // --- TELA DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="relative">
        <LoginPage onLogin={handleLogin} />
        <button 
          onClick={handleAdminLogin}
          className="fixed bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#f16137] transition-colors z-50 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm"
        >
          Acesso Administrativo
        </button>
      </div>
    );
  }

  // --- SIDEBAR LINK ---
  const SidebarLink = ({ icon: Icon, label, active, onClick }: any) => (
    <button onClick={() => { onClick(); setIsMobileMenuOpen(false); }} className={`relative w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all group ${active ? 'text-[#f16137] bg-slate-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'}`}>
      {active && <div className="absolute left-0 w-1.5 h-6 bg-[#f16137] rounded-r-full shadow-[2px_0_8px_rgba(241,97,55,0.3)]" />}
      <Icon size={18} className={active ? 'text-[#f16137]' : 'text-slate-400 group-hover:text-slate-500'} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#eaebef] text-[#1a1a1a] selection:bg-[#f16137]/10 overflow-hidden">
      
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          setView('reservas');
          setSelectedLocker('');
        }} 
      />

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 lg:static lg:translate-x-0 h-full ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 shrink-0 flex items-center justify-between px-8 border-b border-slate-50">
          <div className="flex items-center">
            <img src="/logo.svg" alt="IASC Portal" className="h-10 w-auto object-contain" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500 p-2"><X size={24} /></button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {isAdminMode ? (
            <>
              <div className="px-6 pb-2 mb-2 border-b border-slate-50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administração</p>
              </div>
              <SidebarLink icon={Users} label="Gestão de Locações" active={view === 'admin'} onClick={() => setView('admin')} />
            </>
          ) : (
            <>
              <SidebarLink icon={LayoutDashboard} label="Central de Reservas" active={view === 'reservas' || view === 'select-student' || view === 'select-locker' || view === 'contract'} onClick={() => setView('reservas')} />
              <SidebarLink icon={FileText} label="Meus Contratos" active={view === 'my-contracts'} onClick={() => setView('my-contracts')} />
              <SidebarLink icon={Receipt} label="Extratos de Uso" active={view === 'usage-logs'} onClick={() => setView('usage-logs')} />
              <SidebarLink icon={CreditCard} label="Financeiro" active={view === 'financial'} onClick={() => setView('financial')} />
            </>
          )}
        </nav>
        
        <div className="p-8 border-t border-slate-50 shrink-0">
          <div className="mb-4 px-2">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-xs ${isAdminMode ? 'bg-slate-800' : 'bg-[#f16137]'}`}>
                 {isAdminMode ? 'AD' : 'RO'}
               </div>
               <div className="overflow-hidden">
                 <p className="text-xs font-black text-slate-900 truncate">{isAdminMode ? 'Administrador' : 'Roberto Oliveira'}</p>
                 <p className="text-[10px] text-slate-400 truncate">{isAdminMode ? 'Secretaria Escolar' : 'Responsável Legal'}</p>
               </div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-700 font-black hover:text-red-600 transition-colors text-[10px] uppercase tracking-[0.2em] px-2"><LogOut size={16} /> Encerrar Sessão</button>
        </div>
      </aside>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-20 shrink-0 bg-white border-b border-slate-200 px-6 md:px-10 flex items-center justify-between z-40 shadow-sm">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg"><Menu size={26} /></button>
          
          <div className="flex items-center gap-5 ml-auto">
             {isAdminMode && (
               <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                 Modo Administrativo
               </span>
             )}
             
             <div className="flex items-center gap-4 pl-5 border-l border-slate-200">
              <div className="hidden sm:block text-right leading-tight"><p className="text-sm font-black text-slate-900">{isAdminMode ? 'Administração' : 'Roberto Oliveira'}</p><p className="text-[10px] text-[#f16137] font-black uppercase tracking-widest mt-0.5">{isAdminMode ? 'Acesso Total' : 'Responsável Legal'}</p></div>
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-black shadow-inner ${isAdminMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#f16137]/5 border-[#f16137]/10 text-[#f16137]'}`}>
                {isAdminMode ? 'AD' : 'RO'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth">
          <div className="view-content max-w-6xl mx-auto pb-10">
            
            {view === 'admin' && isAdminMode && <AdminView />}

            {!isAdminMode && (
              <>
                {view === 'my-contracts' && <ContractsView />}
                {view === 'usage-logs' && <UsageLogsView />}
                {view === 'financial' && <FinancialView />}

                {view === 'reservas' && (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Central de Reservas</h2>
                        <p className="text-slate-600 font-medium text-sm mt-1">Gerencie os acessos e escaninhos da sua família.</p>
                      </div>
                      <button onClick={() => setView('select-student')} className="w-auto bg-gradient-to-br from-[#c84622] to-[#f16137] text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-[#f16137]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={18} strokeWidth={3} /> Nova Locação
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#f16137]" /> Alunos Vinculados
                        </h3>
                        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3">
                            {MOCK_STUDENTS.map(student => (
                              <div key={student.id} className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-2xl group cursor-pointer hover:border-[#f16137] hover:bg-white transition-all shadow-sm">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[#f16137] border border-slate-100 shadow-sm group-hover:bg-[#f16137] group-hover:text-white transition-all mb-3">{student.name.charAt(0)}</div>
                                <div className="min-w-0"><p className="font-black text-slate-900 text-sm leading-tight truncate">{student.name}</p><p className="text-[10px] text-slate-700 font-bold mt-1 uppercase tracking-wider">{student.grade}</p></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.25em] ml-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#78865c]" /> Locações Ativas
                        </h3>
                        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm min-h-[180px]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {MOCK_ACTIVE_RENTALS.map(rental => (
                              <div key={rental.id} className="flex items-center gap-3 p-4 border border-emerald-100 bg-emerald-50/20 rounded-2xl hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-[#78865c] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#78865c]/20 shrink-0"><Lock size={16} /></div>
                                <div className="flex-1 min-w-0"><p className="text-[10px] font-black text-[#78865c] uppercase tracking-widest truncate">Box #{rental.locker}</p><p className="text-sm font-black text-slate-900 leading-none mt-1 truncate">{rental.student}</p></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <HistoryTable />
                  </div>
                )}

                {(view === 'select-student' || view === 'select-locker' || view === 'contract') && (
                  <div className="animate-in fade-in zoom-in duration-300">
                    <BookingStepper currentView={view} />

                    {view === 'select-student' && (
                      <div className="max-w-3xl mx-auto space-y-10 text-center">
                        <div className="flex justify-start px-2">
                          <button onClick={() => setView('reservas')} className="flex items-center gap-2 text-slate-500 font-black hover:text-red-500 transition-all text-[10px] tracking-[0.2em] uppercase p-2 -ml-2 hover:bg-red-50 rounded-lg">
                            <ArrowLeft size={14} strokeWidth={3} /> Cancelar Reserva
                          </button>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Quem é o aluno?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {MOCK_STUDENTS.map(student => (
                            <div key={student.id} onClick={() => handleSelectStudent(student.name)} className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-[#78865c] cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#78865c]/10 transition-all group flex flex-col items-center hover:-translate-y-1 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-[#78865c]/10 rounded-bl-[60px] transition-transform scale-0 group-hover:scale-100 duration-300" />
                              <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl mb-4 flex items-center justify-center shadow-inner group-hover:from-[#78865c] group-hover:to-[#5c6846] transition-all duration-300 border border-slate-100 group-hover:border-[#78865c] relative z-10">
                                 <GraduationCap size={28} className="text-slate-400 group-hover:text-white transition-colors" strokeWidth={2} />
                              </div>
                              <div className="relative z-10">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">{student.name}</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 group-hover:text-[#78865c] transition-colors">{student.grade}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {view === 'select-locker' && (
                      <div className="space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-slate-200 pb-6 gap-6">
                          <div className="w-full md:w-auto">
                            <button onClick={() => setView('select-student')} className="flex items-center gap-2 text-slate-500 font-black mb-4 hover:text-slate-900 transition-all text-[10px] tracking-widest uppercase p-2 -ml-2 hover:bg-slate-100 rounded-lg">
                              <ArrowLeft size={14} strokeWidth={3} /> Voltar
                            </button>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Escolha o Box</h2>
                          </div>
                          
                          <div className="flex gap-6 bg-white px-6 py-4 rounded-full shadow-lg border border-slate-200">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600"><LockOpen size={16} strokeWidth={2.5} className="text-emerald-500" /> Livre</div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400"><Lock size={16} className="text-red-400" /> Ocupado</div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600"><Check size={18} strokeWidth={4} className="text-amber-500" /> Selecionado</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
                          <div className="flex-1 max-w-sm mx-auto lg:mx-0">
                            <div className="bg-white p-6 rounded-[20px] border border-slate-200 shadow-xl shadow-slate-200/50">
                              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 mx-auto w-1/2" />
                              <div className="grid grid-cols-3 gap-3">
                                {Array.from({ length: 12 }, (_, i) => {
                                  const num = 101 + i;
                                  const numStr = num.toString();
                                  const statusSimulado = (num === 102 || num === 105 || num === 111) ? 'locado' : selectedLocker === numStr ? 'selecionado' : 'disponivel';
                                  return (
                                    <Locker 
                                      key={num} 
                                      number={numStr} 
                                      status={statusSimulado} 
                                      onClick={() => setSelectedLocker(numStr)} 
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-56 sticky top-8">
                            {selectedLocker ? (
                              <div className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-xl animate-in fade-in slide-in-from-right-8 duration-500 text-center flex flex-col gap-4">
                                <div>
                                   <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Selecionado</h3>
                                   <div className="text-4xl font-black text-slate-800">#{selectedLocker}</div>
                                </div>
                                <button onClick={() => setView('contract')} className="w-full py-3 rounded-xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-br from-[#5c6846] to-[#78865c] text-white shadow-[#78865c]/30 hover:scale-105 active:scale-95">
                                  CONFIRMAR <ChevronRight size={16} strokeWidth={3} />
                                </button>
                              </div>
                            ) : (
                              <div className="hidden lg:flex h-32 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center text-center p-4 text-slate-300">
                                <div>
                                  <LockOpen size={24} className="mx-auto mb-2 opacity-50" />
                                  <p className="font-bold text-[10px] uppercase tracking-widest">Selecione<br/>um box</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {view === 'contract' && (
                      <div className="max-w-4xl mx-auto">
                         <div className="mb-6 px-2">
                            <button onClick={() => setView('select-locker')} className="flex items-center gap-2 text-slate-500 font-black hover:text-slate-900 transition-all text-[10px] tracking-widest uppercase p-2 -ml-2 hover:bg-slate-100 rounded-lg">
                              <ArrowLeft size={14} strokeWidth={3} /> Voltar para Mapa
                            </button>
                         </div>
                         <ContractView 
                            studentName={selectedStudentName || "Lucas Oliveira"} // Nome dinâmico
                            lockerNumber={selectedLocker}
                            onBack={() => setView('select-locker')}
                            onConfirm={() => setShowSuccessModal(true)} 
                          />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}