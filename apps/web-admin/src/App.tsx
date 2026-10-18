import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ShieldCheck,
  Server,
  DollarSign,
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
  Upload,
  X,
  Eye,
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
  ShieldAlert,
  ArrowUpRight,
  User,
  Boxes,
  HelpCircle,
  Menu
} from 'lucide-react';
import { EnterpriseKpiRow, formatVND } from './components/EnterpriseKpiRow';
import { EnterpriseToast, type ToastMessage } from './components/EnterpriseToast';

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

export const DEFAULT_PRODUCTS: Product[] = [
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
    ],
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: 'Full-Frame 12.1MP Exmor R',
      video: '4K 120p 10-bit 4:2:2 All-Intra',
      stabilization: 'IBIS 5 trục',
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
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: 'Full-Frame 33MP Exmor R',
      video: '4K 60p 10-bit 4:2:2',
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
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      payload: 'Tải trọng 4.5kg',
      flightTime: '13 giờ pin',
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
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    status: 'LOW_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '1-inch CMOS',
      video: '4K 120fps',
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
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    status: 'OUT_OF_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '45MP Stacked CMOS',
      video: '8K 60p RAW',
    },
  },
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'PRO-20261016-8942',
    customerName: 'Đoàn Phim CineArt Sài Gòn (Anh Minh)',
    customerPhone: '0912 345 678',
    shippingAddress: 'Studio 12, Đường Nguyễn Cơ Thạch, TP. Thủ Đức, TP.HCM',
    totalAmount: 114980000,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '16/10/2026 14:20',
    items: [
      { productName: 'Sony Cinema Line FX3 Body', productSku: 'ILME-FX3-BODY', price: 94990000, quantity: 1, subtotal: 94990000 },
      { productName: 'DJI RS 4 Pro Gimbal Combo', productSku: 'DJI-RS4PRO-COMBO', price: 19990000, quantity: 1, subtotal: 19990000 },
    ],
    itemsCount: 2,
    orderType: 'STANDARD',
  },
  {
    id: 'ord-102',
    orderNumber: 'PRO-20261016-7721',
    customerName: 'Hoàng Quốc Việt (Media Lab)',
    customerPhone: '0988 776 554',
    shippingAddress: 'Số 45 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    totalAmount: 79990000,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '16/10/2026 11:05',
    items: [
      { productName: 'DJI Mavic 3 Pro Cine Combo', productSku: 'DJI-MAVIC3-PRO-CINE', price: 79990000, quantity: 1, subtotal: 79990000 },
    ],
    itemsCount: 1,
    orderType: 'STANDARD',
  },
  {
    id: 'ord-103',
    orderNumber: 'PRE-20261017-9921',
    customerName: 'Đạo diễn Trần Quang Huy (Studio Hà Nội)',
    customerPhone: '0988 991 223',
    shippingAddress: 'Tòa nhà Artemis, Số 3 Lê Trọng Tấn, Thanh Xuân, Hà Nội',
    totalAmount: 189990000,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'PRE_ORDER',
    isPreOrder: true,
    orderType: 'PRE_ORDER',
    staffCallStatus: 'NOT_CALLED',
    createdAt: '17/10/2026 15:40',
    items: [
      { productName: 'Canon EOS R5 Mark II Body', productSku: 'CANON-R5-M2-BODY', price: 104990000, quantity: 1, subtotal: 104990000 },
      { productName: 'DJI Mavic 3 Pro Cine Combo', productSku: 'DJI-MAVIC3-PRO-CINE', price: 79990000, quantity: 1, subtotal: 79990000 },
    ],
    itemsCount: 2,
    note: '[ĐẶT HÀNG CHỜ VỀ - PRE-ORDER] Khách đặt trước Canon R5 II chờ lô nhập khẩu chính hãng.',
  },
  {
    id: 'ord-104',
    orderNumber: 'PRO-20261017-3312',
    customerName: 'Lê Tuấn Anh (Vlogger)',
    customerPhone: '0903 112 233',
    shippingAddress: 'Tòa Landmark 81, Bình Thạnh, TP.HCM',
    totalAmount: 15890000,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'CONFIRMED',
    createdAt: '17/10/2026 16:15',
    items: [
      { productName: 'DJI Osmo Pocket 3 Creator Combo', productSku: 'DJI-POCKET3-CREATOR', price: 15890000, quantity: 1, subtotal: 15890000 },
    ],
    itemsCount: 1,
    orderType: 'STANDARD',
  },
];

