import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { CustomerUser } from '../types/chat';
import { chatSyncService } from '../services/chatSyncService';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: CustomerUser) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tab, setTab] = useState<'LOGIN' | 'FACEBOOK'>('LOGIN');
  const [authMode, setAuthMode] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Handle Standard Email/Phone Login
  const handleStandardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (authMode === 'REGISTER' && !fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(emailOrPhone.trim())) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${authMode === 'REGISTER' ? 'register' : 'login'}`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authMode === 'REGISTER'
          ? { fullName: fullName.trim(), email: emailOrPhone.trim(), password, phone: phone.trim() || undefined }
          : { email: emailOrPhone.trim(), password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(Array.isArray(result?.message) ? result.message.join(', ') : result?.message || 'Đăng nhập thất bại');
      const user: CustomerUser = {
        id: result.user.id, name: result.user.fullName, email: result.user.email,
        phone: phone.trim() || undefined,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        authProvider: 'EMAIL',
      };
      chatSyncService.saveCustomerSession(user);
      if (onSuccess) onSuccess(user);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể xác thực tài khoản.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <div
        data-testid="customer-auth-modal"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden text-xs">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-950 text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E30019] text-white flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white">ĐĂNG NHẬP TÀI KHOẢN KHÁCH HÀNG</h3>
                <p className="text-[11px] text-gray-400">Hệ thống phân phối máy ảnh ProGear Store</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50 text-center font-bold text-xs">
            <button
              onClick={() => {
                setTab('LOGIN');
                setErrorMessage('');
              }}
              className={`py-3 transition border-b-2 ${
                tab === 'LOGIN'
                  ? 'border-[#E30019] text-[#E30019] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              Đăng Nhập Email / SĐT
            </button>
            <button
              data-testid="tab-login-facebook"
              onClick={() => {
                setTab('FACEBOOK');
                setErrorMessage('');
              }}
              className={`py-3 transition border-b-2 flex items-center justify-center gap-1.5 ${
                tab === 'FACEBOOK'
                  ? 'border-[#1877F2] text-[#1877F2] bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Kết Nối Facebook</span>
            </button>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="m-4 mb-0 p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form Content */}
          {tab === 'LOGIN' ? (
            <form onSubmit={handleStandardSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1">
                <button type="button" onClick={() => { setAuthMode('REGISTER'); setErrorMessage(''); }} className={`rounded-md py-2 font-bold ${authMode === 'REGISTER' ? 'bg-white text-[#E30019] shadow-sm' : 'text-gray-500'}`}>Đăng ký</button>
                <button type="button" onClick={() => { setAuthMode('LOGIN'); setErrorMessage(''); }} className={`rounded-md py-2 font-bold ${authMode === 'LOGIN' ? 'bg-white text-[#E30019] shadow-sm' : 'text-gray-500'}`}>Đăng nhập</button>
              </div>
              {authMode === 'REGISTER' && <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Họ và Tên của bạn <span className="text-[#E30019]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    data-testid="input-customer-fullname"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Hùng"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#E30019]"
                  />
                </div>
              </div>}

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email <span className="text-[#E30019]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    data-testid="input-customer-email"
                    required
                    placeholder="name@email.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#E30019]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mật khẩu <span className="text-[#E30019]">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    data-testid="input-customer-password"
                    required
                    minLength={8}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#E30019]"
                  />
                </div>
              </div>

              <button
                type="submit"
                data-testid="btn-customer-submit-login"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#E30019] hover:bg-red-700 disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Đang xác thực...' : authMode === 'REGISTER' ? 'Tạo Tài Khoản' : 'Đăng Nhập'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-5 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-blue-900 text-xs">
                <div className="font-bold flex items-center gap-1.5 mb-1.5 text-sm text-[#1877F2]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook OAuth Chưa Khả Dụng</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed mb-2">
                  Tính năng này cần Meta App ID và App Secret. Với bản đồ án hiện tại, vui lòng đăng ký hoặc đăng nhập bằng email.
                </p>
                <div className="text-[10.5px] text-blue-700 bg-white/70 p-2 rounded border border-blue-200">
                  Khi có Meta credentials, callback OAuth sẽ được xử lý an toàn tại backend.
                </div>
              </div>

              {/* Big Facebook Open Button */}
              <button
                type="button"
                data-testid="btn-open-facebook-oauth"
                disabled
                className="w-full py-3 px-4 bg-gray-300 text-gray-600 font-bold text-xs rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook OAuth Chưa Được Cấu Hình</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                <span>Hoặc mở trực tiếp trang chủ:</span>
                <a
                  href="https://www.facebook.com/login"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1877F2] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>facebook.com/login</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="bg-gray-50 p-3 border-t border-gray-200 text-gray-500 text-[10.5px] flex items-center justify-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bảo mật thông tin khách hàng 100% theo tiêu chuẩn ProGear.</span>
          </div>
        </div>
      </div>

      {/* Official Facebook OAuth Popup */}
    </>
  );
};
