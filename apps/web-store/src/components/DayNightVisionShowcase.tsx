import React, { useState, useRef } from 'react';
import { Sun, Moon, Eye, ShieldCheck, Sparkles, SlidersHorizontal, Camera, Maximize2 } from 'lucide-react';

interface VisionPreset {
  id: string;
  name: string;
  category: string;
  dayLabel: string;
  nightLabel: string;
  dayImage: string;
  nightImage: string;
  description: string;
  highlights: string[];
}

const PRESETS: VisionPreset[] = [
  {
    id: 'security-smart',
    name: 'Camera Thông Minh: 4K HDR vs Ban Đêm Starlight AI',
    category: 'Giám Sát & An Ninh Cao Cấp',
    dayLabel: '4K HDR Ban Ngày (Chống Ngược Sáng)',
    nightLabel: 'Starlight Ban Đêm + AI Human Tracking',
    dayImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
    nightImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
    description: 'Thử nghiệm cảm biến nhạy sáng cao cấp f/1.4 kết hợp chip xử lý NPU AI. Camera tự động chuyển chế độ hồng ngoại Starlight không độ trễ khi trời tối.',
    highlights: ['Khẩu độ f/1.4 thu sáng gấp 4 lần', 'AI Human Tracking khóa mục tiêu', 'Hồng ngoại ẩn 30m'],
  },
  {
    id: 'cinema-color',
    name: 'Điện Ảnh Pro: S-Log3 10-bit vs Màu Hasselblad Master',
    category: 'Cinema Line & Flycam Hasselblad',
    dayLabel: 'S-Log3 Raw 15+ Stops (Dải Động Rộng)',
    nightLabel: 'Apple ProRes 422 HQ Rec.709 Đã Phối Màu',
    dayImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600',
    nightImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1600',
    description: 'Chiêm ngưỡng sự khác biệt giữa khung hình phẳng (Flat S-Log3) thu trọn chi tiết vùng sáng/tối và bản Master chuẩn điện ảnh tái tạo màu da tự nhiên.',
    highlights: ['10-bit 4:2:2 Color Depth', 'Dải động 15+ stops không cháy sáng', 'Apple ProRes 5.1K/50p'],
  },
];

export function DayNightVisionShowcase() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [showHudGrid, setShowHudGrid] = useState(true);
  const [isAiBoxActive, setIsAiBoxActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const preset = PRESETS[activePresetIndex];

  // Mouse / Touch drag handling for slider
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="relative overflow-hidden py-10 bg-gradient-to-b from-[#070A11] via-[#090E1B] to-[#070A11] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Trải Nghiệm Thấu Kính Quang Học Độc Quyền</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              SO SÁNH CHẤT LƯỢNG HÌNH ẢNH THỰC TẾ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Kéo thanh trượt ngang để kiểm chứng khả năng bắt sáng trong đêm tối và chất lượng cảm biến điện ảnh.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            {PRESETS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePresetIndex(idx);
                  setSliderPos(50);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  activePresetIndex === idx
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{p.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Interactive Comparison Box */}
        <div
          ref={containerRef}
          onMouseMove={(e) => {
            if (e.buttons === 1) handleMove(e.clientX);
          }}
          onTouchMove={handleTouchMove}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden select-none border border-slate-700/80 shadow-2xl group cursor-ew-resize bg-black"
        >
          {/* Layer 2: NIGHT / GRADED (Right / Base layer) */}
          <img
            src={preset.nightImage}
            alt={preset.nightLabel}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />

          {/* Night Vision Label Tag */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white shadow-xl">
            <Moon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{preset.nightLabel}</span>
          </div>

          {/* AI Human Tracking Detection Bounding Box (Living effect on Night Vision) */}
          {isAiBoxActive && sliderPos > 25 && (
            <div
              className="absolute z-20 pointer-events-none transition-all duration-300"
              style={{
                top: '28%',
                left: `${Math.min(72, Math.max(sliderPos + 4, 52))}%`,
                width: '120px',
                height: '140px',
              }}
            >
              {/* Bounding box with pulsing neon emerald corners */}
              <div className="relative w-full h-full border-2 border-dashed border-emerald-400/90 rounded-lg animate-pulse bg-emerald-500/10">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

                {/* AI Tag */}
                <div className="absolute -top-6 left-0 bg-emerald-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 rounded shadow flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>TARGET LOCKED: 99.4%</span>
                </div>
                <div className="absolute -bottom-5 left-0 text-emerald-400 font-mono text-[8px] font-bold bg-black/80 px-1 rounded">
                  HUMAN DETECTED • 5.2M
                </div>
              </div>
            </div>
          )}

          {/* Layer 1: DAY / S-LOG (Left / Clipped layer) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <img
              src={preset.dayImage}
              alt={preset.dayLabel}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Day Label Tag */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold text-white shadow-xl">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>{preset.dayLabel}</span>
            </div>
          </div>

          {/* Rule-of-Thirds Camera HUD Grid Overlay */}
          {showHudGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10 opacity-20">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>
          )}

          {/* Camera Viewfinder Telemetry HUD */}
          <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>REC • 4K 60FPS</span>
            </div>
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-slate-300 font-medium hidden sm:block">
              ISO 400 • f/1.4 • 1/250s
            </div>
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-mono text-amber-400 font-bold hidden md:block">
              NPU AI CHIP: ONLINE
            </div>
          </div>

          {/* Center Dividing Line & Tactical Grip Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent z-30 pointer-events-none shadow-[0_0_12px_rgba(239,68,68,0.9)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-red-600 text-white shadow-xl shadow-red-950 flex items-center justify-center font-bold text-xs ring-4 ring-black/80 group-hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Invisible Range Input for Full Accessibility & Drag */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            aria-label="So sánh hình ảnh thấu kính ngày và đêm"
            className="vision-slider-thumb"
          />
        </div>

        {/* Feature Highlights Pills & Quick Presets */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-2">
            {preset.highlights.map((h, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 font-medium flex items-center space-x-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{h}</span>
              </span>
            ))}
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[11px]">Chuyển nhanh:</span>
            <button
              onClick={() => setSliderPos(15)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              ☀️ Ban Ngày
            </button>
            <button
              onClick={() => setSliderPos(50)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              ⚖️ So Sánh 50/50
            </button>
            <button
              onClick={() => setSliderPos(85)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              🌙 Ban Đêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
