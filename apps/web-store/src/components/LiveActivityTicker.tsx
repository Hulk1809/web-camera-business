import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, Zap, Eye, CheckCircle2 } from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: 'order' | 'warranty' | 'shipping' | 'ai';
  title: string;
  subtitle: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    icon: 'order',
    title: 'Khách hàng tại TP.HCM',
    subtitle: 'vừa đặt mua DJI Mavic 3 Pro Cine Combo (SSD 1TB)',
    timeAgo: '2 phút trước',
  },
  {
    id: '2',
    icon: 'warranty',
    title: 'Bảo hành điện tử chính hãng',
    subtitle: 'Sony Alpha 7 IV (A7M4) Serial SONY-A7M4-VN-1102 đã kích hoạt',
    timeAgo: '4 phút trước',
  },
  {
    id: '3',
    icon: 'shipping',
    title: 'Giao hỏa tốc 2H',
    subtitle: 'Đơn hàng Flycam DJI Mini 4 Pro đang được kỹ thuật viên giao tại Hà Nội',
    timeAgo: '7 phút trước',
  },
  {
    id: '4',
    icon: 'ai',
    title: 'Hệ thống Smart Camera AI',
    subtitle: 'Đang bảo vệ an toàn 1.420+ công trình & gia đình trực tuyến',
    timeAgo: 'Thời gian thực',
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
      }, 350);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const current = ACTIVITIES[currentIndex];

  const getIcon = () => {
    switch (current.icon) {
      case 'order':
        return <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'warranty':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'shipping':
        return <Truck className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      case 'ai':
        return <Eye className="w-3.5 h-3.5 text-red-400 shrink-0" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  return (
    <div className="bg-[#0b101d]/90 border-b border-slate-800/80 px-4 py-1.5 overflow-hidden text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Living Indicator */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold hidden sm:inline">
            LIVE ACTIVITY
          </span>
        </div>

        {/* Dynamic Activity Content */}
        <div
          className={`flex-1 flex items-center space-x-2 transition-all duration-300 truncate ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
          }`}
        >
          {getIcon()}
          <span className="font-semibold text-slate-200 truncate">{current.title}:</span>
          <span className="text-slate-400 truncate">{current.subtitle}</span>
          <span className="text-[10px] text-slate-500 hidden md:inline ml-auto shrink-0 font-mono">
            {current.timeAgo}
          </span>
        </div>

        {/* Quick Action Link */}
        {onOpenWarranty && (
          <button
            onClick={onOpenWarranty}
            className="text-[11px] text-red-400 hover:text-red-300 transition shrink-0 hidden lg:flex items-center space-x-1 font-medium"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Kích hoạt bảo hành</span>
          </button>
        )}
      </div>
    </div>
  );
}
