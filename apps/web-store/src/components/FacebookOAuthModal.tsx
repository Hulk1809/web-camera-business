import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { CustomerUser } from '../types/chat';

interface FacebookOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  initialName?: string;
}

/**
 * Placeholder only. Real Meta OAuth must redirect to Meta from the backend and
 * must never collect a Facebook password inside the Pro Gear application.
 */
export const FacebookOAuthModal: React.FC<FacebookOAuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div data-testid="facebook-oauth-modal" className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-xl bg-white border border-gray-200 shadow-2xl p-5 text-gray-900">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="font-bold text-base">Facebook OAuth chưa được cấu hình</h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Bản đồ án chưa có Meta App ID và App Secret. Vui lòng đăng ký hoặc đăng nhập bằng email.
                Pro Gear không bao giờ yêu cầu mật khẩu Facebook bên trong website này.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="p-1 text-gray-500 hover:text-gray-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        <button type="button" onClick={onClose} className="mt-5 w-full rounded-lg bg-gray-900 py-2.5 text-xs font-bold text-white">
          Quay lại đăng nhập Email
        </button>
      </div>
    </div>
  );
};
