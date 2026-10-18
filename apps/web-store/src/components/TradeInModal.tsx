import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface TradeInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUpgradeProduct?: (productName: string) => void;
}

const OLD_MODELS = [
  { id: 'a7m3', name: 'Sony Alpha A7 Mark III', basePrice: 24000000 },
  { id: 'a7c', name: 'Sony Alpha A7C', basePrice: 25500000 },
  { id: 'a6400', name: 'Sony Alpha A6400 Body', basePrice: 12500000 },
  { id: 'canon_rp', name: 'Canon EOS RP Body', basePrice: 14000000 },
  { id: 'canon_r6', name: 'Canon EOS R6 Mark I', basePrice: 32000000 },
  { id: 'fuji_xt3', name: 'Fujifilm X-T3 Body', basePrice: 15500000 },
  { id: 'fuji_xt4', name: 'Fujifilm X-T4 Body', basePrice: 23000000 },
  { id: 'dji_m2pro', name: 'DJI Mavic 2 Pro Fly More', basePrice: 16000000 },
];

export const TradeInModal: React.FC<TradeInModalProps> = ({ isOpen, onClose }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>('a7m3');
  const [condition, setCondition] = useState<'GRADE_A' | 'GRADE_B' | 'GRADE_C'>('GRADE_A');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentModel = OLD_MODELS.find((m) => m.id === selectedModelId) || OLD_MODELS[0];
  const conditionMultiplier = condition === 'GRADE_A' ? 1.0 : condition === 'GRADE_B' ? 0.9 : 0.8;
  const rawTradeIn = Math.round(currentModel.basePrice * conditionMultiplier);
  const subsidyAmount = 3000000; // Trợ giá 3 triệu đồng
  const totalTradeInValuation = rawTradeIn + subsidyAmount;

  const targetUpgradePrice = 84900000; // FX3 price
  const topUpAmount = Math.max(0, targetUpgradePrice - totalTradeInValuation);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div
      data-testid="tradein-modal"
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
          <RefreshCw className="w-5 h-5" />
          <h3 className="font-bold text-base text-gray-900 uppercase tracking-tight">
            THU CŨ ĐỔI MỚI — TRỢ GIÁ ĐẾN 3.000.000Đ
          </h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Hỗ trợ thu lại máy ảnh, máy quay, flycam cũ của mọi hãng. Định giá minh bạch chỉ trong 5 phút.
        </p>

        {isSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-gray-900">Đặt Lịch Thẩm Định Máy Thành Công!</h4>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              Chuyên viên kỹ thuật Pro Gear sẽ gọi tới số <strong>{phone}</strong> để xác nhận tình trạng máy và gửi phiếu giữ máy nâng cấp cho bạn.
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
            {/* Pick Old Model */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Dòng máy ảnh bạn đang sở hữu:</label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#E30019] font-medium"
              >
                {OLD_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Selection */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Tình trạng ngoại hình & hoạt động:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('GRADE_A')}
                  className={`p-2 rounded border text-left transition ${
                    condition === 'GRADE_A'
                      ? 'border-[#E30019] bg-red-50 text-[#E30019] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold">Loại 1 (99%)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Đẹp như mới, fullbox</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('GRADE_B')}
                  className={`p-2 rounded border text-left transition ${
                    condition === 'GRADE_B'
                      ? 'border-[#E30019] bg-red-50 text-[#E30019] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold">Loại 2 (95%)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Xước nhẹ, hoạt động tốt</div>
                </button>
                <button
                  type="button"
                  onClick={() => setCondition('GRADE_C')}
                  className={`p-2 rounded border text-left transition ${
                    condition === 'GRADE_C'
                      ? 'border-[#E30019] bg-red-50 text-[#E30019] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold">Loại 3 (90%)</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Cũ theo thời gian</div>
                </button>
              </div>
            </div>

            {/* Valuation Summary Card */}
            <div className="p-3.5 bg-gradient-to-br from-amber-50 to-red-50 rounded-lg border border-amber-200 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
                <span className="text-gray-600">Giá thu máy cũ dự kiến:</span>
                <strong className="font-mono text-gray-900">{formatVND(rawTradeIn)}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-amber-200/60 text-emerald-800">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Trợ giá Pro Gear lên đời:</span>
                </span>
                <strong className="font-mono text-emerald-700">+{formatVND(subsidyAmount)}</strong>
              </div>
              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold text-gray-900">Tổng giá trị thu lại:</span>
                <strong className="font-mono text-[#E30019] font-black text-base">
                  {formatVND(totalTradeInValuation)}
                </strong>
              </div>
              <div className="text-[11px] text-gray-600 mt-1">
                💡 Ví dụ nâng cấp lên <strong>Sony FX3 (84.990.000đ)</strong>, bạn chỉ cần bù thêm:{' '}
                <strong className="text-gray-900 font-mono font-bold">{formatVND(topUpAmount)}</strong> (Hỗ trợ trả góp 0% phần chênh lệch).
              </div>
            </div>

            {/* Contact Input Form */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  placeholder="Họ và tên..."
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
              data-testid="btn-submit-tradein"
              className="w-full py-2.5 bg-[#E30019] hover:bg-red-700 text-white font-bold rounded-md shadow transition flex items-center justify-center gap-1.5"
            >
              <span>Đặt Lịch Thẩm Định & Thu Máy Cũ Tại Showroom</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
