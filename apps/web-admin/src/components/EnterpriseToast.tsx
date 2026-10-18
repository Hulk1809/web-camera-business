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

export function EnterpriseToast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          border: 'border-emerald-200 bg-emerald-50 text-emerald-900',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
        };
      case 'warning':
        return {
          border: 'border-amber-200 bg-amber-50 text-amber-900',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
        };
      case 'error':
        return {
          border: 'border-rose-200 bg-rose-50 text-rose-900',
          icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />,
        };
      default:
        return {
          border: 'border-blue-200 bg-blue-50 text-blue-900',
          icon: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-5 right-5 z-50 pointer-events-auto transition-all duration-200">
      <div
        className={`flex items-start space-x-3 p-3.5 rounded-lg border shadow-lg text-xs max-w-sm ${style.border}`}
      >
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[12px]">{toast.title}</div>
          {toast.message && (
            <div className="text-[11px] opacity-90 mt-0.5 leading-snug">{toast.message}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-0.5 transition rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
