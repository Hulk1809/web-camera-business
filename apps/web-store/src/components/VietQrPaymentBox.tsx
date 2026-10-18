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

  // Official VietQR API image URL
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
      data-testid="vietqr-payment-box"
      className="bg-white rounded-lg border-2 border-red-200 p-4 shadow-sm text-gray-900"
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded bg-red-600 text-white flex items-center justify-center shadow-sm">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="font-black text-xs sm:text-sm text-red-600 uppercase tracking-tight flex items-center gap-1">
              <span>QUÉT MÃ VIETQR THANH TOÁN 24/7</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[10.5px] text-gray-500">
              Chuyển khoản liên ngân hàng 24/7 tự động kích hoạt bảo hành
            </div>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>Khớp Lệnh Tức Thì</span>
        </span>
      </div>

      <div className={`grid ${isCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-12'} gap-4 items-center`}>
        {/* QR Code Container (5 cols) */}
        <div className={`${isCompact ? '' : 'md:col-span-5'} flex flex-col items-center justify-center text-center`}>
          <div className="relative p-2 bg-gradient-to-br from-red-50 to-amber-50 rounded-lg border border-red-200 shadow-sm max-w-[200px] w-full">
            <img
              src={imageError ? fallbackQrUrl : vietQrUrl}
              alt="VietQR Payment Code"
              data-testid="vietqr-image"
              onError={() => setImageError(true)}
              className="w-full h-auto aspect-square object-contain rounded bg-white p-1.5"
            />
            <div className="mt-1 text-[10px] text-gray-600 font-mono font-bold tracking-tight">
              MBBank • VietQR Pro
            </div>
          </div>

          <a
            href={imageError ? fallbackQrUrl : vietQrUrl}
            download={`VietQR_${orderNumber}.png`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải mã QR về điện thoại</span>
          </a>
        </div>

        {/* Banking Information (7 cols) */}
        <div className={`${isCompact ? '' : 'md:col-span-7'} space-y-2 text-xs`}>
          {/* Bank Name */}
          <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600 truncate">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">Ngân Hàng:</span>
            </div>
            <strong className="text-gray-900 font-semibold">{bankName}</strong>
          </div>

          {/* Account Number with Copy */}
          <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Số Tài Khoản:</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <strong className="text-red-600 font-mono text-sm tracking-wider font-bold">
                {accountNumber}
              </strong>
              <button
                onClick={() => copyToClipboard(accountNumber, 'accountNumber')}
                className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition"
                title="Sao chép số tài khoản"
              >
                {copiedField === 'accountNumber' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Account Holder */}
          <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
            <div className="flex items-center space-x-2 text-gray-600 truncate">
              <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Chủ Tài Khoản:</span>
            </div>
            <strong className="text-gray-900 text-right truncate pl-2">{accountHolder}</strong>
          </div>

          {/* Total Amount with Copy */}
          <div className="flex items-center justify-between p-2 rounded bg-red-50/70 border border-red-200">
            <span className="text-red-900 font-medium">Số Tiền Thanh Toán:</span>
            <div className="flex items-center space-x-1.5">
              <strong className="text-red-600 font-mono text-base font-black">
                {formatVND(amount)}
              </strong>
              <button
                onClick={() => copyToClipboard(String(amount), 'amount')}
                className="p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700 transition"
                title="Sao chép số tiền"
              >
                {copiedField === 'amount' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Transfer Memo (Nội dung) with Copy */}
          <div className="flex items-center justify-between p-2 rounded bg-amber-50 border border-amber-200">
            <div>
              <span className="text-amber-900 font-medium">Nội Dung Chuyển Khoản:</span>
              <div className="text-[10px] text-amber-700">Bắt buộc giữ nguyên để tự động kích hoạt bảo hành</div>
            </div>
            <div className="flex items-center space-x-1.5">
              <strong className="text-amber-900 font-mono text-sm font-bold bg-white px-2 py-0.5 rounded border border-amber-300">
                {orderNumber}
              </strong>
              <button
                onClick={() => copyToClipboard(orderNumber, 'orderNumber')}
                className="p-1 hover:bg-amber-100 rounded text-amber-600 hover:text-amber-800 transition"
                title="Sao chép nội dung"
              >
                {copiedField === 'orderNumber' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
