import React, { useState } from 'react';
import {
  Camera,
  Search,
  ShoppingCart,
  ShieldCheck,
  PhoneCall,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Star,
  ChevronRight,
  X,
  CreditCard,
  QrCode,
  MapPin,
  ExternalLink,
  SlidersHorizontal,
  Flame,
  Award,
  Zap,
  Lock
} from 'lucide-react';

interface CameraProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  resolution: string;
  nightVision: string;
  aiFeatures: string[];
  isFeatured: boolean;
  specs: {
    resolution: string;
    lens: string;
    nightVision: string;
    audio: string;
    weatherproof: string;
    ai: string;
    power: string;
    storage: string;
  };
}

interface CartItem {
  product: CameraProduct;
  quantity: number;
}

export default function App() {
  // Products dataset matching PostgreSQL seed
  const [products] = useState<CameraProduct[]>([
    {
      id: '1',
      name: 'Camera IP Hikvision ColorVu 4MP DS-2CD2047G2-LU (Có Màu Ban Đêm 24/7)',
      sku: 'DS-2CD2047G2-LU',
      brand: 'Hikvision',
      category: 'Camera Ngoài Trời Chống Nước',
      price: 1850000,
      originalPrice: 2200000,
      rating: 5.0,
      reviewsCount: 38,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600',
      resolution: '4.0 MP 2K',
      nightVision: 'ColorVu có màu 24/7 40m',
      aiFeatures: ['AcuSense AI', 'Lọc báo động giả 98%', 'Mic thu âm'],
      specs: {
        resolution: '4.0 Megapixel (2688 × 1520) 25fps',
        lens: 'Khẩu độ F1.0 siêu thu sáng, tiêu cự 2.8mm/4mm',
        nightVision: 'Ánh sáng trắng thông minh tầm xa 40 mét',
        audio: 'Tích hợp Microphone lọc tiếng ồn cao cấp',
        weatherproof: 'IP67 chống ngập nước, bụi bẩn hoàn toàn',
        ai: 'Phân loại chuyển động người và phương tiện giao thông',
        power: 'PoE 802.3af hoặc Nguồn 12V DC',
        storage: 'Hỗ trợ thẻ nhớ MicroSD tối đa 256GB / Đầu ghi NVR',
      },
    },
    {
      id: '2',
      name: 'Camera Wifi Ezviz C6N 4MP 2K+ Xoay 360 Độ Thông Minh Theo Dõi Chuyển Động',
      sku: 'EZVIZ-C6N-4MP',
      brand: 'Ezviz',
      category: 'Camera Wifi Trong Nhà',
      price: 690000,
      originalPrice: 950000,
      rating: 4.9,
      reviewsCount: 124,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600',
      resolution: '4.0 MP 2K+',
      nightVision: 'Hồng ngoại Smart IR 10m',
      aiFeatures: ['Tự động xoay 360°', 'Đàm thoại 2 chiều', 'Báo tiếng khóc'],
      specs: {
        resolution: '4.0 Megapixel 2K+ (2560 × 1440)',
        lens: 'Góc nhìn chéo 104°, xoay ngang 340°, dọc 55°',
        nightVision: 'Hồng ngoại ban đêm Smart IR chống lóa 10m',
        audio: 'Đàm thoại 2 chiều Real-time qua App điện thoại',
        weatherproof: 'Dùng trong nhà (Phòng khách, phòng ngủ, shop)',
        ai: 'Tự động phát hiện và bám theo đối tượng di chuyển',
        power: 'Cổng sạc Micro-USB 5V/2A',
        storage: 'Thẻ nhớ MicroSD tối đa 256GB / Ezviz CloudPlay',
      },
    },
    {
      id: '3',
      name: 'Camera Ngoài Trời Imou Cruiser Dual 6MP (2 Mắt Kép Giám Sát 2 Hướng Đồng Thời)',
      sku: 'IMOU-IPC-S7XP-6M0WED',
      brand: 'Imou',
      category: 'Camera Ngoài Trời Chống Nước',
      price: 1350000,
      originalPrice: 1650000,
      rating: 4.8,
      reviewsCount: 52,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600',
      resolution: '6.0 MP Kép (3MP+3MP)',
      nightVision: '4 Chế độ có màu ban đêm 30m',
      aiFeatures: ['IMOU SENSE AI', 'Còi hú 110dB', 'Đèn rọi Spotlight'],
      specs: {
        resolution: '6.0 Megapixel (1 mắt cố định 3MP + 1 mắt xoay 3MP)',
        lens: 'Mắt cố định góc rộng + Mắt quay quét 360 độ',
        nightVision: '4 chế độ nhìn đêm: Thông minh, Có màu, Hồng ngoại, Tắt',
        audio: 'Đàm thoại 2 chiều loa to rõ, còi báo động xua đuổi kẻ gian',
        weatherproof: 'IP66 chịu mưa nắng bão tuyết quanh năm',
        ai: 'Thuật toán IMOU SENSE phát hiện người/xe cách 22 mét',
        power: 'Nguồn Adapter 12V/1A kèm theo máy',
        storage: 'Thẻ MicroSD 256GB, kết nối Wifi 6 hoặc dây mạng LAN',
      },
    },
    {
      id: '4',
      name: 'Đầu Ghi Hình NVR Dahua 8 Kênh 4K WizSense Chuẩn Nén H.265+ Chuyên Nghiệp',
      sku: 'DHI-NVR4108HS-8P-4KS2/L',
      brand: 'Dahua',
      category: 'Đầu Ghi Hình & Ổ Cứng',
      price: 2450000,
      originalPrice: 2900000,
      rating: 5.0,
      reviewsCount: 19,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      resolution: 'Hỗ trợ Camera 4K (8MP)',
      nightVision: 'Lưu trữ 24/7 liên tục',
      aiFeatures: ['Bảo vệ vành đai AI', 'Tìm kiếm thông minh', 'Cổng HDMI 4K'],
      specs: {
        resolution: 'Băng thông 80Mbps, giải mã tối đa 8 kênh 4K',
        lens: 'Hỗ trợ tất cả camera IP chuẩn ONVIF',
        nightVision: 'Tối ưu theo camera kết nối',
        audio: '1 cổng Audio In/Out RCA đàm thoại',
        weatherproof: 'Vỏ kim loại tản nhiệt đặt trong nhà hoặc tủ rack',
        ai: 'Phân tích hành vi vượt hàng rào ảo, xâm nhập vùng cấm',
        power: 'Nguồn 48V PoE cấp điện trực tiếp cho 8 camera',
        storage: '1 cổng SATA HDD dung lượng tối đa 10TB',
      },
    },
  ]);

  // Filtering State
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState<CameraProduct | null>(null);

  // Warranty Modal State
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);
  const [serialQuery, setSerialQuery] = useState('');
  const [warrantyResult, setWarrantyResult] = useState<any>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VIETQR'>('VIETQR');

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'ALL' || p.brand === selectedBrand;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchBrand && matchSearch;
  });

  // Cart operations
  const addToCart = (product: CameraProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setShowCartDrawer(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalCartAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName || !customerPhone || !customerAddress) return;

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `CAM-${dateStr}-${randomCode}`;

    setOrderSuccess(orderNumber);
    setCart([]);
  };

  const handleCheckWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    const query = serialQuery.trim().toUpperCase();
    if (!query) return;

    if (query.includes('DS2CD') || query.includes('2047')) {
      setWarrantyResult({
        productName: 'Camera IP Hikvision ColorVu 4MP DS-2CD2047G2-LU',
        brand: 'Hikvision',
        serialNumber: query,
        status: 'Kích Hoạt Bảo Hành 24 Tháng Chính Hãng',
        soldDate: '15/05/2025',
        expiresDate: '15/05/2027 (Còn 485 ngày)',
        isGenuine: true,
      });
    } else if (query.includes('C6N') || query.includes('EZVIZ')) {
      setWarrantyResult({
        productName: 'Camera Wifi Ezviz C6N 4MP 2K+ Xoay 360',
        brand: 'Ezviz',
        serialNumber: query,
        status: 'Kích Hoạt Bảo Hành 24 Tháng Chính Hãng',
        soldDate: '01/01/2026',
        expiresDate: '01/01/2028 (Còn 650 ngày)',
        isGenuine: true,
      });
    } else {
      setWarrantyResult({
        productName: 'Mã Serial Không Tồn Tại Trên Hệ Thống',
        isGenuine: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ----------------- TOP BANNER NOTICE ----------------- */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white text-xs py-2 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline Tư Vấn Lắp Đặt: <b className="text-yellow-300">1900 8888 (24/7)</b></span>
            </span>
            <span className="hidden md:flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Bảo Hành 24 Tháng Đổi Mới Tận Nơi</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowWarrantyModal(true)}
              className="hover:underline flex items-center space-x-1 text-sky-100"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tra Cứu Bảo Hành (SN)</span>
            </button>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[11px] font-bold border border-white/20 transition-all flex items-center space-x-1"
            >
              <span>Trang Admin</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ----------------- HEADER & NAVIGATION ----------------- */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white">CAMERA</span>
                <span className="text-xl font-black text-sky-400">SMART</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Hệ Thống An Ninh AI</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xl hidden sm:block">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm camera theo tên, mã model (DS-2CD, C6N, Imou Cruiser...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all shadow-inner"
            />
          </div>

          {/* Actions: Hotline + Cart */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowWarrantyModal(true)}
              className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Tra Cứu Bảo Hành</span>
            </button>

            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {cart.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-black text-xs font-black flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0f19] to-[#030712] py-14 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-sky-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>CÔNG NGHỆ COLORVU & AI ACUSENSE 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Camera An Ninh Thông Minh <br />
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Ban Đêm Có Màu 24/7 Siêu Nét
                </span>
              </h1>

              <p className="text-slate-300 text-base max-w-xl leading-relaxed">
                Giải pháp giám sát cao cấp cho gia đình, cửa hàng và nhà xưởng. Phát hiện và cảnh báo tức thì kẻ xâm nhập qua điện thoại, giảm báo động giả 98%.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('products-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all flex items-center space-x-2"
                >
                  <span>Xem Camera Bán Chạy</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowWarrantyModal(true)}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
                >
                  Kiểm Tra Bảo Hành Chính Hãng
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-semibold">100% Chính Hãng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-semibold">Giao Hàng 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300 font-semibold">Bảo Hành 2 Năm</span>
                </div>
              </div>
            </div>

            {/* Featured Camera Graphic Card */}
            <div className="relative mx-auto max-w-md w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-sky-400 border border-blue-500/30">
                    TOP 1 BÁN CHẠY
                  </span>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0 (38 đánh giá)</span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600"
                    alt="Hikvision ColorVu"
                    className="w-full h-full object-cover transform hover:scale-105 transition-duration-500"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white">Hikvision ColorVu 4MP (Có Màu 24/7)</h3>
                  <p className="text-xs text-slate-400 mt-1">Chuẩn chống nước IP67 • AcuSense AI phát hiện người/xe</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-2xl font-black text-white">1.850.000 đ</span>
                    <span className="text-xs text-slate-500 line-through block">2.200.000 đ</span>
                  </div>
                  <button
                    onClick={() => addToCart(products[0])}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20"
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FILTER & CATEGORIES BAR ----------------- */}
      <section className="py-6 bg-[#090d16] border-b border-slate-800" id="products-grid">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          {/* Category buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'ALL', label: 'Tất Cả Camera' },
              { id: 'Camera Ngoài Trời Chống Nước', label: 'Camera Ngoài Trời (Chống Nước)' },
              { id: 'Camera Wifi Trong Nhà', label: 'Camera Wifi 360 Trong Nhà' },
              { id: 'Đầu Ghi Hình & Ổ Cứng', label: 'Đầu Ghi Hình NVR & Ổ Cứng' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Brand & Filter row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center space-x-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Hãng Camera:</span>
              </span>
              {['ALL', 'Hikvision', 'Dahua', 'Ezviz', 'Imou'].map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedBrand === brand
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {brand === 'ALL' ? 'Tất cả hãng' : brand}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Hiển thị <b className="text-white">{filteredProducts.length}</b> mẫu camera an ninh
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- PRODUCT LIST GRID ----------------- */}
      <section className="py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer rounded-3xl bg-[#0f172a] border border-slate-800/80 hover:border-sky-500/50 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-3.5">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur border border-slate-700">
                        {product.brand}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-center">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-600/90 text-white backdrop-blur shadow">
                        📸 {product.resolution}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-amber-300 backdrop-blur">
                        ★ {product.rating}
                      </span>
                    </div>
                  </div>

                  {/* Title & SKU */}
                  <h4 className="font-bold text-sm text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2">
                    {product.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">SKU: {product.sku}</p>

                  {/* Highlights */}
                  <div className="space-y-1 my-3 text-xs">
                    <p className="text-slate-300 font-medium text-[11px]">🌙 {product.nightVision}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.aiFeatures.map((feat, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-white">
                      {product.price.toLocaleString('vi-VN')} đ
                    </span>
                    <span className="text-[11px] text-slate-500 line-through block">
                      {product.originalPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <button
                    onClick={(e) => addToCart(product, e)}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-colors"
                    title="Thêm vào giỏ"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- DETAIL MODAL ----------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-blue-500/20 text-sky-400 border border-blue-500/30">
                  {selectedProduct.brand} • Bảo Hành 24 Tháng
                </span>
                <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                <p className="font-mono text-xs text-sky-400">Model SKU: {selectedProduct.sku}</p>

                <div>
                  <span className="text-2xl font-black text-white">
                    {selectedProduct.price.toLocaleString('vi-VN')} đ
                  </span>
                  <span className="text-xs text-slate-500 line-through ml-2">
                    {selectedProduct.originalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm Vào Giỏ & Mua Hàng</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Specs Table (JSONB format) */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="font-bold text-sm text-white mb-3">Thông Số Kỹ Thuật Chi Tiết:</h4>
              <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left divide-y divide-slate-800">
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="bg-slate-900/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-400 w-1/3">Độ phân giải:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.resolution}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Ống kính (Lens):</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.lens}</td>
                    </tr>
                    <tr className="bg-slate-900/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Tầm nhìn ban đêm:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.nightVision}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Âm thanh đàm thoại:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.audio}</td>
                    </tr>
                    <tr className="bg-slate-900/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Chuẩn chống nước:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.weatherproof}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Tính năng AI:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.ai}</td>
                    </tr>
                    <tr className="bg-slate-900/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-400">Nguồn cấp & Lưu trữ:</td>
                      <td className="py-2.5 px-4 text-slate-200">{selectedProduct.specs.power} • {selectedProduct.specs.storage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- CART & CHECKOUT DRAWER ----------------- */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-sky-400" />
                <span>Giỏ Hàng Camera</span>
              </h3>
              <button onClick={() => setShowCartDrawer(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <Camera className="w-12 h-12 text-slate-600" />
                <p className="text-slate-400 text-sm">Giỏ hàng của bạn đang trống</p>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Chọn mua camera ngay
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl border border-slate-700 bg-slate-950" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-slate-100 truncate">{item.product.name}</h4>
                      <p className="text-xs font-black text-white mt-0.5">
                        {item.product.price.toLocaleString('vi-VN')} đ
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Checkout form */}
                <form onSubmit={handleCheckout} className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-white text-sm">Thông Tin Nhận Hàng & Thanh Toán</h4>

                  <input
                    type="text"
                    required
                    placeholder="Họ và tên người nhận *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại di động *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder="Địa chỉ giao hàng (Số nhà, đường, phường, quận/huyện, tỉnh/thành) *"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />

                  <div className="space-y-2 pt-1">
                    <span className="font-semibold text-slate-300">Phương thức thanh toán:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('VIETQR')}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 ${
                          paymentMethod === 'VIETQR'
                            ? 'bg-blue-600/20 border-blue-500 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-sky-400" />
                        <span className="font-bold">Quét VietQR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 ${
                          paymentMethod === 'COD'
                            ? 'bg-blue-600/20 border-blue-500 text-sky-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">COD (Nhận hàng)</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-sm font-bold text-white">
                      <span>Tổng Tiền Thanh Toán:</span>
                      <span className="text-lg text-sky-400">{totalCartAmount.toLocaleString('vi-VN')} đ</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all"
                    >
                      Xác Nhận Đặt Mua Camera
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ORDER SUCCESS MODAL ----------------- */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Đặt Hàng Thành Công!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cảm ơn quý khách đã tin tưởng Camera Smart. Nhân viên kỹ thuật sẽ liên hệ trong vòng 15 phút để xác nhận và bàn giao mã bảo hành.
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <p className="text-slate-400">Mã Đơn Hàng Của Bạn:</p>
              <p className="font-mono font-bold text-sky-400 text-base mt-1">{orderSuccess}</p>
            </div>

            {paymentMethod === 'VIETQR' && (
              <div className="p-4 bg-white text-slate-900 rounded-2xl space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Mã VietQR Chuyển Khoản Tự Động</p>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=CAMERASMART_ORDER"
                  alt="VietQR"
                  className="w-40 h-40 mx-auto"
                />
                <p className="text-[11px] text-slate-500">Mở app Ngân hàng (MB, VCB, Techcombank, Momo) quét mã để hoàn tất</p>
              </div>
            )}

            <button
              onClick={() => {
                setOrderSuccess(null);
                setShowCartDrawer(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Hoàn Tất & Tiếp Tục Xem Sản Phẩm
            </button>
          </div>
        </div>
      )}

      {/* ----------------- WARRANTY LOOKUP MODAL ----------------- */}
      {showWarrantyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setShowWarrantyModal(false);
                setWarrantyResult(null);
                setSerialQuery('');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Tra Cứu Bảo Hành Camera Chính Hãng</h3>
                <p className="text-xs text-slate-400">Nhập mã Serial Number (SN) in dưới đáy hoặc thân camera</p>
              </div>
            </div>

            <form onSubmit={handleCheckWarranty} className="flex gap-2">
              <input
                type="text"
                placeholder="Ví dụ: DS2CD2047G2LU hoặc C6N..."
                value={serialQuery}
                onChange={(e) => setSerialQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Kiểm Tra
              </button>
            </form>

            <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
              <span>Mã thử nghiệm:</span>
              <button
                type="button"
                onClick={() => setSerialQuery('DS2CD2047G2LU-20260101-001')}
                className="text-sky-400 underline font-mono"
              >
                DS2CD2047G2LU-20260101-001
              </button>
              <span>hoặc</span>
              <button
                type="button"
                onClick={() => setSerialQuery('EZVIZC6N-20260102-101')}
                className="text-sky-400 underline font-mono"
              >
                EZVIZC6N-20260102-101
              </button>
            </div>

            {warrantyResult && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                {warrantyResult.isGenuine ? (
                  <>
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{warrantyResult.status}</span>
                    </div>
                    <p className="font-bold text-slate-100 text-sm">{warrantyResult.productName}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Số Serial:</span>
                        <span className="font-mono text-sky-400">{warrantyResult.serialNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Ngày xuất bán:</span>
                        <span>{warrantyResult.soldDate}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Thời hạn bảo hành:</span>
                        <span className="text-emerald-400 font-semibold">{warrantyResult.expiresDate}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-rose-400 font-bold flex items-center space-x-2">
                    <X className="w-4 h-4" />
                    <span>Không tìm thấy thông tin Serial. Vui lòng kiểm tra lại tem dán trên camera.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#0b0f19] border-t border-slate-800 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-sky-400" />
              <span className="text-lg font-black text-white">CAMERASMART</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Nhà phân phối và giải pháp camera an ninh AI hàng đầu Việt Nam. Đối tác chiến lược của Hikvision, Dahua, Ezviz, Imou.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">Hệ Thống Showroom</h5>
            <p className="flex items-start space-x-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" /><span>Hà Nội: 102 Thái Hà, Đống Đa</span></p>
            <p className="flex items-start space-x-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" /><span>TP.HCM: 246 Nguyễn Thị Minh Khai, Q.3</span></p>
            <p className="flex items-start space-x-1.5"><MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" /><span>Đà Nẵng: 85 Nguyễn Văn Linh, Hải Châu</span></p>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">Chính Sách Khách Hàng</h5>
            <p className="hover:text-slate-200 cursor-pointer">Bảo hành 24 tháng 1 đổi 1 tận nơi</p>
            <p className="hover:text-slate-200 cursor-pointer">Chính sách đổi trả trong 30 ngày</p>
            <p className="hover:text-slate-200 cursor-pointer">Tư vấn và khảo sát lắp đặt miễn phí</p>
            <p className="hover:text-slate-200 cursor-pointer">Hướng dẫn cài đặt xem camera từ xa</p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm">Hạ Tầng Điện Toán Đám Mây</h5>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <p className="text-emerald-400 font-bold">☁️ Azure Kubernetes: k8s-hulk-lab</p>
              <p className="text-slate-400">PostgreSQL StatefulSet Database</p>
              <p className="text-slate-400">GitHub Actions CI/CD Pipeline</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800/80 text-center text-slate-500">
          © 2026 CAMERASMART. All rights reserved. Triển khai trên cụm Azure Kubernetes Service `k8s-hulk-lab`.
        </div>
      </footer>
    </div>
  );
}
