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
  Menu,
  LogOut,
  PackageCheck,
  Edit,
  Image as ImageIcon,
} from 'lucide-react';
import { EnterpriseKpiRow, formatVND } from './components/EnterpriseKpiRow';
import { EnterpriseToast, type ToastMessage } from './components/EnterpriseToast';
import { AdminAdvisorChatView } from './components/AdminAdvisorChatView';
import { StaffAccountSwitcher } from './components/StaffAccountSwitcher';
import { VietQrPaymentBox } from './components/VietQrPaymentBox';
import { AdminRevenueStatementView } from './components/AdminRevenueStatementView';
import { AdminLoginScreen } from './components/AdminLoginScreen';
import { chatSyncService } from './services/chatSyncService';

export interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  stockQuantity?: number;
  imageUrl: string;
  images?: string[];
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  specifications?: any;
  shortDesc?: string;
  description?: string;
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
  bankRef?: string;
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
    stockQuantity: 12,
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
    stockQuantity: 8,
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
    stockQuantity: 18,
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
    stockQuantity: 25,
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
    stock: 30,
    stockQuantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
    ],
    status: 'IN_STOCK',
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
    stock: 6,
    stockQuantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    ],
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '45MP Stacked CMOS',
      video: '8K 60p RAW',
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
    stockQuantity: 20,
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      weight: 'Dưới 249g',
      video: '4K 60fps HDR',
      flightTime: '45 phút',
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
    stockQuantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: 'Full-Frame 6K',
      video: 'Blackmagic RAW 12-bit',
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
    stockQuantity: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '40.2MP X-Trans CMOS 5 HR',
      video: '6.2K 30p',
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
    stockQuantity: 14,
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '24-70mm F2.8 GM II',
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
    stockQuantity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '32-bit Float',
      flightTime: '18 giờ',
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
    stockQuantity: 9,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
    status: 'IN_STOCK',
    isFeatured: false,
    specifications: {
      sensor: '45.7MP Stacked CMOS',
      video: '8.3K 60p N-RAW',
    },
  },
];

