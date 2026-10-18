import React, { useState } from 'react';
import { X, Lock, ExternalLink, ShieldCheck, Check, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { CustomerUser } from '../types/chat';
import { chatSyncService } from '../services/chatSyncService';

interface FacebookOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: CustomerUser) => void;
  initialName?: string;
}

export const FacebookOAuthModal: React.FC<FacebookOAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialName = '',
}) => {
  const [fbAccount, setFbAccount] = useState<string>('');
  const [fbPassword, setFbPassword] = useState<string>('');
  const [fbDisplayName, setFbDisplayName] = useState<string>(initialName);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Preset fast-fill Facebook profiles for testing
  const presetProfiles = [
    { name: 'Nguyễn Anh Tuấn (Tuấn Film)', email: 'tuanfilm.creator@gmail.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
    { name: 'Lê Hoàng Phúc (DOP Hà Nội)', email: 'hoangphuc.dop@gmail.com', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80' },
    { name: 'Phan Thanh Hà (Cinematographer)', email: 'thanhha.media@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  ];

  const handleSelectPreset = (p: typeof presetProfiles[0]) => {
    setFbAccount(p.email);
    setFbDisplayName(p.name);
    setFbPassword('••••••••••••');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbDisplayName.trim() && !fbAccount.trim()) {
      setErrorMsg('Vui lòng nhập Họ Tên hoặc Email/SĐT Facebook của bạn.');
      return;
    }

    const finalName = fbDisplayName.trim() || (fbAccount.includes('@') ? fbAccount.split('@')[0].replace(/[._-]/g, ' ') : 'Khách Hàng Facebook');
    const finalEmail = fbAccount.trim().includes('@')
      ? fbAccount.trim()
      : `${finalName.toLowerCase().replace(/[^a-z0-9]/g, '')}.fb@facebook-user.vn`;

    const fbUser: CustomerUser = {
      id: `fb_${Date.now()}`,
      name: finalName,
      email: finalEmail,
      phone: !fbAccount.trim().includes('@') && fbAccount.trim() ? fbAccount.trim() : '0918889999',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authProvider: 'FACEBOOK',
    };

    chatSyncService.saveCustomerSession(fbUser);
    onSuccess(fbUser);
    onClose();
  };

  return (
    <div
      data-testid="facebook-oauth-modal"
      className="fixed inset-0 z-[100] pointer-events-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="bg-[#F0F2F5] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-300 text-xs font-sans">
        {/* Simulated Browser Address Bar */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-2 text-gray-600 select-none">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
          </div>

          <div className="flex-1 max-w-md bg-white border border-gray-300 rounded px-2.5 py-1 text-[11px] flex items-center gap-1.5 truncate text-gray-700">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="font-mono text-emerald-700 font-semibold">https://</span>
            <span className="font-mono text-gray-800 truncate">www.facebook.com/v18.0/dialog/oauth</span>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <a
              href="https://www.facebook.com/login"
              target="_blank"
              rel="noreferrer"
              title="Mở facebook.com trên tab mới"
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Facebook Header */}
        <div className="bg-white px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-7 h-7 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <div>
              <span className="text-[#1877F2] font-black text-xl tracking-tighter">facebook</span>
              <span className="text-[10px] text-gray-500 block -mt-1 font-medium">Xác thực Đăng nhập Meta OAuth</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-500">
            Tiếng Việt (VN)
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs mb-3.5">
            <h3 className="font-bold text-sm text-gray-900 mb-1">
              Đăng nhập vào Facebook
            </h3>
            <p className="text-[11px] text-gray-500 mb-3">
              Đăng nhập bằng tài khoản Facebook của bạn để kết nối và nhận báo giá từ <strong>ProGear Vietnam</strong>.
            </p>

            {errorMsg && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Họ và Tên trên Facebook thật của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  data-testid="input-chat-fb-name"
                  placeholder="Ví dụ: Nguyễn Văn Hùng"
                  value={fbDisplayName}
                  onChange={(e) => setFbDisplayName(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:outline-hidden focus:border-[#1877F2] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Email hoặc số điện thoại Facebook
                </label>
                <input
                  type="text"
                  data-testid="input-fb-email"
                  placeholder="Email hoặc Số điện thoại (tùy chọn)"
                  value={fbAccount}
                  onChange={(e) => setFbAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 focus:outline-hidden focus:border-[#1877F2] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mật khẩu Facebook
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    data-testid="input-fb-password"
                    placeholder="••••••••••••"
                    value={fbPassword}
                    onChange={(e) => setFbPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 bg-white rounded border border-gray-300 focus:outline-hidden focus:border-[#1877F2] text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Meta Permissions Consent Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded p-2.5 space-y-1 text-[11px] text-gray-700">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Quyền Meta OAuth cấp cho ProGear Vietnam:</span>
                </div>
                <div className="text-gray-600 pl-5 text-[10.5px]">
                  <div>• Tên trang cá nhân & Ảnh đại diện công khai</div>
                  <div>• Địa chỉ email liên kết nhận thông báo bảo hành</div>
                </div>
              </div>

              <button
                type="submit"
                data-testid="btn-confirm-chat-fb"
                className="w-full py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-md shadow-xs transition active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Đăng Nhập & Tiếp Tục Dưới Tên Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick-fill sample accounts */}
          <div className="bg-white/80 rounded-lg border border-gray-200 p-3 text-xs">
            <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Chọn nhanh tài khoản Facebook mẫu:</span>
              <span className="text-[10px] text-gray-400">Dành cho Tester</span>
            </div>
            <div className="space-y-1.5">
              {presetProfiles.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="w-full p-1.5 rounded hover:bg-blue-50 text-left flex items-center justify-between border border-transparent hover:border-blue-200 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-gray-800 text-[11px]">{p.name}</div>
                      <div className="text-[10px] text-gray-500">{p.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">Chọn</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Meta Branding */}
        <div className="bg-gray-100 px-5 py-2.5 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
            <span>Xác thực bởi Meta Platforms, Inc.</span>
          </div>
          <div className="flex items-center space-x-2">
            <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noreferrer" className="hover:underline">Quyền riêng tư</a>
            <span>•</span>
            <a href="https://www.facebook.com/legal/terms" target="_blank" rel="noreferrer" className="hover:underline">Điều khoản</a>
          </div>
        </div>
      </div>
    </div>
  );
};
