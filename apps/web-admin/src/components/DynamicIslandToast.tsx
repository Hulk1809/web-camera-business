import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface Props {
  toast: ToastMessage | null;
  onClose: () => void;
}

export function DynamicIslandToast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  const getGlow = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 shadow-emerald-950/40';
      case 'warning':
        return 'border-amber-500/40 shadow-amber-950/40';
      case 'error':
        return 'border-red-500/40 shadow-red-950/40';
      default:
        return 'border-sky-500/40 shadow-sky-950/40';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto transition-all duration-300">
      <div
        className={`flex items-center space-x-3 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-xl border ${getGlow()} shadow-2xl text-xs text-slate-100 max-w-md`}
      >
        <div className="p-1.5 rounded-full bg-slate-800 shrink-0 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="flex-1 truncate">
          <div className="font-bold text-white text-[12px]">{toast.title}</div>
          {toast.message && (
            <div className="text-[11px] text-slate-400 truncate">{toast.message}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white p-1 transition rounded-full hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