export const normalizeAdminProduct = (p: any): Product => {
  if (!p || typeof p !== 'object') {
    return DEFAULT_PRODUCTS[0];
  }
  const defaultMatch = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id || dp.sku === p.sku);

  let finalStock: number;
  if (p.stock !== undefined && p.stock !== null && p.stock !== '') {
    finalStock = Number(p.stock);
  } else if (p.stockQuantity !== undefined && p.stockQuantity !== null && p.stockQuantity !== '') {
    finalStock = Number(p.stockQuantity);
  } else if (defaultMatch && defaultMatch.stock !== undefined) {
    finalStock = defaultMatch.stock;
  } else {
    finalStock = 10;
  }

  if (isNaN(finalStock) || finalStock < 0) {
    finalStock = 0;
  }

  let finalImg = p.imageUrl || defaultMatch?.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
  if (typeof finalImg === 'string' && finalImg.includes('photo-1502982720700-bfff97f2da71')) {
    finalImg = defaultMatch?.imageUrl || 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000';
  }

  const finalStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' =
    finalStock <= 0 ? 'OUT_OF_STOCK' : finalStock <= 3 ? 'LOW_STOCK' : 'IN_STOCK';

  return {
    ...p,
    id: p.id || defaultMatch?.id || `prod-${Date.now()}`,
    name: p.name || defaultMatch?.name || 'Sản phẩm máy ảnh',
    sku: p.sku || defaultMatch?.sku || `SKU-${Date.now()}`,
    brand: (typeof p.brand === 'object' ? p.brand?.name : p.brand) || defaultMatch?.brand || 'Sony',
    category: (typeof p.category === 'object' ? p.category?.name : p.category) || defaultMatch?.category || 'Máy Ảnh Mirrorless & DSLR',
    price: Number(p.price) || defaultMatch?.price || 1000000,
    originalPrice: Number(p.originalPrice) || defaultMatch?.originalPrice || Math.round((Number(p.price) || 1000000) * 1.15),
    stock: finalStock,
    stockQuantity: finalStock,
    imageUrl: finalImg,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [finalImg],
    status: finalStatus,
    specifications: p.specifications || defaultMatch?.specifications || {},
    isFeatured: p.isFeatured ?? defaultMatch?.isFeatured ?? false,
  };
};

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
  {
    id: 'ord-105',
    orderNumber: 'PRO-20261017-8831',
    customerName: 'Studio Nhiếp Ảnh Sài Gòn (Chị Lan)',
    customerPhone: '0977 123 456',
    shippingAddress: '124 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
    totalAmount: 53990000,
    paymentMethod: 'INSTALLMENT_0PCT',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '17/10/2026 17:30',
    items: [
      { productName: 'Sony Alpha 7 IV (A7M4) Body', productSku: 'ILCE-7M4-BODY', price: 53990000, quantity: 1, subtotal: 53990000 },
    ],
    itemsCount: 1,
    orderType: 'STANDARD',
    bankRef: 'MPOS-INST-202610-8831',
  },
  {
    id: 'ord-106',
    orderNumber: 'PRO-20261018-1122',
    customerName: 'Nguyễn Thành Nam (YouTuber Travel)',
    customerPhone: '0934 889 900',
    shippingAddress: 'Chung cư Masteri Thảo Điền, TP. Thủ Đức, TP.HCM',
    totalAmount: 58890000,
    paymentMethod: 'VIETQR',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '18/10/2026 09:15',
    items: [
      { productName: 'Sony FE 24-70mm F2.8 GM II Lens', productSku: 'SEL2470GM2', price: 49990000, quantity: 1, subtotal: 49990000 },
      { productName: 'DJI Mic 2 Wireless Microphone', productSku: 'DJI-MIC2-COMBO', price: 8900000, quantity: 1, subtotal: 8900000 },
    ],
    itemsCount: 2,
    orderType: 'STANDARD',
    bankRef: 'MBB-FT-202610-1122',
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

export const PRESET_GEAR_IMAGES = [
  {
    name: 'Sony FX3 Cinema Line',
    url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    category: 'Máy Quay Điện Ảnh & Cinema',
    brand: 'Sony',
  },
  {
    name: 'Sony Alpha 7 IV (A7M4)',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    category: 'Máy Ảnh Mirrorless & DSLR',
    brand: 'Sony',
  },
  {
    name: 'Canon EOS R5 Mark II',
    url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800',
    category: 'Máy Ảnh Mirrorless & DSLR',
    brand: 'Canon',
  },
  {
    name: 'DJI Mavic 3 Pro Cine',
    url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
    category: 'Flycam & Drone DJI',
    brand: 'DJI',
  },
  {
    name: 'DJI Osmo Pocket 3 Creator',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800',
    category: 'Action Cam & Pocket Creator',
    brand: 'DJI',
  },
  {
    name: 'DJI RS 4 Pro Gimbal Combo',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    category: 'Gimbal & Chống Rung DJI Ronin',
    brand: 'DJI',
  },
  {
    name: 'Fujifilm X-T5 Cổ Điển',
    url: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=800',
    category: 'Máy Ảnh Mirrorless & DSLR',
    brand: 'Fujifilm',
  },
  {
    name: 'Ống Kính Sony FE 24-70mm GM II',
    url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
    category: 'Ống Kính Chuyên Dụng (Lenses)',
    brand: 'Sony',
  },
];

const adminFetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
  return fetch(input, { ...init, credentials: 'include' });
};

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'finance' | 'products' | 'categories' | 'warranty' | 'k8s' | 'chat'>('dashboard');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = (t: ToastMessage) => setToast(t);

  // Enterprise Authentication Guard State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('PROGEAR_ADMIN_LOGGED_IN') === 'true';
    } catch {
      return false;
    }
  });
  const [authenticatedRole, setAuthenticatedRole] = useState<string>(() =>
    sessionStorage.getItem('PROGEAR_ADMIN_ROLE') || '',
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/auth/profile', { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Expired admin session');
        const profile = await response.json();
        if (!['ADMIN', 'STAFF'].includes(profile.role)) throw new Error('Insufficient role');
        setAuthenticatedRole(profile.role);
      })
      .catch(() => {
        sessionStorage.removeItem('PROGEAR_ADMIN_LOGGED_IN');
        sessionStorage.removeItem('PROGEAR_ADMIN_ROLE');
        setIsAuthenticated(false);
        setAuthenticatedRole('');
      });
  }, [isAuthenticated]);

  // Unassigned chat sessions counter
  const [waitingChatCount, setWaitingChatCount] = useState<number>(() => {
    return chatSyncService.getSessions().filter((s) => s.status === 'WAITING').length;
  });

  useEffect(() => {
    const unsub = chatSyncService.subscribe((list) => {
      setWaitingChatCount(list.filter((s) => s.status === 'WAITING').length);
    });
    return () => unsub();
  }, []);

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeAdminProduct);
          localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(normalized));
          return normalized;
        }
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
  const [posSelectedProductId, setPosSelectedProductId] = useState<string>('');
  const [posCustomPrice, setPosCustomPrice] = useState<number>(0);
  const [posQuantity, setPosQuantity] = useState<number>(1);
  const [posSelectedSerialSn, setPosSelectedSerialSn] = useState<string>('');
  const [posCustomSerialInput, setPosCustomSerialInput] = useState<string>('');
  const [selectedPosSerial, setSelectedPosSerial] = useState<SerialItem | null>(null);
  const [posCustomerName, setPosCustomerName] = useState<string>('');
  const [posCustomerPhone, setPosCustomerPhone] = useState<string>('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'QR_TRANSFER' | 'CASH' | 'CARD_POS'>('QR_TRANSFER');
  const [posStaffNote, setPosStaffNote] = useState<string>('Khách mua trực tiếp tại quầy Showroom');
  const [isPosSubmitting, setIsPosSubmitting] = useState<boolean>(false);

  // Helper to open POS with selected product and preloaded unit price
  const openPosModal = (preSelectedProduct?: Product, preSelectedSerial?: SerialItem) => {
    const prod = preSelectedProduct || products[0];
    if (prod) {
      setPosSelectedProductId(prod.id);
      setPosCustomPrice(prod.price || 0);
      setPosQuantity(1);
      if (preSelectedSerial) {
        setSelectedPosSerial(preSelectedSerial);
        setPosSelectedSerialSn(preSelectedSerial.serialNumber);
      } else {
        const avail = serials.filter(
          (s) => (s.productSku === prod.sku || s.productName === prod.name) && s.status === 'IN_STOCK'
        );
        if (avail.length > 0) {
          setSelectedPosSerial(avail[0]);
          setPosSelectedSerialSn(avail[0].serialNumber);
        } else {
          setSelectedPosSerial(null);
          setPosSelectedSerialSn('');
        }
      }
    }
    setPosCustomerName('');
    setPosCustomerPhone('');
    setPosCustomSerialInput('');
    setPosPaymentMethod('QR_TRANSFER');
    setPosStaffNote('Khách mua trực tiếp tại quầy Showroom');
    setShowPosModal(true);
  };

  // POS Printable Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [invoiceSerial, setInvoiceSerial] = useState<SerialItem | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  // Product Form Modal State (Add & Edit with Tech Specs & Images)
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productFormTab, setProductFormTab] = useState<'basic' | 'images' | 'specs' | 'desc'>('basic');
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>('');

  const [productForm, setProductForm] = useState<{
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: string;
    originalPrice: string;
    stock: string;
    imageUrl: string;
    images: string[];
    isFeatured: boolean;
    shortDesc: string;
    description: string;
    specSensor: string;
    specVideo: string;
    specStabilization: string;
    specWeight: string;
    specBattery: string;
    specFeatures: string;
    customSpecs: { key: string; value: string }[];
  }>({
    name: '',
    sku: '',
    brand: 'Sony',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: '',
    originalPrice: '',
    stock: '10',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
    isFeatured: false,
    shortDesc: '',
    description: '',
    specSensor: 'Full-Frame BSI CMOS 33.0 MP',
    specVideo: '4K 60p 10-bit 4:2:2, S-Cinetone',
    specStabilization: 'Chống rung cảm biến IBIS 5 trục 7.0 stops',
    specWeight: '658g',
    specBattery: 'Pin NP-FZ100 (580 ảnh)',
    specFeatures: 'Lấy nét AI Real-time, 2 khe SD/CFexpress',
    customSpecs: [],
  });

  // Fetch Products from Backend API
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const res = await adminFetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: Product[] = data.items.map(normalizeAdminProduct);
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
      const res = await adminFetch('/api/orders?limit=100');
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

  const fetchSerials = async () => {
    try {
      const response = await adminFetch('/api/warranty');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data)) {
        setSerials(data);
        localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(data));
      }
    } catch {
      // Keep the last local snapshot when the backend is temporarily unavailable.
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchProducts();
    fetchOrders();
    fetchSerials();

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
          if (Array.isArray(parsed)) setProducts(parsed.map(normalizeAdminProduct));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated]);

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
      await adminFetch(`/api/orders/${targetId}/status`, {
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
    const currentStock = product.stock ?? (product as any).stockQuantity ?? 0;
    const newStock = Math.max(0, currentStock + addQuantity);
    const updated = products.map((p) =>
      p.id === product.id
        ? {
            ...p,
            stock: newStock,
            stockQuantity: newStock,
            status: (newStock <= 0 ? 'OUT_OF_STOCK' : newStock <= 3 ? 'LOW_STOCK' : 'IN_STOCK') as any,
          }
        : p
    );
    setProducts(updated);
    try {
      localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updated));
    } catch {}

    try {
      await adminFetch(`/api/products/${product.id}`, {
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
      await adminFetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
  };

  // Open Product Modal in Add Mode
  const openAddProductModal = () => {
    setEditingProductId(null);
    setProductFormTab('basic');
    setCustomImageUrlInput('');
    setProductForm({
      name: '',
      sku: '',
      brand: 'Sony',
      category: 'Máy Ảnh Mirrorless & DSLR',
      price: '',
      originalPrice: '',
      stock: '10',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
      isFeatured: false,
      shortDesc: '',
      description: '',
      specSensor: 'Full-Frame BSI CMOS 33.0 MP',
      specVideo: '4K 60p 10-bit 4:2:2, S-Cinetone',
      specStabilization: 'Chống rung cảm biến IBIS 5 trục 7.0 stops',
      specWeight: '658g',
      specBattery: 'Pin NP-FZ100 (580 ảnh)',
      specFeatures: 'Lấy nét AI Real-time, 2 khe SD/CFexpress',
      customSpecs: [],
    });
    setShowAddProductModal(true);
  };

  // Open Product Modal in Edit Mode
  const openEditProductModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductFormTab('basic');
    setCustomImageUrlInput('');
    const specs = prod.specifications || {};

    const standardKeys = new Set(['sensor', 'video', 'stabilization', 'weight', 'battery', 'flightTime', 'payload', 'features']);
    const customSpecsList: { key: string; value: string }[] = [];
    Object.entries(specs).forEach(([k, v]) => {
      if (!standardKeys.has(k) && typeof v === 'string') {
        customSpecsList.push({ key: k, value: v });
      }
    });

    const batteryOrFlight = specs.battery || specs.flightTime || '';
    const featuresStr = Array.isArray(specs.features) ? specs.features.join(', ') : (specs.features || '');

    setProductForm({
      name: prod.name,
      sku: prod.sku,
      brand: prod.brand,
      category: prod.category || 'Máy Ảnh Mirrorless & DSLR',
      price: String(prod.price),
      originalPrice: String(prod.originalPrice || Math.round(prod.price * 1.15)),
      stock: String(prod.stock ?? 10),
      imageUrl: prod.imageUrl,
      images: prod.images && prod.images.length > 0 ? prod.images : [prod.imageUrl],
      isFeatured: !!prod.isFeatured,
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
      specSensor: specs.sensor || (specs.payload ? `Tải trọng: ${specs.payload}` : ''),
      specVideo: specs.video || '',
      specStabilization: specs.stabilization || '',
      specWeight: specs.weight || '',
      specBattery: batteryOrFlight,
      specFeatures: featuresStr,
      customSpecs: customSpecsList,
    });
    setShowAddProductModal(true);
  };

  // Auto-fill standard specs according to category
  const applyCategorySpecPreset = (catName: string) => {
    if (catName.includes('Flycam') || catName.includes('Drone')) {
      setProductForm((prev) => ({
        ...prev,
        category: catName,
        specSensor: 'Hasselblad 4/3 CMOS 20MP + Tele 70mm & 166mm',
        specVideo: 'Apple ProRes 5.1K/50fps, 4K/120fps D-Log M 10-bit',
        specStabilization: 'Gimbal cơ học chống rung 3 trục siêu ổn định',
        specWeight: '958g (Đầy đủ pin và cánh quạt)',
        specBattery: 'Thời gian bay tối đa 43 phút liên tục',
        specFeatures: 'Cảm biến đa hướng APAS 5.0, Truyền sóng O3+ 15km',
      }));
    } else if (catName.includes('Gimbal') || catName.includes('Chống Rung')) {
      setProductForm((prev) => ({
        ...prev,
        category: catName,
        specSensor: 'Tải trọng chịu lực 4.5kg (Khung sợi Carbon)',
        specVideo: 'Hỗ trợ điều khiển lấy nét LiDAR & động cơ Focus Pro',
        specStabilization: 'Thuật toán chống rung thế hệ 4 RS Stabilization',
        specWeight: '1.6kg (Bao gồm trục tháo lắp nhanh)',
        specBattery: 'Pin tích hợp thời lượng 12 giờ, sạc nhanh 18W',
        specFeatures: 'Khóa trục tự động thế hệ 2, Màn hình cảm ứng OLED màu',
      }));
    } else if (catName.includes('Cinema') || catName.includes('Máy Quay')) {
      setProductForm((prev) => ({
        ...prev,
        category: catName,
        specSensor: 'Full-Frame BSI CMOS 12.1MP (Dual Base ISO 800/12800)',
        specVideo: '4K 120p 10-bit 4:2:2, 16-bit RAW output qua HDMI',
        specStabilization: 'Chống rung cảm biến Active Mode + IBIS 5 trục',
        specWeight: '715g (Tích hợp quạt tản nhiệt làm mát chủ động)',
        specBattery: 'Pin NP-FZ100 (Khoảng 135 phút quay liên tục)',
        specFeatures: 'Tay cầm XLR âm thanh 4 kênh, Profile màu điện ảnh S-Cinetone',
      }));
    } else if (catName.includes('Pocket') || catName.includes('Action')) {
      setProductForm((prev) => ({
        ...prev,
        category: catName,
        specSensor: 'Cảm biến CMOS 1-inch ghi hình sắc nét thiếu sáng',
        specVideo: '4K/120fps, D-Log M 10-bit & HLG màu sắc sống động',
        specStabilization: 'Chống rung cơ học 3 trục gimbal thu nhỏ',
        specWeight: '179g (Thiết kế bỏ túi siêu gọn nhẹ)',
        specBattery: 'Pin 1300 mAh, sạc nhanh 80% trong 16 phút',
        specFeatures: 'Màn hình xoay cảm biến 2-inch OLED, ActiveTrack 6.0',
      }));
    } else {
      // Default Camera
      setProductForm((prev) => ({
        ...prev,
        category: catName,
        specSensor: 'Full-Frame BSI CMOS 33.0 MP (Exmor R)',
        specVideo: '4K 60p 10-bit 4:2:2, 4K Super 35, S-Log3/S-Cinetone',
        specStabilization: 'Chống rung cảm biến IBIS 5 trục hiệu quả 7.0 stops',
        specWeight: '658g (Đã bao gồm pin NP-FZ100 và thẻ nhớ)',
        specBattery: 'Pin NP-FZ100 (Chụp khoảng 580 tấm / lần sạc)',
        specFeatures: 'Lấy nét AI Real-time nhận diện người/mắt/động cơ, 2 khe SD/CFexpress',
      }));
    }
  };

  // Image Upload via File Reader
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProductForm((prev) => ({
            ...prev,
            imageUrl: result,
            images: [result, ...prev.images.filter((img) => img !== result)],
          }));
          showToast({
            id: String(Date.now()),
            type: 'success',
            title: 'Tải ảnh thành công! 🖼️',
            message: `Đã nạp ảnh ${file.name} làm ảnh đại diện chính của thiết bị.`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = customImageUrlInput.trim();
    if (!trimmed) return;
    setProductForm((prev) => ({
      ...prev,
      imageUrl: trimmed,
      images: [trimmed, ...prev.images.filter((img) => img !== trimmed)],
    }));
    setCustomImageUrlInput('');
  };

  const handleSelectPresetImage = (url: string) => {
    setProductForm((prev) => ({
      ...prev,
      imageUrl: url,
      images: [url, ...prev.images.filter((img) => img !== url)],
    }));
  };

  const handleRemoveImage = (imgUrl: string) => {
    setProductForm((prev) => {
      const nextImages = prev.images.filter((img) => img !== imgUrl);
      const nextPrimary = prev.imageUrl === imgUrl ? (nextImages[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800') : prev.imageUrl;
      return {
        ...prev,
        imageUrl: nextPrimary,
        images: nextImages.length > 0 ? nextImages : [nextPrimary],
      };
    });
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    // Build specifications object
    const specsObj: Record<string, any> = {};
    if (productForm.specSensor.trim()) specsObj.sensor = productForm.specSensor.trim();
    if (productForm.specVideo.trim()) specsObj.video = productForm.specVideo.trim();
    if (productForm.specStabilization.trim()) specsObj.stabilization = productForm.specStabilization.trim();
    if (productForm.specWeight.trim()) specsObj.weight = productForm.specWeight.trim();
    if (productForm.specBattery.trim()) specsObj.battery = productForm.specBattery.trim();
    if (productForm.specFeatures.trim()) specsObj.features = productForm.specFeatures.trim();

    for (const cs of productForm.customSpecs) {
      if (cs.key.trim() && cs.value.trim()) {
        specsObj[cs.key.trim()] = cs.value.trim();
      }
    }

    const priceNum = Number(productForm.price) || 0;
    const origPriceNum = Number(productForm.originalPrice) || Math.round(priceNum * 1.15);
    const stockNum = Number(productForm.stock) || 0;
    const finalImg = productForm.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
    const finalImages = productForm.images.length > 0 ? productForm.images : [finalImg];

    if (editingProductId) {
      // EDIT EXISTING PRODUCT
      const updatedProdList = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: productForm.name,
            sku: productForm.sku || p.sku,
            brand: productForm.brand,
            category: productForm.category,
            price: priceNum,
            originalPrice: origPriceNum,
            stock: stockNum,
            stockQuantity: stockNum,
            imageUrl: finalImg,
            images: finalImages,
            status: (stockNum > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK') as any,
            isFeatured: productForm.isFeatured,
            shortDesc: productForm.shortDesc || productForm.name,
            description: productForm.description || productForm.shortDesc || '',
            specifications: specsObj,
          };
        }
        return p;
      });

      setProducts(updatedProdList);
      try {
        localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProdList));
        window.dispatchEvent(new CustomEvent('PROGEAR_PRODUCTS_UPDATED', { detail: updatedProdList }));
      } catch {}

      try {
        await adminFetch(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: productForm.name,
            sku: productForm.sku,
            brand: productForm.brand,
            category: productForm.category,
            price: priceNum,
            originalPrice: origPriceNum,
            stockQuantity: stockNum,
            imageUrl: finalImg,
            images: finalImages,
            shortDesc: productForm.shortDesc,
            description: productForm.description,
            specifications: specsObj,
          }),
        });
      } catch {}

      setShowAddProductModal(false);
      setEditingProductId(null);
      showToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Cập Nhật Thiết Bị Thành Công! ⚡',
        message: `${productForm.name} đã được cập nhật thông số và đồng bộ sang Web Bán Hàng.`,
      });
    } else {
      // CREATE NEW PRODUCT
      const newProdItem: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        sku: productForm.sku || `PRO-${Math.floor(1000 + Math.random() * 9000)}`,
        brand: productForm.brand,
        category: productForm.category,
        price: priceNum,
        originalPrice: origPriceNum,
        stock: stockNum,
        stockQuantity: stockNum,
        imageUrl: finalImg,
        images: finalImages,
        status: (stockNum > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK') as any,
        isFeatured: productForm.isFeatured,
        shortDesc: productForm.shortDesc || productForm.name,
        description: productForm.description || productForm.shortDesc || '',
        specifications: specsObj,
      };

      let persistedProduct: Product;
      try {
        const response = await adminFetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newProdItem.name,
            sku: newProdItem.sku,
            brand: newProdItem.brand,
            category: newProdItem.category,
            price: newProdItem.price,
            originalPrice: newProdItem.originalPrice,
            stockQuantity: newProdItem.stock,
            imageUrl: newProdItem.imageUrl,
            images: newProdItem.images,
            shortDesc: newProdItem.shortDesc,
            description: newProdItem.description,
            specifications: specsObj,
          }),
        });
        if (!response.ok) throw new Error('Không thể lưu sản phẩm vào hệ thống');
        persistedProduct = normalizeAdminProduct(await response.json());
      } catch (error) {
        showToast({ id: String(Date.now()), type: 'error', title: 'Thêm thiết bị thất bại',
          message: error instanceof Error ? error.message : 'Vui lòng thử lại.' });
        return;
      }

      const updatedProdList = [persistedProduct, ...products];
      setProducts(updatedProdList);
      try {
        localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updatedProdList));
        window.dispatchEvent(new CustomEvent('PROGEAR_PRODUCTS_UPDATED', { detail: updatedProdList }));
      } catch {}

      setShowAddProductModal(false);
      setEditingProductId(null);
      showToast({
        id: String(Date.now()),
        type: 'success',
        title: 'Thêm Thiết Bị Mới Thành Công! ⚡',
        message: `${newProdItem.name} đã lưu vào kho với đầy đủ thông số kỹ thuật & hình ảnh.`,
      });
    }
  };

  // POS Sale Checkout
  const handleSellAtCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeProduct = products.find((p) => p.id === posSelectedProductId) || products[0];
    if (!activeProduct) {
      showToast({
        id: String(Date.now()),
        type: 'warning',
        title: 'Chưa chọn thiết bị',
        message: 'Vui lòng chọn thiết bị trong kho cần xuất bán tại quầy.',
      });
      return;
    }

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
    expDate.setMonth(expDate.getMonth() + 24);
    const expDateFormatted = `${pad(expDate.getDate())}/${pad(expDate.getMonth() + 1)}/${expDate.getFullYear()}`;

    const unitPrice = posCustomPrice > 0 ? posCustomPrice : activeProduct.price;
    const qty = Math.max(1, posQuantity || 1);
    const totalAmount = unitPrice * qty;

    if (qty !== 1) {
      setIsPosSubmitting(false);
      showToast({
        id: String(Date.now()),
        type: 'warning',
        title: 'Mỗi hóa đơn serial chỉ bán 1 thiết bị',
        message: 'Vui lòng tạo từng hóa đơn để mỗi máy được gắn đúng một serial bảo hành.',
      });
      return;
    }

    // Resolve or generate Serial Item
    let serialSn = posSelectedSerialSn.trim() || posCustomSerialInput.trim();
    if (!serialSn) {
      serialSn = `${activeProduct.sku}-${Date.now().toString().slice(-4)}`;
    }

    let existingSerial = serials.find((s) => s.serialNumber === serialSn);
    try {
      if (!existingSerial) {
        const createSerialResponse = await adminFetch('/api/warranty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: activeProduct.id, serialNumber: serialSn, warrantyMonths: 24 }),
        });
        if (!createSerialResponse.ok) throw new Error('Không thể tạo serial trên hệ thống');
      }

      const saleResponse = await adminFetch('/api/warranty/pos-sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: serialSn,
          customerName: posCustomerName.trim(),
          customerPhone: posCustomerPhone.trim(),
          paymentMethod: posPaymentMethod === 'CASH' ? 'COD' : 'VIETQR',
          price: unitPrice,
          orderNumber,
        }),
      });
      if (!saleResponse.ok) {
        const body = await saleResponse.json().catch(() => null);
        throw new Error(body?.message || 'Không thể ghi nhận giao dịch POS');
      }
    } catch (error) {
      setIsPosSubmitting(false);
      showToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Xuất bán POS thất bại',
        message: error instanceof Error ? error.message : 'Vui lòng thử lại sau.',
      });
      return;
    }

    existingSerial = serials.find((s) => s.serialNumber === serialSn);
    const updatedSerial: SerialItem = existingSerial
      ? {
          ...existingSerial,
          status: 'SOLD',
          soldDate: dateFormatted,
          warrantyExpires: expDateFormatted,
          orderNumber: orderNumber,
          customerName: posCustomerName.trim(),
          customerPhone: posCustomerPhone.trim(),
          soldChannel: 'POS_STORE',
          price: unitPrice,
        }
      : {
          serialNumber: serialSn,
          productName: activeProduct.name,
          productSku: activeProduct.sku,
          brand: activeProduct.brand,
          status: 'SOLD',
          warrantyMonths: 24,
          soldDate: dateFormatted,
          warrantyExpires: expDateFormatted,
          orderNumber: orderNumber,
          customerName: posCustomerName.trim(),
          customerPhone: posCustomerPhone.trim(),
          soldChannel: 'POS_STORE',
          price: unitPrice,
        };

    const updatedSerials = existingSerial
      ? serials.map((s) => (s.serialNumber === serialSn ? updatedSerial : s))
      : [updatedSerial, ...serials];
    setSerials(updatedSerials);
    localStorage.setItem('PROGEAR_SHARED_SERIALS', JSON.stringify(updatedSerials));

    // Decrement Product Stock
    const updatedProducts = products.map((p) => {
      if (p.id === activeProduct.id || p.sku === activeProduct.sku) {
        const currentStock = p.stock ?? (p as any).stockQuantity ?? 0;
        const newStock = Math.max(0, currentStock - qty);
        return {
          ...p,
          stock: newStock,
          stockQuantity: newStock,
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
      totalAmount: totalAmount,
      itemsCount: qty,
      paymentMethod:
        posPaymentMethod === 'CASH'
          ? 'Tiền mặt tại quầy'
          : posPaymentMethod === 'QR_TRANSFER'
          ? 'Chuyển khoản VietQR'
          : 'Quẹt thẻ máy POS',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      status: 'DELIVERED',
      orderType: 'POS_QUAY',
      staffCallStatus: 'STOCK_READY',
      createdAt: 'Vừa xong',
      note: `[BÁN TẠI QUẦY POS] ${posStaffNote}. Số Serial: ${serialSn}`,
      items: [
        {
          productName: activeProduct.name,
          productSku: activeProduct.sku,
          price: unitPrice,
          quantity: qty,
          subtotal: totalAmount,
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
      message: `Đã xuất hóa đơn ${orderNumber} (${formatVND(totalAmount)}) & kích hoạt BH cho Serial ${serialSn}. Đã trừ ${qty} tồn kho.`,
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

  const preOrdersCount = orders.filter(
    (o) => isOrderPreOrder(o) && (o.orderStatus || o.status) !== 'COMPLETED' && (o.orderStatus || o.status) !== 'CANCELLED'
  ).length;
  const pendingOrdersCount = orders.filter((o) => {
    const st = o.orderStatus || o.status || 'PENDING';
    return (st === 'PENDING' || isOrderPreOrder(o)) && st !== 'COMPLETED' && st !== 'CANCELLED';
  }).length;

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
    const currentStock = p.stock ?? (p as any).stockQuantity ?? 0;
    if (productStatusFilter === 'IN_STOCK') matchesStatus = currentStock > 3;
    else if (productStatusFilter === 'LOW_STOCK') matchesStatus = currentStock > 0 && currentStock <= 3;
    else if (productStatusFilter === 'OUT_OF_STOCK') matchesStatus = currentStock <= 0;

    return matchesSearch && matchesBrand && matchesStatus;
  });

  const lowStockCount = products.filter((p) => (p.stock ?? (p as any).stockQuantity ?? 0) <= 3).length;

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

  // If not authenticated, require Admin Login
  if (!isAuthenticated) {
    return (
      <AdminLoginScreen
        onLoginSuccess={(staff) => {
          try {
            sessionStorage.setItem('PROGEAR_ADMIN_LOGGED_IN', 'true');
          } catch {}
          chatSyncService.setActiveStaff(staff);
          setAuthenticatedRole(staff.id === 'admin_root' ? 'ADMIN' : 'STAFF');
          setIsAuthenticated(true);
        }}
      />
    );
  }

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
              data-testid="nav-dashboard"
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
              data-testid="nav-orders"
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
              data-testid="nav-finance"
              onClick={() => setActiveTab('finance')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'finance'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Receipt className={`w-4 h-4 ${activeTab === 'finance' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Doanh Số & Sao Kê</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                Đối Soát
              </span>
            </button>

            <button
              data-testid="nav-products"
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
              data-testid="nav-categories"
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
              data-testid="nav-warranty"
              onClick={() => setActiveTab('warranty')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'warranty'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className={`w-4 h-4 ${activeTab === 'warranty' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Kho Serial & BH Điện Tử</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                {activeWarrantyCount} BH
              </span>
            </button>

            <button
              data-testid="nav-chat"
              onClick={() => setActiveTab('chat')}
              className={`w-full text-left px-3 py-2 rounded-md text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'chat'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <PhoneCall className={`w-4 h-4 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Tư Vấn CSKH (Chat)</span>
              </div>
              {waitingChatCount > 0 ? (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {waitingChatCount} chờ
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              data-testid="nav-k8s"
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
              {activeTab === 'finance' && 'Báo Cáo Doanh Số & Sao Kê Dòng Tiền (Financial Audit)'}
              {activeTab === 'products' && 'Quản Lý Thiết Bị, Máy Ảnh & Tồn Kho'}
              {activeTab === 'categories' && 'Danh Mục & Phân Loại Sản Phẩm'}
              {activeTab === 'warranty' && 'Quản Lý Serial & Bảo Hành Điện Tử (Kho Hàng & Kích Hoạt POS)'}
              {activeTab === 'chat' && 'Trung Tâm Tư Vấn CSKH & Hỗ Trợ Trực Tuyến'}
              {activeTab === 'k8s' && 'Giám Sát Hạ Tầng & Cụm Máy Chủ Kubernetes'}
            </h1>
            <p className="text-xs text-slate-500">
              {activeTab === 'warranty'
                ? 'Định danh Serial Number từng máy, theo dõi tồn kho trên kệ & kích hoạt bảo hành điện tử chính hãng khi xuất bán.'
                : 'Đồng bộ dữ liệu thời gian thực giữa Web Bán Hàng, Quầy POS & Kho Lưu Trữ.'}
            </p>
          </div>

          <div className="flex items-center space-x-2.5 text-xs">
            {/* Multi-Staff Account Switcher */}
            <StaffAccountSwitcher />

            {/* Admin Logout Button */}
            <button
              data-testid="btn-admin-logout"
              onClick={() => {
                try {
                  sessionStorage.removeItem('PROGEAR_ADMIN_LOGGED_IN');
                  sessionStorage.removeItem('PROGEAR_ADMIN_ROLE');
                } catch {}
                setAuthenticatedRole('');
                fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => undefined);
                setIsAuthenticated(false);
              }}
              title="Đăng xuất khỏi cổng quản trị"
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
            {/* Quick POS Sale button */}
            <button
              data-testid="btn-open-pos-header"
              onClick={() => openPosModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Bán Tại Quầy (POS)</span>
            </button>

            {activeTab === 'products' && authenticatedRole === 'ADMIN' && (
              <button
                data-testid="btn-open-add-product"
                onClick={openAddProductModal}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
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
                              {order.orderStatus === 'COMPLETED' || order.status === 'COMPLETED' ? (
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Đã Hoàn Tất</span>
                                </span>
                              ) : isPre ? (
                                <span className="bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px] px-2 py-0.5 rounded">
                                  Đặt Chờ Về
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
                          <tr key={order.id} data-testid="admin-order-row" data-order-number={order.orderNumber} className="hover:bg-slate-50/80 transition-colors">
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
                              {order.orderStatus === 'COMPLETED' || order.status === 'COMPLETED' ? (
                                <div>
                                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Đã Hoàn Tất</span>
                                  </span>
                                  {isPre && (
                                    <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">
                                      Hàng về & Đã giao khách
                                    </div>
                                  )}
                                </div>
                              ) : isPre ? (
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
                                  data-testid="btn-view-order"
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition cursor-pointer"
                                >
                                  Xem
                                </button>

                                {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                                  <button
                                    data-testid={isPre ? "btn-fulfill-preorder" : "btn-complete-order"}
                                    onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                                    className={`px-2.5 py-1 rounded text-white font-semibold text-[11px] transition shadow-sm flex items-center gap-1 cursor-pointer ${
                                      isPre
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white font-bold'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                    title={isPre ? "Hàng đã về kho - Bàn giao khách và kích hoạt bảo hành" : "Xác nhận hoàn tất và kích hoạt bảo hành điện tử"}
                                  >
                                    <PackageCheck className="w-3.5 h-3.5" />
                                    <span>{isPre ? 'Hàng Về - Giao Khách' : 'Hoàn Tất'}</span>
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

          {/* ----------------- TAB: FINANCE & REVENUE STATEMENT (DOANH SỐ & SAO KÊ) ----------------- */}
          {activeTab === 'finance' && (
            <AdminRevenueStatementView
              orders={orders}
              products={products}
              onViewOrder={(ord) => setSelectedOrderDetails(ord)}
              showToast={showToast}
            />
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
                            }}
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
                              (prod.stock ?? (prod as any).stockQuantity ?? 0) <= 0
                                ? 'text-rose-600'
                                : (prod.stock ?? (prod as any).stockQuantity ?? 0) <= 3
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }`}>
                              {prod.stock ?? (prod as any).stockQuantity ?? 0}
                            </span>
                            <span className="text-[10px] text-slate-400">cái</span>
                          </div>
                          {(prod.stock ?? (prod as any).stockQuantity ?? 0) <= 0 ? (
                            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-200">
                              Hết Sẵn • Pre-Order
                            </span>
                          ) : (prod.stock ?? (prod as any).stockQuantity ?? 0) <= 3 ? (
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
                              data-testid={`btn-edit-product-${prod.id}`}
                              onClick={() => openEditProductModal(prod)}
                              className="px-2 py-1 rounded border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Chỉnh sửa thông số kỹ thuật, hình ảnh & giá bán"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
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
                  const totalStock = catProducts.reduce((sum, p) => sum + (p.stock ?? (p as any).stockQuantity ?? 0), 0);
                  const totalVal = catProducts.reduce((sum, p) => sum + p.price * (p.stock ?? (p as any).stockQuantity ?? 0), 0);

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
              {/* Guidance Info Banner for staff */}
              <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-white border-b border-indigo-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-indigo-950">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                      <span>Quy trình quản lý Serial & Kích hoạt bảo hành điện tử:</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Chính Hãng Pro Gear</span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">
                      Mỗi thiết bị trên kệ được cấp một mã SN riêng. Khi bán tại quầy, bấm <strong className="text-indigo-700 font-semibold underline decoration-indigo-300">Xuất Bán POS</strong> để gán vào đơn hàng & tự động kích hoạt bảo hành điện tử cho khách.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Trên Kệ: Chờ bán & kích hoạt</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Đã Bán: Đang hiệu lực BH</span>
                  </span>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo Serial SN, Mã đơn, Khách hàng..."
                    value={serialSearchQuery}
                    onChange={(e) => setSerialSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setSerialFilterTab('ALL')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Tất Cả ({serials.length})
                  </button>
                  <button
                    onClick={() => setSerialFilterTab('IN_STOCK')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'IN_STOCK' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Trên Kệ Chờ Bán ({serials.filter((s) => s.status === 'IN_STOCK').length})
                  </button>
                  <button
                    onClick={() => setSerialFilterTab('SOLD')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition ${
                      serialFilterTab === 'SOLD' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    Đã Bán • Đang Bảo Hành ({activeWarrantyCount})
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
                      <th className="py-3 px-4">Trạng Thái Thiết Bị</th>
                      <th className="py-3 px-4">Khách Hàng / Đơn Hàng</th>
                      <th className="py-3 px-4">Thời Hạn Bảo Hành</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSerials.map((s) => (
                      <tr key={s.serialNumber} data-testid="admin-serial-row" data-serial={s.serialNumber} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-700 text-sm tabular-nums">
                          {s.serialNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{s.productName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">SKU: {s.productSku}</div>
                        </td>
                        <td className="py-3 px-4">
                          {s.status === 'IN_STOCK' ? (
                            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                              Trong Kho Trên Kệ
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                            <span className="text-slate-400 italic text-[11px]">Chưa xuất bán (Chưa gán khách)</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {s.warrantyExpires ? (
                            <div className="font-mono text-emerald-700 font-bold tabular-nums">
                              {s.warrantyExpires} ({s.warrantyMonths}T)
                            </div>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">{s.warrantyMonths} Tháng (Kích hoạt khi bán)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {s.status === 'IN_STOCK' ? (
                            <button
                              data-testid="btn-pos-sell"
                              onClick={() => {
                                const matchProd = products.find((p) => (s.productSku && p.sku === s.productSku) || p.name === s.productName);
                                openPosModal(matchProd, s);
                              }}
                              title="Xuất bán máy này tại quầy POS & tự động kích hoạt bảo hành điện tử"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] transition shadow-xs cursor-pointer active:scale-95"
                            >
                              <Receipt className="w-3 h-3" />
                              <span>Xuất Bán POS</span>
                            </button>
                          ) : (
                            <button
                              data-testid="btn-view-invoice"
                              onClick={() => {
                                setInvoiceSerial(s);
                                const related = orders.find((o) => o.orderNumber === s.orderNumber) || null;
                                setInvoiceOrder(related);
                                setShowInvoiceModal(true);
                              }}
                              title="Xem hóa đơn & chứng nhận bảo hành điện tử chính hãng"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition shadow-2xs cursor-pointer active:scale-95"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Xem Phiếu BH</span>
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

          {/* ----------------- TAB: LIVE ADVISOR CHAT (CSKH TRỰC TUYẾN) ----------------- */}
          {activeTab === 'chat' && <AdminAdvisorChatView />}

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
                  <div className="font-bold text-slate-900 font-mono">https://progear.74.176.156.158.nip.io</div>
                  <div className="text-indigo-600 font-semibold">● Port 80 Ingress</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ----------------- ORDER DETAILS & PRINT INVOICE MODAL ----------------- */}
      {selectedOrderDetails && (() => {
        const isDetailPre = isOrderPreOrder(selectedOrderDetails);
        const isDetailCompleted = selectedOrderDetails.orderStatus === 'COMPLETED' || selectedOrderDetails.status === 'COMPLETED';

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-lg border border-slate-200 max-w-xl w-full p-5 relative shadow-2xl text-slate-900 max-h-[92vh] overflow-y-auto animate-in fade-in duration-150">
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                <ShoppingBag className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">Chi Tiết Đơn Hàng {selectedOrderDetails.orderNumber}</h3>
              </div>

              {/* Pre-Order Pending Alert Banner with Quick Fulfillment Button */}
              {isDetailPre && !isDetailCompleted && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
                  <div>
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Đơn Đặt Hàng Chờ Về (Pre-Order)</span>
                    </div>
                    <div className="text-[11px] text-amber-700 mt-0.5">
                      Khách hàng đang chờ lô thiết bị chính hãng cập cảng / nhập kho Showroom.
                    </div>
                  </div>
                  <button
                    data-testid="btn-modal-fulfill-preorder"
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrderDetails.id, 'COMPLETED');
                      setSelectedOrderDetails((prev) =>
                        prev ? { ...prev, orderStatus: 'COMPLETED', status: 'COMPLETED', paymentStatus: 'PAID' } : null
                      );
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <PackageCheck className="w-4 h-4" />
                    <span>Xác Nhận Hàng Về & Giao Khách</span>
                  </button>
                </div>
              )}

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs mb-3">
                <div>Khách hàng: <strong className="text-slate-900">{selectedOrderDetails.customerName}</strong></div>
                <div>SĐT: <strong className="font-mono tabular-nums">{selectedOrderDetails.customerPhone}</strong></div>
                <div>Thanh toán: <strong className="font-mono text-indigo-700">{selectedOrderDetails.paymentMethod}</strong></div>
                <div>Trạng thái: <strong className={isDetailCompleted ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>
                  {isDetailCompleted ? 'Đã Hoàn Tất (Đã giao khách)' : isDetailPre ? 'Đặt Chờ Về (Chờ Hàng)' : selectedOrderDetails.orderStatus}
                </strong></div>
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

              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Đóng
                </button>

                {!isDetailCompleted && (
                  <button
                    data-testid="btn-modal-complete-order"
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrderDetails.id, 'COMPLETED');
                      setSelectedOrderDetails((prev) =>
                        prev ? { ...prev, orderStatus: 'COMPLETED', status: 'COMPLETED', paymentStatus: 'PAID' } : null
                      );
                    }}
                    className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>Hoàn Tất & Kích Hoạt BH</span>
                  </button>
                )}

                <button
                  data-testid="btn-modal-print-order"
                  onClick={() => {
                    const matchingSerial = serials.find((s) => s.orderNumber === selectedOrderDetails.orderNumber) || {
                      serialNumber: `SN-${selectedOrderDetails.orderNumber}`,
                      productName: selectedOrderDetails.items?.[0]?.productName || 'Thiết bị Pro Gear',
                      brand: 'Sony / DJI / Canon',
                      status: 'SOLD',
                      warrantyMonths: 24,
                      soldDate: selectedOrderDetails.createdAt,
                      warrantyExpires: '24 Tháng Kích Hoạt',
                      orderNumber: selectedOrderDetails.orderNumber,
                      customerName: selectedOrderDetails.customerName,
                      customerPhone: selectedOrderDetails.customerPhone,
                      price: selectedOrderDetails.totalAmount,
                    };
                    setInvoiceSerial(matchingSerial);
                    setInvoiceOrder(selectedOrderDetails);
                    setShowInvoiceModal(true);
                  }}
                  className="px-3 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Hóa Đơn & Biên Bản Bàn Giao</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ----------------- POS MODAL: COUNTER SALE (CÓ GIÁ SẴN, CHỌN SẢN PHẨM & IN BILL) ----------------- */}
      {showPosModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full p-5 relative shadow-2xl text-slate-900 animate-in fade-in">
            <button
              onClick={() => setShowPosModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-indigo-600 mb-2">
              <Store className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Xuất Bán Tại Quầy Showroom (POS)</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Chọn thiết bị trong kho, kiểm tra giá niêm yết, chọn mã Serial và xuất hóa đơn bán lẻ trực tiếp cho khách.
            </p>

            <form onSubmit={handleSellAtCounter} className="space-y-3 text-xs">
              {/* Product Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chọn Thiết Bị Xuất Bán <span className="text-rose-500">*</span>
                </label>
                <select
                  data-testid="select-pos-product"
                  value={posSelectedProductId}
                  onChange={(e) => {
                    const pId = e.target.value;
                    setPosSelectedProductId(pId);
                    const targetP = products.find((p) => p.id === pId);
                    if (targetP) {
                      setPosCustomPrice(targetP.price || 0);
                      const avail = serials.filter(
                        (s) => (s.productSku === targetP.sku || s.productName === targetP.name) && s.status === 'IN_STOCK'
                      );
                      if (avail.length > 0) {
                        setPosSelectedSerialSn(avail[0].serialNumber);
                        setSelectedPosSerial(avail[0]);
                      } else {
                        setPosSelectedSerialSn('');
                        setSelectedPosSerial(null);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 bg-white font-medium text-xs text-slate-900"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatVND(p.price)} (Tồn: {p.stock} chiếc)
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Quantity Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Đơn Giá Bán (VND) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    data-testid="input-pos-price"
                    type="number"
                    required
                    value={posCustomPrice}
                    onChange={(e) => setPosCustomPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono font-bold text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số Lượng <span className="text-rose-500">*</span>
                  </label>
                  <input
                    data-testid="input-pos-quantity"
                    type="number"
                    min="1"
                    required
                    value={posQuantity}
                    onChange={(e) => setPosQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono font-bold text-slate-900 text-xs"
                  />
                </div>
              </div>

              {/* Serial Selector or Custom Input */}
              {(() => {
                const activeProd = products.find((p) => p.id === posSelectedProductId) || products[0];
                const availSerials = serials.filter(
                  (s) => activeProd && (s.productSku === activeProd.sku || s.productName === activeProd.name) && s.status === 'IN_STOCK'
                );
                return (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Mã Serial Thiết Bị (SN trên hộp máy)
                    </label>
                    {availSerials.length > 0 ? (
                      <select
                        data-testid="select-pos-serial"
                        value={posSelectedSerialSn}
                        onChange={(e) => {
                          setPosSelectedSerialSn(e.target.value);
                          const found = serials.find((s) => s.serialNumber === e.target.value);
                          if (found) setSelectedPosSerial(found);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 bg-white font-mono font-bold text-indigo-700 text-xs"
                      >
                        {availSerials.map((s) => (
                          <option key={s.serialNumber} value={s.serialNumber}>
                            Serial SN: {s.serialNumber} ({s.warrantyMonths || 24} Tháng BH)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        data-testid="input-pos-custom-serial"
                        type="text"
                        placeholder="Nhập mã Serial SN trên thân máy..."
                        value={posCustomSerialInput}
                        onChange={(e) => setPosCustomSerialInput(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono font-bold text-indigo-700 text-xs"
                      />
                    )}
                  </div>
                );
              })()}

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Họ tên khách hàng *</label>
                  <input
                    data-testid="input-pos-customer-name"
                    type="text"
                    required
                    placeholder="Nguyễn Văn A..."
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    data-testid="input-pos-customer-phone"
                    type="tel"
                    required
                    placeholder="09..."
                    value={posCustomerPhone}
                    onChange={(e) => setPosCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hình thức thanh toán</label>
                <select
                  data-testid="select-pos-payment-method"
                  value={posPaymentMethod}
                  onChange={(e) => setPosPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                >
                  <option value="QR_TRANSFER">Chuyển khoản VietQR</option>
                  <option value="CASH">Tiền mặt tại quầy</option>
                  <option value="CARD_POS">Quẹt thẻ máy POS</option>
                </select>
              </div>

              {/* Total Summary */}
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-600 font-medium">Tổng Tiền Hóa Đơn:</div>
                  <div className="text-[10px] text-indigo-600 font-semibold">Tự động kích hoạt BH điện tử 24 tháng</div>
                </div>
                <div className="text-right">
                  <div data-testid="pos-total-amount" className="font-mono font-black text-indigo-700 text-base tabular-nums">
                    {formatVND(posCustomPrice * posQuantity)}
                  </div>
                </div>
              </div>

              <button
                data-testid="btn-pos-submit"
                type="submit"
                disabled={isPosSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow mt-2 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{isPosSubmitting ? 'Đang hoàn tất...' : 'Xác Nhận Xuất Bán & In Bill'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- INVOICE & WARRANTY CERTIFICATE MODAL ----------------- */}
      {showInvoiceModal && invoiceSerial && (
        <div data-testid="invoice-modal" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full p-6 relative shadow-2xl text-slate-900">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3 text-center mb-4">
              <div className="font-black text-lg text-slate-900 tracking-tight">HÓA ĐƠN & PHIẾU BẢO HÀNH ĐIỆN TỬ</div>
              <div className="text-xs text-slate-500">PRO GEAR Vietnam — Flagship Camera & Cinema</div>
            </div>

            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mã Đơn / Hóa Đơn:</span>
                <strong data-testid="invoice-order-number" className="font-mono text-indigo-700">{invoiceSerial.orderNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Khách Hàng:</span>
                <strong data-testid="invoice-customer-name">{invoiceSerial.customerName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Số Điện Thoại:</span>
                <strong className="font-mono">{invoiceSerial.customerPhone}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Thiết Bị:</span>
                <strong data-testid="invoice-product-name">{invoiceSerial.productName}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Mã Serial (SN):</span>
                <strong data-testid="invoice-serial-sn" className="font-mono text-indigo-700 font-bold">{invoiceSerial.serialNumber}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Hạn Bảo Hành:</span>
                <strong className="font-mono text-emerald-700">{invoiceSerial.warrantyExpires} ({invoiceSerial.warrantyMonths || 24}T)</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500">Tổng Thanh Toán:</span>
                <strong data-testid="invoice-total-amount" className="font-mono text-indigo-700 text-sm">
                  {formatVND(invoiceOrder?.totalAmount || invoiceSerial.price || 0)}
                </strong>
              </div>
            </div>

            {/* VietQR Payment & Warranty Verification Block */}
            <div className="mb-4">
              <VietQrPaymentBox
                orderNumber={invoiceSerial.orderNumber || 'POS-DEFAULT'}
                amount={invoiceOrder?.totalAmount || invoiceSerial.price || 84900000}
                customerName={invoiceSerial.customerName || 'Khách Mua Tại Quầy'}
                isCompact={true}
              />
            </div>

            <button
              data-testid="btn-print-invoice"
              onClick={() => window.print()}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Hóa Đơn & Phiếu Bảo Hành</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------- PRODUCT FORM MODAL (THÊM MỚI & SỬA THIẾT BỊ) ----------------- */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 relative shadow-2xl text-slate-900 my-8 animate-in fade-in">
            <button
              onClick={() => {
                setShowAddProductModal(false);
                setEditingProductId(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-2.5 text-indigo-600 mb-1">
              <Package className="w-6 h-6" />
              <h3 className="font-bold text-lg text-slate-900">
                {editingProductId ? 'Chỉnh Sửa Thiết Bị & Thông Số Kỹ Thuật' : 'Thêm Thiết Bị Mới Vào Kho Hàng'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Cập nhật thông tin niêm yết, thông số kỹ thuật điện ảnh & bộ sưu tập hình ảnh hiển thị đồng bộ lên Web Bán Hàng.
            </p>

            {/* Tabs Navigation */}
            <div className="flex items-center border-b border-slate-200 mb-4 gap-1 text-xs font-semibold">
              <button
                type="button"
                data-testid="tab-prod-basic"
                onClick={() => setProductFormTab('basic')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  productFormTab === 'basic'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Thông Tin Cơ Bản</span>
              </button>
              <button
                type="button"
                data-testid="tab-prod-images"
                onClick={() => setProductFormTab('images')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  productFormTab === 'images'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Hình Ảnh & Album ({productForm.images.length})</span>
              </button>
              <button
                type="button"
                data-testid="tab-prod-specs"
                onClick={() => setProductFormTab('specs')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  productFormTab === 'specs'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Thông Số Kỹ Thuật (Specs)</span>
              </button>
              <button
                type="button"
                data-testid="tab-prod-desc"
                onClick={() => setProductFormTab('desc')}
                className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  productFormTab === 'desc'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Mô Tả & Ghi Chú</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* TAB 1: BASIC INFO */}
              {productFormTab === 'basic' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tên thiết bị / Sản phẩm <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      data-testid="input-product-name"
                      placeholder="VD: Sony Alpha 7 IV (A7M4) Body..."
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Mã SKU</label>
                      <input
                        type="text"
                        data-testid="input-product-sku"
                        placeholder="ILCE-7M4-BODY..."
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Thương hiệu</label>
                      <select
                        data-testid="select-product-brand"
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 bg-white"
                      >
                        <option value="Sony">Sony</option>
                        <option value="DJI">DJI</option>
                        <option value="Canon">Canon</option>
                        <option value="Fujifilm">Fujifilm</option>
                        <option value="Nikon">Nikon</option>
                        <option value="Blackmagic">Blackmagic Design</option>
                        <option value="RED">RED Digital Cinema</option>
                        <option value="Sigma">Sigma</option>
                        <option value="Tamron">Tamron</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 font-semibold">Danh mục hàng hóa <span className="text-rose-500">*</span></label>
                        <button
                          type="button"
                          onClick={() => applyCategorySpecPreset(productForm.category)}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                          title="Tự động nạp mẫu thông số kỹ thuật chuẩn cho danh mục này"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Gợi ý specs</span>
                        </button>
                      </div>
                      <select
                        data-testid="select-product-category"
                        value={productForm.category}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setProductForm({ ...productForm, category: newCat });
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 bg-white font-medium"
                      >
                        {CATEGORIES_LIST.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Số lượng tồn kho (Chiếc)</label>
                      <input
                        type="number"
                        min="0"
                        data-testid="input-product-stock"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Giá bán niêm yết (VNĐ) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        data-testid="input-product-price"
                        placeholder="53990000"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono font-bold text-indigo-700"
                      />
                      {productForm.price && (
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {formatVND(Number(productForm.price) || 0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Giá thị trường / Giá gốc cũ (VNĐ)
                      </label>
                      <input
                        type="number"
                        data-testid="input-product-original-price"
                        placeholder="62000000"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 font-mono"
                      />
                      {productForm.originalPrice && (
                        <div className="text-[11px] text-slate-400 font-mono line-through mt-0.5">
                          {formatVND(Number(productForm.originalPrice) || 0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        data-testid="checkbox-product-featured"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="font-semibold text-slate-800">
                        Ghim Thiết Bị Nổi Bật (FLAGSHIP / HOT SALE trên Web Bán Hàng)
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setProductFormTab('images')}
                      className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Tiếp: Thêm Hình Ảnh</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGES & ALBUM */}
              {productFormTab === 'images' && (
                <div className="space-y-4">
                  {/* Upload from PC Box */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      1. Tải ảnh từ máy tính lên (Computer Upload)
                    </label>
                    <label
                      htmlFor="product-image-upload"
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-lg bg-indigo-50/40 hover:bg-indigo-50 transition cursor-pointer text-center group"
                    >
                      <Upload className="w-6 h-6 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-slate-800 text-xs">
                        Bấm để chọn file ảnh từ máy tính hoặc kéo thả vào đây
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Hỗ trợ định dạng JPG, PNG, WEBP (Tự động chuyển thành Data URL độ nét cao)
                      </span>
                      <input
                        id="product-image-upload"
                        data-testid="input-upload-file"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>

                  {/* Add URL */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      2. Hoặc dán đường link URL ảnh trực tiếp
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        data-testid="input-product-image-url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={customImageUrlInput}
                        onChange={(e) => setCustomImageUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                      <button
                        type="button"
                        data-testid="btn-add-image-url"
                        onClick={handleAddImageUrl}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md shadow-sm transition cursor-pointer"
                      >
                        Thêm Link Ảnh
                      </button>
                    </div>
                  </div>

                  {/* Preset Image Gallery */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      3. Hoặc chọn nhanh từ thư viện ảnh máy ảnh & flycam mẫu Pro Gear:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {PRESET_GEAR_IMAGES.map((preset) => (
                        <div
                          key={preset.name}
                          data-testid={`preset-img-${preset.brand}`}
                          onClick={() => handleSelectPresetImage(preset.url)}
                          className={`border rounded-lg p-1.5 cursor-pointer transition text-center hover:shadow-md ${
                            productForm.imageUrl === preset.url
                              ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/30'
                              : 'border-slate-200 hover:border-indigo-300 bg-white'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
                            }}
                            className="w-full h-14 object-contain rounded bg-slate-50 mb-1"
                          />
                          <div className="font-semibold text-slate-900 text-[10px] truncate">{preset.name}</div>
                          <div className="text-[9px] text-slate-500 truncate">{preset.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Image Preview & Album */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        <span>Xem trước hình ảnh đại diện trên Web:</span>
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                        ⭐ Ảnh Chính Đại Diện
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div
                        data-testid="product-image-preview"
                        className="w-24 h-24 rounded-lg border border-slate-300 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
                      >
                        <img
                          src={productForm.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'}
                          alt="Preview"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
                          }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 text-xs">
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {productForm.name || 'Chưa đặt tên sản phẩm'}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono break-all line-clamp-2">
                          {productForm.imageUrl}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          ✓ Ảnh sẵn sàng hiển thị tại banner, danh mục & popup chi tiết
                        </div>
                      </div>
                    </div>

                    {/* Album Thumbnails */}
                    {productForm.images.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="text-[11px] font-semibold text-slate-700 mb-1.5">
                          Album ảnh chi tiết ({productForm.images.length} ảnh):
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {productForm.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`relative group shrink-0 w-12 h-12 rounded border p-0.5 bg-white cursor-pointer ${
                                productForm.imageUrl === imgUrl ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'
                              }`}
                              onClick={() => setProductForm({ ...productForm, imageUrl: imgUrl })}
                            >
                              <img
                                src={imgUrl}
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800';
                                }}
                                className="w-full h-full object-contain rounded"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveImage(imgUrl);
                                }}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center text-[9px] opacity-0 group-hover:opacity-100 transition shadow cursor-pointer"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIFICATIONS */}
              {productFormTab === 'specs' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Bảng Thông Số Kỹ Thuật Điện Ảnh</div>
                      <div className="text-[11px] text-slate-500">
                        Thông số sẽ hiển thị trực tiếp trong bảng "THÔNG SỐ KỸ THUẬT NỔI BẬT" trên Web Bán Hàng.
                      </div>
                    </div>
                    <button
                      type="button"
                      data-testid="btn-preset-specs"
                      onClick={() => applyCategorySpecPreset(productForm.category)}
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-[11px] shadow-sm flex items-center gap-1 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Tự Điền Mẫu Theo Danh Mục</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        1. Cảm biến hình ảnh (Sensor)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-sensor"
                        placeholder="VD: Full-Frame BSI CMOS 33.0 MP (Exmor R)..."
                        value={productForm.specSensor}
                        onChange={(e) => setProductForm({ ...productForm, specSensor: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        2. Quay Video & Tốc độ khung hình (Video)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-video"
                        placeholder="VD: 4K 60p 10-bit 4:2:2, Apple ProRes 5.1K..."
                        value={productForm.specVideo}
                        onChange={(e) => setProductForm({ ...productForm, specVideo: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        3. Chống rung hình ảnh (Stabilization)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-stabilization"
                        placeholder="VD: Chống rung IBIS 5 trục 7.0 stops, Gimbal 3 trục..."
                        value={productForm.specStabilization}
                        onChange={(e) => setProductForm({ ...productForm, specStabilization: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        4. Trọng lượng thiết bị (Weight)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-weight"
                        placeholder="VD: 658g (Đã gồm pin & thẻ nhớ)..."
                        value={productForm.specWeight}
                        onChange={(e) => setProductForm({ ...productForm, specWeight: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        5. Pin / Nguồn / Thời gian bay (Battery / Flight Time)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-battery"
                        placeholder="VD: Pin NP-FZ100 (580 ảnh), Bay tối đa 43 phút..."
                        value={productForm.specBattery}
                        onChange={(e) => setProductForm({ ...productForm, specBattery: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        6. Tính năng công nghệ nổi bật (Features)
                      </label>
                      <input
                        type="text"
                        data-testid="input-spec-features"
                        placeholder="VD: Lấy nét AI Real-time, 2 khe SD/CFexpress, Kháng thời tiết..."
                        value={productForm.specFeatures}
                        onChange={(e) => setProductForm({ ...productForm, specFeatures: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                      />
                    </div>
                  </div>

                  {/* Custom Specifications Section */}
                  <div className="pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">
                        Thông số tùy biến bổ sung ({productForm.customSpecs.length})
                      </span>
                      <button
                        type="button"
                        data-testid="btn-add-custom-spec"
                        onClick={() =>
                          setProductForm({
                            ...productForm,
                            customSpecs: [...productForm.customSpecs, { key: '', value: '' }],
                          })
                        }
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm thông số khác</span>
                      </button>
                    </div>

                    {productForm.customSpecs.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        Chưa có thông số tùy biến. Bạn có thể nhấn "Thêm thông số khác" để bổ sung các trường như Màn hình, ISO, Ngàm ống kính...
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {productForm.customSpecs.map((cs, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Tên thông số (VD: Màn hình)"
                              value={cs.key}
                              onChange={(e) => {
                                const copy = [...productForm.customSpecs];
                                copy[idx].key = e.target.value;
                                setProductForm({ ...productForm, customSpecs: copy });
                              }}
                              className="w-1/3 px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Giá trị (VD: 3.0-inch xoay lật 1.44M điểm ảnh)"
                              value={cs.value}
                              onChange={(e) => {
                                const copy = [...productForm.customSpecs];
                                copy[idx].value = e.target.value;
                                setProductForm({ ...productForm, customSpecs: copy });
                              }}
                              className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = productForm.customSpecs.filter((_, i) => i !== idx);
                                setProductForm({ ...productForm, customSpecs: filtered });
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: DESCRIPTION */}
              {productFormTab === 'desc' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Tóm tắt ngắn (Short Description)
                    </label>
                    <textarea
                      rows={2}
                      data-testid="input-product-short-desc"
                      placeholder="VD: Máy ảnh Full-Frame Hybrid đa năng cảm biến 33MP thế hệ mới, bộ xử lý BIONZ XR, lấy nét AI..."
                      value={productForm.shortDesc}
                      onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Mô tả chi tiết điện ảnh (Full Description)
                    </label>
                    <textarea
                      rows={5}
                      data-testid="input-product-full-desc"
                      placeholder="Nhập bài viết giới thiệu chi tiết, công nghệ cảm biến, tính năng quay phim và các phụ kiện đi kèm trong hộp..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProductModal(false);
                    setEditingProductId(null);
                  }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-md text-slate-700 font-semibold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  data-testid="btn-submit-product"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingProductId
                      ? 'Lưu Thay Đổi & Cập Nhật Web Bán Hàng'
                      : 'Lưu Thiết Bị Vào Kho & Đồng Bộ Web Bán Hàng'}
                  </span>
                </button>
              </div>
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
