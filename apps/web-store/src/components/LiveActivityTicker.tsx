import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Zap, CheckCircle2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: 'order' | 'warranty' | 'shipping';
  title: string;
  subtitle: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    icon: 'order',
    title: 'Khách hàng tại TP.HCM',
    subtitle: 'vừa đặt mua DJI Mavic 3 Pro Cine Combo',
    timeAgo: '2 phút trước',
  },
  {
    id: '2',
    icon: 'warranty',
    title: 'Bảo hành điện tử',
    subtitle: 'Sony Cinema FX3 Serial SONY-FX3-VN-9901 đã kích hoạt 24T',
    timeAgo: '4 phút trước',
  },
  {
    id: '3',
    icon: 'shipping',
    title: 'Giao hỏa tốc 2H',
    subtitle: 'Kỹ thuật viên đang giao máy ảnh Sony A7 IV tại Hoàn Kiếm, Hà Nội',
    timeAgo: '7 phút trước',
  },
  {
    id: '4',
    icon: 'order',
    title: 'Đơn hàng mới',
    subtitle: 'DJI Osmo Pocket 3 Creator Combo vừa được thanh toán VietQR',
    timeAgo: '10 phút trước',
  },
];

export function LiveActivityTicker({ onOpenWarranty }: { onOpenWarranty?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 300);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const current = ACTIVITIES[currentIndex];

  const getIcon = () => {
    switch (current.icon) {
      case 'order':
        return <Zap className="w-3 h-3 text-amber-400 shrink-0" />;
      case 'warranty':
        return <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />;
      case 'shipping':
        return <Truck className="w-3 h-3 text-sky-400 shrink-0" />;
      default:
        return <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 py-1 text-xs text-gray-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Living Indicator */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide hidden sm:inline">
            HỆ THỐNG TRỰC TUYẾN:
          </span>
        </div>

        {/* Dynamic Activity Content */}
        <div
          className={`flex-1 flex items-center space-x-1.5 transition-all duration-300 truncate text-[11px] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {getIcon()}
          <span className="font-semibold text-white truncate">{current.title}:</span>
          <span className="text-gray-300 truncate">{current.subtitle}</span>
          <span className="text-[10px] text-gray-400 hidden md:inline ml-auto shrink-0 font-mono">
            ({current.timeAgo})
          </span>
        </div>

        {/* Quick Action Link */}
        {onOpenWarranty && (
          <button
            onClick={onOpenWarranty}
            className="text-[11px] text-red-400 hover:text-red-300 transition shrink-0 hidden lg:flex items-center space-x-1 font-medium hover:underline"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Tra cứu bảo hành SN</span>
          </button>
        )}
      </div>
    </div>
  );
}
