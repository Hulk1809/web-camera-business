import React, { useState, useEffect } from 'react';
import {
  Camera,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShieldCheck,
  Server,
  Plus,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Boxes,
  Truck,
  ExternalLink,
  ChevronRight,
  Filter,
  Eye,
  Trash2,
  Edit3,
  RotateCw
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  resolution: string;
  nightVision: string;
  aiFeatures: string[];
  imageUrl: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  itemsCount: number;
  paymentMethod: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'warranty' | 'k8s'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial State synced with DB Seed
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Camera IP Hikvision ColorVu 4MP DS-2CD2047G2-LU',
      sku: 'DS-2CD2047G2-LU',
      brand: 'Hikvision',
      category: 'Camera Ngoài Trời Chống Nước',
      price: 1850000,
      originalPrice: 2200000,
      stock: 45,
      resolution: '4.0 MP 2K (2688x1520)',
      nightVision: 'ColorVu có màu 24/7 40m',
      aiFeatures: ['AcuSense AI', 'Nhận diện Người/Xe', 'Mic thu âm'],
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300',
      status: 'IN_STOCK',
    },
    {
      id: '2',
      name: 'Camera Wifi Ezviz C6N 4MP 2K+ Xoay 360 Độ',
      sku: 'EZVIZ-C6N-4MP',
      brand: 'Ezviz',
      category: 'Camera Wifi Trong Nhà',
      price: 690000,
      originalPrice: 950000,
      stock: 120,
      resolution: '4.0 MP 2K+ (2560x1440)',
      nightVision: 'Hồng ngoại Smart IR 10m',
      aiFeatures: ['Tự động xoay theo chuyển động', 'Đàm thoại 2 chiều'],
      imageUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=300',
      status: 'IN_STOCK',
    },
    {
      id: '3',
      name: 'Camera Ngoài Trời Imou Cruiser Dual 6MP (2 Mắt Kép)',
      sku: 'IMOU-IPC-S7XP-6M0WED',
      brand: 'Imou',
      category: 'Camera Ngoài Trời Chống Nước',
      price: 1350000,
      originalPrice: 1650000,
      stock: 4,
      resolution: '6.0 MP Kép (3MP + 3MP)',
      nightVision: '4 chế độ màu ban đêm 30m',
      aiFeatures: ['IMOU SENSE AI', 'Còi hú 110dB', 'Đèn rọi'],
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300',
      status: 'LOW_STOCK',
    },
    {
      id: '4',
      name: 'Đầu Ghi Hình NVR Dahua 8 Kênh 4K WizSense PoE',
      sku: 'DHI-NVR4108HS-8P-4KS2/L',
      brand: 'Dahua',
      category: 'Đầu Ghi Hình & Ổ Cứng',
      price: 2450000,
      originalPrice: 2900000,
      stock: 15,
      resolution: 'Hỗ trợ Camera 4K (8MP)',
      nightVision: 'Tương thích mọi Camera',
      aiFeatures: ['Bảo vệ vành đai AI', 'Tìm kiếm khuôn mặt'],
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300',
      status: 'IN_STOCK',
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-1',
      orderNumber: 'CAM-20261016-8942',
      customerName: 'Nguyễn Văn Hùng',
      customerPhone: '0912 345 678',
      totalAmount: 3700000,
      itemsCount: 2,
      paymentMethod: 'VIETQR (Đã thanh toán)',
      status: 'CONFIRMED',
      createdAt: '10 phút trước',
    },
    {
      id: 'ord-2',
      orderNumber: 'CAM-20261016-7721',
      customerName: 'Trần Thị Mai',
      customerPhone: '0988 776 554',
      totalAmount: 690000,
      itemsCount: 1,
      paymentMethod: 'COD (Thanh toán khi nhận)',
      status: 'SHIPPING',
      createdAt: '1 giờ trước',
    },
    {
      id: 'ord-3',
      orderNumber: 'CAM-20261015-1109',
      customerName: 'Công ty TNHH Smart Tech',
      customerPhone: '0903 112 233',
      totalAmount: 9800000,
      itemsCount: 6,
      paymentMethod: 'Chuyển khoản Doanh nghiệp',
      status: 'COMPLETED',
      createdAt: 'Hôm qua',
    },
  ]);

  // Form state for adding camera
  const [newCamera, setNewCamera] = useState({
    name: '',
    sku: '',
    brand: 'Hikvision',
    category: 'Camera Ngoài Trời Chống Nước',
    price: '',
    stock: '',
    resolution: '4.0 MP 2K',
    nightVision: 'ColorVu có màu 24/7',
    aiFeature: 'AI AcuSense',
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: Product[] = data.items.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            sku: item.sku,
            brand: item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'Hikvision'),
            category: item.category?.name || (typeof item.category === 'string' ? item.category : 'Camera Ngoài Trời Chống Nước'),
            price: Number(item.price),
            originalPrice: Number(item.originalPrice) || Math.round(Number(item.price) * 1.2),
            stock: Number(item.stockQuantity ?? 10),
            resolution: item.specifications?.resolution || '4.0 MP 2K',
            nightVision: item.specifications?.nightVision || 'ColorVu có màu 24/7',
            aiFeatures: Array.isArray(item.specifications?.aiFeatures) ? item.specifications.aiFeatures : ['Nhận diện AI'],
            imageUrl: item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300',
            status: Number(item.stockQuantity ?? 10) < 5 ? 'LOW_STOCK' : 'IN_STOCK',
          }));
          setProducts(mapped);
        }
      }
    } catch (err) {
      console.error('Lỗi tải sản phẩm từ backend:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Lỗi xóa sản phẩm khỏi database:', err);
    }
  };

  const handleResetSeed = async () => {
    try {
      await fetch('/api/products/seed', { method: 'POST' });
      await fetchProducts();
    } catch (err) {
      console.error('Lỗi nạp dữ liệu mẫu:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamera.name || !newCamera.price) return;

    const payload = {
      name: newCamera.name,
      sku: newCamera.sku || `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newCamera.brand,
      category: newCamera.category,
      price: Number(newCamera.price),
      originalPrice: Number(newCamera.price) * 1.2,
      stockQuantity: Number(newCamera.stock) || 10,
      specifications: {
        resolution: newCamera.resolution,
        nightVision: newCamera.nightVision,
        aiFeatures: [newCamera.aiFeature],
      },
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300',
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        const p: Product = {
          id: String(Date.now()),
          name: newCamera.name,
          sku: newCamera.sku || `CAM-${Math.floor(1000 + Math.random() * 9000)}`,
          brand: newCamera.brand,
          category: newCamera.category,
          price: Number(newCamera.price),
          originalPrice: Number(newCamera.price) * 1.2,
          stock: Number(newCamera.stock) || 10,
          resolution: newCamera.resolution,
          nightVision: newCamera.nightVision,
          aiFeatures: [newCamera.aiFeature],
          imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300',
          status: Number(newCamera.stock) < 5 ? 'LOW_STOCK' : 'IN_STOCK',
        };
        setProducts(prev => [p, ...prev]);
      }
    } catch (err) {
      console.error('Lỗi lưu camera vào database:', err);
    }

    setShowAddModal(false);
    setNewCamera({
      name: '',
      sku: '',
      brand: 'Hikvision',
      category: 'Camera Ngoài Trời Chống Nước',
      price: '',
      stock: '',
      resolution: '4.0 MP 2K',
      nightVision: 'ColorVu có màu 24/7',
      aiFeature: 'AI AcuSense',
    });
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
    return matchSearch && matchBrand;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="flex h-screen bg-[#0b1120] text-slate-100 overflow-hidden font-sans">
      {/* ----------------- SIDEBAR ----------------- */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">CAM ADMIN</h1>
            <p className="text-xs text-sky-400 font-medium">Operations & Cloud</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Tổng Quan (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5" />
              <span>Quản Lý Camera</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">{products.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <span>Đơn Hàng</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'warranty'
                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Serial & Bảo Hành</span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <span className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Hạ Tầng Kubernetes</span>
            <button
              onClick={() => setActiveTab('k8s')}
              className={`w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'k8s'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Server className="w-5 h-5 text-indigo-400" />
              <span>Cụm AKS k8s-hulk-lab</span>
            </button>
          </div>
        </nav>

        {/* Cluster Status Widget */}
        <div className="p-4 m-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>AKS: k8s-hulk-lab</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">2 Nodes Active • PostgreSQL Ready</p>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW ----------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white capitalize">
              {activeTab === 'dashboard' && 'Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'products' && 'Quản Lý Danh Mục Camera & Kho Hàng'}
              {activeTab === 'orders' && 'Quản Lý Đơn Đặt Hàng Bán Lẻ & Dự Án'}
              {activeTab === 'warranty' && 'Tra Cứu Mã Serial & Kích Hoạt Bảo Hành'}
              {activeTab === 'k8s' && 'Giám Sát Cụm Kubernetes k8s-hulk-lab'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 border border-slate-700"
            >
              <span>Xem Web Khách Hàng</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                AD
              </div>
              <div className="text-left text-xs hidden sm:block">
                <p className="font-semibold text-slate-200">Admin Quản Trị</p>
                <p className="text-slate-400">admin@camerasmart.vn</p>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ===================== TAB 1: DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</span>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-3">
                    {totalRevenue.toLocaleString('vi-VN')} <span className="text-sm font-semibold text-slate-400">đ</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 mt-2 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+18.4% so với tháng trước</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Đơn Hàng Mới</span>
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-3">{orders.length} Đơn</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-sky-400 mt-2 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>2 đơn đang chờ xử lý xuất kho</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Camera Đang Bán</span>
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Boxes className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-3">{products.length} Mẫu</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-indigo-400 mt-2 font-medium">
                    <span>4 thương hiệu: Hikvision, Dahua, Ezviz, Imou</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cảnh Báo Tồn Kho</span>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-amber-400 mt-3">1 Mẫu Sắp Hết</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400/80 mt-2 font-medium">
                    <span>Imou Cruiser Dual (Còn 4 chiếc)</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Recent Orders + Quick Infrastructure info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 rounded-2xl bg-[#0f172a] border border-slate-800 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-white">Đơn Hàng Gần Đây</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
                    >
                      <span>Xem tất cả</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Mã Đơn</th>
                          <th className="py-3 px-4">Khách Hàng</th>
                          <th className="py-3 px-4">Tổng Tiền</th>
                          <th className="py-3 px-4">Trạng Thái</th>
                          <th className="py-3 px-4 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-sky-400 text-xs">{ord.orderNumber}</td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-slate-100">{ord.customerName}</p>
                              <p className="text-xs text-slate-400">{ord.customerPhone}</p>
                            </td>
                            <td className="py-3 px-4 font-semibold text-white">{ord.totalAmount.toLocaleString('vi-VN')} đ</td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                ord.status === 'CONFIRMED' ? 'bg-sky-500/20 text-sky-400' :
                                ord.status === 'SHIPPING' ? 'bg-amber-500/20 text-amber-400' :
                                ord.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-slate-700 text-slate-300'
                              }`}>
                                {ord.status === 'CONFIRMED' && 'Đã Xác Nhận'}
                                {ord.status === 'SHIPPING' && 'Đang Giao Hàng'}
                                {ord.status === 'COMPLETED' && 'Hoàn Thành'}
                                {ord.status === 'PENDING' && 'Chờ Duyệt'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setActiveTab('orders')}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
                              >
                                Chi Tiết
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Cloud & DevOps Snapshot */}
                <div className="rounded-2xl bg-[#0f172a] border border-slate-800 p-5 space-y-4">
                  <h3 className="font-bold text-base text-white flex items-center space-x-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    <span>Hạ Tầng K8s (AKS)</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Cụm AKS:</span>
                        <span className="font-mono text-emerald-400 font-bold">k8s-hulk-lab</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1.5">
                        <span className="text-slate-400">Node Pools:</span>
                        <span className="text-slate-200 font-semibold">2 Nodes (agentpool)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs mt-1.5">
                        <span className="text-slate-400">Hệ Điều Hành:</span>
                        <span className="text-slate-200">Ubuntu Linux</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Trạng Thái Pods K8s</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">postgres-0 (StatefulSet)</span>
                          <span className="text-emerald-400 font-bold">Running (20GB PVC)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">backend (2 replicas)</span>
                          <span className="text-emerald-400 font-bold">Running (NestJS)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">web-store (2 replicas)</span>
                          <span className="text-emerald-400 font-bold">Running (Next.js)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300">web-admin (2 replicas)</span>
                          <span className="text-emerald-400 font-bold">Running (React)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('k8s')}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      Quản Trị Chi Tiết Kubernetes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: PRODUCTS ===================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0f172a] p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên camera, SKU..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="ALL">Tất cả hãng</option>
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Ezviz">Ezviz</option>
                    <option value="Imou">Imou</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleResetSeed}
                    title="Nạp lại dữ liệu sản phẩm mẫu ban đầu vào PostgreSQL"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Nạp Dữ Liệu Mẫu</span>
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Camera Mới</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs uppercase bg-slate-800/60 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Ảnh & Model</th>
                      <th className="py-3.5 px-4">Hãng & Danh Mục</th>
                      <th className="py-3.5 px-4">Thông Số Kỹ Thuật (Specs JSONB)</th>
                      <th className="py-3.5 px-4">Giá Bán</th>
                      <th className="py-3.5 px-4">Kho</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img src={p.imageUrl} alt={p.name} className="w-14 h-14 object-cover rounded-xl border border-slate-700 bg-slate-900" />
                            <div>
                              <p className="font-semibold text-slate-100 line-clamp-1">{p.name}</p>
                              <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                                SKU: {p.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            {p.brand}
                          </span>
                          <p className="text-xs text-slate-400 mt-1">{p.category}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 text-xs">
                            <p className="font-medium text-slate-200">📸 {p.resolution}</p>
                            <p className="text-slate-400">🌙 {p.nightVision}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.aiFeatures.map((feat, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white text-base">
                          {p.price.toLocaleString('vi-VN')} đ
                          <p className="text-xs text-slate-500 line-through font-normal">
                            {p.originalPrice.toLocaleString('vi-VN')} đ
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            p.status === 'LOW_STOCK'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {p.stock} chiếc
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400"
                              title="Xóa camera khỏi database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: ORDERS ===================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-white">Toàn Bộ Đơn Đặt Hàng</h3>
                  <div className="text-xs text-slate-400">Tự động trừ kho & liên kết với PostgreSQL ACID</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-800/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3.5 px-4">Mã Đơn & Thời Gian</th>
                        <th className="py-3.5 px-4">Khách Hàng & SĐT</th>
                        <th className="py-3.5 px-4">Hình Thức Thanh Toán</th>
                        <th className="py-3.5 px-4">Tổng Giá Trị</th>
                        <th className="py-3.5 px-4">Trạng Thái Đơn</th>
                        <th className="py-3.5 px-4 text-right">Thao Tác Xử Lý</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-mono font-bold text-sky-400">{ord.orderNumber}</p>
                            <p className="text-xs text-slate-400">{ord.createdAt}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-100">{ord.customerName}</p>
                            <p className="text-xs text-slate-400 font-mono">{ord.customerPhone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white text-base">
                            {ord.totalAmount.toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as Order['status'])}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500"
                            >
                              <option value="PENDING">Chờ Xác Nhận</option>
                              <option value="CONFIRMED">Đã Xác Nhận (Đóng gói)</option>
                              <option value="SHIPPING">Đang Vận Chuyển</option>
                              <option value="COMPLETED">Đã Hoàn Thành</option>
                              <option value="CANCELLED">Hủy Đơn</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold border border-sky-500/30">
                              In Phiếu Kho
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: WARRANTY ===================== */}
          {activeTab === 'warranty' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2">Hệ Thống Quản Lý Mã Serial Number (SN) & Bảo Hành</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Mỗi camera xuất kho được gán mã Serial vật lý để kích hoạt bảo hành 24 tháng chính hãng và chống hàng giả.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Tổng Serial Trong Kho</p>
                    <p className="text-2xl font-black text-white mt-1">179 Mã SN</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Đã Xuất Bán (Đang Bảo Hành)</p>
                    <p className="text-2xl font-black text-sky-400 mt-1">42 Mã SN</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Thời Hạn Bảo Hành Chuẩn</p>
                    <p className="text-2xl font-black text-emerald-400 mt-1">24 Tháng</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-800/60 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Mã Serial Number (SN)</th>
                        <th className="py-3 px-4">Tên Camera</th>
                        <th className="py-3 px-4">Trạng Thái SN</th>
                        <th className="py-3 px-4">Hạn Bảo Hành</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      <tr>
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">DS2CD2047G2LU-20260101-001</td>
                        <td className="py-3 px-4">Camera IP Hikvision ColorVu 4MP</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Tồn kho sẵn sàng</span></td>
                        <td className="py-3 px-4 text-slate-400">24 tháng kể từ ngày bán</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">EZVIZC6N-20260102-101</td>
                        <td className="py-3 px-4">Camera Wifi Ezviz C6N 4MP 2K+</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">Tồn kho sẵn sàng</span></td>
                        <td className="py-3 px-4 text-slate-400">24 tháng kể từ ngày bán</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-mono font-bold text-sky-400">IMOUCRUISER-20260103-501</td>
                        <td className="py-3 px-4">Camera Ngoài Trời Imou Cruiser Dual</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-xs bg-sky-500/20 text-sky-400">Đã kích hoạt</span></td>
                        <td className="py-3 px-4 text-emerald-400 font-semibold">Đến ngày 16/10/2028</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 5: KUBERNETES DEVOPS ===================== */}
          {activeTab === 'k8s' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <Server className="w-5 h-5 text-indigo-400" />
                      <span>Chi Tiết Cụm Azure Kubernetes Service: k8s-hulk-lab</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Quản lý trực tiếp từ GitHub Actions CI/CD Pipeline</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Cluster Status: Succeeded
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Node Pool</p>
                    <p className="text-lg font-bold text-white mt-1">agentpool (2 Nodes)</p>
                    <p className="text-xs text-slate-500">Ubuntu Linux VirtualMachineScaleSets</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Namespace</p>
                    <p className="text-lg font-bold text-sky-400 mt-1">camera-shop</p>
                    <p className="text-xs text-slate-500">Dedicated production namespace</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Database Storage</p>
                    <p className="text-lg font-bold text-indigo-400 mt-1">managed-csi</p>
                    <p className="text-xs text-slate-500">20Gi Azure Managed Disk PVC</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Ingress Controller</p>
                    <p className="text-lg font-bold text-emerald-400 mt-1">NGINX + Let's Encrypt</p>
                    <p className="text-xs text-slate-500">Automatic SSL/TLS termination</p>
                  </div>
                </div>

                {/* Architecture Deployment Visualization */}
                <h4 className="font-bold text-white text-sm mb-3">Manifests Đã Sẵn Sàng Triển Khai (`deploy/k8s/`):</h4>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/01-postgres/postgres-statefulset.yaml</span>
                    </div>
                    <span className="text-slate-400">PostgreSQL 16 + PVC 20GB</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/02-redis/redis.yaml</span>
                    </div>
                    <span className="text-slate-400">Redis Cache & Session Queue</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/03-backend/backend.yaml</span>
                    </div>
                    <span className="text-slate-400">NestJS API (2 Replicas, RollingUpdate)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/04-web-store/web-store.yaml</span>
                    </div>
                    <span className="text-slate-400">Next.js Storefront (2 Replicas, Port 3000)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/05-web-admin/web-admin.yaml</span>
                    </div>
                    <span className="text-slate-400">React Admin Portal (2 Replicas, Nginx Port 80)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="text-slate-200">deploy/k8s/06-ingress/ingress.yaml</span>
                    </div>
                    <span className="text-slate-400">Routing /api, /admin, / và Cert-Manager SSL</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===================== MODAL THÊM CAMERA MỚI ===================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Thêm Camera Mới Vào Kho Hàng</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Model Camera</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Camera IP Dahua WizSense 4MP Full-color"
                  value={newCamera.name}
                  onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mã SKU</label>
                  <input
                    type="text"
                    placeholder="IPC-HFW2439S-SA-LED"
                    value={newCamera.sku}
                    onChange={(e) => setNewCamera({ ...newCamera, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thương Hiệu</label>
                  <select
                    value={newCamera.brand}
                    onChange={(e) => setNewCamera({ ...newCamera, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Ezviz">Ezviz</option>
                    <option value="Imou">Imou</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Giá Bán (VNĐ)</label>
                  <input
                    type="number"
                    required
                    placeholder="1850000"
                    value={newCamera.price}
                    onChange={(e) => setNewCamera({ ...newCamera, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Lượng Nhập Kho</label>
                  <input
                    type="number"
                    required
                    placeholder="20"
                    value={newCamera.stock}
                    onChange={(e) => setNewCamera({ ...newCamera, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Thông số kỹ thuật đặc thù (JSONB)</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400">Độ phân giải:</label>
                    <input
                      type="text"
                      value={newCamera.resolution}
                      onChange={(e) => setNewCamera({ ...newCamera, resolution: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Hồng ngoại / Ban đêm:</label>
                    <input
                      type="text"
                      value={newCamera.nightVision}
                      onChange={(e) => setNewCamera({ ...newCamera, nightVision: e.target.value })}
                      className="w-full mt-1 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/20"
                >
                  Lưu Vào Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
