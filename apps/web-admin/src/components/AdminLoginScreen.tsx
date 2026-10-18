import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Camera, ArrowRight, AlertCircle } from 'lucide-react';
import { AdvisorStaff, PRESET_STAFF_ACCOUNTS } from '../types/chat';

interface AdminLoginScreenProps {
  onLoginSuccess: (staff: AdvisorStaff) => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      // Check against configured accounts
      if (cleanEmail === 'admin@progear.vn' || cleanEmail === 'admin@camerasmart.vn') {
        if (cleanPass === 'admin123456') {
          const staff = PRESET_STAFF_ACCOUNTS.find((s) => s.id === 'admin_root') || PRESET_STAFF_ACCOUNTS[0];
          onLoginSuccess(staff);
          return;
        }
      }

      if (cleanEmail === 'tuvan1@progear.vn') {
        if (cleanPass === 'progear123') {
          onLoginSuccess(PRESET_STAFF_ACCOUNTS[0]); // Hoàng Nam
          return;
        }
      }

      if (cleanEmail === 'tuvan2@progear.vn') {
        if (cleanPass === 'progear123') {
          onLoginSuccess(PRESET_STAFF_ACCOUNTS[1]); // Minh Thư
          return;
        }
      }

      if (cleanEmail === 'tuvan3@progear.vn') {
        if (cleanPass === 'progear123') {
          onLoginSuccess(PRESET_STAFF_ACCOUNTS[2]); // Quốc Anh
          return;
        }
      }

      setIsLoading(false);
      setErrorMessage('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin đăng nhập!');
    }, 400);
  };

  return (
    <div
      data-testid="admin-login-screen"
      className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand & Security Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>CỔNG QUẢN TRỊ NỘI BỘ • BẢO MẬT 256-BIT</span>
          </div>

          <div className="flex items-center justify-center space-x-2.5 pt-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-xl font-black text-white tracking-tight flex items-center gap-1 leading-none">
                <span className="text-indigo-400">PRO</span>
                <span>GEAR</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Back-office Enterprise Admin
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
            Đăng nhập để quản lý đơn hàng, điều phối tư vấn khách hàng, kho thiết bị và đối soát sao kê tài chính.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          {errorMessage && (
            <div
              data-testid="admin-login-error"
              className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Email Nhân Viên / Quản Trị Viên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  data-testid="input-admin-email"
                  required
                  placeholder="nhanvien@progear.vn"
                  autoComplete="username"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold">
                  Mật Khẩu <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  data-testid="input-admin-password"
                  required
                  placeholder="Nhập mật khẩu nội bộ..."
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              data-testid="btn-admin-login-submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-60 text-xs"
            >
              {isLoading ? (
                <span>Đang xác thực thông tin...</span>
              ) : (
                <>
                  <span>Đăng Nhập Cổng Quản Trị</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Warning */}
        <p className="text-center text-[10.5px] text-slate-500">
          Hệ thống bảo vệ nội bộ. Nghiêm cấm mọi hành vi truy cập trái phép khi chưa được phân quyền.
        </p>
      </div>
    </div>
  );
};
