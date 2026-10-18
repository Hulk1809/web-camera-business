import React, { useState } from 'react';
import { QrCode, Copy, Check, Download, Building2, User, CreditCard, ShieldCheck } from 'lucide-react';

interface VietQrPaymentBoxProps {
  orderNumber: string;
  amount: number;
  customerName?: string;
  isCompact?: boolean;
}

export const VietQrPaymentBox: React.FC<VietQrPaymentBoxProps> = ({
  orderNumber,
  amount,
  customerName,
  isCompact = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  const bankName = 'MBBank (Ngân Hàng Quân Đội)';
  const accountNumber = '888899996688';
  const accountHolder = 'CONG TY CP CONG NGHE PRO GEAR VIETNAM';

  const vietQrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    orderNumber
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=247PAY_${orderNumber}_${amount}`;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div
      data-testid="admin-vietqr-payment-box"
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm text-slate-900"
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs">
          <QrCode className="w-4 h-4" />
          <span>MÃ VIETQR THANH TOÁN TẠI QUẦY & CHUYỂN KHOẢN</span>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
          Tự động gạch nợ
        </span>
      </div>

      <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-12'} gap-3 items-center`}>
        <div className={`${isCompact ? '' : 'sm:col-span-5'} flex flex-col items-center justify-center text-center`}>
          <div className="p-1.5 bg-slate-50 rounded border border-slate-200 max-w-[160px] w-full">
            <img
              src={imageError ? fallbackQrUrl : vietQrUrl}
              alt="VietQR Code"
              onError={() => setImageError(true)}
              className="w-full h-auto aspect-square object-contain bg-white rounded p-1"
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Quét bằng mọi App Ngân Hàng</span>
        </div>

        <div className={`${isCompact ? '' : 'sm:col-span-7'} space-y-1.5 text-[11px]`}>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Ngân hàng:</span>
            <strong>{bankName}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">STK:</span>
            <div className="flex items-center gap-1">
              <strong className="font-mono text-indigo-700">{accountNumber}</strong>
              <button
                onClick={() => copyToClipboard(accountNumber, 'acc')}
                className="text-slate-400 hover:text-slate-600"
              >
                {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Số tiền:</span>
            <strong className="text-indigo-700 font-mono font-bold">{formatVND(amount)}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Nội dung:</span>
            <div className="flex items-center gap-1">
              <strong className="font-mono text-indigo-900 bg-indigo-50 px-1 rounded">{orderNumber}</strong>
              <button
                onClick={() => copyToClipboard(orderNumber, 'memo')}
                className="text-slate-400 hover:text-slate-600"
              >
                {copiedField === 'memo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
