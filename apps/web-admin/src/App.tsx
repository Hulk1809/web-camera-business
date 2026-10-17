import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShieldCheck,
  Server,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Camera,
  Film,
  Video,
  Layers,
  Battery,
  Flame,
  QrCode,
  DollarSign,
  Upload,
  X,
  Eye,
  Maximize2,
  Phone,
  PhoneCall,
  Calendar,
  Save,
  Zap,
  Printer,
  FileText,
  Store,
  CreditCard,
  BadgeCheck,
  Check,
  Copy,
  Receipt,
  Tag,
  Barcode,
  SlidersHorizontal,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { BentoMetricsGrid } from './components/BentoMetricsGrid';
import { DynamicIslandToast, type ToastMessage } from './components/DynamicIslandToast';

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  imageUrl: string;
  images?: string[];
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  specifications?: any;
  isFeatured?: boolean;
}

export interface OrderItem {
  id?: string;
  productId?: string;
  productName: string;
  productSku?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress?: string;
  totalAmount: number;
  itemsCount?: number;
  paymentMethod: string;
  paymentStatus?: string;
  orderStatus?: string;
  status?: string;
  createdAt: string;
  items?: OrderItem[];
  note?: string;
  isPreOrder?: boolean;
  orderType?: string;
  scheduledDate?: string;
  staffCallStatus?: 'NOT_CALLED' | 'CALLED_SCHEDULED' | 'STOCK_READY' | 'CANCELLED';
  staffNotes?: string;
}

export interface SerialItem {
  id?: string;
  serialNumber: string;
  productName: string;
  productSku?: string;
  brand: string;
  status: 'IN_STOCK' | 'SOLD' | 'EXPIRED' | string;
  warrantyMonths: number;
  soldDate?: string;
  warrantyExpires?: string;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  soldChannel?: 'ONLINE' | 'POS_STORE';
  price?: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-dji-m3pro',
    name: 'DJI Mavic 3 Pro Cine Combo - 3 Camera Hasselblad Apple ProRes',
    sku: 'DJI-MAVIC3-PRO-CINE',
    brand: 'DJI',
    category: 'Flycam & Drone DJI',
    price: 79990000,
    originalPrice: 87500000,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=1000',
    ],
    status: 'IN_STOCK',
    isFeatured: true,
    specifications: {
      sensor: 'Hasselblad 4/3 CMOS 20MP',
      video: 'Apple ProRes 5.1K 50fps',
      flightTime: '43 phút bay',
    },
  },
  {
    id: 'prod-sony-fx3',
    name: 'Sony Cinema Line FX3 (ILME-FX3) - Máy quay Full-Frame chuyên nghiệp',
    sku: 'ILME-FX3-BODY',
    brand: 'Sony',
    category: 'Máy Quay Điện Ảnh & Cinema',
    price: 94990000,
    originalPrice: 102000000,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: 'Full-Frame 12.1MP BSI Exmor R',
      video: '4K 120p 10-bit 4:2:2 All-Intra',
      stabilization: 'IBIS 5 trục + Active Mode',
    },
  },
  {
    id: 'prod-sony-a7m4',
    name: 'Sony Alpha 7 IV (A7M4) Body - Máy ảnh Full-Frame Hybrid 33MP',
    sku: 'ILCE-7M4-BODY',
    brand: 'Sony',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 53990000,
    originalPrice: 59990000,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: 'Full-Frame 33MP Exmor R',
      video: '4K 60p 10-bit 4:2:2',
      stabilization: 'IBIS 5.5 stops',
    },
  },
  {
    id: 'prod-dji-rs4pro',
    name: 'DJI RS 4 Pro Gimbal Combo - Tay cầm chống rung tải trọng 4.5kg',
    sku: 'DJI-RS4-PRO-COMBO',
    brand: 'DJI',
    category: 'Gimbal & Chống Rung DJI Ronin',
    price: 19990000,
    originalPrice: 22500000,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
      'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1000',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      payload: 'Tải trọng 4.5kg',
      stabilization: 'RS 4th Gen',
      flightTime: 'Pin 13 tiếng',
    },
  },
  {
    id: 'prod-dji-pocket3',
    name: 'DJI Osmo Pocket 3 Creator Combo - Camera Vlogging Cảm biến 1-inch',
    sku: 'DJI-POCKET3-CREATOR',
    brand: 'DJI',
    category: 'Action Cam & Pocket Creator',
    price: 15890000,
    originalPrice: 17900000,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    images: [
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: '1-inch CMOS',
      video: '4K 120fps D-Log M',
      weight: '179g',
    },
  },
  {
    id: 'prod-canon-r5m2',
    name: 'Canon EOS R5 Mark II Body - 45MP Stacked CMOS & 8K 60p RAW',
    sku: 'CANON-R5-M2-BODY',
    brand: 'Canon',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 104990000,
    originalPrice: 115000000,
    stock: 6,
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    images: [
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: '45MP Stacked CMOS',
      video: '8K 60p RAW',
      stabilization: 'IBIS 8.5 stops',
    },
  },
  {
    id: 'prod-dji-mini4pro',
    name: 'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2) - Dưới 249g',
    sku: 'DJI-MINI4-PRO-RC2',
    brand: 'DJI',
    category: 'Flycam & Drone DJI',
    price: 24890000,
    originalPrice: 27900000,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      weight: 'Dưới 249g',
      video: '4K 60fps HDR',
      flightTime: '45 phút bay',
    },
  },
  {
    id: 'prod-bmd-cinema6k',
    name: 'Blackmagic Cinema Camera 6K (Full-Frame L-Mount)',
    sku: 'BMD-CINEMA-6K-FF',
    brand: 'Blackmagic Design',
    category: 'Máy Quay Điện Ảnh & Cinema',
    price: 62500000,
    originalPrice: 68000000,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: 'Full-Frame 6K 6048x4032',
      video: '6K 36fps Open Gate 12-bit RAW',
      screen: 'Màn hình 5.0 inch 1500 nits',
    },
  },
  {
    id: 'prod-fuji-xt5',
    name: 'Fujifilm X-T5 Body (Silver) - 40.2MP Cảm biến X-Trans CMOS 5 HR',
    sku: 'FUJI-XT5-BODY-SILVER',
    brand: 'Fujifilm',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 41900000,
    originalPrice: 45900000,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
      'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: '40.2MP X-Trans CMOS 5 HR',
      video: '6.2K 30p 10-bit',
      stabilization: 'IBIS 7.0 stops',
    },
  },
  {
    id: 'prod-sony-2470gm2',
    name: 'Ống kính Sony FE 24-70mm F2.8 GM II (SEL2470GM2)',
    sku: 'SEL2470GM2',
    brand: 'Sony',
    category: 'Ống Kính Chuyên Dụng (Lenses)',
    price: 49990000,
    originalPrice: 54900000,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1000',
    images: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      focalLength: '24-70mm F2.8 GM',
      weight: '695g',
    },
  },
  {
    id: 'prod-dji-mic2',
    name: 'Bộ Micro Thu Âm Không Dây DJI Mic 2 (2 TX + 1 RX + Hộp sạc)',
    sku: 'DJI-MIC2-COMBO',
    brand: 'DJI',
    category: 'Âm Thanh & Ánh Sáng Studio',
    price: 8490000,
    originalPrice: 9490000,
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      audioQuality: 'Thu âm 32-bit Float nội bộ',
      flightTime: 'Pin 18 tiếng kèm hộp',
    },
  },
  {
    id: 'prod-nikon-z8',
    name: 'Nikon Z8 Body - Máy ảnh Mirrorless 45.7MP Quay 8.3K N-RAW',
    sku: 'NIKON-Z8-BODY',
    brand: 'Nikon',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 86900000,
    originalPrice: 95000000,
    stock: 9,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000',
    ],
    status: 'IN_STOCK',
    specifications: {
      sensor: '45.7MP Stacked BSI CMOS',
      video: '8.3K 60p N-RAW',
    },
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'PRO-20261016-8942',
    customerName: 'Đoàn Phim CineArt Sài Gòn (Anh Minh)',
    customerPhone: '0912 345 678',
    shippingAddress: 'Studio 12, Đường Nguyễn Cơ Thạch, TP. Thủ Đức, TP.HCM',
    totalAmount: 114980000,
    itemsCount: 2,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    status: 'CONFIRMED',
    createdAt: '15 phút trước',
    note: 'Cần kiểm tra kỹ trước khi giao, xuất hóa đơn VAT',
    items: [
      { productName: 'Sony Cinema Line FX3 Body', price: 94990000, quantity: 1, subtotal: 94990000 },
      { productName: 'DJI RS 4 Pro Gimbal Combo', price: 19990000, quantity: 1, subtotal: 19990000 },
    ],
  },
  {
    id: 'ord-102',
    orderNumber: 'PRO-20261016-7721',
    customerName: 'Hoàng Quốc Việt (Media Lab)',
    customerPhone: '0988 776 554',
    shippingAddress: 'Số 45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    totalAmount: 79990000,
    itemsCount: 1,
    paymentMethod: 'COD',
    paymentStatus: 'UNPAID',
    orderStatus: 'SHIPPING',
    status: 'SHIPPING',
    createdAt: '1 giờ trước',
    note: 'Bay test trực tiếp khi nhận hàng',
    items: [
      { productName: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes)', price: 79990000, quantity: 1, subtotal: 79990000 },
    ],
  },
  {
    id: 'ord-103',
    orderNumber: 'PRO-20261015-1109',
    customerName: 'Vlogger Lê Tuấn Anh',
    customerPhone: '0903 112 233',
    shippingAddress: 'Tòa Landmark 81, P. 22, Bình Thạnh, TP.HCM',
    totalAmount: 15890000,
    itemsCount: 1,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    status: 'COMPLETED',
    createdAt: 'Hôm qua',
    items: [
      { productName: 'DJI Osmo Pocket 3 Creator Combo', price: 15890000, quantity: 1, subtotal: 15890000 },
    ],
  },
  {
    id: 'ord-104-pre',
    orderNumber: 'PRE-20261017-9921',
    customerName: 'Đạo diễn Trần Quang Huy (Studio Hà Nội)',
    customerPhone: '0988 991 223',
    shippingAddress: 'Tòa nhà Artemis, Số 3 Lê Trọng Tấn, Thanh Xuân, Hà Nội',
    totalAmount: 189990000,
    itemsCount: 1,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'PRE_ORDER',
    status: 'PRE_ORDER',
    isPreOrder: true,
    orderType: 'PRE_ORDER',
    staffCallStatus: 'NOT_CALLED',
    scheduledDate: '2026-10-25',
    staffNotes: 'Khách cần trước ngày 26 để quay TVC, nhân viên cần gọi báo lịch nhập hàng lô mới.',
    createdAt: 'Vừa xong',
    note: '[ĐẶT HÀNG CHỜ VỀ - PRE-ORDER] Khách đặt trước khi hàng tạm hết sẵn tại kho. CSKH liên hệ hẹn ngày giao máy.',
    items: [
      { productName: 'Sony Cinema Line FX6 (ILME-FX6V)', price: 189990000, quantity: 1, subtotal: 189990000 },
    ],
  },
];

