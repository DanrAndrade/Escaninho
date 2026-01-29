"use client";
import React, { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ id: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.id, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar');
      }

      onLogin(data);

    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Erro de conexão: Verifique se o backend está rodando.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans p-4 md:p-8 relative overflow-hidden bg-[#dde1e6]">
      
      {/* Pattern de fundo */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-slate-400/20 overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[600px]">
        
        {/* --- LADO ESQUERDO: IMAGEM --- */}
        <div className="hidden lg:block w-1/2 p-4"> 
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-100"> 
             {/* IMAGEM DE LOGIN AQUI */}
             <img 
               src="/login.jpg" 
               alt="IASC School Lockers" 
               className="absolute inset-0 w-full h-full object-cover"
               onError={(e) => {
                 // Fallback caso a imagem não exista
                 e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

             <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white">
               <div className="space-y-6 mb-8">
                   <h2 className="text-4xl xl:text-5xl font-black tracking-tighter leading-[1.1] drop-shadow-xl">
                     Garanta seu<br/>espaço.
                   </h2>
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg">
                     <p className="text-sm font-medium leading-relaxed text-gray-100 opacity-90">
                       "Realize a reserva, gestão e pagamento do seu armário escolar de forma simples e segura."
                     </p>
                   </div>
               </div>
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                 © Colégio IASC 
               </div>
             </div>
          </div>
        </div>

        {/* --- LADO DIREITO: FORMULÁRIO --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 xl:p-16 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            
            {/* Header com LOGO (Mobile e Desktop) */}
            <div className="mb-10 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                {/* LOGO DO LOGIN AQUI */}
                <img src="/logo.svg" alt="IASC" className="h-10 w-auto" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bem-vindo</h1>
              <p className="text-slate-500 font-medium">Insira suas credenciais para continuar.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wide ml-1">
                  Email (Responsável)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f16137] transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#f16137] focus:bg-white rounded-xl py-4 pl-11 pr-4 text-slate-800 font-bold text-sm outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    Senha
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f16137] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#f16137] focus:bg-white rounded-xl py-4 pl-11 pr-10 text-slate-800 font-bold text-sm outline-none transition-all placeholder:font-black placeholder:text-slate-300 tracking-widest"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={16} className="text-red-500 shrink-0" />
                  <p className="text-xs font-bold text-red-600">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#f16137] to-[#d14d2a] text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Conectando...</span>
                  ) : (
                    <>
                      Acessar Portal
                      <ArrowRight size={18} strokeWidth={3} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed flex items-center justify-center gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <ShieldCheck size={14} className="text-emerald-600" />
                Problemas? Contate a <strong className="text-slate-600">Secretaria</strong>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}