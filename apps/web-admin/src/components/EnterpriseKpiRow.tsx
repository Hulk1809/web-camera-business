import React from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, ShieldCheck, TrendingUp, ChevronRight } from 'lucide-react';

interface EnterpriseKpiRowProps {
  totalRevenue: number;
  pendingOrdersCount: number;
  preOrdersCount: number;
  lowStockCount: number;
  activeWarrantyCount: number;
  onNavigateTab: (tab: 'orders' | 'products' | 'warranty' | 'finance') => void;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function EnterpriseKpiRow({
  totalRevenue,
  pendingOrdersCount,
  preOrdersCount,
  lowStockCount,
  activeWarrantyCount,
  onNavigateTab,
}: EnterpriseKpiRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
      {/* KPI 1: Doanh Thu */}
      <div
        data-testid="kpi-card-total-revenue"
        onClick={() => onNavigateTab('finance')}
        className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:border-indigo-400 transition-colors cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-indigo-600 transition-colors flex items-center gap-1">
            <span>Tổng Doanh Thu</span>
            <span className="text-[10px] text-indigo-500 font-normal">(Xem sao kê)</span>
          </span>
          <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center border border-indigo-100">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
            {formatVND(totalRevenue)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-600 font-medium mt-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +18.5% so với tuần trước
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* KPI 2: Đơn mới cần xử lý */}
      <div
        onClick={() => onNavigateTab('orders')}
        className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
            Đơn Cần Xử Lý
          </span>
          <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums flex items-baseline gap-2">
            <span>{pendingOrdersCount}</span>
            <span className="text-xs font-normal text-slate-500">đơn hàng</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-1">
            {preOrdersCount > 0 ? (
              <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {preOrdersCount} đơn đặt chờ về cần gọi
              </span>
            ) : (
              <span className="text-slate-500">Tiến độ xử lý đạt 100%</span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* KPI 3: Cảnh báo tồn kho */}
      <div
        onClick={() => onNavigateTab('products')}
        className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:border-rose-300 transition-colors cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-rose-600 transition-colors">
            Cảnh Báo Tồn Kho
          </span>
          <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums flex items-baseline gap-2">
            <span>{lowStockCount}</span>
            <span className="text-xs font-normal text-slate-500">sản phẩm</span>
          </div>
          <div className="flex items-center justify-between text-[11px] mt-1">
            {lowStockCount > 0 ? (
              <span className="text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                Tồn dưới 3 hoặc hết hàng
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">Kho hàng đầy đủ</span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* KPI 4: Phiếu bảo hành & Serial */}
      <div
        onClick={() => onNavigateTab('warranty')}
        className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
            Bảo Hành Đang Hiệu Lực
          </span>
          <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums flex items-baseline gap-2">
            <span>{activeWarrantyCount}</span>
            <span className="text-xs font-normal text-slate-500">máy đã kích hoạt</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
            <span className="text-emerald-700 font-medium">Chuẩn Tin Học Ngôi Sao</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
