"use client";

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, LogOut, ArrowLeft, Menu, Loader2, Check, Lock, Unlock, X } from 'lucide-react';
import { ContractView } from '@/components/locker/ContractView';
import { SuccessModal } from '@/components/modals/SuccessModal';
import { ContractsView } from '@/components/views/ContractsView';
import { AdminView } from '@/components/admin/AdminView';
import { LoginPage } from '@/components/auth/LoginPage';
import { DashboardView } from '@/components/views/DashboardView';
import { StudentSelectionView } from '@/components/views/StudentSelectionView';
import { API_URL } from '@/lib/api';
import { generateContractPDF } from '@/utils/contractGenerator';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [view, setView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados Reserva
  const [selectedLocker, setSelectedLocker] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [occupiedLockers, setOccupiedLockers] = useState<string[]>([]);
  const [loadingLockers, setLoadingLockers] = useState(false);
  const [lastReservation, setLastReservation] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('escaninho_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      if (u.role === 'ADMIN') setView('admin');
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (view === 'select-locker') {
      setLoadingLockers(true);
      fetch(`${API_URL}/api/armarios`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setOccupiedLockers(data); else setOccupiedLockers([]); })
        .catch(() => setOccupiedLockers([]))
        .finally(() => setLoadingLockers(false));
    }
  }, [view]);

  const handleLogin = (userData: any) => {
    localStorage.setItem('escaninho_user', JSON.stringify(userData));
    setUser(userData);
    if (userData.role === 'ADMIN') setView('admin');
    else setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('escaninho_user');
    setUser(null);
    setView('dashboard');
    setIsMobileMenuOpen(false);
  };

  const handleStudentSelect = (studentId: number, studentName: string) => {
    setSelectedStudentId(studentId);
    setSelectedStudentName(studentName);
    setView('contract'); 
  };

  const getClientIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch (e) { return 'IP não identificado'; }
  };

  const handleFinalizeReservation = async () => {
    if (!selectedLocker || !user || !selectedStudentId) return;
    setIsProcessing(true);

    try {
      const userIP = await getClientIP();
      const response = await fetch(`${API_URL}/api/reservar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluno_id: selectedStudentId,
          responsavel_id: user.id,
          locker_number: selectedLocker,
          valor: 250.00,
          ano_letivo: '2025'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao reservar');

      await fetch(`${API_URL}/api/assinar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservation_id: data.reservationId, ip_address: userIP, user_agent: navigator.userAgent })
      });

      setLastReservation({
        locker_number: selectedLocker,
        nome_responsavel: user.name,
        nome_aluno: selectedStudentName,
        ra: 'Registrado no Sistema',
        data_reserva: new Date().toISOString(),
        data_assinatura: new Date().toISOString(),
        ip_address: userIP
      });

      setShowSuccessModal(true);
    } catch (error: any) {
      alert('Erro: ' + error.message);
      setView('select-locker');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadLastContract = () => {
    if (lastReservation) generateContractPDF(lastReservation);
  };

  if (loadingUser) return null;
  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderContent = () => {
    if (user.role === 'ADMIN') return <AdminView />;

    switch (view) {
      case 'dashboard':
        return <DashboardView onNewRental={() => setView('select-locker')} userEmail={user.email} />;
      case 'select-locker':
        const safeOccupied = Array.isArray(occupiedLockers) ? occupiedLockers : [];
        const lockers = Array.from({ length: 12 }, (_, i) => {
          const num = (3320 + i).toString();
          const isOccupied = safeOccupied.includes(num);
          return { number: num, status: isOccupied ? 'locado' : 'disponivel' };
        });
        return (
          <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-6"><button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-sm"><ArrowLeft size={18} /> Voltar</button></div>
            <CheckoutSteps currentStep={1} />
            <div className="text-center mb-8"><h2 className="text-3xl font-black text-slate-900">Escolha seu Armário</h2><p className="text-slate-500">Armários grandes e arejados para o material escolar.</p></div>
            {loadingLockers ? (<div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#f16137] w-10 h-10" /></div>) : (<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{lockers.map((locker) => (<button key={locker.number} disabled={locker.status === 'locado'} onClick={() => { setSelectedLocker(locker.number); setView('select-student'); }} className={`relative group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 h-40 ${locker.status === 'locado' ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-60' : 'bg-white border-slate-200 hover:border-[#f16137] hover:shadow-xl hover:-translate-y-1 cursor-pointer'}`}><div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${locker.status === 'locado' ? 'bg-slate-200 text-slate-400' : 'bg-[#f16137]/10 text-[#f16137] group-hover:bg-[#f16137] group-hover:text-white transition-colors'}`}>{locker.status === 'locado' ? <Lock size={20} /> : <Unlock size={20} />}</div><span className={`text-2xl font-black ${locker.status === 'locado' ? 'text-slate-400' : 'text-slate-800'}`}>{locker.number}</span><span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">{locker.status === 'locado' ? 'Ocupado' : 'Disponível'}</span></button>))}</div>)}
          </div>
        );
      case 'select-student':
        return (
          <div className="max-w-xl mx-auto pb-20">
            <div className="mb-6"><button onClick={() => setView('select-locker')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-sm"><ArrowLeft size={18} /> Voltar</button></div>
            <CheckoutSteps currentStep={2} />
            <div className="text-center mb-10"><h2 className="text-3xl font-black text-slate-900 mb-2">Quem vai usar?</h2><p className="text-slate-500">Selecionando para o armário <strong className="text-[#f16137]">#{selectedLocker}</strong></p></div>
            <StudentSelectionView onSelect={handleStudentSelect} userEmail={user.email} />
          </div>
        );
      case 'contract':
        return (
          <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-6"><button onClick={() => setView('select-student')} className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold text-sm"><ArrowLeft size={18} /> Voltar</button></div>
            <CheckoutSteps currentStep={3} />
            {isProcessing ? (<div className="text-center py-32"><Loader2 className="w-16 h-16 animate-spin text-[#f16137] mx-auto mb-4" /><h3 className="text-xl font-bold text-slate-800">Processando sua reserva...</h3><p className="text-slate-500">Estamos gerando o contrato e registrando no sistema.</p></div>) : (<ContractView studentName={selectedStudentName} lockerNumber={selectedLocker || "000"} reservationId={0} onBack={() => setView('select-student')} onConfirm={handleFinalizeReservation} />)}
          </div>
        );
      case 'contracts': return <ContractsView />;
      case 'admin': return <AdminView />;
      default: return <DashboardView onNewRental={() => setView('select-locker')} userEmail={user.email} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#f16137] selection:text-white">
      <SuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); setView('dashboard'); }} onDownload={handleDownloadLastContract} />
      
      <Sidebar user={user} view={view} setView={setView} handleLogout={handleLogout} />
      <MobileHeader setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {isMobileMenuOpen && (
        <MobileMenu 
          user={user} 
          view={view} 
          setView={setView} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
          handleLogout={handleLogout} 
        />
      )}

      {/* Ajuste de padding para não cortar conteúdo no mobile/tablet */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-20 md:pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

// --- SUBCOMPONENTES (Limpamos os botões de senha) ---
function Sidebar({ user, view, setView, handleLogout }: any) { 
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 p-6 justify-between fixed h-full z-30">
      <div>
        <div className="mb-10 px-2"><img src="/logo.svg" alt="IASC" className="h-9 w-auto" /></div>
        <nav className="space-y-2">
          {user.role === 'ADMIN' ? (
            <SidebarItem icon={<FileText size={20} />} label="Gestão" active={true} onClick={() => { }} />
          ) : (
            <>
              <SidebarItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
              <SidebarItem icon={<FileText size={20} />} label="Contratos" active={view === 'contracts'} onClick={() => setView('contracts')} />
            </>
          )}
        </nav>
      </div>
      <div className="pt-6 border-t border-slate-100">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-600 font-bold text-sm"><LogOut size={18} /> Sair</button>
      </div>
    </aside>
  )
}

function MobileHeader({ setIsMobileMenuOpen }: any) { 
  return (
    <div className="lg:hidden fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
      <img src="/logo.svg" alt="IASC" className="h-7 w-auto" />
      <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg active:scale-95 transition-all">
        <Menu size={26} />
      </button>
    </div>
  )
}

function MobileMenu({ user, view, setView, setIsMobileMenuOpen, handleLogout }: any) { 
  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex justify-start">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className="relative w-[85%] max-w-[300px] bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-300">
        <div>
           <div className="flex justify-between items-center mb-8">
              <img src="/logo.svg" alt="IASC" className="h-8 w-auto" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full">
                 <X size={20} />
              </button>
           </div>
           <nav className="space-y-3">
             {user.role === 'ADMIN' ? (
                <SidebarItem icon={<FileText size={22} />} label="Gestão" active={true} onClick={() => setIsMobileMenuOpen(false)} />
             ) : (
                <>
                  <SidebarItem icon={<LayoutDashboard size={22} />} label="Início" active={view === 'dashboard'} onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} />
                  <SidebarItem icon={<FileText size={22} />} label="Contratos" active={view === 'contracts'} onClick={() => { setView('contracts'); setIsMobileMenuOpen(false); }} />
                </>
             )}
           </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold py-4 rounded-xl active:scale-95 transition-transform">
           <LogOut size={20} /> Sair
        </button>
      </div>
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }: any) { return <button onClick={onClick} className={`flex items-center gap-3 px-4 py-4 w-full rounded-xl transition-all font-bold text-sm ${active ? 'bg-[#f16137]/10 text-[#f16137]' : 'text-slate-500 hover:bg-slate-50'}`}>{icon} {label}</button>; }
function CheckoutSteps({ currentStep }: { currentStep: number }) { const steps = [{ id: 1, label: 'Armário' }, { id: 2, label: 'Aluno' }, { id: 3, label: 'Contrato' }]; return (<div className="flex items-center justify-center mb-10 w-full max-w-lg mx-auto select-none">{steps.map((step, index) => (<React.Fragment key={step.id}><div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs z-10 ${step.id === currentStep ? 'bg-[#f16137] text-white' : step.id < currentStep ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{step.id < currentStep ? <Check size={14} /> : step.id}</div>{index < steps.length - 1 && (<div className="flex-1 h-1 mx-2 bg-slate-100 rounded-full"><div className={`h-full bg-emerald-500`} style={{ width: step.id < currentStep ? '100%' : '0%' }} /></div>)}</React.Fragment>))}</div>); }