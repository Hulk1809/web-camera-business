import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
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

  // Form states
  const [fullName, setFullName] = useState<string>('');
  const [emailOrPhone, setEmailOrPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  // Handle Facebook Login with real entered name
  const handleFacebookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên tài khoản Facebook của bạn.');
      return;
    }

    const cleanName = fullName.trim();
    const fbUser: CustomerUser = {
      id: `fb_${Date.now()}`,
      name: cleanName,
      email: emailOrPhone.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '.')}.fb@gmail.com`,
      phone: phone.trim() || '0908112233',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authProvider: 'FACEBOOK',
    };

    chatSyncService.saveCustomerSession(fbUser);
    if (onSuccess) onSuccess(fbUser);
    onClose();
  };

  // Handle Standard Email/Phone Login
  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMessage('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }

    const cleanName = fullName.trim();
    const user: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: cleanName,
      email: emailOrPhone.includes('@') ? emailOrPhone.trim() : `${emailOrPhone.trim()}@progear-guest.vn`,
      phone: !emailOrPhone.includes('@') ? emailOrPhone.trim() : (phone.trim() || '0912345678'),
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      authProvider: 'EMAIL',
    };

    chatSyncService.saveCustomerSession(user);
    if (onSuccess) onSuccess(user);
    onClose();
  };

  return (
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
            <div>
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
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email hoặc Số Điện Thoại <span className="text-[#E30019]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  data-testid="input-customer-email"
                  required
                  placeholder="name@email.com hoặc 0912 345 678"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#E30019]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mật khẩu (Tùy chọn)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
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
              className="w-full py-2.5 px-4 bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Đăng Nhập & Bắt Đầu Mua Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleFacebookSubmit} className="p-5 space-y-3.5">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900 text-xs">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Đăng Nhập Nhanh Qua Facebook</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Vui lòng xác nhận Họ và Tên hiển thị trên Facebook của bạn để chuyên viên tư vấn xưng hô và chuẩn bị báo giá chính xác.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Họ và Tên Facebook của bạn <span className="text-[#1877F2]">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  data-testid="input-customer-fb-name"
                  required
                  placeholder="Nhập tên thật hiển thị của bạn..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#1877F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Số Điện Thoại Nhận Báo Giá (Tùy chọn)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="Ví dụ: 0908 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-hidden focus:border-[#1877F2]"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="btn-customer-submit-fb"
              className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <span>Xác Nhận Đăng Nhập Facebook</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Guarantee */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-gray-500 text-[11px] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bảo mật thông tin khách hàng 100% theo tiêu chuẩn ProGear.</span>
        </div>
      </div>
    </div>
  );
};
