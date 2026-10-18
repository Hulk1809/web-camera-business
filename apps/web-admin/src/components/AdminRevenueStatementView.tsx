import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Building2,
  Download,
  Layers,
  Camera,
  Film,
  Video,
  Battery,
  Eye,
  Sparkles,
  HelpCircle,
  X,
  FileText,
  BadgeCheck,
  RefreshCw,
} from 'lucide-react';
import { formatVND } from './EnterpriseKpiRow';
import { Order, Product, CATEGORIES_LIST } from '../App';

interface AdminRevenueStatementViewProps {
  orders: Order[];
  products: Product[];
  onViewOrder?: (order: Order) => void;
  showToast?: (toast: { title: string; message: string; type: 'success' | 'info' | 'warning' | 'error' }) => void;
}

export interface CategoryRevenueStat {
  categoryName: string;
  totalRevenue: number;
  itemsSold: number;
  orderCount: number;
  percentage: number;
  color: string;
  icon: any;
}

export const AdminRevenueStatementView: React.FC<AdminRevenueStatementViewProps> = ({
  orders,
  products,
  onViewOrder,
  showToast,
}) => {
  // Filters
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected receipt for popup inspection
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Map category helper for an order item
  const getItemCategory = (item: any): string => {
    if (item.category) return item.category;
    // Find matching product in catalog
    const matched = products.find(
      (p) =>
        p.name.toLowerCase() === item.productName.toLowerCase() ||
        (p.sku && item.productSku && p.sku.toLowerCase() === item.productSku.toLowerCase())
    );
    if (matched) return matched.category;
    
    // Heuristic fallback
    const name = item.productName.toLowerCase();
    if (name.includes('fx3') || name.includes('cinema') || name.includes('blackmagic')) return 'Máy Quay Điện Ảnh & Cinema';
    if (name.includes('dji') && (name.includes('mavic') || name.includes('flycam') || name.includes('drone') || name.includes('avata') || name.includes('mini'))) return 'Flycam & Drone DJI';
    if (name.includes('rs') || name.includes('gimbal') || name.includes('ronin')) return 'Gimbal & Chống Rung DJI Ronin';
    if (name.includes('pocket') || name.includes('action') || name.includes('osmo')) return 'Action Cam & Pocket Creator';
    if (name.includes('fe ') || name.includes('lens') || name.includes('ống kính') || name.includes('rf ')) return 'Ống Kính Chuyên Dụng (Lenses)';
    if (name.includes('mic') || name.includes('đèn') || name.includes('ánh sáng') || name.includes('studio')) return 'Âm Thanh & Ánh Sáng Studio';
    return 'Máy Ảnh Mirrorless & DSLR';
  };

  // Generate Bank Transaction Ref (Trace ID) if not provided
  const getBankTraceId = (order: Order): string => {
    if (order.bankRef) return order.bankRef;
    if (order.paymentMethod === 'VIETQR') {
      const cleanNum = order.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '8899';
      return `MBB-FT-202610-${cleanNum}`;
    }
    if (order.paymentMethod === 'INSTALLMENT_0PCT' || (order.paymentMethod as string) === 'INSTALLMENT') {
      const cleanNum = order.orderNumber.replace(/[^0-9]/g, '').slice(-4) || '5521';
      return `MPOS-INST-${cleanNum}`;
    }
    return `CASH-COD-RECEIPT`;
  };

  // Filter Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Payment filter
      if (paymentFilter !== 'ALL' && order.paymentMethod !== paymentFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const currentStatus = order.paymentStatus || (order.orderStatus === 'COMPLETED' ? 'PAID' : 'PENDING');
        if (currentStatus !== statusFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const trace = getBankTraceId(order).toLowerCase();
        const matchesQuery =
          order.orderNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.customerPhone.toLowerCase().includes(q) ||
          trace.includes(q) ||
          (order.items && order.items.some((it) => it.productName.toLowerCase().includes(q)));
        if (!matchesQuery) return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL') {
        const hasCategory = order.items && order.items.some((it) => getItemCategory(it) === categoryFilter);
        if (!hasCategory) return false;
      }

      return true;
    });
  }, [orders, paymentFilter, statusFilter, searchQuery, categoryFilter]);

  // Aggregate Category Stats across all completed/paid orders
  const categoryStats = useMemo(() => {
    const categoryMap: Record<
      string,
      { totalRevenue: number; itemsSold: number; orderCount: number }
    > = {};

    CATEGORIES_LIST.forEach((cat) => {
      categoryMap[cat.name] = { totalRevenue: 0, itemsSold: 0, orderCount: 0 };
    });

    let overallRevenue = 0;

    orders.forEach((order) => {
      // Consider all orders that have completed or paid
      const isPaid = order.paymentStatus === 'PAID' || order.orderStatus === 'COMPLETED' || order.totalAmount > 0;
      if (!isPaid) return;

      overallRevenue += order.totalAmount;

      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          const cat = getItemCategory(item);
          if (!categoryMap[cat]) {
            categoryMap[cat] = { totalRevenue: 0, itemsSold: 0, orderCount: 0 };
          }
          const itemRev = item.subtotal || item.price * (item.quantity || 1);
          categoryMap[cat].totalRevenue += itemRev;
          categoryMap[cat].itemsSold += item.quantity || 1;
          categoryMap[cat].orderCount += 1;
        });
      }
    });

    const categoryColors = [
      'bg-indigo-600',
      'bg-blue-600',
      'bg-emerald-600',
      'bg-amber-600',
      'bg-purple-600',
      'bg-rose-600',
      'bg-teal-600',
    ];

    const result: CategoryRevenueStat[] = CATEGORIES_LIST.map((cat, idx) => {
      const stat = categoryMap[cat.name] || { totalRevenue: 0, itemsSold: 0, orderCount: 0 };
      const percentage = overallRevenue > 0 ? (stat.totalRevenue / overallRevenue) * 100 : 0;
      return {
        categoryName: cat.name,
        totalRevenue: stat.totalRevenue,
        itemsSold: stat.itemsSold,
        orderCount: stat.orderCount,
        percentage: Number(percentage.toFixed(1)),
        color: categoryColors[idx % categoryColors.length],
        icon: cat.icon,
      };
    });

    // Sort by revenue descending
    return result.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [orders, products]);

  // Overall Financial KPIs
  const financialKpis = useMemo(() => {
    let totalPaidRevenue = 0;
    let pendingRevenue = 0;
    let vietQrRevenue = 0;
    let vietQrCount = 0;
    let codRevenue = 0;
    let codCount = 0;
    let installmentRevenue = 0;
    let installmentCount = 0;

    orders.forEach((order) => {
      const isPaid = order.paymentStatus === 'PAID' || order.orderStatus === 'COMPLETED';
      if (isPaid) {
        totalPaidRevenue += order.totalAmount;
      } else {
        pendingRevenue += order.totalAmount;
      }

      if (order.paymentMethod === 'VIETQR') {
        vietQrRevenue += order.totalAmount;
        vietQrCount++;
      } else if (order.paymentMethod === 'INSTALLMENT_0PCT' || (order.paymentMethod as string) === 'INSTALLMENT') {
        installmentRevenue += order.totalAmount;
        installmentCount++;
      } else {
        codRevenue += order.totalAmount;
        codCount++;
      }
    });

    const totalOrdersCount = orders.length;
    const aov = totalOrdersCount > 0 ? totalPaidRevenue / (totalOrdersCount || 1) : 0;

    return {
      totalPaidRevenue,
      pendingRevenue,
      vietQrRevenue,
      vietQrCount,
      codRevenue,
      codCount,
      installmentRevenue,
      installmentCount,
      aov,
    };
  }, [orders]);

  // Export CSV Function (UTF-8 BOM for Microsoft Excel compatibility)
  const handleExportCsv = () => {
    const headers = [
      'STT',
      'Mã Đơn / Mã Giao Dịch',
      'Thời Gian Khớp Lệnh',
      'Khách Hàng',
      'Số Điện Thoại',
      'Địa Chỉ Giao Hàng',
      'Phương Thức Thanh Toán',
      'Mã Đối Soát Ngân Hàng (Trace ID)',
      'Danh Mục & Mặt Hàng',
      'Doanh Số (VNĐ)',
      'Trạng Thái Thanh Toán',
      'Trạng Thái Đơn Hàng',
    ];

    const rows = filteredOrders.map((ord, idx) => {
      const trace = getBankTraceId(ord);
      const itemsDesc = (ord.items || [])
        .map((it) => `${it.productName} (x${it.quantity}) [${getItemCategory(it)}]`)
        .join('; ');
      
      const paymentLabel =
        ord.paymentMethod === 'VIETQR'
          ? 'Chuyển Khoản MBBank VietQR'
          : ord.paymentMethod === 'INSTALLMENT_0PCT'
          ? 'Trả Góp Lãi Suất 0%'
          : 'Tiền Mặt (COD)';

      const paymentStatusLabel =
        ord.paymentStatus === 'PAID' || ord.orderStatus === 'COMPLETED'
          ? 'Đã Nhận Đủ Tiền (Khớp Lệnh 100%)'
          : 'Chờ Thanh Toán / Đối Soát';

      return [
        idx + 1,
        `"${ord.orderNumber}"`,
        `"${ord.createdAt || '18/10/2026'}"`,
        `"${ord.customerName}"`,
        `"${ord.customerPhone}"`,
        `"${(ord.shippingAddress || 'Nhận tại Showroom').replace(/"/g, '""')}"`,
        `"${paymentLabel}"`,
        `"${trace}"`,
        `"${itemsDesc.replace(/"/g, '""')}"`,
        ord.totalAmount,
        `"${paymentStatusLabel}"`,
        `"${ord.orderStatus || 'COMPLETED'}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Sao_Ke_Doanh_So_ProGear_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast({
        title: 'Xuất Sao Kê Thành Công',
        message: `Đã xuất ${filteredOrders.length} giao dịch sao kê ra file Excel CSV có UTF-8 BOM chuẩn.`,
        type: 'success',
      });
    }
  };

  // Print Statement Function
  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div data-testid="admin-revenue-statement-view" className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5" />
              Sổ Cái Đối Soát Doanh Số & Dòng Tiền
            </span>
            <span className="text-xs text-slate-400 font-mono">MBBank: 888899996688</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Báo Cáo Doanh Số & Sao Kê Tài Chính</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Phân bổ doanh thu theo từng danh mục thiết bị, sao kê dòng tiền VietQR MBBank & đối soát phiếu thu bán hàng.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            data-testid="btn-export-statement-csv"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Sao Kê Excel (CSV)</span>
          </button>

          <button
            data-testid="btn-print-statement"
            onClick={handlePrintStatement}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In Bản Sao Kê</span>
          </button>
        </div>
      </div>

      {/* 2. Top Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Thực Nhận */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Doanh Thu Thực Nhận
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {formatVND(financialKpis.totalPaidRevenue)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Khớp lệnh 100%
            </span>
            <span>{orders.length} đơn bán</span>
          </div>
        </div>

        {/* KPI 2: Dòng Tiền MBBank VietQR */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Chuyển Khoản MBBank VietQR
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 tabular-nums">
            {formatVND(financialKpis.vietQrRevenue)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-blue-600 font-medium">STK: 888899996688</span>
            <span>{financialKpis.vietQrCount} giao dịch</span>
          </div>
        </div>

        {/* KPI 3: Doanh số Trả Góp & COD */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Trả Góp 0% & Tiền Mặt COD
            </span>
            <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 tabular-nums">
            {formatVND(financialKpis.codRevenue + financialKpis.installmentRevenue)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-amber-700 font-medium">
              Trả góp: {formatVND(financialKpis.installmentRevenue)}
            </span>
            <span>COD: {financialKpis.codCount} đơn</span>
          </div>
        </div>

        {/* KPI 4: Giá trị đơn trung bình (AOV) */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Giá Trị Đơn Trung Bình (AOV)
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {formatVND(financialKpis.aov)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-indigo-600 font-medium">Phân khúc cao cấp</span>
            <span>Chờ thanh toán: {formatVND(financialKpis.pendingRevenue)}</span>
          </div>
        </div>
      </div>

      {/* 3. Section: Danh Mục Doanh Số (Category Sales Breakdown) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Bảng Phân Bổ Doanh Số Theo Danh Mục Hàng Hóa
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thống kê lượng hàng bán ra và doanh thu thực nhận đóng góp theo từng nhóm danh mục sản phẩm ProGear.
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span>Bấm vào danh mục để lọc sao kê chi tiết:</span>
            {categoryFilter !== 'ALL' && (
              <button
                onClick={() => setCategoryFilter('ALL')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
              >
                (Xem tất cả)
              </button>
            )}
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryStats.map((catStat) => {
            const isSelected = categoryFilter === catStat.categoryName;
            const Icon = catStat.icon || Camera;
            return (
              <div
                key={catStat.categoryName}
                data-testid={`card-category-stat-${catStat.categoryName}`}
                onClick={() =>
                  setCategoryFilter(isSelected ? 'ALL' : catStat.categoryName)
                }
                className={`p-3.5 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-slate-900 leading-tight">
                        {catStat.categoryName}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      {catStat.percentage}%
                    </span>
                  </div>

                  <div className="text-lg font-bold text-slate-900 tabular-nums">
                    {formatVND(catStat.totalRevenue)}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${catStat.color}`}
                      style={{ width: `${Math.min(100, Math.max(5, catStat.percentage))}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Đã bán: <strong className="text-slate-800">{catStat.itemsSold}</strong> sản phẩm</span>
                    <span>{catStat.orderCount} giao dịch</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Section: Bảng Sao Kê Chi Tiết & Đối Soát Ngân Hàng (Ledger Table) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Sao Kê Giao Dịch & Khớp Lệnh Ngân Hàng Chi Tiết
            </h3>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
              {filteredOrders.length} chứng từ
            </span>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                data-testid="input-search-statement"
                placeholder="Tìm mã đơn, SĐT, Trace ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs w-48 focus:w-60 transition-all focus:outline-hidden focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Payment Filter */}
            <select
              data-testid="select-payment-statement"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="ALL">Mọi Kênh Thanh Toán</option>
              <option value="VIETQR">VietQR MBBank</option>
              <option value="COD">Tiền Mặt COD</option>
              <option value="INSTALLMENT_0PCT">Trả Góp 0%</option>
            </select>

            {/* Status Filter */}
            <select
              data-testid="select-status-statement"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500"
            >
              <option value="ALL">Mọi Trạng Thái Đối Soát</option>
              <option value="PAID">Khớp Lệnh 100% (Đã Thu)</option>
              <option value="PENDING">Chờ Thanh Toán / Đối Soát</option>
            </select>
          </div>
        </div>

        {/* Ledger Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">STT</th>
                <th className="py-2.5 px-3">Mã Đơn & Trace ID</th>
                <th className="py-2.5 px-3">Thời Gian</th>
                <th className="py-2.5 px-3">Khách Hàng & SĐT</th>
                <th className="py-2.5 px-3">Danh Mục & Hàng Hóa</th>
                <th className="py-2.5 px-3">Kênh Thanh Toán</th>
                <th className="py-2.5 px-3 text-right">Doanh Số (VNĐ)</th>
                <th className="py-2.5 px-3 text-center">Đối Soát</th>
                <th className="py-2.5 px-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-bold text-slate-700">Không tìm thấy giao dịch sao kê phù hợp</div>
                      <p className="text-[11px] text-slate-400">
                        Thử điều chỉnh lại bộ lọc thời gian, kênh thanh toán hoặc từ khóa tìm kiếm.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord, idx) => {
                  const traceId = getBankTraceId(ord);
                  const isPaid = ord.paymentStatus === 'PAID' || ord.orderStatus === 'COMPLETED';

                  return (
                    <tr
                      key={ord.id}
                      data-testid={`row-statement-order-${ord.id}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-400 text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Mã đơn & Trace ID */}
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-indigo-700 flex items-center gap-1">
                          <span>{ord.orderNumber}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                            {traceId}
                          </span>
                        </div>
                      </td>

                      {/* Thời gian */}
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {ord.createdAt || '18/10/2026 10:30'}
                      </td>

                      {/* Khách hàng */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</div>
                      </td>

                      {/* Danh mục & hàng hóa */}
                      <td className="py-3 px-3 max-w-xs">
                        {ord.items && ord.items.length > 0 ? (
                          <div className="space-y-1">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-[11px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                                <span className="font-medium text-slate-800 truncate" title={it.productName}>
                                  {it.productName}
                                </span>
                                <span className="text-slate-400 shrink-0 font-mono">x{it.quantity}</span>
                                <span className="text-[9px] bg-slate-100 text-slate-600 px-1 rounded shrink-0 border border-slate-200">
                                  {getItemCategory(it)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Thiết bị ProGear</span>
                        )}
                      </td>

                      {/* Kênh thanh toán */}
                      <td className="py-3 px-3">
                        {ord.paymentMethod === 'VIETQR' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Building2 className="w-3 h-3" />
                            MBBank VietQR
                          </span>
                        ) : ord.paymentMethod === 'INSTALLMENT_0PCT' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <CreditCard className="w-3 h-3" />
                            Trả Góp 0%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <Receipt className="w-3 h-3" />
                            COD Tiền Mặt
                          </span>
                        )}
                      </td>

                      {/* Doanh số */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-bold font-mono text-slate-900 text-sm tabular-nums">
                          {formatVND(ord.totalAmount)}
                        </div>
                      </td>

                      {/* Trạng thái đối soát */}
                      <td className="py-3 px-3 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Khớp 100%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Chờ Đối Soát
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-3 text-center">
                        <button
                          data-testid={`btn-view-receipt-${ord.id}`}
                          onClick={() => setSelectedReceiptOrder(ord)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>Phiếu Thu</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span>Hiển thị <strong>{filteredOrders.length}</strong> / <strong>{orders.length}</strong> chứng từ đối soát</span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              Tổng số tiền trong danh sách lọc:
            </span>
            <strong className="text-sm font-bold text-indigo-700 font-mono tabular-nums">
              {formatVND(filteredOrders.reduce((acc, curr) => acc + curr.totalAmount, 0))}
            </strong>
          </div>
        </div>
      </div>

      {/* 5. Modal Phiếu Thu & Đối Soát Sao Kê Chi Tiết */}
      {selectedReceiptOrder && (
        <div
          data-testid="modal-receipt-inspection"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-bold text-sm">PHIẾU THU & CHỨNG TỪ SAO KÊ</h4>
                  <p className="text-[11px] text-slate-400">
                    Đối soát giao dịch ngân hàng & chứng thực dòng tiền
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="text-slate-400 hover:text-white p-1 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Organization Header */}
              <div className="border-b border-dashed border-slate-200 pb-3 text-center">
                <h5 className="font-extrabold text-slate-900 text-sm uppercase">
                  CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ PRO GEAR VIỆT NAM
                </h5>
                <p className="text-[11px] text-slate-500">
                  Hệ Thống Phân Phối Máy Ảnh, Thiết Bị Điện Ảnh & DJI Flagship Store
                </p>
                <p className="text-[11px] text-slate-500">
                  Địa chỉ: Số 88 Phố Máy Ảnh, Quận Hoàn Kiếm, TP. Hà Nội | Hotline: 1800 6868
                </p>
              </div>

              {/* Transaction Metadata */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Mã Đơn / Mã Chứng Từ</span>
                  <div className="font-mono font-bold text-slate-900">{selectedReceiptOrder.orderNumber}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Thời Gian Khớp Lệnh</span>
                  <div className="font-mono text-slate-700">{selectedReceiptOrder.createdAt || '18/10/2026'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Khách Hàng Nộp Tiền</span>
                  <div className="font-bold text-slate-900">{selectedReceiptOrder.customerName}</div>
                  <div className="text-slate-500">{selectedReceiptOrder.customerPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Kênh Thanh Toán</span>
                  <div className="font-bold text-indigo-700">
                    {selectedReceiptOrder.paymentMethod === 'VIETQR'
                      ? 'Chuyển Khoản MBBank VietQR'
                      : selectedReceiptOrder.paymentMethod === 'INSTALLMENT_0PCT'
                      ? 'Trả Góp Lãi Suất 0%'
                      : 'Tiền Mặt (COD)'}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    Trace: {getBankTraceId(selectedReceiptOrder)}
                  </div>
                </div>
              </div>

              {/* MBBank Details if VietQR */}
              {selectedReceiptOrder.paymentMethod === 'VIETQR' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900">
                  <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chứng Thực Giao Dịch Ngân Hàng MBBank</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Số tài khoản thụ hưởng: <strong>888899996688</strong></div>
                    <div>Chủ tài khoản: <strong>CONG TY PROGEAR VIET NAM</strong></div>
                    <div>Mã chuẩn đối soát: <strong>{getBankTraceId(selectedReceiptOrder)}</strong></div>
                    <div>Trạng thái: <strong className="text-emerald-700">Đã khớp 100%</strong></div>
                  </div>
                </div>
              )}

              {/* Items Table */}
              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Chi Tiết Thiết Bị Bán Ra:</span>
                <table className="w-full text-left border border-slate-200 rounded overflow-hidden">
                  <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600">
                    <tr>
                      <th className="p-2">Thiết Bị</th>
                      <th className="p-2 text-center">SL</th>
                      <th className="p-2 text-right">Đơn Giá</th>
                      <th className="p-2 text-right">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedReceiptOrder.items && selectedReceiptOrder.items.length > 0 ? (
                      selectedReceiptOrder.items.map((it, idx) => (
                        <tr key={idx} className="text-[11px]">
                          <td className="p-2 font-medium text-slate-900">
                            <div>{it.productName}</div>
                            <span className="text-[9px] text-slate-400 font-mono">
                              Danh mục: {getItemCategory(it)}
                            </span>
                          </td>
                          <td className="p-2 text-center font-mono">{it.quantity}</td>
                          <td className="p-2 text-right font-mono tabular-nums">{formatVND(it.price)}</td>
                          <td className="p-2 text-right font-mono font-bold tabular-nums">
                            {formatVND(it.subtotal || it.price * it.quantity)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-2 text-slate-500 italic">Thiết bị ProGear</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="p-2 text-right text-slate-700">TỔNG CỘNG DOANH SỐ THU VỀ:</td>
                      <td className="p-2 text-right text-indigo-700 font-mono text-sm tabular-nums">
                        {formatVND(selectedReceiptOrder.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 text-center pt-4 border-t border-slate-200 text-[11px]">
                <div>
                  <div className="font-bold text-slate-800">Người Nộp Tiền / Khách Hàng</div>
                  <div className="text-slate-400 text-[10px] italic">(Ký, ghi rõ họ tên)</div>
                  <div className="h-12"></div>
                  <div className="font-medium text-slate-700">{selectedReceiptOrder.customerName}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-800">Thủ Quỹ / Kế Toán Đối Soát</div>
                  <div className="text-slate-400 text-[10px] italic">(Đã thu tiền & đóng dấu)</div>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-emerald-600 border border-emerald-300 bg-emerald-50 px-2 py-0.5 rounded rotate-[-5deg]">
                      ĐÃ THU ĐỦ TIỀN
                    </span>
                  </div>
                  <div className="font-medium text-slate-700">Kế Toán Trưởng ProGear</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Đóng
              </button>

              <button
                onClick={handlePrintStatement}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Phiếu Thu Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