const DEFAULT_SERIALS: SerialItem[] = [
  {
    serialNumber: 'DJI-M3PRO-2026-8899',
    productName: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes)',
    productSku: 'DJI-MAVIC3-PRO-CINE',
    brand: 'DJI',
    status: 'IN_STOCK',
    warrantyMonths: 24,
    price: 79990000,
  },
  {
    serialNumber: 'SONY-FX3-VN-9901',
    productName: 'Sony Cinema Line FX3 Body Chính Hãng',
    productSku: 'ILME-FX3-BODY',
    brand: 'Sony',
    status: 'SOLD',
    warrantyMonths: 24,
    soldDate: '10/02/2026',
    warrantyExpires: '10/02/2028',
    orderNumber: 'PRO-20261016-8942',
    customerName: 'Đoàn Phim CineArt',
    customerPhone: '0908123456',
    soldChannel: 'ONLINE',
    price: 94990000,
  },
  {
    serialNumber: 'DJI-POCKET3-2026-5521',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    productSku: 'DJI-POCKET3-CREATOR',
    brand: 'DJI',
    status: 'SOLD',
    warrantyMonths: 12,
    soldDate: '01/04/2026',
    warrantyExpires: '01/04/2027',
    orderNumber: 'POS-20260401-1109',
    customerName: 'Lê Tuấn Anh',
    customerPhone: '0988776655',
    soldChannel: 'POS_STORE',
    price: 15890000,
  },
  {
    serialNumber: 'SONY-A7M4-VN-1102',
    productName: 'Sony Alpha 7 IV (A7M4) Body',
    productSku: 'ILCE-7M4-BODY',
    brand: 'Sony',
    status: 'IN_STOCK',
    warrantyMonths: 24,
    price: 53990000,
  },
  {
    serialNumber: 'DJI-RS4-PRO-COMBO-3311',
    productName: 'DJI RS 4 Pro Gimbal Combo',
    productSku: 'DJI-RS4-PRO-COMBO',
    brand: 'DJI',
    status: 'IN_STOCK',
    warrantyMonths: 24,
    price: 19990000,
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'warranty' | 'k8s'>('dashboard');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (t: ToastMessage) => setToast(t);

  // Products State with Persistent Sync Layer
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PRODUCTS;
  });
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('ALL');
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // CSKH Call & Schedule States for Pre-Orders
  const [scheduleDateInput, setScheduleDateInput] = useState<string>('');
  const [staffCallStatusInput, setStaffCallStatusInput] = useState<
    'NOT_CALLED' | 'CALLED_SCHEDULED' | 'STOCK_READY' | 'CANCELLED'
  >('NOT_CALLED');
  const [staffNotesInput, setStaffNotesInput] = useState<string>('');

  // Serials & Warranty Hub State with LocalStorage Persistence
  const [serials, setSerials] = useState<SerialItem[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_SERIALS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_SERIALS;
  });
  const [serialFilterTab, setSerialFilterTab] = useState<'ALL' | 'IN_STOCK' | 'SOLD' | 'EXPIRED'>('ALL');
  const [serialSearchQuery, setSerialSearchQuery] = useState<string>('');
  const [showAddSerialModal, setShowAddSerialModal] = useState<boolean>(false);
  const [newSerialForm, setNewSerialForm] = useState<{
    serialNumber: string;
    productSku: string;
    warrantyMonths: number;
  }>({
    serialNumber: '',
    productSku: 'DJI-MAVIC3-PRO-CINE',
    warrantyMonths: 24,
  });

  // POS Showroom Checkout State
  const [showPosModal, setShowPosModal] = useState<boolean>(false);
  const [selectedPosSerial, setSelectedPosSerial] = useState<SerialItem | null>(null);
  const [posCustomerName, setPosCustomerName] = useState<string>('');
  const [posCustomerPhone, setPosCustomerPhone] = useState<string>('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'QR_TRANSFER' | 'CASH' | 'CARD_POS'>('QR_TRANSFER');
  const [posStaffNote, setPosStaffNote] = useState<string>('Khách mua trực tiếp và kiểm tra máy tại quầy Showroom');
  const [isPosSubmitting, setIsPosSubmitting] = useState<boolean>(false);

  // POS Printable Invoice & Warranty Certificate State (Tin Học Ngôi Sao Standard)
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceSerial, setInvoiceSerial] = useState<SerialItem | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Form State for Adding Product
  const [newGear, setNewGear] = useState<{
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: string;
    stock: string;
    sensor: string;
    video: string;
    stabilization: string;
    imageUrl: string;
    images: string[];
    isFeatured: boolean;
  }>({
    name: '',
    sku: '',
    brand: 'DJI',
    category: 'Flycam & Drone DJI',
    price: '',
    stock: '10',
    sensor: 'Hasselblad 4/3 CMOS',
    video: '4K 120p / 5.1K ProRes',
    stabilization: 'Gimbal cơ học 3 trục',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
    ],
    isFeatured: false,
  });

  const [inputImgUrl, setInputImgUrl] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productBrandFilter, setProductBrandFilter] = useState<string>('ALL');

  // Image Manager Modal State for Existing Products in Table
  const [imageManagerProduct, setImageManagerProduct] = useState<Product | null>(null);
  const [managerImages, setManagerImages] = useState<string[]>([]);
  const [managerInputUrl, setManagerInputUrl] = useState<string>('');
  const [isSavingImages, setIsSavingImages] = useState<boolean>(false);

  // Helper to extract multi-images array from API response
  const parseImagesFromItem = (item: any): string[] => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const list = item.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl).filter(Boolean);
      if (list.length > 0) return list;
    }
    return [item.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000'];
  };

  // Fetch Products from Backend API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: Product[] = data.items.map((item: any) => {
            const itemImgs = parseImagesFromItem(item);
            return {
              id: String(item.id),
              name: item.name,
              sku: item.sku,
              brand: item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'DJI'),
              category: item.category?.name || (typeof item.category === 'string' ? item.category : 'Máy Ảnh Mirrorless & DSLR'),
              price: Number(item.price),
              originalPrice: Number(item.originalPrice) || Math.round(Number(item.price) * 1.15),
              stock: Number(item.stockQuantity ?? 10),
              imageUrl: itemImgs[0],
              images: itemImgs,
              status: Number(item.stockQuantity ?? 10) <= 3 ? 'LOW_STOCK' : 'IN_STOCK',
              specifications: item.specifications || {},
            };
          });
          setProducts(mapped);
          try {
            localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(mapped));
          } catch {}
        } else if (data && Array.isArray(data.items) && data.items.length === 0) {
          // If database on AKS is currently empty, trigger auto seed and reload!
          await fetch('/api/products/seed');
          const retryRes = await fetch('/api/products?limit=100');
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            if (retryData && Array.isArray(retryData.items) && retryData.items.length > 0) {
              const mapped: Product[] = retryData.items.map((item: any) => {
                const itemImgs = parseImagesFromItem(item);
                return {
                  id: String(item.id),
                  name: item.name,
                  sku: item.sku,
                  brand: item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'DJI'),
                  category: item.category?.name || (typeof item.category === 'string' ? item.category : 'Máy Ảnh Mirrorless & DSLR'),
                  price: Number(item.price),
                  originalPrice: Number(item.originalPrice) || Math.round(Number(item.price) * 1.15),
                  stock: Number(item.stockQuantity ?? 10),
                  imageUrl: itemImgs[0],
                  images: itemImgs,
                  status: Number(item.stockQuantity ?? 10) <= 3 ? 'LOW_STOCK' : 'IN_STOCK',
                  specifications: item.specifications || {},
                };
              });
              setProducts(mapped);
              try {
                localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(mapped));
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      console.warn('Backend API offline, keeping local products from persistent layer:', err);
      try {
        const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        }
      } catch {}
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Helpers for Add Product Form Images
  const handleAddImageUrl = () => {
    const trimmed = inputImgUrl.trim();
    if (!trimmed) return;
    setNewGear((prev) => {
      const current = prev.images || [];
      if (current.includes(trimmed)) return prev;
      const updated = [...current, trimmed];
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0],
      };
    });
    setInputImgUrl('');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setNewGear((prev) => {
            const current = prev.images || [];
            const updated = [...current, dataUrl];
            return {
              ...prev,
              images: updated,
              imageUrl: updated[0],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setNewGear((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        imageUrl: updated[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      };
    });
  };

  const handleSetPrimaryImage = (targetIndex: number) => {
    setNewGear((prev) => {
      const list = [...(prev.images || [])];
      if (targetIndex <= 0 || targetIndex >= list.length) return prev;
      const [item] = list.splice(targetIndex, 1);
      list.unshift(item);
      return {
        ...prev,
        images: list,
        imageUrl: list[0],
      };
    });
  };

  // Helpers for Managing Images of Existing Product in Table
  const openImageManagerModal = (prod: Product) => {
    setImageManagerProduct(prod);
    setManagerImages(prod.images && prod.images.length > 0 ? [...prod.images] : [prod.imageUrl]);
    setManagerInputUrl('');
  };

  const handleAddManagerImageUrl = () => {
    const trimmed = managerInputUrl.trim();
    if (!trimmed) return;
    if (managerImages.includes(trimmed)) return;
    setManagerImages((prev) => [...prev, trimmed]);
    setManagerInputUrl('');
  };

  const handleManagerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setManagerImages((prev) => [...prev, dataUrl]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveManagerImage = (indexToRemove: number) => {
    setManagerImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetManagerPrimaryImage = (targetIndex: number) => {
    setManagerImages((prev) => {
      const list = [...prev];
      if (targetIndex <= 0 || targetIndex >= list.length) return prev;
      const [item] = list.splice(targetIndex, 1);
      list.unshift(item);
      return list;
    });
  };

  const handleSaveManagerImages = async () => {
    if (!imageManagerProduct) return;
    setIsSavingImages(true);

    const updatedImgs = managerImages.length > 0
      ? managerImages
      : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'];

    // Optimistically update product list
    const updatedWithImages = products.map((p) =>
      p.id === imageManagerProduct.id
        ? { ...p, images: updatedImgs, imageUrl: updatedImgs[0] }
        : p
    );
    setProducts(updatedWithImages);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedWithImages));
    } catch {}

    try {
      await fetch(`/api/products/${imageManagerProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: updatedImgs[0],
          images: updatedImgs,
        }),
      });
      fetchProducts();
    } catch (err) {
      console.warn('API update images failed:', err);
    } finally {
      setIsSavingImages(false);
      setImageManagerProduct(null);
    }
  };

  // FETCH ORDERS FROM API & LOCAL SHARED SYNC (THÔNG API VỚI STOREFRONT!)
  const fetchOrders = async () => {
    setIsOrdersLoading(true);
    let backendOrders: Order[] = [];

    try {
      const res = await fetch('/api/orders?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items)) {
          backendOrders = data.items.map((item: any) => ({
            id: String(item.id),
            orderNumber: item.orderNumber,
            customerName: item.customerName,
            customerPhone: item.customerPhone,
            shippingAddress: item.shippingAddress,
            totalAmount: Number(item.totalAmount),
            itemsCount: item.items ? item.items.length : 1,
            paymentMethod: item.paymentMethod,
            paymentStatus: item.paymentStatus,
            orderStatus: item.orderStatus,
            status: item.orderStatus,
            createdAt: new Date(item.createdAt).toLocaleDateString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
            }),
            items: item.items || [],
            note: item.note,
            isPreOrder:
              item.isPreOrder ??
              (item.orderStatus === 'PRE_ORDER' ||
                (item.orderNumber && item.orderNumber.startsWith('PRE-')) ||
                (item.note && item.note.includes('PRE-ORDER'))),
            orderType: item.orderType ?? (item.orderStatus === 'PRE_ORDER' ? 'PRE_ORDER' : 'STANDARD'),
            staffCallStatus: item.staffCallStatus || 'NOT_CALLED',
            scheduledDate: item.scheduledDate,
            staffNotes: item.staffNotes,
          }));
        }
      }
    } catch {
      // Backend offline
    }

    // Read from shared sync layer in localStorage (written by storefront)
    let sharedOrders: Order[] = [];
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (raw) {
        sharedOrders = JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }

    // Merge orders: DEFAULT_ORDERS (base) -> backendOrders (db) -> sharedOrders (latest admin/client state)
    const combinedMap = new Map<string, Order>();

    // 1. Fallback default orders first (as base templates)
    DEFAULT_ORDERS.forEach((o) => combinedMap.set(o.orderNumber, o));

    // 2. Overlay backend orders from PostgreSQL database
    backendOrders.forEach((o) => {
      if (combinedMap.has(o.orderNumber)) {
        combinedMap.set(o.orderNumber, { ...combinedMap.get(o.orderNumber)!, ...o });
      } else {
        combinedMap.set(o.orderNumber, o);
      }
    });

    // 3. Overlay shared orders from localStorage (contains customer orders + admin status overrides)
    sharedOrders.forEach((o) => {
      if (combinedMap.has(o.orderNumber)) {
        combinedMap.set(o.orderNumber, { ...combinedMap.get(o.orderNumber)!, ...o });
      } else {
        combinedMap.set(o.orderNumber, o);
      }
    });

    const finalOrders = Array.from(combinedMap.values());
    setOrders(finalOrders);
    setIsOrdersLoading(false);
  };

  // Fetch Serials from API & Shared Storage
  const fetchSerials = async () => {
    let backendSerials: SerialItem[] = [];
    try {
      const res = await fetch('/api/warranty');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          backendSerials = data;
        }
      }
    } catch {
      // Ignore
    }

    let sharedSerials: SerialItem[] = [];
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_SERIALS');
      if (raw) {
        sharedSerials = JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }

    const map = new Map<string, SerialItem>();
    backendSerials.forEach((s) => map.set(s.serialNumber, s));
    sharedSerials.forEach((s) => {
      if (map.has(s.serialNumber)) {
        map.set(s.serialNumber, { ...map.get(s.serialNumber)!, ...s });
      } else {
        map.set(s.serialNumber, s);
      }
    });
    DEFAULT_SERIALS.forEach((s) => {
      if (!map.has(s.serialNumber)) {
        map.set(s.serialNumber, s);
      }
    });

    const finalSerials = Array.from(map.values());
    setSerials(finalSerials);
    localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(finalSerials));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSerials();

    // Auto polling every 10s to capture new orders from Storefront live
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'PROGEAR_SHARED_SERIALS' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setSerials(parsed);
        } catch {}
      }
      if (e.key === 'PROGEAR_SHARED_ORDERS' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setOrders(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Open POS Sell Modal for a specific Serial
  const handleOpenPosModal = (serial: SerialItem) => {
    setSelectedPosSerial(serial);
    setPosCustomerName('');
    setPosCustomerPhone('');
    setPosPaymentMethod('QR_TRANSFER');
    setPosStaffNote('Khách mua trực tiếp và kiểm tra máy tại quầy Showroom');
    setShowPosModal(true);
  };

  // Complete POS Counter Sale & Activate Warranty
  const handleSellAtCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosSerial) return;
    if (!posCustomerName.trim() || !posCustomerPhone.trim()) {
      showToast({
        id: String(Date.now()),
        type: 'warning',
        title: 'Thiếu thông tin khách hàng',
        message: 'Vui lòng nhập Họ tên và Số điện thoại khách hàng để kích hoạt bảo hành điện tử.',
      });
      return;
    }

    setIsPosSubmitting(true);
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `POS-${dateStr}-${randomSuffix}`;

    // Calculate warranty expiration
    const expDate = new Date(now);
    expDate.setMonth(expDate.getMonth() + (selectedPosSerial.warrantyMonths || 24));
    const expDateFormatted = `${pad(expDate.getDate())}/${pad(expDate.getMonth() + 1)}/${expDate.getFullYear()}`;

    // Determine device price
    let soldPrice = selectedPosSerial.price || 0;
    const matchingProd = products.find(
      (p) =>
        (selectedPosSerial.productSku && p.sku === selectedPosSerial.productSku) ||
        p.name === selectedPosSerial.productName
    );
    if (matchingProd && (!soldPrice || soldPrice === 0)) {
      soldPrice = matchingProd.price;
    }

    // 1. Update Serial to SOLD & Activate Warranty
    const updatedSerial: SerialItem = {
      ...selectedPosSerial,
      status: 'SOLD',
      soldDate: dateFormatted,
      warrantyExpires: expDateFormatted,
      orderNumber: orderNumber,
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim(),
      soldChannel: 'POS_STORE',
      price: soldPrice,
    };

    const updatedSerials = serials.map((s) =>
      s.serialNumber === selectedPosSerial.serialNumber ? updatedSerial : s
    );
    setSerials(updatedSerials);
    localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(updatedSerials));

    // 2. Decrement Product Stock
    const updatedProducts = products.map((p) => {
      if (
        (selectedPosSerial.productSku && p.sku === selectedPosSerial.productSku) ||
        p.name === selectedPosSerial.productName
      ) {
        const newStock = Math.max(0, p.stock - 1);
        return {
          ...p,
          stock: newStock,
          status: (newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= 3 ? 'LOW_STOCK' : 'IN_STOCK') as any,
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProducts));

    // 3. Create POS Retail Order
    const paymentMethodLabel =
      posPaymentMethod === 'CASH'
        ? 'Tiền mặt tại quầy'
        : posPaymentMethod === 'QR_TRANSFER'
        ? 'Chuyển khoản VietQR'
        : 'Quẹt thẻ máy POS';

    const newPosOrder: Order = {
      id: `pos-${Date.now()}`,
      orderNumber: orderNumber,
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim(),
      shippingAddress: 'Showroom Quầy Trực Tiếp (125 Điện Biên Phủ, P. Đa Kao, Q.1, TP.HCM)',
      totalAmount: soldPrice,
      itemsCount: 1,
      paymentMethod: paymentMethodLabel,
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      status: 'DELIVERED',
      orderType: 'POS_QUAY',
      staffCallStatus: 'STOCK_READY',
      createdAt: 'Vừa xong',
      note: `[BÁN TẠI QUẦY POS] ${posStaffNote}. Số Serial máy: ${selectedPosSerial.serialNumber}`,
      items: [
        {
          productName: selectedPosSerial.productName,
          productSku: selectedPosSerial.productSku,
          price: soldPrice,
          quantity: 1,
          subtotal: soldPrice,
        },
      ],
    };

    const updatedOrders = [newPosOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify(updatedOrders));

    // Try posting to backend
    try {
      await fetch('/api/warranty/pos-sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: selectedPosSerial.serialNumber,
          customerName: posCustomerName.trim(),
          customerPhone: posCustomerPhone.trim(),
          paymentMethod: posPaymentMethod,
          price: soldPrice,
          orderNumber: orderNumber,
        }),
      });
    } catch {
      // Handled
    }

    setIsPosSubmitting(false);
    setShowPosModal(false);

    // Open Printable Invoice & Warranty Certificate Modal
    setInvoiceSerial(updatedSerial);
    setInvoiceOrder(newPosOrder);
    setShowInvoiceModal(true);

    showToast({
      id: String(Date.now()),
      title: 'Xuất Bán Tại Quầy Thành Công! ⚡',
      message: `Đã kích hoạt bảo hành điện tử cho Serial ${selectedPosSerial.serialNumber} (Hạn BH: ${expDateFormatted}). Đã trừ 1 tồn kho.`,
      type: 'success',
    });
  };

  // View Printable Invoice & Warranty for any SOLD serial
  const handleViewInvoice = (serial: SerialItem) => {
    const relatedOrder = orders.find(
      (o) =>
        o.orderNumber === serial.orderNumber ||
        (serial.customerPhone && o.customerPhone === serial.customerPhone)
    ) || {
      id: `ord-${serial.serialNumber}`,
      orderNumber: serial.orderNumber || `POS-STORE-${serial.serialNumber}`,
      customerName: serial.customerName || 'Khách Hàng Pro Gear',
      customerPhone: serial.customerPhone || '0908 123 456',
      shippingAddress:
        serial.soldChannel === 'POS_STORE'
          ? 'Showroom Quầy Trực Tiếp (125 Điện Biên Phủ, P. Đa Kao, Q.1)'
          : 'Giao hàng tận nơi',
      totalAmount: serial.price || 0,
      paymentMethod:
        serial.soldChannel === 'POS_STORE'
          ? 'Thanh toán tại quầy Showroom'
          : 'Chuyển khoản QR / COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: serial.soldDate || '10/02/2026',
      items: [
        {
          productName: serial.productName,
          productSku: serial.productSku,
          price: serial.price || 0,
          quantity: 1,
          subtotal: serial.price || 0,
        },
      ],
    };

    setInvoiceSerial(serial);
    setInvoiceOrder(relatedOrder);
    setShowInvoiceModal(true);
  };

  // Add new Serial item to warehouse shelf
  const handleAddNewSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialForm.serialNumber.trim()) {
      showToast({
        id: String(Date.now()),
        type: 'warning',
        title: 'Thiếu số Serial',
        message: 'Vui lòng nhập mã Serial Number in trên thân máy.',
      });
      return;
    }

    const cleanSn = newSerialForm.serialNumber.trim().toUpperCase();
    if (serials.some((s) => s.serialNumber.toUpperCase() === cleanSn)) {
      showToast({
        id: String(Date.now()),
        type: 'warning',
        title: 'Mã Serial đã tồn tại',
        message: `Mã ${cleanSn} đã có trên hệ thống.`,
      });
      return;
    }

    const prod = products.find((p) => p.sku === newSerialForm.productSku) || products[0];
    const newSerialItem: SerialItem = {
      serialNumber: cleanSn,
      productName: prod ? prod.name : 'Thiết Bị Pro Gear',
      productSku: prod ? prod.sku : newSerialForm.productSku,
      brand: prod ? prod.brand : 'Chính Hãng',
      status: 'IN_STOCK',
      warrantyMonths: Number(newSerialForm.warrantyMonths) || 24,
      price: prod ? prod.price : 0,
    };

    const updated = [newSerialItem, ...serials];
    setSerials(updated);
    localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(updated));

    // Also increment product stock
    if (prod) {
      const updatedProducts = products.map((p) =>
        p.id === prod.id ? { ...p, stock: p.stock + 1, status: 'IN_STOCK' as any } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProducts));
    }

    setShowAddSerialModal(false);
    setNewSerialForm({
      serialNumber: '',
      productSku: products[0]?.sku || '',
      warrantyMonths: 24,
    });

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã nhập kho mã Serial mới! 📦',
      message: `Mã ${cleanSn} đã lưu kho trên kệ. Sẵn sàng bán tại quầy hoặc kích hoạt khi xuất đơn.`,
    });
  };

  // Update Order Status - THÔNG API BACKEND & KÍCH HOẠT BẢO HÀNH!
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    const targetId = targetOrder?.id || orderId;
    const targetOrderNumber = targetOrder?.orderNumber || orderId;

    // 1. Update local state immediately
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId || o.id === targetId || o.orderNumber === targetOrderNumber
          ? {
              ...o,
              orderStatus: newStatus,
              status: newStatus,
              paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : o.paymentStatus,
            }
          : o
      )
    );

    const statusLabels: Record<string, string> = {
      CONFIRMED: 'Đã Xác Nhận',
      SHIPPING: 'Đang Giao Hàng',
      COMPLETED: 'Hoàn Tất Giao Hàng',
      CANCELLED: 'Đã Hủy Đơn',
    };

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Cập nhật trạng thái đơn hàng',
      message: `Đơn ${targetOrderNumber} đã chuyển sang "${statusLabels[newStatus] || newStatus}"`,
    });

    // If order is completed, activate any serial assigned to this order
    if (newStatus === 'COMPLETED' || newStatus === 'DELIVERED') {
      const order = targetOrder || orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        const now = new Date();
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

        let hasActivated = false;
        const updatedSerials = serials.map((s) => {
          if (s.orderNumber === order.orderNumber && s.status === 'IN_STOCK') {
            hasActivated = true;
            const expDate = new Date(now);
            expDate.setMonth(expDate.getMonth() + (s.warrantyMonths || 24));
            const expDateFormatted = `${pad(expDate.getDate())}/${pad(expDate.getMonth() + 1)}/${expDate.getFullYear()}`;
            return {
              ...s,
              status: 'SOLD' as const,
              soldDate: dateFormatted,
              warrantyExpires: expDateFormatted,
              customerName: order.customerName,
              customerPhone: order.customerPhone,
              soldChannel: 'ONLINE' as const,
            };
          }
          return s;
        });

        if (hasActivated) {
          setSerials(updatedSerials);
          localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(updatedSerials));
        }
      }
    }

    // 2. Call backend PATCH /api/orders/:id/status (with targetId and fallback targetOrderNumber)
    try {
      const res = await fetch(`/api/orders/${targetId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : undefined,
        }),
      });
      if (!res.ok && targetOrderNumber !== targetId) {
        await fetch(`/api/orders/${targetOrderNumber}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: newStatus,
            paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : undefined,
          }),
        });
      }
    } catch (err) {
      console.warn('API update order status offline fallback:', err);
    }

    // 3. Update localStorage shared orders with UPSERT (so mock orders & backend orders are permanently persisted)
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      let list: Order[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex(
        (o) => o.id === targetId || o.orderNumber === targetOrderNumber || o.id === orderId || o.orderNumber === orderId
      );
      if (idx >= 0) {
        list[idx] = {
          ...list[idx],
          orderStatus: newStatus,
          status: newStatus,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : list[idx].paymentStatus,
        };
      } else if (targetOrder) {
        list.push({
          ...targetOrder,
          orderStatus: newStatus,
          status: newStatus,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : targetOrder.paymentStatus,
        });
      }
      localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  // Sync inputs whenever selectedOrderDetails modal is opened
  useEffect(() => {
    if (selectedOrderDetails) {
      setScheduleDateInput(selectedOrderDetails.scheduledDate || '');
      setStaffCallStatusInput(selectedOrderDetails.staffCallStatus || 'NOT_CALLED');
      setStaffNotesInput(selectedOrderDetails.staffNotes || '');
    }
  }, [selectedOrderDetails]);

  // Save Pre-Order Schedule & CSKH Call Status
  const handleSavePreOrderSchedule = (
    orderId: string,
    scheduledDate: string,
    staffCallStatus: 'NOT_CALLED' | 'CALLED_SCHEDULED' | 'STOCK_READY' | 'CANCELLED',
    staffNotes: string
  ) => {
    // 1. Update local orders state
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, scheduledDate, staffCallStatus, staffNotes }
          : o
      )
    );

    // 2. Update currently open modal state
    setSelectedOrderDetails((prev) =>
      prev && (prev.id === orderId || prev.orderNumber === orderId)
        ? { ...prev, scheduledDate, staffCallStatus, staffNotes }
        : prev
    );

    // 3. Persist to shared localStorage sync with UPSERT
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      let list: Order[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
      if (idx >= 0) {
        list[idx] = { ...list[idx], scheduledDate, staffCallStatus, staffNotes };
      } else {
        const orderToSave = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
        if (orderToSave) {
          list.push({ ...orderToSave, scheduledDate, staffCallStatus, staffNotes });
        }
      }
      localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    const callStatusText: Record<string, string> = {
      NOT_CALLED: 'Chưa gọi khách',
      CALLED_SCHEDULED: 'Đã gọi & Chốt ngày hẹn',
      STOCK_READY: 'Hàng đã về sẵn kho',
      CANCELLED: 'Khách đã hủy',
    };

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã lưu lịch hẹn khách hàng',
      message: `Đơn ${orderId}: Ngày có hàng ${scheduledDate || 'Chưa đặt'}, CSKH: ${callStatusText[staffCallStatus] || staffCallStatus}`,
    });
  };

  // Add Product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGear.name || !newGear.price) return;

    const productImages = newGear.images && newGear.images.length > 0
      ? newGear.images
      : [newGear.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'];

    const payload = {
      name: newGear.name,
      sku: newGear.sku || `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newGear.brand,
      category: newGear.category,
      price: Number(newGear.price),
      originalPrice: Number(newGear.price) * 1.15,
      stockQuantity: Number(newGear.stock) || 10,
      specifications: {
        sensor: newGear.sensor,
        video: newGear.video,
        stabilization: newGear.stabilization,
      },
      imageUrl: productImages[0],
      images: productImages,
    };

    // Optimistic update
    const newProdItem: Product = {
      id: `local-${Date.now()}`,
      name: payload.name,
      sku: payload.sku,
      brand: payload.brand,
      category: payload.category,
      price: payload.price,
      originalPrice: payload.originalPrice,
      stock: payload.stockQuantity,
      imageUrl: productImages[0],
      images: productImages,
      status: 'IN_STOCK',
      specifications: payload.specifications,
      isFeatured: newGear.isFeatured,
    };
    const updatedProdList = [
      newProdItem,
      ...products.map((p) => (newGear.isFeatured ? { ...p, isFeatured: false } : p)),
    ];
    setProducts(updatedProdList);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProdList));
    } catch {}

    // Send to backend
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.warn('API add product offline fallback:', err);
    }

    // Reset Form
    setNewGear({
      name: '',
      sku: '',
      brand: 'DJI',
      category: 'Flycam & Drone DJI',
      price: '',
      stock: '10',
      sensor: 'Hasselblad 4/3 CMOS',
      video: '4K 120p / 5.1K ProRes',
      stabilization: 'Gimbal cơ học 3 trục',
      imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
      images: [],
      isFeatured: false,
    });
    setInputImgUrl('');
    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã thêm thiết bị mới',
      message: `${newGear.name} đã được lưu vào kho thành công.`,
    });
  };

  // Toggle Featured / Hàng HOT on Storefront
  const handleToggleFeatured = (productId: string) => {
    const targetProd = products.find((p) => p.id === productId);
    const willBeFeatured = !targetProd?.isFeatured;

    const updatedProdList = products.map((p) => {
      if (p.id === productId) {
        return { ...p, isFeatured: willBeFeatured };
      }
      return willBeFeatured ? { ...p, isFeatured: false } : p;
    });

    setProducts(updatedProdList);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProdList));
    } catch {}

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: willBeFeatured ? 'Đã ghim làm HÀNG HOT' : 'Đã bỏ HÀNG HOT',
      message: willBeFeatured
        ? `"${targetProd?.name}" đã được đưa lên vị trí HÀNG HOT nổi bật nhất ở đầu Storefront!`
        : `"${targetProd?.name}" đã bỏ khỏi vị trí HÀNG HOT.`,
    });
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast({
      id: String(Date.now()),
      type: 'warning',
      title: 'Đã xóa thiết bị',
      message: 'Thiết bị đã được xóa khỏi hệ thống quản trị.',
    });
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  // Reset Seed
  const handleResetSeed = async () => {
    try {
      await fetch('/api/products/seed');
      localStorage.removeItem('PROGEAR_SHARED_PRODUCTS');
      await fetchProducts();
      showToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Đã đồng bộ lại kho hàng gốc',
        message: 'Tất cả thiết bị, ống kính và flycam đã được khôi phục tồn kho sẵn hàng ban đầu.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Restock Product
  const handleQuickRestock = async (product: Product, addQuantity: number) => {
    const newStock = Math.max(0, (product.stock || 0) + addQuantity);
    const updated = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            stock: newStock,
            status: (newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= 3 ? 'LOW_STOCK' : 'IN_STOCK') as any,
          }
        : p
    );
    setProducts(updated);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockQuantity: newStock }),
      });
    } catch (err) {
      console.warn('Backend stock update fallback:', err);
    }

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã nhập thêm hàng vào kho',
      message: `${product.name}: Nhập +${addQuantity} -> Tồn kho: ${newStock} chiếc (${newStock > 0 ? 'Sẵn hàng' : 'Pre-Order'})`,
    });
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Filtered Orders
  const isOrderPreOrder = (o: Order) => {
    const st = o.orderStatus || o.status || 'PENDING';
    return Boolean(
      o.isPreOrder ||
      o.orderType === 'PRE_ORDER' ||
      st === 'PRE_ORDER' ||
      (o.orderNumber && o.orderNumber.startsWith('PRE-')) ||
      (o.note && o.note.includes('PRE-ORDER'))
    );
  };

  const filteredOrders = orders.filter((o) => {
    const st = o.orderStatus || o.status || 'PENDING';
    if (selectedOrderStatus === 'ALL') return true;
    if (selectedOrderStatus === 'PRE_ORDER') {
      return isOrderPreOrder(o);
    }
    return st === selectedOrderStatus;
  });

  const preOrdersCount = orders.filter(isOrderPreOrder).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const query = productSearch.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    const matchesBrand =
      productBrandFilter === 'ALL' || p.brand.toLowerCase() === productBrandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  // Calculations for Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => (o.orderStatus || o.status) === 'PENDING').length;
  const completedOrdersCount = orders.filter((o) => (o.orderStatus || o.status) === 'COMPLETED').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* ----------------- DYNAMIC ISLAND TOAST ----------------- */}
      <DynamicIslandToast toast={toast} onClose={() => setToast(null)} />

      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="bg-[#070A11] border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-black text-white flex items-center space-x-1.5">
                <span>PRO GEAR</span>
                <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                  OPERATIONS ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Hệ Thống Quản Trị Máy Ảnh • Cinema Line • Flycam DJI
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Storefront Link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <span>Xem Web Bán Hàng</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-semibold">Hệ Thống Trực Tuyến</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'dashboard'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Bảng Điều Khiển (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'products'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Quản Lý Thiết Bị ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition relative ${
              activeTab === 'orders'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Quản Lý Đơn Hàng ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-500 text-black font-black px-1.5 py-0.2 rounded-full text-[10px]">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('warranty')}
            className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'warranty'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Mã Serial & Bảo Hành</span>
          </button>

          <button
            onClick={() => setActiveTab('k8s')}
            className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === 'k8s'
                ? 'border-red-500 text-red-400 bg-red-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-sky-400" />
            <span>Hệ Thống Máy Chủ</span>
          </button>
        </div>
      </header>

      {/* ----------------- TAB CONTENTS ----------------- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* ================= 1. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Bento Metrics Grid with Ambient Light & Animated Counters */}
            <BentoMetricsGrid
              totalRevenue={totalRevenue}
              totalOrdersCount={totalOrdersCount}
              pendingOrdersCount={pendingOrdersCount}
              productsCount={products.length}
              lowStockCount={lowStockCount}
              completedOrdersCount={completedOrdersCount}
              onNavigateOrders={() => setActiveTab('orders')}
              onNavigateProducts={() => setActiveTab('products')}
              onNavigateK8s={() => setActiveTab('k8s')}
            />

            {/* Quick Action & Sync Alert */}
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <Flame className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Hệ Thống Đã Đồng Bộ Hoàn Toàn Với Storefront</h3>
                  <p className="text-xs text-slate-400">
                    Khi khách đặt đơn máy ảnh / flycam tại web bán hàng, đơn sẽ xuất hiện ngay tại tab Đơn Hàng.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    fetchOrders();
                    fetchProducts();
                    showToast({
                      id: String(Date.now()),
                      type: 'info',
                      title: 'Đã làm mới dữ liệu',
                      message: 'Chỉ số và đơn hàng từ web bán hàng đã được đồng bộ.',
                    });
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Làm Mới Dữ Liệu</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  Duyệt Đơn Hàng Mới
                </button>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-red-500" />
                  <span>Đơn Đặt Hàng Mới Nhất</span>
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-red-400 hover:underline font-semibold"
                >
                  Xem toàn bộ {orders.length} đơn →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Mã Đơn</th>
                      <th className="py-2.5 px-3">Khách Hàng</th>
                      <th className="py-2.5 px-3">Giá Trị</th>
                      <th className="py-2.5 px-3">Thanh Toán</th>
                      <th className="py-2.5 px-3">Trạng Thái</th>
                      <th className="py-2.5 px-3">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {orders.slice(0, 5).map((ord) => {
                      const st = ord.orderStatus || ord.status || 'PENDING';
                      return (
                        <tr key={ord.id} className="hover:bg-slate-800/50 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-200">
                            <div>{ord.customerName}</div>
                            <div className="text-[11px] text-slate-500">{ord.customerPhone}</div>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-amber-400">{formatVND(ord.totalAmount)}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                st === 'CONFIRMED'
                                  ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30'
                                  : st === 'SHIPPING'
                                  ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30'
                                  : st === 'COMPLETED'
                                  ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {st === 'PENDING'
                                ? 'Chờ xác nhận'
                                : st === 'CONFIRMED'
                                ? 'Đã xác nhận'
                                : st === 'SHIPPING'
                                ? 'Đang giao'
                                : st === 'COMPLETED'
                                ? 'Hoàn tất'
                                : st}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => {
                                setSelectedOrderDetails(ord);
                                setActiveTab('orders');
                              }}
                              className="text-xs text-red-400 hover:text-white"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. QUẢN LÝ SẢN PHẨM ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Product Controls */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Package className="w-5 h-5 text-red-500" />
                  <span>Danh Mục Máy Ảnh, Máy Quay Cinema & Flycam DJI</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Quản lý kho hàng, thông số kỹ thuật, giá bán và hình ảnh thiết bị
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetSeed}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
                  title="Đồng bộ lại kho dữ liệu gốc thiết bị"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đồng Bộ Dữ Liệu Gốc</span>
                </button>
              </div>
            </div>

            {/* Add New Product Form */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Thêm Thiết Bị Mới Vào Kho (Pro Gear)</span>
              </h4>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Tên thiết bị *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Sony FX3 Cinema Line..."
                    value={newGear.name}
                    onChange={(e) => setNewGear({ ...newGear, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mã SKU</label>
                  <input
                    type="text"
                    placeholder="Tự động sinh (VD: PRO-8821)"
                    value={newGear.sku}
                    onChange={(e) => setNewGear({ ...newGear, sku: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Thương hiệu</label>
                  <select
                    value={newGear.brand}
                    onChange={(e) => setNewGear({ ...newGear, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="DJI">DJI</option>
                    <option value="Sony">Sony</option>
                    <option value="Canon">Canon</option>
                    <option value="Fujifilm">Fujifilm</option>
                    <option value="Blackmagic Design">Blackmagic Design</option>
                    <option value="Nikon">Nikon</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Danh mục</label>
                  <select
                    value={newGear.category}
                    onChange={(e) => setNewGear({ ...newGear, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Máy Ảnh Mirrorless & DSLR">Máy Ảnh Mirrorless & DSLR</option>
                    <option value="Máy Quay Điện Ảnh & Cinema">Máy Quay Điện Ảnh & Cinema</option>
                    <option value="Flycam & Drone DJI">Flycam & Drone DJI</option>
                    <option value="Gimbal & Chống Rung DJI Ronin">Gimbal & Chống Rung DJI Ronin</option>
                    <option value="Action Cam & Pocket Creator">Action Cam & Pocket Creator</option>
                    <option value="Ống Kính Chuyên Dụng (Lenses)">Ống Kính Chuyên Dụng (Lenses)</option>
                    <option value="Âm Thanh & Ánh Sáng Studio">Âm Thanh & Ánh Sáng Studio</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Giá bán niêm yết (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    placeholder="VD: 53990000"
                    value={newGear.price}
                    onChange={(e) => setNewGear({ ...newGear, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={newGear.stock}
                    onChange={(e) => setNewGear({ ...newGear, stock: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Cảm biến (Sensor)</label>
                  <input
                    type="text"
                    placeholder="VD: Full-Frame 33MP..."
                    value={newGear.sensor}
                    onChange={(e) => setNewGear({ ...newGear, sensor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Quay video (Video Codec)</label>
                  <input
                    type="text"
                    placeholder="VD: 4K 120p 10-bit..."
                    value={newGear.video}
                    onChange={(e) => setNewGear({ ...newGear, video: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                {/* Bộ Sưu Tập Hình Ảnh Thiết Bị */}
                <div className="md:col-span-3 lg:col-span-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <Camera className="w-4 h-4 text-red-500" />
                        <span>Bộ Sưu Tập Hình Ảnh Thiết Bị (Storefront Gallery)</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-950/80 text-red-400 border border-red-800/40 font-mono">
                          {newGear.images?.length || 0} góc ảnh
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Thêm nhiều góc ảnh (chính diện, cảm biến/ngàm, màn hình lật, thực tế tác nghiệp). Khách hàng xem trên web bán hàng có thể lật xem toàn bộ bộ ảnh.
                      </p>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex items-center space-x-1.5 text-[11px]">
                      <span className="text-slate-500">Mẫu sẵn:</span>
                      <button
                        type="button"
                        onClick={() => setNewGear(prev => ({
                          ...prev,
                          images: [
                            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
                            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
                            'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
                          ],
                          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000'
                        }))}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                      >
                        📷 Alpha Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewGear(prev => ({
                          ...prev,
                          images: [
                            'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
                            'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
                            'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
                          ],
                          imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000'
                        }))}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                      >
                        🚁 Flycam DJI
                      </button>
                    </div>
                  </div>

                  {/* Input controls: URL & File Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-8 flex space-x-2">
                      <input
                        type="url"
                        placeholder="Nhập link hình ảnh (HTTPS URL)..."
                        value={inputImgUrl}
                        onChange={(e) => setInputImgUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition shrink-0"
                      >
                        + Thêm URL
                      </button>
                    </div>

                    <div className="sm:col-span-4 flex items-center">
                      <label className="w-full cursor-pointer flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-semibold transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Tải ảnh từ máy</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Previews Grid */}
                  {newGear.images && newGear.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
                      {newGear.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border ${
                            idx === 0
                              ? 'border-red-500 ring-2 ring-red-500/30'
                              : 'border-slate-800 hover:border-slate-700'
                          } bg-black aspect-video flex items-center justify-center`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 flex items-center space-x-1">
                            {idx === 0 ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white shadow">
                                ★ Ảnh chính
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/70 text-slate-300 backdrop-blur-sm">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1 p-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                title="Đặt làm ảnh chính"
                                className="px-1.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-[10px] text-white font-medium transition"
                              >
                                Đặt chính
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              title="Xóa ảnh này"
                              className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                      Chưa có hình ảnh nào được chọn. Nhập link hoặc tải tệp ảnh từ máy để tạo bộ sưu tập cho thiết bị.
                    </div>
                  )}
                </div>

                <div className="md:col-span-3 lg:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 hover:border-amber-500/50 transition">
                    <input
                      type="checkbox"
                      checked={newGear.isFeatured}
                      onChange={(e) => setNewGear((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Đặt làm Hàng HOT (Nổi bật trên Hero Storefront)</span>
                      </span>
                      <p className="text-[10px] text-slate-400">Hiển thị nổi bật ở khung lớn đầu trang chủ web bán hàng</p>
                    </div>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow transition flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lưu Thiết Bị Vào Kho & Xuất Lên Storefront</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[260px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên máy ảnh, flycam, mã SKU, hãng sản xuất..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto text-xs py-0.5">
                {['ALL', 'DJI', 'Sony', 'Canon', 'Fujifilm', 'Blackmagic', 'Nikon'].map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setProductBrandFilter(brand)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
                      productBrandFilter.toLowerCase() === brand.toLowerCase()
                        ? 'bg-red-600 text-white shadow-md shadow-red-950'
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {brand === 'ALL' ? 'Tất Cả Hãng' : brand}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Hiển thị <span className="font-bold text-white">{filteredProducts.length}</span> / {products.length} thiết bị
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Thiết Bị</th>
                      <th className="py-3 px-4">Hãng</th>
                      <th className="py-3 px-4">Danh Mục</th>
                      <th className="py-3 px-4">Giá Bán</th>
                      <th className="py-3 px-4">Tồn Kho</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-center">Hàng HOT Hero</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-500">
                          <Package className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                          <p>Không tìm thấy thiết bị nào phù hợp với từ khóa tìm kiếm.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative shrink-0 group">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-11 h-11 object-cover rounded-lg bg-black border border-slate-800"
                              />
                              <button
                                type="button"
                                onClick={() => openImageManagerModal(p)}
                                title="Xem & chỉnh sửa bộ ảnh"
                                className="absolute -bottom-1 -right-1 px-1 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[9px] text-slate-300 font-mono flex items-center space-x-0.5 hover:bg-red-600 hover:text-white transition shadow"
                              >
                                <span>📸</span>
                                <span>{(p.images && p.images.length) || 1}</span>
                              </button>
                            </div>
                            <div>
                              <div className="font-bold text-white max-w-sm truncate flex items-center gap-1.5">
                                <span>{p.name}</span>
                                {p.isFeatured && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black tracking-wider uppercase shadow">
                                    HOT HERO
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{p.brand}</td>
                        <td className="py-3 px-4 text-slate-400">{p.category}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">{formatVND(p.price)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono font-bold text-xs ${p.stock <= 0 ? 'text-rose-400' : p.stock <= 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                              {p.stock}
                            </span>
                            <div className="flex items-center space-x-1">
                              <button
                                type="button"
                                onClick={() => handleQuickRestock(p, 5)}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-[10px] text-slate-300 font-bold border border-slate-700 transition"
                                title="Nhập thêm +5 chiếc vào kho"
                              >
                                +5
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickRestock(p, 10)}
                                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-white text-[10px] text-slate-300 font-bold border border-slate-700 transition"
                                title="Nhập thêm +10 chiếc vào kho"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stock <= 0
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                                : p.stock <= 3
                                ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {p.stock <= 0 ? 'Hết hàng (Pre-Order)' : p.stock <= 3 ? 'Sắp hết' : 'Sẵn hàng'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p.id)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition inline-flex items-center space-x-1.5 ${
                              p.isFeatured
                                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-md shadow-amber-950/50 ring-2 ring-amber-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-amber-300 border-slate-700 hover:border-amber-500/50'
                            }`}
                            title={p.isFeatured ? 'Đang là Hàng HOT trang chủ. Bấm để tắt.' : 'Bấm để chọn thiết bị này làm Hàng HOT trang chủ'}
                          >
                            <Flame className={`w-3.5 h-3.5 ${p.isFeatured ? 'text-amber-200 fill-amber-200' : 'text-slate-500'}`} />
                            <span>{p.isFeatured ? 'Hàng HOT ★' : 'Đặt HOT'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => openImageManagerModal(p)}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition flex items-center space-x-1 text-xs border border-slate-700"
                              title="Quản lý bộ sưu tập ảnh góc máy"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span className="font-semibold text-[11px]">Ảnh ({(p.images && p.images.length) || 1})</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition"
                              title="Xóa thiết bị"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. QUẢN LÝ ĐƠN HÀNG (THÔNG API) ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                  <span>Quản Lý Đơn Đặt Hàng Bán Lẻ & Dự Án Đoàn Phim</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Đồng bộ tức thời với Storefront. Đơn hàng khách vừa đặt sẽ hiển thị ngay tại đây.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={fetchOrders}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOrdersLoading ? 'animate-spin' : ''}`} />
                  <span>Làm Mới Danh Sách</span>
                </button>
              </div>
            </div>

            {/* Filter by Status */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['ALL', 'PRE_ORDER', 'PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedOrderStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center space-x-1.5 ${
                    selectedOrderStatus === st
                      ? st === 'PRE_ORDER'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-950/50'
                        : 'bg-red-600 text-white shadow-lg shadow-red-950'
                      : st === 'PRE_ORDER'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/40'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {st === 'PRE_ORDER' && <PhoneCall className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                  <span>
                    {st === 'ALL'
                      ? `Tất Cả (${orders.length})`
                      : st === 'PRE_ORDER'
                      ? `Đặt Hàng Chờ Về (${preOrdersCount})`
                      : st === 'PENDING'
                      ? `Chờ Xác Nhận (${orders.filter((o) => (o.orderStatus || o.status) === 'PENDING').length})`
                      : st === 'CONFIRMED'
                      ? `Đã Xác Nhận (${orders.filter((o) => (o.orderStatus || o.status) === 'CONFIRMED').length})`
                      : st === 'SHIPPING'
                      ? `Đang Giao (${orders.filter((o) => (o.orderStatus || o.status) === 'SHIPPING').length})`
                      : st === 'COMPLETED'
                      ? `Hoàn Tất (${orders.filter((o) => (o.orderStatus || o.status) === 'COMPLETED').length})`
                      : 'Đã Hủy'}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Mã Đơn Hàng</th>
                      <th className="py-3 px-4">Khách Hàng & SĐT</th>
                      <th className="py-3 px-4">Địa Chỉ Nhận</th>
                      <th className="py-3 px-4">Tổng Tiền</th>
                      <th className="py-3 px-4">Thanh Toán</th>
                      <th className="py-3 px-4">Trạng Thái Đơn</th>
                      <th className="py-3 px-4 text-right">Thao Tác Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          Không có đơn hàng nào trong danh mục này.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const st = ord.orderStatus || ord.status || 'PENDING';
                        const isPre = isOrderPreOrder(ord);

                        return (
                          <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-red-400">{ord.orderNumber}</span>
                              <div className="text-[10px] text-slate-500">{ord.createdAt}</div>
                              {isPre && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 inline-flex items-center gap-1 mt-1">
                                  <Clock className="w-2.5 h-2.5" /> ĐẶT CHỜ VỀ
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{ord.customerName}</div>
                              <div className="text-slate-400 flex items-center gap-1">
                                <span>{ord.customerPhone}</span>
                                {isPre && (
                                  <a
                                    href={`tel:${ord.customerPhone.replace(/[^0-9+]/g, '')}`}
                                    className="p-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition"
                                    title="Bấm gọi khách ngay"
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-xs truncate text-slate-400">
                              {ord.shippingAddress || 'Nhận tại Showroom'}
                            </td>
                            <td className="py-3 px-4 font-bold text-amber-400">
                              {formatVND(ord.totalAmount)}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {isPre ? (
                                <div className="space-y-1">
                                  <span
                                    className={`px-2.5 py-1 rounded text-[10px] font-bold inline-block ${
                                      ord.staffCallStatus === 'CALLED_SCHEDULED'
                                        ? 'bg-blue-900/50 text-blue-300 border border-blue-500/40'
                                        : ord.staffCallStatus === 'STOCK_READY'
                                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/40'
                                        : ord.staffCallStatus === 'CANCELLED'
                                        ? 'bg-red-900/50 text-red-300 border border-red-500/40'
                                        : 'bg-amber-950/70 text-amber-300 border border-amber-500/50 animate-pulse'
                                    }`}
                                  >
                                    {ord.staffCallStatus === 'CALLED_SCHEDULED'
                                      ? '✓ Đã Hẹn Ngày'
                                      : ord.staffCallStatus === 'STOCK_READY'
                                      ? '★ Hàng Đã Về Kho'
                                      : ord.staffCallStatus === 'CANCELLED'
                                      ? '✕ Khách Hủy'
                                      : '☎ Cần Gọi Khách'}
                                  </span>
                                  {ord.scheduledDate && (
                                    <div className="text-[10px] text-amber-400/90 font-mono flex items-center gap-1">
                                      <Calendar className="w-2.5 h-2.5" /> Hẹn: {ord.scheduledDate}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                                    st === 'CONFIRMED'
                                      ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30'
                                      : st === 'SHIPPING'
                                      ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30'
                                      : st === 'COMPLETED'
                                      ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                                      : st === 'CANCELLED'
                                      ? 'bg-red-900/40 text-red-400 border border-red-500/30'
                                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                                  }`}
                                >
                                  {st === 'PENDING'
                                    ? 'Chờ xác nhận'
                                    : st === 'CONFIRMED'
                                    ? 'Đã xác nhận'
                                    : st === 'SHIPPING'
                                    ? 'Đang giao hàng'
                                    : st === 'COMPLETED'
                                    ? 'Đã hoàn tất'
                                    : st === 'CANCELLED'
                                    ? 'Đã hủy'
                                    : st}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
                              {isPre ? (
                                <>
                                  <button
                                    onClick={() => setSelectedOrderDetails(ord)}
                                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition shadow inline-flex items-center space-x-1"
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                    <span>Gọi & Hẹn</span>
                                  </button>
                                  {ord.staffCallStatus === 'STOCK_READY' && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'SHIPPING')}
                                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                                    >
                                      Giao hàng
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {st === 'PENDING' && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'CONFIRMED')}
                                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow"
                                    >
                                      Xác nhận
                                    </button>
                                  )}
                                  {st === 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'SHIPPING')}
                                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition shadow"
                                    >
                                      Giao hàng
                                    </button>
                                  )}
                                  {st === 'SHIPPING' && (
                                    <button
                                      onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'COMPLETED')}
                                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow"
                                    >
                                      Hoàn tất
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => setSelectedOrderDetails(ord)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                              >
                                Xem
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Detail View Modal */}
            {selectedOrderDetails && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 relative shadow-2xl text-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-red-500" />
                        <span>Hóa Đơn Đơn Hàng: {selectedOrderDetails.orderNumber}</span>
                      </h4>
                      {isOrderPreOrder(selectedOrderDetails) && (
                        <div className="mt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ĐƠN ĐẶT HÀNG CHỜ VỀ (PRE-ORDER)
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-slate-300">
                    <div className="flex justify-between items-center">
                      <span>Khách hàng:</span>
                      <strong className="text-white text-sm">{selectedOrderDetails.customerName}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Số điện thoại:</span>
                      <div className="flex items-center space-x-2">
                        <strong className="text-white font-mono">{selectedOrderDetails.customerPhone}</strong>
                        <a
                          href={`tel:${selectedOrderDetails.customerPhone.replace(/[^0-9+]/g, '')}`}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] shadow flex items-center space-x-1 transition active:scale-95"
                          title="Bấm gọi ngay cho khách hàng"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Gọi Ngay</span>
                        </a>
                      </div>
                    </div>
                    <div>
                      Địa chỉ nhận: <span className="text-slate-200">{selectedOrderDetails.shippingAddress}</span>
                    </div>
                    <div>
                      Phương thức thanh toán: <strong>{selectedOrderDetails.paymentMethod}</strong>
                    </div>
                    {selectedOrderDetails.note && (
                      <div className="pt-1 border-t border-slate-850">
                        Ghi chú khách: <span className="text-amber-400 font-medium">{selectedOrderDetails.note}</span>
                      </div>
                    )}
                  </div>

                  {/* CSKH Gọi Điện & Hẹn Ngày Có Hàng Cho Khách */}
                  <div className="bg-gradient-to-br from-amber-950/40 to-slate-950 border border-amber-500/40 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs">
                        <PhoneCall className="w-4 h-4 text-amber-400" />
                        <span>CSKH Gọi Khách & Hẹn Ngày Có Hàng</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        Lịch Hẹn Cung Cấp
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1 font-semibold flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ngày Hẹn Có Hàng & Giao:</span>
                        </label>
                        <input
                          type="date"
                          value={scheduleDateInput}
                          onChange={(e) => setScheduleDateInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Trạng Thái Cuộc Gọi:</span>
                        </label>
                        <select
                          value={staffCallStatusInput}
                          onChange={(e) => setStaffCallStatusInput(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none"
                        >
                          <option value="NOT_CALLED">Chưa gọi cho khách</option>
                          <option value="CALLED_SCHEDULED">Đã gọi & Hẹn ngày có hàng</option>
                          <option value="STOCK_READY">Hàng đã về kho (Sẵn sàng xuất)</option>
                          <option value="CANCELLED">Khách đã hủy đơn</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                        Ghi Chú Cuộc Gọi CSKH:
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Đã hẹn khách 25/10 nhận hàng buổi chiều..."
                        value={staffNotesInput}
                        onChange={(e) => setStaffNotesInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          handleSavePreOrderSchedule(
                            selectedOrderDetails.id || selectedOrderDetails.orderNumber,
                            scheduleDateInput,
                            staffCallStatusInput,
                            staffNotesInput
                          );
                        }}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs shadow flex items-center space-x-1.5 transition active:scale-95"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Lưu Lịch Hẹn & Cập Nhật CSKH</span>
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h5 className="font-bold text-slate-300 mb-2">Thiết Bị Khách Đặt:</h5>
                    <div className="space-y-2">
                      {(selectedOrderDetails.items || []).map((itm, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-bold text-white">{itm.productName}</div>
                            <div className="text-[11px] text-slate-500">Số lượng: x{itm.quantity}</div>
                          </div>
                          <div className="font-bold text-amber-400 font-mono">
                            {formatVND(itm.subtotal || itm.price * itm.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="font-bold text-slate-400">Tổng Đơn Hàng:</span>
                    <span className="font-black text-amber-400 text-base">
                      {formatVND(selectedOrderDetails.totalAmount)}
                    </span>
                  </div>

                  {/* Status Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrderDetails.id || selectedOrderDetails.orderNumber, 'CONFIRMED');
                        setSelectedOrderDetails(null);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                    >
                      Duyệt Xác Nhận
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrderDetails.id || selectedOrderDetails.orderNumber, 'SHIPPING');
                        setSelectedOrderDetails(null);
                      }}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl"
                    >
                      Xuất Kho Giao Hàng
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrderDetails.id || selectedOrderDetails.orderNumber, 'COMPLETED');
                        setSelectedOrderDetails(null);
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                    >
                      Đã Hoàn Tất
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. QUẢN LÝ MÃ SERIAL & BẢO HÀNH (POS & WARRANTY HUB) ================= */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            {/* Header with Title and Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                      <span>Quản Lý Mã Serial, Kích Hoạt Bảo Hành & Bán Lẻ POS</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Theo dõi từng thiết bị trên kệ showroom. Bán trực tiếp tại quầy để kích hoạt bảo hành điện tử chuẩn Tin Học Ngôi Sao.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => setShowAddSerialModal(true)}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-lg shadow-red-900/30 transition transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nhập Serial Vào Kệ</span>
                </button>
                <button
                  onClick={fetchSerials}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cập Nhật</span>
                </button>
              </div>
            </div>

            {/* KPI Bento Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Tổng Số Serial</div>
                  <div className="text-xl font-bold text-white font-mono">{serials.length}</div>
                </div>
              </div>

              <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-xl flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-amber-400 font-medium">Tồn Kệ (Chưa Kích Hoạt)</div>
                  <div className="text-xl font-bold text-amber-400 font-mono">
                    {serials.filter((s) => s.status === 'IN_STOCK').length}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-emerald-900/40 p-4 rounded-xl flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-emerald-400 font-medium">Đang Bảo Hành (Đã Bán)</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {serials.filter((s) => s.status === 'SOLD').length}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-blue-400 font-medium">Xuất Bán Tại Quầy (POS)</div>
                  <div className="text-xl font-bold text-blue-400 font-mono">
                    {serials.filter((s) => s.soldChannel === 'POS_STORE').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
              <div className="flex items-center space-x-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSerialFilterTab('ALL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    serialFilterTab === 'ALL'
                      ? 'bg-red-600 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Tất Cả ({serials.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSerialFilterTab('IN_STOCK')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1.5 ${
                    serialFilterTab === 'IN_STOCK'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-amber-400/80 hover:text-amber-300 hover:bg-slate-800'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Tồn Kho Kệ - Chưa Kích Hoạt ({serials.filter((s) => s.status === 'IN_STOCK').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerialFilterTab('SOLD')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1.5 ${
                    serialFilterTab === 'SOLD'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Đang Bảo Hành - Đã Bán ({serials.filter((s) => s.status === 'SOLD').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerialFilterTab('EXPIRED')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                    serialFilterTab === 'EXPIRED'
                      ? 'bg-slate-700 text-white shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Hết Hạn Bảo Hành ({serials.filter((s) => s.status === 'EXPIRED').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tra cứu SN, Tên máy, SĐT, Mã đơn..."
                  value={serialSearchQuery}
                  onChange={(e) => setSerialSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Table of Serials */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Mã Serial (SN)</th>
                      <th className="py-3.5 px-4">Tên Thiết Bị & SKU</th>
                      <th className="py-3.5 px-4">Trạng Thái & Kênh</th>
                      <th className="py-3.5 px-4">Thời Hạn & Ngày Bán</th>
                      <th className="py-3.5 px-4">Thông Tin Khách & Đơn</th>
                      <th className="py-3.5 px-4 text-right">Thao Tác Nghiệp Vụ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {(() => {
                      const filtered = serials.filter((s) => {
                        if (serialFilterTab !== 'ALL' && s.status !== serialFilterTab) {
                          return false;
                        }
                        if (serialSearchQuery.trim()) {
                          const q = serialSearchQuery.toLowerCase();
                          const matchSn = s.serialNumber.toLowerCase().includes(q);
                          const matchProd = s.productName.toLowerCase().includes(q);
                          const matchCustomer = (s.customerName || '').toLowerCase().includes(q);
                          const matchPhone = (s.customerPhone || '').toLowerCase().includes(q);
                          const matchOrder = (s.orderNumber || '').toLowerCase().includes(q);
                          return matchSn || matchProd || matchCustomer || matchPhone || matchOrder;
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500">
                              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                              <div className="font-semibold text-slate-400">Không tìm thấy mã Serial phù hợp</div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Hãy thử thay đổi bộ lọc trạng thái hoặc từ khóa tìm kiếm.
                              </p>
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((s, idx) => {
                        const isInStock = s.status === 'IN_STOCK';
                        const isSold = s.status === 'SOLD';
                        const isExpired = s.status === 'EXPIRED';

                        return (
                          <tr key={idx} className="hover:bg-slate-800/40 transition">
                            {/* Serial Number */}
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                              <div className="flex items-center space-x-1.5">
                                <span>{s.serialNumber}</span>
                                <button
                                  type="button"
                                  title="Sao chép Serial"
                                  onClick={() => {
                                    navigator.clipboard.writeText(s.serialNumber);
                                    showToast({
                                      id: String(Date.now()),
                                      type: 'info',
                                      title: 'Đã sao chép Serial',
                                      message: s.serialNumber,
                                    });
                                  }}
                                  className="text-slate-500 hover:text-slate-200 transition p-1"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>

                            {/* Product & SKU */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white max-w-xs truncate" title={s.productName}>
                                {s.productName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center space-x-2">
                                <span className="text-slate-500">{s.brand}</span>
                                <span>•</span>
                                <span>{s.productSku || 'SKU-N/A'}</span>
                              </div>
                            </td>

                            {/* Status & Channel */}
                            <td className="py-3.5 px-4">
                              {isInStock && (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-950/40 text-amber-300 border border-amber-500/30">
                                  <Package className="w-3 h-3" />
                                  <span>Tồn Kệ Showroom (Chưa Kích Hoạt)</span>
                                </span>
                              )}
                              {isSold && (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span>Đang Bảo Hành</span>
                                  </span>
                                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                                    {s.soldChannel === 'POS_STORE' ? (
                                      <span className="text-sky-400 font-semibold flex items-center space-x-0.5">
                                        <Store className="w-3 h-3" />
                                        <span>Quầy Showroom</span>
                                      </span>
                                    ) : (
                                      <span className="text-purple-400 font-semibold flex items-center space-x-0.5">
                                        <Truck className="w-3 h-3" />
                                        <span>Đơn Trực Tuyến</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              {isExpired && (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                                  <Clock className="w-3 h-3" />
                                  <span>Hết Hạn Bảo Hành</span>
                                </span>
                              )}
                            </td>

                            {/* Warranty Duration & Dates */}
                            <td className="py-3.5 px-4 text-xs">
                              {isInStock ? (
                                <div className="text-slate-400">
                                  <div className="font-semibold text-slate-300">{s.warrantyMonths} Tháng Chính Hãng</div>
                                  <div className="text-[11px] text-amber-500/80 italic">Kích hoạt khi xuất bán</div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-semibold text-white">
                                    {s.warrantyMonths} Tháng (Hạn: <span className="text-emerald-400 font-mono font-bold">{s.warrantyExpires}</span>)
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    Ngày bán: <span className="text-slate-300 font-mono">{s.soldDate || '10/02/2026'}</span>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Customer & Order Info */}
                            <td className="py-3.5 px-4">
                              {isInStock ? (
                                <div className="text-slate-500 text-[11px] italic">
                                  Lưu kho sẵn sàng xuất bán tại quầy
                                </div>
                              ) : (
                                <div>
                                  <div className="font-bold text-slate-200">{s.customerName || 'Khách Vãng Lai'}</div>
                                  <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                                    {s.customerPhone && (
                                      <span className="text-sky-400 flex items-center space-x-0.5">
                                        <Phone className="w-3 h-3" />
                                        <span>{s.customerPhone}</span>
                                      </span>
                                    )}
                                    {s.orderNumber && (
                                      <span className="text-red-400 font-semibold">{s.orderNumber}</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Actions Column */}
                            <td className="py-3.5 px-4 text-right">
                              {isInStock ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenPosModal(s)}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition transform hover:scale-[1.03]"
                                >
                                  <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                                  <span>Bán Tại Quầy (POS)</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleViewInvoice(s)}
                                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                                >
                                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                                  <span>Hóa Đơn & BH</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. HỆ THỐNG MÁY CHỦ ================= */}
        {activeTab === 'k8s' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-sky-400" />
                <span>Giám Sát Vận Hành Hệ Thống & Máy Chủ</span>
              </h3>
              <p className="text-xs text-slate-400">
                Toàn bộ hệ thống Pro Gear vận hành trên hạ tầng đám mây phân tán với khả năng chịu tải và bảo mật dữ liệu cao.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Cụm Máy Chủ Đám Mây</div>
                <div className="text-base font-bold text-white font-mono">Cloud Enterprise Cluster</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cân Bằng Tải Tự Động • Uptime 99.9%</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Cơ Sở Dữ Liệu & Bộ Nhớ Đệm</div>
                <div className="text-base font-bold text-white font-mono">PostgreSQL Dedicated + Cache</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sao Lưu Liên Tục • Mã Hóa Lưu Trữ</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Bảo Mật Đường Truyền</div>
                <div className="text-base font-bold text-white font-mono">SSL / TLS 256-bit Encryption</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bảo Vệ Tường Lửa & Chống Tấn Công</span>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
                Trạng Thái Hoạt Động Của Các Dịch Vụ Hệ Thống
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white font-medium">Cổng Bán Hàng Trực Tuyến (Storefront Service)</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Hoạt Động Bình Thường • Tốc Độ Cao</span>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white font-medium">Hệ Thống Xử Lý Đơn Hàng & Nghiệp Vụ Kho</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Hoạt Động Bình Thường • Đồng Bộ Tức Thời</span>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white font-medium">Cổng Quản Trị Hệ Thống (Operations Admin Portal)</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Hoạt Động Bình Thường • Quyền Quản Trị</span>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white font-medium">Hệ Thống Cơ Sở Dữ Liệu & Serial Thiết Bị</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    <span>Hoạt Động Bình Thường • Toàn Vẹn Dữ Liệu</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL QUẢN LÝ BỘ SƯU TẬP ẢNH CỦA THIẾT BỊ ================= */}
      {imageManagerProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                    <Camera className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Quản Lý Bộ Sưu Tập Ảnh Thiết Bị
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {imageManagerProduct.name} <span className="font-mono text-slate-500">({imageManagerProduct.sku})</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setImageManagerProduct(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Helper / Info */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hiển thị trên Khách Hàng Storefront:</span>
              </div>
              <p className="text-slate-400">
                Toàn bộ ảnh bạn lưu ở đây sẽ xuất hiện trong thanh lướt góc ảnh chi tiết của sản phẩm ở trang bán hàng. Ảnh đầu tiên (★ Ảnh chính) sẽ là ảnh đại diện card.
              </p>
            </div>

            {/* Input Controls */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Thêm Góc Ảnh Mới (Link HTTPS hoặc Tải Từ Thiết Bị)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-8 flex space-x-2">
                  <input
                    type="url"
                    placeholder="Dán link ảnh (VD: https://images.unsplash.com/...)"
                    value={managerInputUrl}
                    onChange={(e) => setManagerInputUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddManagerImageUrl();
                      }
                    }}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddManagerImageUrl}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition shrink-0"
                  >
                    + Thêm Link
                  </button>
                </div>

                <div className="sm:col-span-4">
                  <label className="w-full cursor-pointer flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 hover:text-sky-300 rounded-xl text-xs font-semibold transition">
                    <Upload className="w-4 h-4" />
                    <span>Tải tệp từ máy tính</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleManagerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Current Gallery */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-300">
                  Danh Sách Góc Ảnh Hiện Có ({managerImages.length} ảnh):
                </span>
                <span className="text-[11px] text-slate-500">
                  Kéo hoặc bấm "Đặt làm ảnh chính" để thay đổi ảnh bìa
                </span>
              </div>

              {managerImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {managerImages.map((url, idx) => (
                    <div
                      key={idx}
                      className={`relative group rounded-xl overflow-hidden border ${
                        idx === 0
                          ? 'border-red-500 ring-2 ring-red-500/40 bg-red-950/10'
                          : 'border-slate-800 bg-slate-950'
                      } aspect-video flex items-center justify-center`}
                    >
                      <img
                        src={url}
                        alt={`Ảnh góc ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5">
                        {idx === 0 ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-600 text-white shadow">
                            ★ Ảnh Chính
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/75 text-slate-300 backdrop-blur-sm">
                            Góc #{idx + 1}
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 space-y-1.5">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetManagerPrimaryImage(idx)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow transition"
                          >
                            Đặt Làm Ảnh Chính
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveManagerImage(idx)}
                          className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-[11px] font-bold shadow transition flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa ảnh</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-slate-500 text-xs">
                  Chưa có hình ảnh nào. Hãy thêm ít nhất 1 ảnh để đại diện sản phẩm!
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end items-center space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setImageManagerProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSavingImages}
                onClick={handleSaveManagerImages}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-red-900/30"
              >
                {isSavingImages ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang Lưu & Đồng Bộ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lưu Bộ Sưu Tập Ảnh Lên Storefront</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL BÁN TẠI QUẦY (POS CHECKOUT) ================= */}
      {showPosModal && selectedPosSerial && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/40">
                  <Zap className="w-5 h-5 fill-current" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Bán Hàng Tại Quầy (POS) & Kích Hoạt Bảo Hành
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Xuất thiết bị từ kệ trưng bày showroom cho khách. Bảo hành điện tử sẽ được kích hoạt tức thời.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPosModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Device Banner */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                    THIẾT BỊ TRÊN KỆ SHOWROOM
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">{selectedPosSerial.productName}</h4>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center space-x-2">
                    <span className="text-slate-300 font-semibold">{selectedPosSerial.brand}</span>
                    <span>•</span>
                    <span>SKU: {selectedPosSerial.productSku || 'N/A'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Giá Niêm Yết</div>
                  <div className="text-base font-bold text-red-400 font-mono">
                    {(() => {
                      const p = products.find(
                        (item) =>
                          (selectedPosSerial.productSku && item.sku === selectedPosSerial.productSku) ||
                          item.name === selectedPosSerial.productName
                      );
                      const price = selectedPosSerial.price || (p ? p.price : 0);
                      return price.toLocaleString('vi-VN') + ' ₫';
                    })()}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-400">Mã Serial Number:</span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30">
                    {selectedPosSerial.serialNumber}
                  </span>
                </div>
                <div className="text-emerald-400 font-semibold">
                  🛡️ BH {selectedPosSerial.warrantyMonths} Tháng Chính Hãng
                </div>
              </div>
            </div>

            {/* POS Form */}
            <form onSubmit={handleSellAtCounter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Họ & Tên Khách Hàng <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Anh Minh Tuấn"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Số Điện Thoại Nhận Bảo Hành <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0908 123 456"
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Khách dùng SĐT này để tra cứu bảo hành điện tử trên web.
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Hình Thức Thanh Toán Tại Quầy <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('QR_TRANSFER')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      posPaymentMethod === 'QR_TRANSFER'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>Chuyển Khoản QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CASH')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      posPaymentMethod === 'CASH'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Tiền Mặt Quầy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPosPaymentMethod('CARD_POS')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition ${
                      posPaymentMethod === 'CARD_POS'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-sky-400" />
                    <span>Quẹt Thẻ POS</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Ghi Chú Nhân Viên Bàn Giao Thiết Bị
                </label>
                <input
                  type="text"
                  value={posStaffNote}
                  onChange={(e) => setPosStaffNote(e.target.value)}
                  placeholder="VD: Đã dán tem bảo hành, khách kiểm tra máy hoạt động bình thường..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPosModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isPosSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-900/40 transform hover:scale-[1.02]"
                >
                  {isPosSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Kích Hoạt & Xuất Hóa Đơn...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>⚡ Hoàn Tất Bán & Kích Hoạt Bảo Hành</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL HÓA ĐƠN BÁN LẺ & PHIẾU BẢO HÀNH ĐIỆN TỬ (TIN HỌC NGÔI SAO STANDARD) ================= */}
      {showInvoiceModal && invoiceSerial && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-100 animate-in fade-in duration-200">
            {/* Header controls */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Chứng Từ Bán Hàng & Bảo Hành Điện Tử
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-900/30 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Hóa Đơn (Print)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Area */}
            <div className="bg-white text-slate-900 rounded-xl p-6 border border-slate-200 shadow-inner space-y-5 font-sans">
              {/* Store Logo & Header */}
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-red-600 text-white">
                      <Camera className="w-5 h-5" />
                    </span>
                    <span className="text-xl font-black tracking-tight text-slate-900">
                      PRO GEAR <span className="text-red-600 font-extrabold">CAMERA</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                    <strong>CÔNG TY TNHH THƯƠNG MẠI & DỊCH VỤ PRO GEAR VIỆT NAM</strong>
                    <br />
                    Showroom Flagship: 125 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh
                    <br />
                    Hotline Tư vấn & Bảo hành: <strong>1900 8899 - (028) 3822 9999</strong> • Website: <strong>progear.vn</strong>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-[11px] font-mono font-bold text-slate-800">
                    MÃ ĐƠN: {invoiceOrder?.orderNumber || invoiceSerial.orderNumber || 'POS-20261017-0001'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Ngày xuất: {invoiceSerial.soldDate || '17/10/2026'}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-1">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                  HÓA ĐƠN BÁN LẺ & PHIẾU BẢO HÀNH ĐIỆN TỬ
                </h2>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  (Quản lý bảo hành bằng Số Serial Number & Số Điện Thoại — Chuẩn Doanh Nghiệp)
                </p>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="space-y-1">
                  <div>
                    Khách hàng: <strong>{invoiceOrder?.customerName || invoiceSerial.customerName || 'Khách Hàng'}</strong>
                  </div>
                  <div>
                    Số điện thoại BH: <strong className="font-mono text-red-600">{invoiceOrder?.customerPhone || invoiceSerial.customerPhone || '0908 123 456'}</strong>
                  </div>
                </div>
                <div className="space-y-1 text-right sm:text-left">
                  <div>
                    Kênh bán: <strong>{invoiceSerial.soldChannel === 'POS_STORE' ? 'Showroom Trực Tiếp (POS)' : 'Đơn Trực Tuyến Web'}</strong>
                  </div>
                  <div>
                    Phương thức: <strong>{invoiceOrder?.paymentMethod || 'Chuyển khoản VietQR'}</strong>
                  </div>
                </div>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-10">STT</th>
                      <th className="border border-slate-300 p-2">Tên Thiết Bị & Cấu Hình</th>
                      <th className="border border-slate-300 p-2">Mã Serial (SN)</th>
                      <th className="border border-slate-300 p-2 text-center">Thời Hạn BH</th>
                      <th className="border border-slate-300 p-2 text-right">Đơn Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-300 p-2">
                        <div className="font-bold text-slate-900">{invoiceSerial.productName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {invoiceSerial.brand} • {invoiceSerial.productSku || 'SKU-PROGEAR'}
                        </div>
                      </td>
                      <td className="border border-slate-300 p-2 font-mono font-bold text-red-600">
                        {invoiceSerial.serialNumber}
                      </td>
                      <td className="border border-slate-300 p-2 text-center">
                        <span className="font-bold text-emerald-700">{invoiceSerial.warrantyMonths} Tháng</span>
                        <div className="text-[10px] text-slate-500">
                          Đến: <strong>{invoiceSerial.warrantyExpires}</strong>
                        </div>
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono font-bold text-slate-900">
                        {(() => {
                          const p = products.find(
                            (item) =>
                              (invoiceSerial.productSku && item.sku === invoiceSerial.productSku) ||
                              item.name === invoiceSerial.productName
                          );
                          const price = invoiceSerial.price || (p ? p.price : invoiceOrder?.totalAmount || 0);
                          return price.toLocaleString('vi-VN') + ' ₫';
                        })()}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={4} className="border border-slate-300 p-2 text-right uppercase text-[11px]">
                        Tổng Cộng Thanh Toán:
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-mono text-red-600 text-sm">
                        {(() => {
                          const p = products.find(
                            (item) =>
                              (invoiceSerial.productSku && item.sku === invoiceSerial.productSku) ||
                              item.name === invoiceSerial.productName
                          );
                          const price = invoiceSerial.price || (p ? p.price : invoiceOrder?.totalAmount || 0);
                          return price.toLocaleString('vi-VN') + ' ₫';
                        })()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Warranty Policy (Tin Học Ngôi Sao Enterprise Standard) */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] leading-relaxed text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center space-x-1.5 uppercase text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Quy Định & Quyền Lợi Bảo Hành Điện Tử Pro Gear (Chuẩn Tin Học Ngôi Sao):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[10.5px]">
                  <li>
                    <strong>Bảo hành điện tử tự động:</strong> Máy được quản lý bảo hành theo số Serial Number & Số điện thoại khách hàng trên hệ thống. Quý khách không cần giữ hóa đơn giấy, có thể tra cứu hạn bảo hành trực tuyến 24/7 tại <strong>progear.vn/tra-cuu-bao-hanh</strong>.
                  </li>
                  <li>
                    <strong>Chính sách 1 đổi 1 trong 30 ngày:</strong> Đổi mới 100% thiết bị nguyên hộp trong vòng 30 ngày đầu tiên nếu máy phát sinh lỗi phần cứng do nhà sản xuất (cảm biến, mainboard, động cơ gimbal).
                  </li>
                  <li>
                    <strong>Dịch vụ hậu mãi trọn đời:</strong> Miễn phí kiểm tra, khử nấm mốc tia UV, vệ sinh cảm biến (sensor) và cân chỉnh ống kính trọn đời sản phẩm tại Showroom Pro Gear.
                  </li>
                  <li>
                    <strong>Điều kiện từ chối:</strong> Máy rơi vỡ cấn móp biến dạng, ngấm nước/chất lỏng, có dấu hiệu tự ý cạy mở tem niêm phong hoặc can thiệp firmware trái phép.
                  </li>
                </ul>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 pt-6 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-800 uppercase">Khách Hàng</div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5">(Ký và ghi rõ họ tên)</div>
                  <div className="h-14" />
                  <div className="font-semibold text-slate-800">
                    {invoiceOrder?.customerName || invoiceSerial.customerName || 'Khách Hàng'}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-800 uppercase">Đại Diện Pro Gear Camera</div>
                  <div className="text-[10px] text-slate-500 italic mt-0.5">(Đã dán tem bảo hành & kiểm tra máy)</div>
                  <div className="h-14" />
                  <div className="font-semibold text-slate-800">Bộ Phận Kỹ Thuật & Showroom</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Mã Serial: <strong className="text-amber-400 font-mono">{invoiceSerial.serialNumber}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowInvoiceModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL NHẬP MÃ SERIAL KHO ================= */}
      {showAddSerialModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 text-white">
                <span className="p-1.5 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30">
                  <Plus className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-base">Nhập Mã Serial Mới Vào Kệ Showroom</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSerialModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewSerial} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Chọn Thiết Bị Gán Serial</label>
                <select
                  value={newSerialForm.productSku}
                  onChange={(e) => setNewSerialForm({ ...newSerialForm, productSku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.sku}>
                      {p.name} ({p.brand} - {p.price.toLocaleString('vi-VN')} ₫)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  Mã Serial Number (SN) In Trên Máy <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: DJI-M3PRO-2026-9901, SONY-FX3-VN-8811..."
                  value={newSerialForm.serialNumber}
                  onChange={(e) =>
                    setNewSerialForm({ ...newSerialForm, serialNumber: e.target.value.toUpperCase() })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono uppercase"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Serial này sẽ lưu kho trên kệ ở trạng thái CHƯA KÍCH HOẠT.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Thời Hạn Bảo Hành Tiêu Chuẩn</label>
                <select
                  value={newSerialForm.warrantyMonths}
                  onChange={(e) =>
                    setNewSerialForm({ ...newSerialForm, warrantyMonths: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                >
                  <option value={12}>12 Tháng Chính Hãng</option>
                  <option value={24}>24 Tháng Chính Hãng (Khuyên dùng)</option>
                  <option value={36}>36 Tháng Chính Hãng VIP</option>
                </select>
              </div>

              <div className="flex justify-end items-center space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSerialModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1 shadow-lg shadow-red-900/30"
                >
                  <Check className="w-4 h-4" />
                  <span>+ Lưu Serial Vào Kệ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
