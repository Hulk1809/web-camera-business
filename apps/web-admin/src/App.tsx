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
  Cpu,
  Battery,
  Flame,
  QrCode,
  DollarSign,
  Upload,
  X,
  Eye,
  Maximize2
} from 'lucide-react';

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
}

export interface SerialItem {
  id?: string;
  serialNumber: string;
  productName: string;
  productSku?: string;
  brand: string;
  status: string;
  warrantyMonths: number;
  soldDate?: string;
  warrantyExpires?: string;
  orderNumber?: string;
  customerName?: string;
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
];

const DEFAULT_SERIALS: SerialItem[] = [
  {
    serialNumber: 'DJI-M3PRO-2026-8899',
    productName: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes)',
    productSku: 'DJI-MAVIC3-PRO-CINE',
    brand: 'DJI',
    status: 'IN_STOCK',
    warrantyMonths: 24,
    warrantyExpires: '15/03/2028',
  },
  {
    serialNumber: 'SONY-FX3-VN-9901',
    productName: 'Sony Cinema Line FX3 Body Chính Hãng',
    productSku: 'ILME-FX3-BODY',
    brand: 'Sony',
    status: 'SOLD',
    warrantyMonths: 24,
    orderNumber: 'PRO-20261016-8942',
    customerName: 'Đoàn Phim CineArt',
    warrantyExpires: '10/02/2028',
  },
  {
    serialNumber: 'DJI-POCKET3-2026-5521',
    productName: 'DJI Osmo Pocket 3 Creator Combo',
    productSku: 'DJI-POCKET3-CREATOR',
    brand: 'DJI',
    status: 'SOLD',
    warrantyMonths: 12,
    orderNumber: 'PRO-20261015-1109',
    customerName: 'Vlogger Lê Tuấn Anh',
    warrantyExpires: '01/04/2027',
  },
  {
    serialNumber: 'SONY-A7M4-VN-1102',
    productName: 'Sony Alpha 7 IV (A7M4) Body',
    productSku: 'ILCE-7M4-BODY',
    brand: 'Sony',
    status: 'IN_STOCK',
    warrantyMonths: 24,
    warrantyExpires: '20/01/2028',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'warranty' | 'k8s'>('dashboard');

  // Products State
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>('ALL');
  const [isOrdersLoading, setIsOrdersLoading] = useState<boolean>(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Serials State
  const [serials, setSerials] = useState<SerialItem[]>(DEFAULT_SERIALS);
  const [newSerialSn, setNewSerialSn] = useState<string>('');
  const [newSerialProductId, setNewSerialProductId] = useState<string>('');

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
  });

  const [inputImgUrl, setInputImgUrl] = useState<string>('');

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
            }
          }
        }
      }
    } catch (err) {
      console.warn('Backend API offline, keeping local products:', err);
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
    setProducts((prev) =>
      prev.map((p) =>
        p.id === imageManagerProduct.id
          ? { ...p, images: updatedImgs, imageUrl: updatedImgs[0] }
          : p
      )
    );

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

    // Merge backend, shared and default orders (deduplicating by orderNumber)
    const combinedMap = new Map<string, Order>();

    // 1. First add backend orders
    backendOrders.forEach((o) => combinedMap.set(o.orderNumber, o));

    // 2. Add shared orders from storefront
    sharedOrders.forEach((o) => {
      if (!combinedMap.has(o.orderNumber)) {
        combinedMap.set(o.orderNumber, o);
      }
    });

    // 3. Fallback default orders
    DEFAULT_ORDERS.forEach((o) => {
      if (!combinedMap.has(o.orderNumber)) {
        combinedMap.set(o.orderNumber, o);
      }
    });

    const finalOrders = Array.from(combinedMap.values());
    setOrders(finalOrders);
    setIsOrdersLoading(false);
  };

  // Fetch Serials from API
  const fetchSerials = async () => {
    try {
      const res = await fetch('/api/warranty');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSerials(data);
        }
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSerials();

    // Auto polling every 10s to capture new orders from Storefront live
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update Order Status - THÔNG API BACKEND!
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // 1. Update local state immediately
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, orderStatus: newStatus, status: newStatus }
          : o
      )
    );

    // 2. Call backend PATCH /api/orders/:id/status
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('API update order status offline fallback:', err);
    }

    // 3. Update localStorage shared orders
    try {
      const raw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (raw) {
        const list: Order[] = JSON.parse(raw);
        const updated = list.map((o) =>
          o.id === orderId || o.orderNumber === orderId
            ? { ...o, orderStatus: newStatus, status: newStatus }
            : o
        );
        localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
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
    };
    setProducts([newProdItem, ...products]);

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
    });
    setInputImgUrl('');
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
      await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const st = o.orderStatus || o.status || 'PENDING';
    if (selectedOrderStatus === 'ALL') return true;
    return st === selectedOrderStatus;
  });

  // Calculations for Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => (o.orderStatus || o.status) === 'PENDING').length;
  const lowStockCount = products.filter((p) => p.stock <= 3).length;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
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
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            >
              <span>Xem Web Khách Hàng (Port 3000)</span>
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
            </a>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-400 font-semibold">API Đã Kết Nối</span>
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
            <span>Hạ Tầng K8s (AKS)</span>
          </button>
        </div>
      </header>

      {/* ----------------- TAB CONTENTS ----------------- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* ================= 1. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Tổng Doanh Thu</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">{formatVND(totalRevenue)}</div>
                <div className="text-[11px] text-emerald-400 flex items-center space-x-1 mt-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Tăng trưởng 24% so với tuần trước</span>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Tổng Đơn Đặt Hàng</span>
                  <ShoppingBag className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-black text-white">{totalOrdersCount} đơn</div>
                <div className="text-[11px] text-amber-400 mt-1">
                  {pendingOrdersCount} đơn đang chờ duyệt xuất kho
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Thiết Bị Trong Kho</span>
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-black text-white">{products.length} mã sản phẩm</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Sony • DJI • Canon • Fujifilm • BMD
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>Cảnh Báo Tồn Kho</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-400">{lowStockCount} model</div>
                <div className="text-[11px] text-amber-500/80 mt-1">
                  Cần nhập thêm Pocket 3, RS 4 Pro
                </div>
              </div>
            </div>

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
                  onClick={fetchOrders}
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
                  title="Nạp lại bộ dữ liệu chuẩn máy ảnh và DJI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nạp Dữ Liệu Chuẩn (Seed)</span>
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

                <div className="md:col-span-3 lg:col-span-4 pt-1">
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
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {products.map((p) => (
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
                              <div className="font-bold text-white max-w-sm truncate">{p.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-200">{p.brand}</td>
                        <td className="py-3 px-4 text-slate-400">{p.category}</td>
                        <td className="py-3 px-4 font-bold text-amber-400">{formatVND(p.price)}</td>
                        <td className="py-3 px-4 font-mono font-bold">{p.stock}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stock <= 3
                                ? 'bg-amber-900/40 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {p.stock <= 3 ? 'Sắp hết' : 'Đủ hàng'}
                          </span>
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
                    ))}
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
              {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedOrderStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    selectedOrderStatus === st
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {st === 'ALL'
                    ? `Tất Cả (${orders.length})`
                    : st === 'PENDING'
                    ? `Chờ Xác Nhận (${orders.filter((o) => (o.orderStatus || o.status) === 'PENDING').length})`
                    : st === 'CONFIRMED'
                    ? `Đã Xác Nhận (${orders.filter((o) => (o.orderStatus || o.status) === 'CONFIRMED').length})`
                    : st === 'SHIPPING'
                    ? `Đang Giao (${orders.filter((o) => (o.orderStatus || o.status) === 'SHIPPING').length})`
                    : st === 'COMPLETED'
                    ? `Hoàn Tất (${orders.filter((o) => (o.orderStatus || o.status) === 'COMPLETED').length})`
                    : 'Đã Hủy'}
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
                        return (
                          <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-red-400">{ord.orderNumber}</span>
                              <div className="text-[10px] text-slate-500">{ord.createdAt}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-white">{ord.customerName}</div>
                              <div className="text-slate-400">{ord.customerPhone}</div>
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
                            </td>
                            <td className="py-3 px-4 text-right space-x-1">
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
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl text-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-white text-sm flex items-center space-x-2">
                      <ShoppingBag className="w-4 h-4 text-red-500" />
                      <span>Chi Tiết Đơn: {selectedOrderDetails.orderNumber}</span>
                    </h4>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-slate-300">
                    <div>
                      Khách hàng: <strong className="text-white">{selectedOrderDetails.customerName}</strong>
                    </div>
                    <div>
                      Số điện thoại: <strong className="text-white">{selectedOrderDetails.customerPhone}</strong>
                    </div>
                    <div>
                      Địa chỉ nhận: <span className="text-slate-200">{selectedOrderDetails.shippingAddress}</span>
                    </div>
                    <div>
                      Phương thức thanh toán: <strong>{selectedOrderDetails.paymentMethod}</strong>
                    </div>
                    {selectedOrderDetails.note && (
                      <div>
                        Ghi chú khách: <span className="text-amber-400">{selectedOrderDetails.note}</span>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h5 className="font-bold text-slate-300 mb-2">Thiết Bị Khách Đặt Mua:</h5>
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

        {/* ================= 4. QUẢN LÝ MÃ SERIAL & BẢO HÀNH ================= */}
        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <span>Quản Lý Mã Serial Number & Kích Hoạt Bảo Hành</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mỗi thân máy ảnh, flycam DJI và gimbal đều được gán mã Serial duy nhất để chống hàng giả và bảo hành điện tử.
                </p>
              </div>

              <button
                onClick={fetchSerials}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cập Nhật Serial</span>
              </button>
            </div>

            {/* Table of Serials */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Mã Serial Number (SN)</th>
                      <th className="py-3 px-4">Tên Thiết Bị</th>
                      <th className="py-3 px-4">Thương Hiệu</th>
                      <th className="py-3 px-4">Trạng Thái Kho</th>
                      <th className="py-3 px-4">Thời Hạn BH</th>
                      <th className="py-3 px-4">Đơn Hàng Gán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {serials.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">{s.serialNumber}</td>
                        <td className="py-3 px-4 font-bold text-white">{s.productName}</td>
                        <td className="py-3 px-4 font-semibold text-slate-300">{s.brand}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === 'SOLD'
                                ? 'bg-blue-900/40 text-blue-400 border border-blue-500/30'
                                : 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {s.status === 'SOLD' ? 'Đã Xuất Bán' : 'Tồn Kho'}
                          </span>
                        </td>
                        <td className="py-3 px-4">{s.warrantyMonths} tháng</td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {s.orderNumber ? (
                            <span className="text-red-400 font-bold">{s.orderNumber}</span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. HẠ TẦNG KUBERNETES ================= */}
        {activeTab === 'k8s' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Server className="w-5 h-5 text-sky-400" />
                <span>Giám Sát Cụm Kubernetes Azure AKS (k8s-hulk-lab)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Toàn bộ hệ thống Pro Gear Monorepo vận hành trên hạ tầng Microservices Kubernetes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Cụm AKS Cluster</div>
                <div className="text-base font-bold text-white font-mono">k8s-hulk-lab</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2 Worker Nodes (Ubuntu 22.04 LTS)</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Database StatefulSet</div>
                <div className="text-base font-bold text-white font-mono">PostgreSQL 16 + Redis 7</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PVC 20GB Azure Managed Disk CSI</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="text-xs text-slate-400 mb-1">Ingress Routing</div>
                <div className="text-base font-bold text-white font-mono">NGINX Ingress Controller</div>
                <div className="text-[11px] text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Port 80/443 SSL Let's Encrypt</span>
                </div>
              </div>
            </div>

            {/* Pods Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
                Trạng Thái Các Pods Đang Chạy Trong Namespace `camera-business`
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white">backend-api-79b8f-x42kp (2/2)</span>
                  <span className="text-emerald-400 font-bold">Running • Ready</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white">web-store-684c7-nm982 (2/2)</span>
                  <span className="text-emerald-400 font-bold">Running • Ready (Port 3000)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white">web-admin-55d8f-pq210 (2/2)</span>
                  <span className="text-emerald-400 font-bold">Running • Ready (Port 3001)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 flex justify-between items-center border border-slate-800">
                  <span className="text-white">postgres-statefulset-0 (1/1)</span>
                  <span className="text-emerald-400 font-bold">Running • 20GB PVC Mounted</span>
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
    </div>
  );
}

export default App;