export const DEFAULT_SERIALS: SerialItem[] = [
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
    customerName: 'Đoàn Phim CineArt Sài Gòn (Anh Minh)',
    customerPhone: '0912 345 678',
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

export const CATEGORIES_LIST = [
  { name: 'Máy Ảnh Mirrorless & DSLR', desc: 'Sony Alpha, Canon EOS R, Fujifilm X, Nikon Z', icon: Camera },
  { name: 'Máy Quay Điện Ảnh & Cinema', desc: 'Sony Cinema Line, Blackmagic Design, RED', icon: Film },
  { name: 'Flycam & Drone DJI', desc: 'Mavic 3 Pro, Mini 4 Pro, Avata 2, Inspire 3', icon: Video },
  { name: 'Gimbal & Chống Rung DJI Ronin', desc: 'RS 4 Pro, RS 3 Mini, Ronin 4D', icon: Layers },
  { name: 'Action Cam & Pocket Creator', desc: 'Osmo Pocket 3, Action 4, Mic 2', icon: Battery },
  { name: 'Ống Kính Chuyên Dụng (Lenses)', desc: 'Sony G Master, Canon RF, Sigma Art, Tamron', icon: Eye },
  { name: 'Âm Thanh & Ánh Sáng Studio', desc: 'DJI Mic 2, Đèn Nanlite, Godox, Aputure', icon: Sparkles },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'categories' | 'warranty' | 'k8s'>('dashboard');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (t: ToastMessage) => setToast(t);

  // Products State
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
  const [productSearch, setProductSearch] = useState<string>('');
  const [productBrandFilter, setProductBrandFilter] = useState<string>('ALL');
  const [productStatusFilter, setProductStatusFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ORDERS;
  });
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // CSKH Call & Schedule States for Pre-Orders
  const [scheduleDateInput, setScheduleDateInput] = useState<string>('');
  const [staffCallStatusInput, setStaffCallStatusInput] = useState<
    'NOT_CALLED' | 'CALLED_SCHEDULED' | 'STOCK_READY' | 'CANCELLED'
  >('NOT_CALLED');
  const [staffNotesInput, setStaffNotesInput] = useState<string>('');

  // Serials & Warranty Hub State
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
  const [posStaffNote, setPosStaffNote] = useState<string>('Khách mua trực tiếp tại quầy Showroom');
  const [isPosSubmitting, setIsPosSubmitting] = useState<boolean>(false);

  // POS Printable Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceSerial, setInvoiceSerial] = useState<SerialItem | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Form State for Adding Product
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newGear, setNewGear] = useState<{
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: string;
    stock: string;
    imageUrl: string;
    isFeatured: boolean;
  }>({
    name: '',
    sku: '',
    brand: 'Sony',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: '',
    stock: '10',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    isFeatured: false,
  });

  // Fetch Products from Backend API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: Product[] = data.items.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            sku: item.sku,
            brand: item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'DJI'),
            category: item.category?.name || (typeof item.category === 'string' ? item.category : 'Máy Ảnh Mirrorless & DSLR'),
            price: Number(item.price),
            originalPrice: Number(item.originalPrice) || Math.round(Number(item.price) * 1.15),
            stock: Number(item.stockQuantity ?? 10),
            imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
            status: Number(item.stockQuantity ?? 10) <= 0 ? 'OUT_OF_STOCK' : Number(item.stockQuantity ?? 10) <= 3 ? 'LOW_STOCK' : 'IN_STOCK',
            specifications: item.specifications || {},
            isFeatured: item.isFeatured ?? false,
          }));
          setProducts(mapped);
          try {
            localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(mapped));
          } catch {}
        }
      }
    } catch {
      // Backend offline, fallback to local storage
    } finally {
      setIsProductsLoading(false);
    }
  };

  // Fetch Orders from API & Shared Storage
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

    let sharedOrders: Order[] = [];
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (raw) sharedOrders = JSON.parse(raw);
    } catch {}

    const combinedMap = new Map<string, Order>();
    DEFAULT_ORDERS.forEach((o) => combinedMap.set(o.orderNumber, o));
    backendOrders.forEach((o) => {
      combinedMap.set(o.orderNumber, { ...(combinedMap.get(o.orderNumber) || {}), ...o });
    });
    sharedOrders.forEach((o) => {
      combinedMap.set(o.orderNumber, { ...(combinedMap.get(o.orderNumber) || {}), ...o });
    });

    const finalOrders = Array.from(combinedMap.values());
    setOrders(finalOrders);
    setIsOrdersLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 12000);

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
      if (e.key === 'PROGEAR_SHARED_PRODUCTS' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setProducts(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Sync inputs whenever selectedOrderDetails modal is opened
  useEffect(() => {
    if (selectedOrderDetails) {
      setScheduleDateInput(selectedOrderDetails.scheduledDate || '');
      setStaffCallStatusInput(selectedOrderDetails.staffCallStatus || 'NOT_CALLED');
      setStaffNotesInput(selectedOrderDetails.staffNotes || '');
    }
  }, [selectedOrderDetails]);

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    const targetId = targetOrder?.id || orderId;
    const targetOrderNumber = targetOrder?.orderNumber || orderId;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
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
    if (newStatus === 'COMPLETED') {
      const order = targetOrder || orders.find((o) => o.id === orderId || o.orderNumber === orderId);
      if (order) {
        const now = new Date();
        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const dateFormatted = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
        const expDate = new Date(now);
        expDate.setMonth(expDate.getMonth() + 24);
        const expDateFormatted = `${pad(expDate.getDate())}/${pad(expDate.getMonth() + 1)}/${expDate.getFullYear()}`;

        const updatedSerials = serials.map((s) => {
          if (s.orderNumber === order.orderNumber && s.status === 'IN_STOCK') {
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
        setSerials(updatedSerials);
        localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(updatedSerials));
      }
    }

    // Call backend API
    try {
      await fetch(`/api/orders/${targetId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newStatus === 'COMPLETED' ? 'PAID' : undefined,
        }),
      });
    } catch {
      // Handled
    }

    // Persist to shared localStorage
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
    } catch {}
  };

  // Quick Restock Product (+5 / +10)
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
    } catch {}

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã nhập thêm hàng vào kho',
      message: `${product.name}: Nhập +${addQuantity} -> Tồn kho: ${newStock} chiếc`,
    });
  };

  // Toggle Featured / Hàng HOT
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
        ? `"${targetProd?.name}" đã được đưa lên vị trí HÀNG HOT nổi bật nhất Storefront!`
        : `"${targetProd?.name}" đã bỏ khỏi vị trí HÀNG HOT.`,
    });
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Quý khách có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?')) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast({
      id: String(Date.now()),
      type: 'warning',
      title: 'Đã xóa thiết bị',
      message: 'Thiết bị đã được xóa khỏi hệ thống quản trị.',
    });
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Add Product Submit
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGear.name || !newGear.price) return;

    const newProdItem: Product = {
      id: `prod-${Date.now()}`,
      name: newGear.name,
      sku: newGear.sku || `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: newGear.brand,
      category: newGear.category,
      price: Number(newGear.price),
      originalPrice: Number(newGear.price) * 1.15,
      stock: Number(newGear.stock) || 10,
      imageUrl: newGear.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      status: 'IN_STOCK',
      isFeatured: newGear.isFeatured,
    };

    const updatedProdList = [newProdItem, ...products];
    setProducts(updatedProdList);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProdList));
    } catch {}

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdItem.name,
          sku: newProdItem.sku,
          brand: newProdItem.brand,
          category: newProdItem.category,
          price: newProdItem.price,
          stockQuantity: newProdItem.stock,
          imageUrl: newProdItem.imageUrl,
        }),
      });
    } catch {}

    setShowAddProductModal(false);
    setNewGear({
      name: '',
      sku: '',
      brand: 'Sony',
      category: 'Máy Ảnh Mirrorless & DSLR',
      price: '',
      stock: '10',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      isFeatured: false,
    });

    showToast({
      id: String(Date.now()),
      type: 'success',
      title: 'Đã thêm thiết bị mới',
      message: `${newProdItem.name} đã được lưu vào kho thành công.`,
    });
  };

  // POS Sale Checkout
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
    const orderNumber = `POS-${dateStr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const expDate = new Date(now);
    expDate.setMonth(expDate.getMonth() + (selectedPosSerial.warrantyMonths || 24));
    const expDateFormatted = `${pad(expDate.getDate())}/${pad(expDate.getMonth() + 1)}/${expDate.getFullYear()}`;

    let soldPrice = selectedPosSerial.price || 0;
    const matchingProd = products.find(
      (p) => (selectedPosSerial.productSku && p.sku === selectedPosSerial.productSku) || p.name === selectedPosSerial.productName
    );
    if (matchingProd && (!soldPrice || soldPrice === 0)) {
      soldPrice = matchingProd.price;
    }

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

    // Decrement Product Stock
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

    // Create POS Order
    const newPosOrder: Order = {
      id: `pos-${Date.now()}`,
      orderNumber: orderNumber,
      customerName: posCustomerName.trim(),
      customerPhone: posCustomerPhone.trim(),
      shippingAddress: 'Showroom Quầy Trực Tiếp (125 Điện Biên Phủ, P. Đa Kao, Q.1, TP.HCM)',
      totalAmount: soldPrice,
      itemsCount: 1,
      paymentMethod: posPaymentMethod === 'CASH' ? 'Tiền mặt tại quầy' : posPaymentMethod === 'QR_TRANSFER' ? 'Chuyển khoản VietQR' : 'Quẹt thẻ máy POS',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      status: 'DELIVERED',
      orderType: 'POS_QUAY',
      staffCallStatus: 'STOCK_READY',
      createdAt: 'Vừa xong',
      note: `[BÁN TẠI QUẦY POS] ${posStaffNote}. Số Serial: ${selectedPosSerial.serialNumber}`,
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

    setIsPosSubmitting(false);
    setShowPosModal(false);

    setInvoiceSerial(updatedSerial);
    setInvoiceOrder(newPosOrder);
    setShowInvoiceModal(true);

    showToast({
      id: String(Date.now()),
      title: 'Xuất Bán Tại Quầy Thành Công! ⚡',
      message: `Đã kích hoạt BH cho Serial ${selectedPosSerial.serialNumber} (Hạn: ${expDateFormatted}). Đã trừ 1 tồn kho.`,
      type: 'success',
    });
  };

  // Add new Serial Number
  const handleAddNewSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialForm.serialNumber.trim()) return;

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
    const query = orderSearchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      o.orderNumber.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.customerPhone.includes(query);

    let matchStatus = true;
    if (selectedOrderStatus === 'PRE_ORDER') {
      matchStatus = isOrderPreOrder(o);
    } else if (selectedOrderStatus !== 'ALL') {
      matchStatus = st === selectedOrderStatus;
    }

    return matchQuery && matchStatus;
  });

  const preOrdersCount = orders.filter(isOrderPreOrder).length;
  const pendingOrdersCount = orders.filter((o) => (o.orderStatus || o.status) === 'PENDING' || isOrderPreOrder(o)).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const query = productSearch.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    const matchesBrand = productBrandFilter === 'ALL' || p.brand.toLowerCase() === productBrandFilter.toLowerCase();

    let matchesStatus = true;
    if (productStatusFilter === 'IN_STOCK') matchesStatus = (p.stock || 0) > 3;
    else if (productStatusFilter === 'LOW_STOCK') matchesStatus = (p.stock || 0) > 0 && (p.stock || 0) <= 3;
    else if (productStatusFilter === 'OUT_OF_STOCK') matchesStatus = (p.stock || 0) <= 0;

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const lowStockCount = products.filter((p) => (p.stock || 0) <= 3).length;

  // Filtered Serials
  const filteredSerials = serials.filter((s) => {
    const query = serialSearchQuery.trim().toLowerCase();
    const matchQuery =
      query === '' ||
      s.serialNumber.toLowerCase().includes(query) ||
      s.productName.toLowerCase().includes(query) ||
      (s.customerName && s.customerName.toLowerCase().includes(query)) ||
      (s.orderNumber && s.orderNumber.toLowerCase().includes(query));

    let matchTab = true;
    if (serialFilterTab === 'IN_STOCK') matchTab = s.status === 'IN_STOCK';
    else if (serialFilterTab === 'SOLD') matchTab = s.status === 'SOLD';
    else if (serialFilterTab === 'EXPIRED') matchTab = s.status === 'EXPIRED';

    return matchQuery && matchTab;
  });

  const activeWarrantyCount = serials.filter((s) => s.status === 'SOLD').length;
  const totalRevenue = orders
    .filter((o) => o.orderStatus === 'COMPLETED' || o.orderStatus === 'DELIVERED' || o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* ----------------- FIXED LEFT SIDEBAR (SAPO / HARAVAN STYLE) ----------------- */}
      <aside className="w-60 h-screen fixed top-0 left-0 bg-white border-r border-slate-200 flex flex-col justify-between z-30 select-none shadow-sm">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-200 flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm tracking-tight text-slate-900">
                PRO GEAR <span className="text-indigo-600">ADMIN</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wide">
                Hệ Thống Quản Trị Bán Lẻ
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Tổng Quan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'orders'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Đơn Hàng</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'products'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Sản Phẩm & Kho</span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'categories'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Danh Mục Hàng</span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono tabular-nums">7</span>
            </button>

            <button
              onClick={() => setActiveTab('warranty')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'warranty'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'warranty' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Serial & Bảo Hành</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                {activeWarrantyCount} BH
              </span>
            </button>

            <button
              onClick={() => setActiveTab('k8s')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'k8s'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Server className={`w-4 h-4 ${activeTab === 'k8s' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Hạ Tầng & Máy Chủ</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-between transition shadow-2xl"
          >
            <div className="flex items-center space-x-2">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>Xem Web Bán Hàng</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <div className="flex items-center space-x-2.5 px-2 py-1 text-xs text-slate-500">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="truncate flex-1">
              <div className="font-semibold text-slate-800 text-[11px] truncate">Admin Quản Trị</div>
              <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Trực tuyến</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA (OFFSET MARGIN-LEFT 240px) ----------------- */}
      <div className="ml-60 flex-1 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {activeTab === 'dashboard' && 'Tổng Quan Tình Hình Kinh Doanh'}
              {activeTab === 'orders' && 'Quản Lý Đơn Đặt Hàng & Dự Án'}
              {activeTab === 'products' && 'Quản Lý Thiết Bị, Máy Ảnh & Tồn Kho'}
              {activeTab === 'categories' && 'Danh Mục & Phân Loại Sản Phẩm'}
              {activeTab === 'warranty' && 'Quản Lý Serial & Bảo Hành Điện Tử'}
              {activeTab === 'k8s' && 'Giám Sát Hạ Tầng & Cụm Máy Chủ Kubernetes'}
            </h1>
            <p className="text-xs text-slate-500">
              Đồng bộ dữ liệu thời gian thực giữa Web Bán Hàng, Quầy POS & Kho Lưu Trữ.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Quick POS Sale button */}
            <button
              onClick={() => {
                const firstAvailable = serials.find((s) => s.status === 'IN_STOCK');
                if (firstAvailable) {
                  setSelectedPosSerial(firstAvailable);
                  setShowPosModal(true);
                } else {
                  showToast({
                    id: String(Date.now()),
                    type: 'warning',
                    title: 'Hết hàng trên kệ',
                    message: 'Hiện không có mã Serial nào sẵn sàng trên kệ để bán POS.',
                  });
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Bán Tại Quầy (POS)</span>
            </button>

            {activeTab === 'products' && (
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Thiết Bị</span>
              </button>
            )}

            {activeTab === 'warranty' && (
              <button
                onClick={() => setShowAddSerialModal(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nhập Serial Mới</span>
              </button>
            )}

            <button
              onClick={() => {
                fetchProducts();
                fetchOrders();
                showToast({
                  id: String(Date.now()),
                  type: 'info',
                  title: 'Đã làm mới dữ liệu',
                  message: 'Toàn bộ danh sách đơn hàng và kho thiết bị đã được tải mới.',
                });
              }}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6 flex-1">
          {/* COMPACT KPI ROW (DISPLAYED ON DASHBOARD & ORDERS) */}
          {(activeTab === 'dashboard' || activeTab === 'orders') && (
            <EnterpriseKpiRow
              totalRevenue={totalRevenue}
              pendingOrdersCount={pendingOrdersCount}
              preOrdersCount={preOrdersCount}
              lowStockCount={lowStockCount}
              activeWarrantyCount={activeWarrantyCount}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ----------------- TAB: DASHBOARD ----------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              {/* Recent Orders Overview */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    <h2 className="font-bold text-sm text-slate-900">Đơn Đặt Hàng Gần Đây</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <span>Xem tất cả ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-4">Mã Đơn</th>
                        <th className="py-2.5 px-4">Khách Hàng & SĐT</th>
                        <th className="py-2.5 px-4">Tổng Tiền</th>
                        <th className="py-2.5 px-4">Thanh Toán</th>
                        <th className="py-2.5 px-4">Trạng Thái</th>
                        <th className="py-2.5 px-4 text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((order) => {
                        const isPre = isOrderPreOrder(order);
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-4 font-mono font-bold text-indigo-600 tabular-nums">
                              {order.orderNumber}
                            </td>
                            <td className="py-2.5 px-4">
                              <div className="font-medium text-slate-900">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono tabular-nums">{order.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-4 font-bold text-slate-900 font-mono tabular-nums">
                              {formatVND(order.totalAmount)}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className="font-mono text-[11px] text-slate-600">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-2.5 px-4">
                              {isPre ? (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đặt Chờ Về
                                </span>
                              ) : order.orderStatus === 'COMPLETED' || order.status === 'COMPLETED' ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đã Hoàn Tất
                                </span>
                              ) : (
                                <span className="bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đang Xử Lý
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrderDetails(order)}
                                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition"
                              >
                                Chi Tiết
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

          {/* ----------------- TAB: ORDERS (QUẢN LÝ ĐƠN HÀNG) ----------------- */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Filter Bar */}
              <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                {/* Search Input */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo Mã đơn, Tên khách hàng, SĐT..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <button
                    onClick={() => setSelectedOrderStatus('ALL')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      selectedOrderStatus === 'ALL'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Tất Cả ({orders.length})
                  </button>
                  <button
                    onClick={() => setSelectedOrderStatus('PRE_ORDER')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1 ${
                      selectedOrderStatus === 'PRE_ORDER'
                        ? 'bg-amber-600 text-white'
                        : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>Đặt Chờ Về</span>
                    <span className="font-mono text-[10px] tabular-nums">({preOrdersCount})</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderStatus('CONFIRMED')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      selectedOrderStatus === 'CONFIRMED'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Đã Xác Nhận
                  </button>
                  <button
                    onClick={() => setSelectedOrderStatus('COMPLETED')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      selectedOrderStatus === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Hoàn Tất
                  </button>
                  <button
                    onClick={() => setSelectedOrderStatus('CANCELLED')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      selectedOrderStatus === 'CANCELLED'
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Đã Hủy
                  </button>
                </div>
              </div>

              {/* Orders Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Mã Đơn Hàng</th>
                      <th className="py-3 px-4">Khách Hàng & SĐT</th>
                      <th className="py-3 px-4">Địa Chỉ Nhận Hàng</th>
                      <th className="py-3 px-4">Tổng Tiền</th>
                      <th className="py-3 px-4">Thanh Toán</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Không tìm thấy đơn hàng nào phù hợp bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPre = isOrderPreOrder(order);
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-indigo-600 tabular-nums">
                                {order.orderNumber}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">{order.createdAt}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900">{order.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono tabular-nums">{order.customerPhone}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                              {order.shippingAddress || 'Nhận tại quầy Showroom'}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono tabular-nums text-sm">
                              {formatVND(order.totalAmount)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-mono text-[11px] text-slate-700">{order.paymentMethod}</div>
                              <span className={`text-[10px] font-bold ${
                                order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                              }`}>
                                {order.paymentStatus === 'PAID' ? 'Đã Thanh Toán' : 'Chưa Thu Tiền'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {isPre ? (
                                <div>
                                  <span className="bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                    Đặt Chờ Về
                                  </span>
                                  <div className="text-[10px] text-amber-700 mt-0.5">
                                    {order.staffCallStatus === 'CALLED_SCHEDULED'
                                      ? `Đã hẹn: ${order.scheduledDate || 'Chờ giao'}`
                                      : 'Cần gọi khách'}
                                  </div>
                                </div>
                              ) : order.orderStatus === 'COMPLETED' || order.status === 'COMPLETED' ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đã Hoàn Tất
                                </span>
                              ) : order.orderStatus === 'CONFIRMED' ? (
                                <span className="bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đã Xác Nhận
                                </span>
                              ) : order.orderStatus === 'CANCELLED' ? (
                                <span className="bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đã Hủy Đơn
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Chờ Xử Lý
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition"
                                >
                                  Xem
                                </button>

                                {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition shadow-sm"
                                    title="Xác nhận hoàn tất và kích hoạt bảo hành điện tử"
                                  >
                                    Hoàn Tất
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----------------- TAB: PRODUCTS (QUẢN LÝ SẢN PHẨM & TỒN KHO) ----------------- */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Filter Bar */}
              <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo Tên thiết bị, SKU, Brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Status Tabs */}
                  <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                    <button
                      onClick={() => setProductStatusFilter('ALL')}
                      className={`px-3 py-1 font-semibold transition ${
                        productStatusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Tất Cả ({products.length})
                    </button>
                    <button
                      onClick={() => setProductStatusFilter('IN_STOCK')}
                      className={`px-3 py-1 font-semibold transition ${
                        productStatusFilter === 'IN_STOCK' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Còn Hàng
                    </button>
                    <button
                      onClick={() => setProductStatusFilter('LOW_STOCK')}
                      className={`px-3 py-1 font-semibold transition ${
                        productStatusFilter === 'LOW_STOCK' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Sắp Hết ({lowStockCount})
                    </button>
                    <button
                      onClick={() => setProductStatusFilter('OUT_OF_STOCK')}
                      className={`px-3 py-1 font-semibold transition ${
                        productStatusFilter === 'OUT_OF_STOCK' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Hết Hàng
                    </button>
                  </div>

                  {/* Brand select */}
                  <select
                    value={productBrandFilter}
                    onChange={(e) => setProductBrandFilter(e.target.value)}
                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-700 font-semibold focus:outline-none"
                  >
                    <option value="ALL">Tất Cả Hãng</option>
                    <option value="Sony">Sony</option>
                    <option value="DJI">DJI</option>
                    <option value="Canon">Canon</option>
                    <option value="Fujifilm">Fujifilm</option>
                  </select>
                </div>
              </div>

              {/* Products Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4 w-14">Ảnh</th>
                      <th className="py-3 px-4">Tên Thiết Bị & Mã SKU</th>
                      <th className="py-3 px-4">Thương Hiệu & Danh Mục</th>
                      <th className="py-3 px-4">Giá Niêm Yết</th>
                      <th className="py-3 px-4">Tồn Kho</th>
                      <th className="py-3 px-4">Hàng HOT</th>
                      <th className="py-3 px-4 text-right">Nhập Kho / Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-10 h-10 object-contain rounded bg-slate-50 border border-slate-200 p-1"
                          />
                        </td>
                        <td className="py-2.5 px-4 max-w-sm">
                          <div className="font-semibold text-slate-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono font-bold mt-0.5">
                            SKU: {prod.sku}
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="font-semibold text-slate-800">{prod.brand}</span>
                          <div className="text-[11px] text-slate-500">{prod.category}</div>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 font-mono tabular-nums text-sm">
                          {formatVND(prod.price)}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className={`font-mono font-bold tabular-nums text-sm ${
                              (prod.stock || 0) <= 0
                                ? 'text-rose-600'
                                : (prod.stock || 0) <= 3
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}>
                              {prod.stock || 0}
                            </span>
                            <span className="text-[10px] text-slate-400">cái</span>
                          </div>
                          {(prod.stock || 0) <= 0 ? (
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200">
                              Hết Sẵn • Pre-Order
                            </span>
                          ) : (prod.stock || 0) <= 3 ? (
                            <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                              Sắp hết hàng
                            </span>
                          ) : (
                            <span className="text-emerald-600 text-[10px] font-medium">Sẵn hàng</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <button
                            onClick={() => handleToggleFeatured(prod.id)}
                            className={`px-2 py-1 rounded text-[11px] font-bold border transition flex items-center gap-1 ${
                              prod.isFeatured
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <Flame className={`w-3 h-3 ${prod.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                            <span>{prod.isFeatured ? 'Đang Ghim HOT' : 'Ghim HOT'}</span>
                          </button>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleQuickRestock(prod, 5)}
                              className="px-2 py-1 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[10px] transition"
                              title="Nhập thêm +5 máy vào kho"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleQuickRestock(prod, 10)}
                              className="px-2 py-1 rounded border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[10px] transition"
                              title="Nhập thêm +10 máy vào kho"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Xóa thiết bị"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* ----------------- TAB: CATEGORIES (QUẢN LÝ DANH MỤC) ----------------- */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES_LIST.map((cat, idx) => {
                  const Icon = cat.icon;
                  const catProducts = products.filter((p) => p.category === cat.name);
                  const totalStock = catProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
                  const totalVal = catProducts.reduce((sum, p) => sum + p.price * (p.stock || 0), 0);

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:border-indigo-300 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 leading-tight">{cat.name}</h3>
                            <span className="text-[11px] text-slate-500">{catProducts.length} dòng sản phẩm</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-3">{cat.desc}</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">Tồn kho / Giá trị</div>
                          <div className="font-bold text-slate-800 font-mono tabular-nums">
                            {totalStock} máy • {formatVND(totalVal)}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setProductSearch(cat.name);
                            setActiveTab('products');
                          }}
                          className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition"
                        >
                          Xem SP
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ----------------- TAB: WARRANTY & SERIALS ----------------- */}
          {activeTab === 'warranty' && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Filter Bar */}
              <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo Serial SN, Mã đơn, Khách hàng..."
                    value={serialSearchQuery}
                    onChange={(e) => setSerialSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setSerialFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Tất Cả ({serials.length})
                  </button>
                  <button
                    onClick={() => setSerialFilterTab('IN_STOCK')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'IN_STOCK' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Trên Kệ Kho ({serials.filter((s) => s.status === 'IN_STOCK').length})
                  </button>
                  <button
                    onClick={() => setSerialFilterTab('SOLD')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'SOLD' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Đang Bảo Hành ({activeWarrantyCount})
                  </button>
                </div>
              </div>

              {/* Serials Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Số Serial (SN)</th>
                      <th className="py-3 px-4">Tên Thiết Bị & SKU</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4">Khách Hàng / Đơn Hàng</th>
                      <th className="py-3 px-4">Hạn Bảo Hành</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSerials.map((s) => (
                      <tr key={s.serialNumber} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700 text-sm tabular-nums">
                          {s.serialNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{s.productName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">SKU: {s.productSku}</div>
                        </td>
                        <td className="py-3 px-4">
                          {s.status === 'IN_STOCK' ? (
                            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              Trong Kho Trên Kệ
                            </span>
                          ) : (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              Đã Bán • Đang Bảo Hành
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {s.customerName ? (
                            <div>
                              <div className="font-medium text-slate-900">{s.customerName}</div>
                              <div className="text-[11px] text-slate-500 font-mono tabular-nums">{s.orderNumber}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">Chưa gán khách</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {s.warrantyExpires ? (
                            <div className="font-mono text-emerald-700 font-bold tabular-nums">
                              {s.warrantyExpires} ({s.warrantyMonths}T)
                            </div>
                          ) : (
                            <span className="text-slate-500">{s.warrantyMonths} Tháng (Kích hoạt khi bán)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {s.status === 'IN_STOCK' ? (
                            <button
                              onClick={() => {
                                setSelectedPosSerial(s);
                                setShowPosModal(true);
                              }}
                              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition shadow-sm"
                            >
                              Bán POS
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setInvoiceSerial(s);
                                const related = orders.find((o) => o.orderNumber === s.orderNumber) || null;
                                setInvoiceOrder(related);
                                setShowInvoiceModal(true);
                              }}
                              className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition"
                            >
                              Xem Phiếu BH
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ----------------- TAB: SERVER / K8S ----------------- */}
          {activeTab === 'k8s' && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
                <Server className="w-5 h-5" />
                <span>Trạng Thái Cụm Máy Chủ Kubernetes (Azure AKS k8s-hulk-lab)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium">Cluster Name:</div>
                  <div className="font-bold text-slate-900 font-mono">k8s-hulk-lab (Azure)</div>
                  <div className="text-emerald-600 font-semibold">● 100% Sẵn Sàng</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium">PostgreSQL Database:</div>
                  <div className="font-bold text-slate-900 font-mono">camera-postgres:5432</div>
                  <div className="text-emerald-600 font-semibold">● Kết nối ổn định</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-slate-500 font-medium">Public Domain / IP:</div>
                  <div className="font-bold text-slate-900 font-mono">http://74.176.156.158</div>
                  <div className="text-indigo-600 font-semibold">● Port 80 Ingress</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ----------------- ORDER DETAILS & PRINT INVOICE MODAL ----------------- */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full p-5 relative shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Chi Tiết Đơn Hàng {selectedOrderDetails.orderNumber}</h3>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs mb-3">
              <div>Khách hàng: <strong className="text-slate-900">{selectedOrderDetails.customerName}</strong></div>
              <div>SĐT: <strong className="font-mono tabular-nums">{selectedOrderDetails.customerPhone}</strong></div>
              <div>Thanh toán: <strong className="font-mono text-indigo-700">{selectedOrderDetails.paymentMethod}</strong></div>
              <div>Trạng thái: <strong className="text-emerald-700">{selectedOrderDetails.orderStatus}</strong></div>
              <div className="col-span-2 text-slate-600">Địa chỉ: <span>{selectedOrderDetails.shippingAddress}</span></div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="font-bold text-xs text-slate-900">Danh Sách Thiết Bị Trong Đơn:</div>
              {(selectedOrderDetails.items || []).map((itm, idx) => (
                <div key={idx} className="p-2.5 rounded border border-slate-200 flex justify-between items-center text-xs bg-white">
                  <div>
                    <div className="font-semibold text-slate-900">{itm.productName}</div>
                    <div className="text-[11px] text-amber-700 font-mono font-bold">Mã Hàng (SKU): {itm.productSku || 'ILME-FX3-BODY'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 tabular-nums">{formatVND(itm.price)}</div>
                    <div className="text-[11px] text-slate-500">SL: {itm.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-3 border-t border-slate-200 font-bold text-sm">
              <span>Tổng Tiền Đơn Hàng:</span>
              <span className="text-indigo-600 font-mono tabular-nums text-base">{formatVND(selectedOrderDetails.totalAmount)}</span>
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- POS MODAL: COUNTER SALE ----------------- */}
      {showPosModal && selectedPosSerial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-5 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setShowPosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Store className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Xuất Bán Tại Quầy Showroom (POS)</h3>
            </div>

            <form onSubmit={handleSellAtCounter} className="space-y-3 text-xs mt-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">{selectedPosSerial.productName}</div>
                <div className="text-[11px] text-indigo-700 font-mono font-bold mt-0.5">
                  Serial SN: {selectedPosSerial.serialNumber} (SKU: {selectedPosSerial.productSku})
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ tên khách hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="Họ và tên..."
                  value={posCustomerName}
                  onChange={(e) => setPosCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  placeholder="09..."
                  value={posCustomerPhone}
                  onChange={(e) => setPosCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hình thức thanh toán</label>
                <select
                  value={posPaymentMethod}
                  onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                >
                  <option value="QR_TRANSFER">Chuyển khoản VietQR</option>
                  <option value="CASH">Tiền mặt tại quầy</option>
                  <option value="CARD_POS">Quẹt thẻ máy POS</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isPosSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow mt-2"
              >
                {isPosSubmitting ? 'Đang hoàn tất...' : 'Xác Nhận Xuất Bán & Kích Hoạt Bảo Hành'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- INVOICE & WARRANTY CERTIFICATE MODAL ----------------- */}
      {showInvoiceModal && invoiceSerial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full p-6 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3 text-center mb-4">
              <div className="font-black text-lg text-slate-900 tracking-tight">HÓA ĐƠN & PHIẾU BẢO HÀNH ĐIỆN TỬ</div>
              <div className="text-xs text-slate-500">PRO GEAR Vietnam — Chuẩn Tin Học Ngôi Sao</div>
            </div>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mã Đơn / Hóa Đơn:</span>
                <strong className="font-mono text-indigo-700">{invoiceSerial.orderNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Khách Hàng:</span>
                <strong>{invoiceSerial.customerName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Số Điện Thoại:</span>
                <strong className="font-mono">{invoiceSerial.customerPhone}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Thiết Bị:</span>
                <strong>{invoiceSerial.productName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mã Serial (SN):</span>
                <strong className="font-mono text-indigo-700 font-bold">{invoiceSerial.serialNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Hạn Bảo Hành:</span>
                <strong className="font-mono text-emerald-700">{invoiceSerial.warrantyExpires} ({invoiceSerial.warrantyMonths}T)</strong>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow flex items-center justify-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In Hóa Đơn & Phiếu Bảo Hành</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- ADD PRODUCT MODAL ----------------- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-5 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Package className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Thêm Thiết Bị Vào Kho</h3>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs mt-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Sony FX3 Body..."
                  value={newGear.name}
                  onChange={(e) => setNewGear({ ...newGear, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mã SKU</label>
                  <input
                    type="text"
                    placeholder="ILME-FX3..."
                    value={newGear.sku}
                    onChange={(e) => setNewGear({ ...newGear, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    placeholder="94990000"
                    value={newGear.price}
                    onChange={(e) => setNewGear({ ...newGear, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Thương hiệu</label>
                  <select
                    value={newGear.brand}
                    onChange={(e) => setNewGear({ ...newGear, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Sony">Sony</option>
                    <option value="DJI">DJI</option>
                    <option value="Canon">Canon</option>
                    <option value="Fujifilm">Fujifilm</option>
                    <option value="Nikon">Nikon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={newGear.stock}
                    onChange={(e) => setNewGear({ ...newGear, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Link Ảnh Sản Phẩm</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newGear.imageUrl}
                  onChange={(e) => setNewGear({ ...newGear, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow mt-2"
              >
                Lưu Vào Danh Sách Thiết Bị
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- ADD SERIAL MODAL ----------------- */}
      {showAddSerialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-5 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setShowAddSerialModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Nhập Số Serial Mới Vào Kệ Kho</h3>
            </div>

            <form onSubmit={handleAddNewSerial} className="space-y-3 text-xs mt-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Số Serial Number (SN) *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: SONY-FX3-VN-8899..."
                  value={newSerialForm.serialNumber}
                  onChange={(e) => setNewSerialForm({ ...newSerialForm, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sản phẩm gắn Serial</label>
                <select
                  value={newSerialForm.productSku}
                  onChange={(e) => setNewSerialForm({ ...newSerialForm, productSku: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.sku}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Thời hạn bảo hành (Tháng)</label>
                <input
                  type="number"
                  value={newSerialForm.warrantyMonths}
                  onChange={(e) => setNewSerialForm({ ...newSerialForm, warrantyMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow mt-2"
              >
                Lưu Serial Vào Kho Kệ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <EnterpriseToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
