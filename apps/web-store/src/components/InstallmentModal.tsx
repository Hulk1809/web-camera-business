import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Calculator, ShieldCheck, ArrowRight } from 'lucide-react';

interface InstallmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: number;
}

export const InstallmentModal: React.FC<InstallmentModalProps> = ({
  isOpen,
  onClose,
  productName = 'Sony FX3 Cinema Line Body (ILME-FX3)',
  price = 84900000,
}) => {
  const [prepayPercent, setPrepayPercent] = useState<number>(20);
  const [termMonths, setTermMonths] = useState<number>(6);
  const [financeMethod, setFinanceMethod] = useState<'CREDIT_CARD' | 'FINANCE_COMPANY'>('CREDIT_CARD');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Form fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  if (!isOpen) return null;

  const prepayAmount = Math.round((price * prepayPercent) / 100);
  const loanAmount = price - prepayAmount;
  const monthlyAmount = Math.round(loanAmount / termMonths);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div
      data-testid="installment-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-white rounded-lg border border-gray-200 max-w-lg w-full p-5 relative shadow-2xl text-gray-900 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#E30019] mb-1">
          <CreditCard className="w-5 h-5" />
          <h3 className="font-bold text-base text-gray-900 uppercase tracking-tight">
            TÍNH TOÁN & ĐĂNG KÝ TRẢ GÓP 0% LÃI SUẤT
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Áp dụng cho mọi dòng máy ảnh Sony Alpha, Canon EOS, Fujifilm & Flycam DJI chính hãng.
        </p>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-gray-900">Gửi Hồ Sơ Trả Góp Thành Công!</h4>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Chuyên viên tài chính Pro Gear sẽ liên hệ lại với bạn qua số <strong>{phone}</strong> trong vòng 15 phút để hoàn tất thủ tục xét duyệt hồ sơ online.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-3 px-6 py-2 bg-[#E30019] text-white font-bold text-xs rounded-md shadow"
            >
              Đóng Cửa Sổ
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Selected Product Card */}
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 text-xs">{productName}</div>
                <div className="text-[11px] text-[#E30019] font-mono font-bold mt-0.5">
                  Giá bán niêm yết: {formatVND(price)}
                </div>
              </div>
              <span className="bg-[#E30019] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                Lãi suất 0%
              </span>
            </div>

            {/* Method selection */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hình thức trả góp:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinanceMethod('CREDIT_CARD')}
                  className={`p-2.5 rounded-md border text-center transition ${
                    financeMethod === 'CREDIT_CARD'
                      ? 'border-[#E30019] bg-red-50 text-[#E30019] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  💳 Qua Thẻ Tín Dụng (Visa/Master)
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceMethod('FINANCE_COMPANY')}
                  className={`p-2.5 rounded-md border text-center transition ${
                    financeMethod === 'FINANCE_COMPANY'
                      ? 'border-[#E30019] bg-red-50 text-[#E30019] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📄 Qua CCCD (HD SAISON / HomeCredit)
                </button>
              </div>
            </div>

            {/* Prepay Percent Selector */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Tỷ lệ trả trước: <strong className="text-[#E30019] font-mono">{prepayPercent}%</strong> ({formatVND(prepayAmount)})
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 20, 30, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPrepayPercent(pct)}
                    className={`py-1.5 rounded border text-center font-mono font-bold transition ${
                      prepayPercent === pct
                        ? 'bg-[#E30019] text-white border-[#E30019]'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Term Months Selector */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Kỳ hạn trả góp:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTermMonths(m)}
                    className={`py-1.5 rounded border text-center font-bold transition ${
                      termMonths === m
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {m} Tháng
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Repayment Box */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền cần trả trước:</span>
                <strong className="text-gray-900 font-mono">{formatVND(prepayAmount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Góp mỗi tháng (ước tính):</span>
                <strong className="text-[#E30019] font-mono text-sm font-bold">
                  {formatVND(monthlyAmount)}/tháng
                </strong>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-700 font-medium pt-1 border-t border-gray-200">
                <span>Chênh lệch lãi suất:</span>
                <span>0 VNĐ (Không phát sinh phí ẩn)</span>
              </div>
            </div>

            {/* Contact Input Form */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019]"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="09..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019]"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="btn-submit-installment"
              className="w-full py-2.5 bg-[#E30019] hover:bg-red-700 text-white font-bold rounded-md shadow transition flex items-center justify-center gap-1.5"
            >
              <span>Nộp Hồ Sơ Duyệt Nhanh 15 Phút</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
