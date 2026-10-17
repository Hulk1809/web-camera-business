import React from 'react';
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, Server, Activity, ArrowUpRight } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface Props {
  totalRevenue: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  productsCount: number;
  lowStockCount: number;
  completedOrdersCount: number;
  onNavigateOrders: () => void;
  onNavigateProducts: () => void;
  onNavigateK8s: () => void;
}

export function BentoMetricsGrid({
  totalRevenue,
  totalOrdersCount,
  pendingOrdersCount,
  productsCount,
  lowStockCount,
  completedOrdersCount,
  onNavigateOrders,
  onNavigateProducts,
  onNavigateK8s,
}: Props) {
  const completionRate = totalOrdersCount > 0 ? Math.round((completedOrdersCount / totalOrdersCount) * 100) : 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ----------------- BENTO 1: TOTAL REVENUE (Large 2-column on desktop) ----------------- */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl bento-card p-6 flex flex-col justify-between group shadow-xl">
        {/* Soft Ambient Light Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tổng Doanh Thu Hệ Thống
              </span>
              <p className="text-[11px] text-slate-500">Đơn hàng camera & thiết bị điện ảnh</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% tuần này</span>
          </div>
        </div>

        <div className="my-2">
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            <AnimatedCounter value={totalRevenue} isCurrency />
          </div>
        </div>

        {/* Progress & Target Milestone Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
            <span>Tiến độ mục tiêu quý Q2/2026</span>
            <span className="text-emerald-400 font-bold">88.5% Hoàn Thành</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
              style={{ width: '88.5%' }}
            />
          </div>
        </div>
      </div>

      {/* ----------------- BENTO 2: ORDERS OVERVIEW ----------------- */}
      <div
        onClick={onNavigateOrders}
        className="relative overflow-hidden rounded-3xl bento-card p-5 flex flex-col justify-between group shadow-xl cursor-pointer hover:border-red-500/40"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/20 transition-all" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Đơn Hàng
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition" />
        </div>

        <div className="my-1">
          <div className="text-2xl font-black text-white">
            <AnimatedCounter value={totalOrdersCount} suffix=" đơn" />
          </div>
          <div className="text-[11px] text-amber-400 flex items-center space-x-1 mt-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{pendingOrdersCount} đơn chờ duyệt xuất</span>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Tỉ lệ hoàn tất</span>
            <span className="font-bold text-slate-200">{completionRate}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${completionRate}%` }} />
            <div className="bg-amber-500 h-full" style={{ width: `${100 - completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* ----------------- BENTO 3: INVENTORY STATUS ----------------- */}
      <div
        onClick={onNavigateProducts}
        className="relative overflow-hidden rounded-3xl bento-card p-5 flex flex-col justify-between group shadow-xl cursor-pointer hover:border-sky-500/40"
      >
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kho Thiết Bị
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition" />
        </div>

        <div className="my-1">
          <div className="text-2xl font-black text-white">
            <AnimatedCounter value={productsCount} suffix=" model" />
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sony • DJI • Canon • Hasselblad
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Cảnh báo tồn kho:</span>
          {lowStockCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{lowStockCount} mã sắp hết</span>
            </span>
          ) : (
            <span className="text-emerald-400 text-[10px] font-semibold">Tồn kho ổn định</span>
          )}
        </div>
      </div>
    </div>
  );
}
