import React, { useRef, useState } from 'react';
import { Camera, Video, Battery, Layers, Heart, Eye, ShoppingBag, Zap, Award, Sparkles } from 'lucide-react';
import type { ProProduct } from '../App';

interface Props {
  product: ProProduct;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, e?: React.MouseEvent) => void;
  onAddToCart: (product: ProProduct, e?: React.MouseEvent) => void;
  onOpenDetail: (product: ProProduct) => void;
  formatVND: (val: number) => string;
}

export function SpotlightProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenDetail,
  formatVND,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(product, e);
    setTimeout(() => setIsAdding(false), 600);
  };

  const specs = product.specifications || {};
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenDetail(product)}
      className="group relative glass-panel glass-panel-hover rounded-3xl border border-slate-800/80 hover:border-red-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-red-950/40 cursor-pointer"
    >
      {/* Interactive Mouse Spotlight Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.14), transparent 75%)`,
          }}
        />
      )}

      {/* 4 Camera Viewfinder Brackets (Corners) */}
      <div className="viewfinder-bracket top-3 left-3 border-t-2 border-l-2 border-slate-600" />
      <div className="viewfinder-bracket top-3 right-3 border-t-2 border-r-2 border-slate-600" />
      <div className="viewfinder-bracket bottom-3 left-3 border-b-2 border-l-2 border-slate-600" />
      <div className="viewfinder-bracket bottom-3 right-3 border-b-2 border-r-2 border-slate-600" />

      {/* Product Image Section */}
      <div className="relative aspect-[4/3] bg-black/60 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />

        {/* Top Left: Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center z-20">
          <span className="bg-red-600/90 backdrop-blur-md text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-lg shadow-md border border-red-400/30">
            {product.badge || product.brand}
          </span>
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-lg shadow-md animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top Right: Wishlist Button */}
        <button
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-300 active:scale-75 ${
            isWishlisted
              ? 'bg-red-600/90 border-red-400 text-white shadow-lg shadow-red-600/50 scale-105'
              : 'bg-black/60 border-white/10 text-slate-300 hover:text-red-400 hover:border-red-500/50 hover:bg-black/80'
          }`}
          title={isWishlisted ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current text-white' : ''}`} />
        </button>

        {/* Stock Pill with living pulse */}
        <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 border border-white/5 z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sẵn hàng: {product.stockQuantity} máy</span>
        </div>

        {/* Multi-angle Pill */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] text-amber-300 font-semibold flex items-center space-x-1 border border-amber-500/30 shadow z-20">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>{product.images.length} góc ảnh</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 relative z-10">
        <div>
          {/* SKU and Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono text-slate-500">{product.sku}</span>
            <span className="text-red-400/90 font-medium truncate max-w-[150px]">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-red-400 transition leading-snug">
            {product.name}
          </h3>

          {/* Perks */}
          <div className="mt-2 flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
            <span className="inline-flex items-center text-amber-400">
              <Zap className="w-3 h-3 mr-0.5 text-amber-400" />
              Hỏa tốc 2H
            </span>
            <span>•</span>
            <span className="inline-flex items-center text-emerald-400">
              <Award className="w-3 h-3 mr-0.5 text-emerald-400" />
              Trả góp 0%
            </span>
          </div>

          {/* Specs Highlights */}
          <div className="mt-2.5 space-y-1 text-[11px]">
            {specs.sensor && (
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Camera className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate">{specs.sensor}</span>
              </div>
            )}
            {specs.video && (
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Video className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{specs.video}</span>
              </div>
            )}
            {specs.flightTime && (
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Battery className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{specs.flightTime}</span>
              </div>
            )}
            {specs.payload && (
              <div className="flex items-center space-x-1.5 text-slate-300">
                <Layers className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="truncate">Tải trọng: {specs.payload}</span>
              </div>
            )}
          </div>
        </div>

        {/* Price and Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-500 line-through">
                {formatVND(product.originalPrice)}
              </div>
            )}
            <div className="text-base font-black text-white group-hover:text-amber-400 transition">
              {formatVND(product.price)}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(product);
              }}
              className="p-2 rounded-xl btn-secondary-genz text-slate-300 hover:text-white"
              title="Xem chi tiết & bộ ảnh"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleQuickAdd}
              className={`px-3 py-2 rounded-xl btn-primary-genz text-white font-bold text-xs flex items-center space-x-1 shadow-lg shadow-red-950 btn-quick-add ${
                isAdding ? 'scale-90 bg-emerald-600' : ''
              }`}
              title="Thêm nhanh vào giỏ hàng"
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${isAdding ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline text-[11px]">
                {isAdding ? 'Đã thêm!' : 'Thêm'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
