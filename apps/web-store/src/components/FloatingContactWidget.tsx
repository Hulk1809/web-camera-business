import React from 'react';
import { MessageSquare, Headset, PhoneCall } from 'lucide-react';

interface FloatingContactWidgetProps {
  onOpenLiveChat: () => void;
  unreadCount?: number;
  activeAdvisorName?: string;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({
  onOpenLiveChat,
  unreadCount = 0,
  activeAdvisorName,
}) => {
  return (
    <div
      data-testid="floating-contact-widget"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3 pointer-events-auto"
    >
      {/* 1. ZALO OFFICIAL CHAT BUBBLE */}
      <div className="relative group">
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-gray-900 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-1">
          <span>Chat Zalo với Chuyên Viên (0909 123 456)</span>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>

        <a
          href="https://zalo.me/0909123456"
          target="_blank"
          rel="noreferrer"
          data-testid="btn-zalo-bubble"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white relative overflow-hidden"
          title="Chat Zalo với Pro Gear"
        >
          {/* Zalo official icon text */}
          <span className="font-black text-xs sm:text-sm tracking-tighter drop-shadow">Zalo</span>
          {/* Subtle shine effect */}
          <span className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-25"></span>
        </a>
      </div>

      {/* 2. PRO GEAR LIVE ADVISOR CHAT BUBBLE */}
      <div className="relative group">
        {/* Advisor active tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {activeAdvisorName ? `Đang kết nối: ${activeAdvisorName}` : 'Chuyên viên Pro Gear trực tuyến — Chat ngay!'}
            </span>
          </div>
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>

        <button
          onClick={onOpenLiveChat}
          data-testid="btn-livechat-bubble"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#E30019] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white relative"
        >
          <Headset className="w-6 h-6 sm:w-7 sm:h-7" />

          {/* Pulse ring */}
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
          </span>

          {/* Unread badge if any */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -left-1 bg-amber-500 text-gray-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
