import React from 'react';
import { Camera, Video, Navigation, Disc, Aperture, Mic, Sparkles, ChevronRight, X } from 'lucide-react';

interface CategoryMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectBrand: (brand: string) => void;
}

const CATEGORIES = [
  {
    name: 'Máy Ảnh Mirrorless & DSLR',
    icon: Camera,
    desc: 'Sony Alpha, Canon EOS, Fujifilm X-Series, Nikon Z',
    badge: 'Hot nhất',
  },
  {
    name: 'Máy Quay Điện Ảnh & Cinema',
    icon: Video,
    desc: 'Sony Cinema Line (FX3, FX6), Blackmagic Pocket 6K Pro',
    badge: 'Chuyên nghiệp',
  },
  {
    name: 'Flycam & Drone DJI',
    icon: Navigation,
    desc: 'DJI Mavic 3 Pro, Mini 4 Pro, Avata 2 FPV',
    badge: 'Bán chạy',
  },
  {
    name: 'Gimbal & Chống Rung DJI Ronin',
    icon: Disc,
    desc: 'DJI RS 4 Pro, RS 3 Mini, Ronin 4D',
  },
  {
    name: 'Action Cam & Pocket Creator',
    icon: Camera,
    desc: 'DJI Osmo Pocket 3, Action 4, GoPro Hero 12',
  },
  {
    name: 'Ống Kính Chuyên Dụng (Lenses)',
    icon: Aperture,
    desc: 'Sony G Master, Canon RF L-series, Sigma Art',
  },
  {
    name: 'Âm Thanh & Ánh Sáng Studio',
    icon: Mic,
    desc: 'DJI Mic 2, Rode Wireless PRO, Aputure Amaran',
  },
];

const BRANDS = ['Sony', 'Canon', 'Fujifilm', 'DJI', 'Blackmagic', 'Nikon'];

export const CategoryMegaMenu: React.FC<CategoryMegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectBrand,
}) => {
  if (!isOpen) return null;

  return (
    <div
      data-testid="category-mega-menu"
      className="absolute top-full left-0 right-0 z-50 bg-white border-b-2 border-[#E30019] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#E30019]"></span>
            <span className="font-black text-sm text-gray-900 uppercase tracking-tight">
              TẤT CẢ DANH MỤC THIẾT BỊ NHIẾP ẢNH & ĐIỆN ẢNH
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded transition text-xs flex items-center gap-1 cursor-pointer"
          >
            <span>Đóng</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Categories (8 cols) */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  data-testid={`btn-category-${cat.name}`}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onClose();
                  }}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50/50 transition text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-md bg-red-100 text-[#E30019] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-xs text-gray-900 group-hover:text-[#E30019] transition">
                        {cat.name}
                      </span>
                      {cat.badge && (
                        <span className="bg-[#E30019] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">{cat.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Brands & Promotion (4 cols) */}
          <div className="md:col-span-4 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-gray-900 mb-2 uppercase tracking-wide">
                THƯƠNG HIỆU PHÂN PHỐI CHÍNH HÃNG
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onSelectBrand(b);
                      onClose();
                    }}
                    className="p-2 rounded bg-white hover:bg-red-50 hover:text-[#E30019] border border-gray-200 text-xs font-bold text-gray-700 text-center transition shadow-2xs"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  onSelectCategory('Tất Cả');
                  onSelectBrand('Tất Cả');
                  onClose();
                }}
                className="w-full py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-md shadow flex items-center justify-center gap-1.5"
              >
                <span>Xem Toàn Bộ Sản Phẩm</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
