"use client";
import React from 'react';
import { Lock, LockOpen, Check } from 'lucide-react';

interface LockerProps {
  number: string;
  status: 'disponivel' | 'locado' | 'reservado' | 'selecionado';
  onClick: () => void;
}

export function Locker({ number, status, onClick }: LockerProps) {
  const isAvailable = status === 'disponivel' || status === 'selecionado';
  
  const statusConfig = {
    disponivel: {
      style: "bg-white border-slate-200 hover:border-emerald-400 cursor-pointer",
      text: "text-slate-600",
      icon: <LockOpen size={16} className="text-emerald-500" />
    },
    locado: {
      style: "bg-red-50/50 border-red-100 cursor-not-allowed",
      text: "text-red-300",
      icon: <Lock size={16} className="text-red-300" />
    },
    reservado: {
      style: "bg-slate-50 border-slate-200 cursor-not-allowed opacity-50",
      text: "text-slate-300",
      icon: <Lock size={16} className="text-slate-300" />
    },
    selecionado: {
      style: "bg-amber-50 border-amber-400 shadow-lg shadow-amber-100/50 scale-105 z-10 cursor-pointer",
      text: "text-amber-700",
      icon: <Check size={18} className="text-amber-600" strokeWidth={4} />
    }
  };

  const current = statusConfig[status];

  return (
    <div 
      onClick={isAvailable ? onClick : undefined}
      className={`
        relative aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 group
        ${current.style}
      `}
    >
      <div className="absolute top-3 w-1/3 flex flex-col gap-1 opacity-30">
        <div className="h-0.5 bg-slate-400 rounded-full" />
        <div className="h-0.5 bg-slate-400 rounded-full" />
      </div>

      <div className="flex flex-col items-center gap-1 mt-2">
        <span className={`text-xl font-black tracking-tighter ${current.text}`}>
          {number}
        </span>
        <div>{current.icon}</div>
      </div>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-200 rounded-full opacity-50" />
    </div>
  );
}