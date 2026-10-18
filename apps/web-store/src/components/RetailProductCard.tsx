import React from 'react';
import { ShoppingCart, Check, Clock, Heart, Eye } from 'lucide-react';
import { ProProduct } from '../App';

interface RetailProductCardProps {
  product: ProProduct;
  onAddToCart: (product: ProProduct, e: React.MouseEvent) => void;
  onQuickView: (product: ProProduct) => void;
  onToggleWishlist?: (productId: string, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  isFlashDeal?: boolean;
  soldCount?: number;
  totalDealStock?: number;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RetailProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWishlisted = false,
  isFlashDeal = false,
  soldCount = 12,
  totalDealStock = 20,
}: RetailProductCardProps) {
  const isOutOfStock = (product.stockQuantity ?? (product as any).stock ?? 0) <= 0;

  // Calculate discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // Extract top 2-3 tech spec pills
  const specPills: string[] = [];
  if (product.specifications) {
    if (product.specifications.sensor) specPills.push(product.specifications.sensor.split('+')[0].trim());
    if (product.specifications.video) specPills.push(product.specifications.video.split(',')[0].trim());
    if (product.specifications.stabilization) specPills.push('Chống rung IBIS');
    if (product.specifications.payload) specPills.push(product.specifications.payload);
    if (product.specifications.flightTime) specPills.push(product.specifications.flightTime.replace('Thời gian bay tối đa ', 'Bay '));
  }
  if (specPills.length === 0) {
    specPills.push('Chính Hãng 100%', 'Bảo hành 24T');
  }

  // Display top 2 specs to preserve compact layout
  const visibleSpecs = specPills.slice(0, 2);

  // Flash deal progress calculation
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalDealStock)) * 100));

  return (
    <div
      onClick={() => onQuickView(product)}
      data-testid="product-card"
      data-sku={product.sku}
      className="bg-white border border-gray-200 hover:border-[#E30019] rounded-lg p-2.5 flex flex-col justify-between group relative cursor-pointer product-card-hover select-none"
    >
      {/* Top badges & Wishlist */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
        {discountPercent > 0 && (
          <span className="bg-[#E30019] text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {product.badge && discountPercent === 0 && (
          <span className="bg-gray-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {onToggleWishlist && (
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product.id, e)}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-colors ${
            isWishlisted
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 hover:text-red-500 bg-gray-100 hover:bg-gray-200'
          }`}
          title="Thêm vào yêu thích"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      )}

      {/* Product Image with square aspect ratio & subtle hover lift */}
      <div className="w-full aspect-square bg-white rounded-md overflow-hidden flex items-center justify-center p-2 mb-2 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600';
          }}
          className="w-full h-full object-contain transform transition-transform duration-200 group-hover:-translate-y-1"
        />

        {/* Quick View overlay button */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded shadow-md flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#E30019]" />
            <span>Xem nhanh</span>
          </span>
        </div>
      </div>

      {/* Tech Specs Pills */}
      <div className="flex flex-wrap gap-1 mb-1.5 h-5 overflow-hidden">
        {visibleSpecs.map((spec, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-600 text-[10px] font-medium px-1.5 py-0.5 rounded border border-gray-200/80 truncate max-w-[130px]"
            title={spec}
          >
            {spec}
          </span>
        ))}
        <span className="bg-red-50 text-red-600 text-[10px] font-medium px-1.5 py-0.5 rounded border border-red-100">
          BH 24T
        </span>
      </div>

      {/* Product Name (Fixed 2 lines height) */}
      <h3
        className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-[#E30019] line-clamp-2 h-10 leading-snug transition-colors mb-2"
        title={product.name}
      >
        {product.name}
      </h3>

      {/* Price Section */}
      <div className="mb-2">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[#E30019] font-bold text-sm md:text-base">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Flash Deal Progress Bar (if Flash Deal mode) */}
      {isFlashDeal && (
        <div className="mb-2.5">
          <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
            <span className="font-medium text-[#E30019]">Đã bán {soldCount}/{totalDealStock}</span>
            <span>Còn {Math.max(0, totalDealStock - soldCount)}</span>
          </div>
          <div className="w-full bg-red-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-500 to-[#E30019] h-full rounded-full transition-all duration-500"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Stock Status & Quick Add Cart Button */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
        {isOutOfStock ? (
          <span className="text-amber-600 text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Đặt chờ về</span>
          </span>
        ) : (
          <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Còn hàng</span>
          </span>
        )}

        <button
          type="button"
          data-testid="btn-quick-add-cart"
          onClick={(e) => onAddToCart(product, e)}
          className="p-1.5 bg-red-50 hover:bg-[#E30019] text-[#E30019] hover:text-white rounded-md transition-all border border-red-200 active:scale-90"
          title={isOutOfStock ? 'Đặt hàng chờ về' : 'Thêm nhanh vào giỏ hàng'}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
