import React, { useState, useEffect } from 'react';
import {
  Camera,
  Film,
  Video,
  ShieldCheck,
  ShoppingCart,
  Search,
  CheckCircle2,
  X,
  Plus,
  Minus,
  QrCode,
  Truck,
  RotateCcw,
  Headphones,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ExternalLink,
  Flame,
  Zap,
  Info,
  Clock,
  Battery,
  Layers,
  Eye,
  Award,
  Trash2,
  Heart,
  Check,
  Gift,
  Tag,
  PhoneCall,
  Store,
  Barcode,
  BadgeCheck,
  Copy,
  FileText,
  AlertTriangle,
  Menu,
  Sparkles,
  Percent,
  Sliders,
  ChevronDown,
  User
} from 'lucide-react';
import { RetailProductCard, formatVND } from './components/RetailProductCard';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { triggerConfetti } from './utils/confetti';
import { VietQrPaymentBox } from './components/VietQrPaymentBox';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { CustomerChatDrawer } from './components/CustomerChatDrawer';
import { InstallmentModal } from './components/InstallmentModal';
import { TradeInModal } from './components/TradeInModal';
import { CategoryMegaMenu } from './components/CategoryMegaMenu';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerUser } from './types/chat';
import { chatSyncService } from './services/chatSyncService';

export interface ProProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stockQuantity: number;
  stock?: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  imageUrl: string;
  images?: string[];
  shortDesc: string;
  description: string;
  badge?: string;
  specifications: {
    sensor?: string;
    video?: string;
    stabilization?: string;
    flightTime?: string;
    payload?: string;
    weight?: string;
    storage?: string;
    screen?: string;
    [key: string]: any;
  };
}

export interface CartItem {
  product: ProProduct;
  quantity: number;
}

export const DEFAULT_PRODUCTS: ProProduct[] = [
  {
    id: 'prod-dji-m3pro',
    name: 'DJI Mavic 3 Pro Cine Combo - 3 Camera Hasselblad Apple ProRes',
    slug: 'dji-mavic-3-pro-cine-combo',
    sku: 'DJI-MAVIC3-PRO-CINE',
    brand: 'DJI',
    category: 'Flycam & Drone DJI',
    price: 79990000,
    originalPrice: 87500000,
    stockQuantity: 12,
    rating: 5.0,
    reviewsCount: 42,
    isFeatured: true,
    badge: 'FLAGSHIP DRONE',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
    ],
    shortDesc: 'Hệ thống 3 camera quang học Hasselblad 4/3 CMOS 20MP, Tele 70mm & 166mm. Hỗ trợ Apple ProRes 422 HQ.',
    description: 'Đỉnh cao flycam điện ảnh dân dụng thế giới. Tích hợp bộ mã hóa Apple ProRes 422 HQ trên cả 3 camera quang học, SSD 1TB gắn trong, thời gian bay ấn tượng lên tới 43 phút và hệ thống truyền video DJI O3+ 15km.',
    specifications: {
      sensor: 'Hasselblad 4/3 CMOS 20MP + Medium Tele 70mm + Tele 166mm',
      video: 'Apple ProRes 5.1K/50fps, D-Log 10-bit, 4K/120fps slow-mo',
      flightTime: 'Thời gian bay tối đa 43 phút liên tục',
      stabilization: 'Gimbal chống rung cơ học 3 trục siêu ổn định',
      storage: 'Tích hợp sẵn SSD 1TB tốc độ cao bên trong thân máy',
      weight: '958g (Đầy đủ pin và cánh quạt)',
    },
  },
  {
    id: 'prod-sony-fx3',
    name: 'Sony Cinema Line FX3 (ILME-FX3) - Máy quay Full-Frame chuyên nghiệp',
    slug: 'sony-cinema-line-fx3-body',
    sku: 'ILME-FX3-BODY',
    brand: 'Sony',
    category: 'Máy Quay Điện Ảnh & Cinema',
    price: 94990000,
    originalPrice: 102000000,
    stockQuantity: 8,
    rating: 5.0,
    reviewsCount: 38,
    isFeatured: false,
    badge: 'CINEMA LINE',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
    ],
    shortDesc: 'Cảm biến Full-Frame 12.1MP, Dual Base ISO 800/12800, quạt tản nhiệt chủ động không giới hạn thời gian quay.',
    description: 'Máy quay điện ảnh nhỏ gọn được ưa chuộng bậc nhất Hollywood và các đoàn làm phim quảng cáo. Khả năng quay 4K 120p không giới hạn thời gian nhờ hệ thống quạt tản nhiệt chủ động, dải động 15+ stops, S-Cinetone cho tone màu da điện ảnh hoàn hảo.',
    specifications: {
      sensor: 'Full-Frame 12.1 Megapixel Back-Illuminated Exmor R CMOS',
      video: '4K 120p 10-bit 4:2:2 All-Intra, 16-bit RAW qua HDMI',
      stabilization: 'IBIS 5 trục trong thân máy + Active Mode chống rung',
      weight: '715g (Thân máy)',
      storage: '2 khe cắm thẻ CFexpress Type A / SD UHS-II',
      screen: 'Màn hình cảm ứng xoay lật 3.0 inch 1.44 triệu điểm',
    },
  },
  {
    id: 'prod-sony-a7m4',
    name: 'Sony Alpha 7 IV (A7M4) Body - Máy ảnh Full-Frame Hybrid 33MP',
    slug: 'sony-alpha-7-iv-a7m4-body',
    sku: 'ILCE-7M4-BODY',
    brand: 'Sony',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 53990000,
    originalPrice: 59990000,
    stockQuantity: 18,
    rating: 4.9,
    reviewsCount: 56,
    isFeatured: false,
    badge: 'BEST SELLER',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    ],
    shortDesc: 'Cảm biến Exmor R CMOS 33MP Full-Frame, quay 4K 60p 10-bit 4:2:2, lấy nét theo mắt Real-time Eye-AF đỉnh cao.',
    description: 'Sony Alpha 7 IV là chuẩn mực máy ảnh hybrid cho nhiếp ảnh gia và nhà sáng tạo video hiện đại. Trang bị chip xử lý hình ảnh BIONZ XR thế hệ mới, bộ lọc màu S-Cinetone kế thừa từ dòng Cinema cao cấp, chống rung thân máy IBIS 5.5 stops.',
    specifications: {
      sensor: 'Full-Frame 33.0 Megapixel Exmor R BSI CMOS',
      video: '4K 60p (Super 35) & 4K 30p 7K oversampled 10-bit 4:2:2',
      stabilization: 'Chống rung cảm biến IBIS 5 trục 5.5 stops',
      weight: '658g (Kèm pin)',
      storage: '2 khe cắm CFexpress Type A / SD UHS-II',
    },
  },
  {
    id: 'prod-dji-rs4pro',
    name: 'DJI RS 4 Pro Gimbal Combo - Tay cầm chống rung tải trọng 4.5kg',
    slug: 'dji-rs-4-pro-gimbal-combo',
    sku: 'DJI-RS4-PRO-COMBO',
    brand: 'DJI',
    category: 'Gimbal & Chống Rung DJI Ronin',
    price: 19990000,
    originalPrice: 22500000,
    stockQuantity: 25,
    rating: 5.0,
    reviewsCount: 29,
    isFeatured: false,
    badge: 'RONIN PRO',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
    images: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
      'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1000',
    ],
    shortDesc: 'Cần trục sợi Carbon thế hệ 2, thuật toán chống rung RS 4th Gen, hỗ trợ Focus Pro LiDAR 76.800 điểm.',
    description: 'Hệ thống gimbal flagship phục vụ quay phim điện ảnh. Trang bị cánh tay trục sợi carbon siêu cứng chịu tải 4.5kg, tương thích với hầu hết máy quay cinema FX6, RED Komodo, Canon C70 cùng ống kính nặng. Hệ thống khóa trục tự động 2nd Gen khởi động quay tức thì trong 1 giây.',
    specifications: {
      payload: 'Tải trọng 4.5kg (Khung carbon siêu cứng)',
      flightTime: 'Thời lượng pin 13 tiếng hoạt động liên tục',
      stabilization: 'Thuật toán chống rung RS 4th Gen tối ưu góc nghiêng cao',
      weight: '1.6kg (Bao gồm tay cầm và pin)',
    },
  },
  {
    id: 'prod-dji-pocket3',
    name: 'DJI Osmo Pocket 3 Creator Combo - Camera Vlogging Cảm biến 1-inch',
    slug: 'dji-osmo-pocket-3-creator-combo',
    sku: 'DJI-POCKET3-CREATOR',
    brand: 'DJI',
    category: 'Action Cam & Pocket Creator',
    price: 15890000,
    originalPrice: 17900000,
    stockQuantity: 30,
    rating: 5.0,
    reviewsCount: 84,
    isFeatured: false,
    badge: 'HOT CREATOR',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
    ],
    shortDesc: 'Cảm biến 1-inch CMOS, quay 4K 120fps, màn hình OLED xoay 2 inch, chống rung cơ học 3 trục, kèm Mic 2.',
    description: 'Camera sáng tạo nội dung bỏ túi bán chạy nhất thế giới. Cảm biến 1-inch cho chất lượng hình ảnh đêm xuất sắc, màu 10-bit D-Log M, lấy nét thần tốc full-pixel, theo dõi khuôn mặt ActiveTrack 6.0, combo bao gồm bộ phát không dây DJI Mic 2 và tay cầm pin phụ.',
    specifications: {
      sensor: '1-inch CMOS độ phân giải cao thu sáng tối ưu ban đêm',
      video: '4K 120fps Slow-mo, 4K 60fps HDR, 10-bit D-Log M & HLG',
      stabilization: 'Chống rung cơ học 3 trục thực thụ (không giật hình)',
      weight: 'Chỉ 179g bỏ túi siêu nhẹ',
    },
  },
  {
    id: 'prod-canon-r5m2',
    name: 'Canon EOS R5 Mark II Body - 45MP Stacked CMOS & 8K 60p RAW',
    slug: 'canon-eos-r5-mark-ii-body',
    sku: 'CANON-R5-M2-BODY',
    brand: 'Canon',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 104990000,
    originalPrice: 115000000,
    stockQuantity: 6,
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: false,
    badge: '8K CINEMA',
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    ],
    shortDesc: 'Cảm biến xếp chồng 45MP BSI, chip kép DIGIC Accelerator + DIGIC X, quay 8K 60p RAW nội bộ, Eye Control AF thế hệ mới.',
    description: 'Cỗ máy đỉnh cao của Canon cho các nhiếp ảnh gia thương mại và thể thao. Khả năng chụp liên tiếp 30fps không chớp đen, lấy nét điều khiển bằng mắt người chụp Eye Control AF chuẩn xác, chống rung phối hợp thân máy và ống kính lên tới 8.5 stops.',
    specifications: {
      sensor: '45.0 Megapixel Back-Illuminated Stacked Full-Frame CMOS',
      video: '8K 60p RAW / 4K 120p 10-bit Canon Log 2/3 & HDR-HLG',
      stabilization: 'IBIS chống rung 5 trục hiệu quả tới 8.5 stops',
      weight: '746g (Kèm pin LP-E6P)',
    },
  },
  {
    id: 'prod-dji-mini4pro',
    name: 'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2) - Dưới 249g',
    slug: 'dji-mini-4-pro-fly-more-combo-plus',
    sku: 'DJI-MINI4-PRO-RC2',
    brand: 'DJI',
    category: 'Flycam & Drone DJI',
    price: 24890000,
    originalPrice: 27900000,
    stockQuantity: 20,
    rating: 4.9,
    reviewsCount: 48,
    isFeatured: false,
    badge: 'UNDER 249G',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
    images: [
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1000',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1000',
    ],
    shortDesc: 'Trọng lượng siêu nhẹ dưới 249g, cảm biến chướng ngại vật đa hướng 360°, quay 4K 60p HDR dọc chân thực.',
    description: 'Flycam mini mạnh mẽ nhất hiện nay. Không cần đăng ký giấy phép bay khắt khe tại nhiều quốc gia nhờ trọng lượng dưới 249g, trang bị cảm biến va chạm 360 độ, camera xoay dọc 90 độ vật lý hoàn hảo cho video TikTok/Reels chất lượng cao.',
    specifications: {
      weight: 'Dưới 249g siêu nhẹ bỏ vừa túi áo khoác',
      video: '4K 60fps HDR, 4K 100fps Slow-mo, 10-bit D-Log M & HLG',
      flightTime: '45 phút với pin Intelligent Flight Battery Plus',
    },
  },
  {
    id: 'prod-bmd-cinema6k',
    name: 'Blackmagic Cinema Camera 6K (Full-Frame L-Mount)',
    slug: 'blackmagic-cinema-camera-6k-fullframe',
    sku: 'BMD-CINEMA-6K-FF',
    brand: 'Blackmagic Design',
    category: 'Máy Quay Điện Ảnh & Cinema',
    price: 62500000,
    originalPrice: 68000000,
    stockQuantity: 10,
    rating: 4.9,
    reviewsCount: 22,
    isFeatured: false,
    badge: 'BLACKMAGIC RAW',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    images: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000',
    ],
    shortDesc: 'Cảm biến Full-Frame 6K 6048x4032, dải tương phản 13 stops, ngàm L-Mount, màn hình cảm ứng HDR 5 inch 1500 nits.',
    description: 'Máy quay điện ảnh thế hệ mới nhất từ Blackmagic Design với cảm biến Full-Frame 6K sắc nét kinh ngạc, ghi hình Blackmagic RAW 12-bit vào thẻ CFexpress B hoặc ổ cứng SSD ngoài qua cổng USB-C, kèm phần mềm DaVinci Resolve Studio bản quyền.',
    specifications: {
      sensor: 'Full-Frame 6K (6048 x 4032) Open Gate 3:2',
      video: '6K 36fps Open Gate, 6K 48fps 17:9, Blackmagic RAW 12-bit',
      screen: 'Màn hình cảm ứng nghiêng 5.0 inch 1500 nits siêu sáng',
      weight: '1.2kg (Thân máy)',
    },
  },
  {
    id: 'prod-fuji-xt5',
    name: 'Fujifilm X-T5 Body (Silver) - 40.2MP Cảm biến X-Trans CMOS 5 HR',
    slug: 'fujifilm-x-t5-body-silver',
    sku: 'FUJI-XT5-BODY-SILVER',
    brand: 'Fujifilm',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 41900000,
    originalPrice: 45900000,
    stockQuantity: 15,
    rating: 4.9,
    reviewsCount: 34,
    isFeatured: false,
    badge: 'FILM SIMULATION',
    imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
    ],
    shortDesc: 'Độ phân giải 40.2MP siêu nét, 19 chế độ giả lập màu phim Film Simulation, quay 6.2K 30p, thiết kế hoài cổ đẳng cấp.',
    description: 'Mẫu máy ảnh hoài cổ biểu tượng được giới nhiếp ảnh đường phố và du lịch mê đắm. Vòng xoay cơ học kim loại sang trọng, cảm biến APS-C 40.2MP cao nhất từ trước đến nay của Fujifilm, thuật toán lấy nét tự động siêu nhanh nhận diện chủ thể động vật, xe cộ, chim chóc.',
    specifications: {
      sensor: '40.2 Megapixel APS-C X-Trans CMOS 5 HR',
      video: '6.2K 30p 4:2:2 10-bit nội bộ, 4K HQ 60p oversampled',
      stabilization: 'IBIS chống rung cảm biến 5 trục lên tới 7.0 stops',
      weight: '557g (Kèm pin)',
    },
  },
  {
    id: 'prod-sony-2470gm2',
    name: 'Ống kính Sony FE 24-70mm F2.8 GM II (SEL2470GM2)',
    slug: 'sony-fe-24-70mm-f2-8-gm-ii',
    sku: 'SEL2470GM2',
    brand: 'Sony',
    category: 'Ống Kính Chuyên Dụng (Lenses)',
    price: 49990000,
    originalPrice: 54900000,
    stockQuantity: 14,
    rating: 5.0,
    reviewsCount: 31,
    isFeatured: false,
    badge: 'G MASTER',
    imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1000',
    images: [
      'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
    ],
    shortDesc: 'Ống kính tiêu chuẩn G Master thế hệ II nhẹ nhất thế giới, khẩu độ F2.8 toàn dải, 4 động cơ lấy nét XD Linear.',
    description: 'Ống kính zoom đa dụng số 1 cho các nhiếp ảnh gia và nhà quay phim chuyên nghiệp. Nhẹ hơn 22% so với đời 1, độ sắc nét vượt trội từ tâm đến rìa ảnh, bokeh tròn mịn với 11 lá khẩu, vòng chỉnh khẩu độ có nấc gạt de-click mượt mà cho quay phim.',
    specifications: {
      sensor: 'Tiêu cự 24-70mm Full-Frame ngàm E-Mount',
      weight: 'Chỉ 695g, nhẹ nhất thế giới trong dòng 24-70 F2.8',
    },
  },
  {
    id: 'prod-dji-mic2',
    name: 'Bộ Micro Thu Âm Không Dây DJI Mic 2 (2 TX + 1 RX + Hộp sạc)',
    slug: 'dji-mic-2-wireless-microphone-combo',
    sku: 'DJI-MIC2-COMBO',
    brand: 'DJI',
    category: 'Âm Thanh & Ánh Sáng Studio',
    price: 8490000,
    originalPrice: 9490000,
    stockQuantity: 40,
    rating: 5.0,
    reviewsCount: 65,
    isFeatured: false,
    badge: '32-BIT FLOAT',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
    ],
    shortDesc: 'Thu âm 32-bit Float nội bộ chống vỡ tiếng, chống ồn thông minh DSP, phạm vi truyền 250m, hộp sạc pin 18 giờ.',
    description: 'Tiêu chuẩn vàng cho âm thanh video creator và phóng viên. Tính năng ghi âm 32-bit float giúp không bao giờ bị méo tiếng dù tiếng hét lớn hay thì thầm nhỏ, kết nối Bluetooth trực tiếp với điện thoại hoặc máy quay qua jack 3.5mm / Type-C / Lightning.',
    specifications: {
      sensor: 'Thu âm 32-bit Float nội bộ 8GB, 48kHz / 24-bit chất lượng cao',
      flightTime: 'Thời lượng hoạt động 6 giờ (18 giờ kèm hộp sạc)',
      weight: 'Bộ phát siêu nhẹ chỉ 28g',
    },
  },
  {
    id: 'prod-nikon-z8',
    name: 'Nikon Z8 Body - Máy ảnh Mirrorless 45.7MP Quay 8.3K N-RAW',
    slug: 'nikon-z8-body',
    sku: 'NIKON-Z8-BODY',
    brand: 'Nikon',
    category: 'Máy Ảnh Mirrorless & DSLR',
    price: 86900000,
    originalPrice: 95000000,
    stockQuantity: 9,
    rating: 5.0,
    reviewsCount: 27,
    isFeatured: false,
    badge: '8.3K N-RAW',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1000',
    ],
    shortDesc: 'Cảm biến xếp chồng 45.7MP không màn trập cơ học, quay 8.3K 60p N-RAW nội bộ, chụp 120fps.',
    description: 'Được mệnh danh là "Baby Z9", Nikon Z8 gói gọn sức mạnh của máy ảnh flagship thể thao vào thân máy nhỏ hơn 30%. Loại bỏ hoàn toàn màn trập cơ học nhờ tốc độ đọc cảm biến cực nhanh, nhận diện 9 loại chủ thể thông minh theo thời gian thực.',
    specifications: {
      sensor: '45.7 Megapixel Stacked BSI CMOS Full-Frame',
      video: '8.3K 60p N-RAW 12-bit & 4.1K 120p, Apple ProRes 422 HQ',
      weight: '910g (Kèm pin)',
    },
  },
];

export const CATEGORIES_MENU = [
  {
    name: 'Máy Ảnh Mirrorless & DSLR',
    icon: Camera,
    shortTitle: 'Máy Ảnh Mirrorless',
    badge: 'Hot nhất',
    highlightPromo: 'Trợ giá thu cũ đổi mới lên đời máy ảnh đến 3.000.000đ',
    subCategories: [
      { title: 'Sony Alpha Full-Frame', items: ['Sony A7 IV', 'Sony A7R V', 'Sony A7C II', 'Sony A1 Flagship'] },
      { title: 'Canon EOS R System', items: ['Canon EOS R5 Mark II', 'Canon EOS R6 II', 'Canon EOS R8'] },
      { title: 'Fujifilm X-Series', items: ['Fujifilm X-T5', 'Fujifilm X-H2S', 'Fujifilm X100VI'] },
      { title: 'Nikon Z Mirrorless', items: ['Nikon Z8', 'Nikon Z6 III', 'Nikon Zf Retro'] },
    ],
  },
  {
    name: 'Máy Quay Điện Ảnh & Cinema',
    icon: Film,
    shortTitle: 'Máy Quay Cinema',
    badge: 'Chuyên nghiệp',
    highlightPromo: 'Tặng thẻ CFexpress Type A 160GB khi đặt mua Body FX3',
    subCategories: [
      { title: 'Sony Cinema Line', items: ['Sony FX3 Full-Frame', 'Sony FX6 Cinema 4K', 'Sony FX30 Super 35'] },
      { title: 'Blackmagic Design', items: ['Cinema 6K Full-Frame', 'Pocket Cinema 6K G2', 'URSA Mini Pro 12K'] },
      { title: 'Phụ kiện Cinema Pro', items: ['Khung Cage Tilta/SmallRig', 'Pin V-Mount 150Wh', 'Màn hình SmallHD'] },
    ],
  },
  {
    name: 'Flycam & Drone DJI',
    icon: Video,
    shortTitle: 'Flycam & Drone',
    badge: 'Bán chạy',
    highlightPromo: 'Bảo hiểm rơi vỡ DJI Care Refresh 1 năm miễn phí',
    subCategories: [
      { title: 'Dòng Flycam Cine Flagship', items: ['DJI Mavic 3 Pro Cine', 'DJI Mavic 3 Classic', 'DJI Inspire 3 8K'] },
      { title: 'Dòng Flycam Mini Du Lịch', items: ['DJI Mini 4 Pro RC 2', 'DJI Mini 3 Fly More Combo'] },
      { title: 'Dòng FPV Cảm Giác Mạnh', items: ['DJI Avata 2 Goggles 3', 'DJI O3 Air Unit FPV'] },
      { title: 'Phụ kiện Flycam Chính Hãng', items: ['Hub sạc 100W 3 pin', 'Bộ cánh quạt giảm ồn', 'Kính lọc Filter ND'] },
    ],
  },
  {
    name: 'Gimbal & Chống Rung DJI Ronin',
    icon: Layers,
    shortTitle: 'Gimbal Chống Rung',
    badge: 'Studio',
    highlightPromo: 'Tặng Focus Motor LiDAR & ngàm kẹp phone khi mua RS 4 Pro',
    subCategories: [
      { title: 'Gimbal Máy Ảnh Chuyên Nghiệp', items: ['DJI RS 4 Pro Combo', 'DJI RS 4 Standard', 'DJI RS 3 Pro'] },
      { title: 'Gimbal Nhỏ Gọn Du Lịch', items: ['DJI RS 3 Mini', 'Zhiyun Weebill 3S'] },
      { title: 'Hệ thống Cine Cao Cấp', items: ['DJI Ronin 4D 8K', 'Hệ thống Focus LiDAR'] },
    ],
  },
  {
    name: 'Action Cam & Pocket Creator',
    icon: Battery,
    shortTitle: 'Action Cam & Vlog',
    badge: 'Xu hướng',
    highlightPromo: 'Bộ combo làm vlog TikTok / YouTube sẵn hàng giao ngay',
    subCategories: [
      { title: 'Camera Bỏ Túi Creator', items: ['DJI Osmo Pocket 3 Creator Combo', 'DJI Osmo Pocket 3 Standard'] },
      { title: 'Action Cam Hành Trình', items: ['DJI Osmo Action 4 Adventure', 'GoPro Hero 12 Black'] },
      { title: 'Phụ kiện Vlogger', items: ['Gậy selfie kéo dài 1.5m', 'Hộp sạc pin thông minh', 'Case lặn 60m'] },
    ],
  },
  {
    name: 'Ống Kính Chuyên Dụng (Lenses)',
    icon: Eye,
    shortTitle: 'Ống Kính Lenses',
    badge: 'Quang học',
    highlightPromo: 'Miễn phí vệ sinh thấu kính & cân chỉnh sensor trọn đời',
    subCategories: [
      { title: 'Sony FE G Master', items: ['FE 24-70mm F2.8 GM II', 'FE 70-200mm F2.8 GM OSS II', 'FE 16-35mm F2.8 GM II'] },
      { title: 'Canon RF L-Series', items: ['RF 24-70mm F2.8L IS USM', 'RF 28-70mm F2L USM', 'RF 70-200mm F2.8L'] },
      { title: 'Ống Kính Anamorphic', items: ['Sirui Venus 1.6x Full Frame', 'Blazar Remus 1.5x'] },
    ],
  },
  {
    name: 'Âm Thanh & Ánh Sáng Studio',
    icon: Headphones,
    shortTitle: 'Micro & Đèn Studio',
    badge: 'Âm thanh',
    highlightPromo: 'Tư vấn setup phòng livestream / podcast chuyên nghiệp 1-1',
    subCategories: [
      { title: 'Micro Thu Âm Không Dây', items: ['DJI Mic 2 (2 TX + 1 RX)', 'Rode Wireless PRO', 'Hollyland Lark Max'] },
      { title: 'Đèn Led Quay Phim', items: ['Aputure Amaran 200d S', 'Nanlite Forza 300B II', 'Colbor CL220'] },
      { title: 'Phụ kiện Phòng Quay', items: ['Softbox Cầu Lantern', 'Chân C-Stand Inox', 'Bảng tản sáng 5 in 1'] },
    ],
  },
];

export const BRANDS = ['Tất Cả', 'Sony', 'DJI', 'Canon', 'Fujifilm', 'Nikon', 'Blackmagic Design'];

export const normalizeStoreProduct = (p: any): ProProduct => {
  const rawStock = (p.stockQuantity !== undefined && p.stockQuantity !== null && p.stockQuantity !== '')
    ? p.stockQuantity
    : (p.stock !== undefined && p.stock !== null && p.stock !== '')
    ? p.stock
    : 10;
  const numStock = Number(rawStock);
  const finalStock = !isNaN(numStock) ? numStock : 10;
  return {
    ...p,
    stockQuantity: finalStock,
    stock: finalStock,
  };
};

export function App() {
  const [products, setProducts] = useState<ProProduct[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeStoreProduct);
        }
      }
    } catch {}
    return DEFAULT_PRODUCTS.map(normalizeStoreProduct);
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'UNDER_20M' | '20M_50M' | 'OVER_50M'>('ALL');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);

  // Detail Modal & Multi-Image Gallery State
  const [selectedProduct, setSelectedProduct] = useState<ProProduct | null>(null);
  const [activeModalImgIdx, setActiveModalImgIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Hero Carousel State
  const [heroSlide, setHeroSlide] = useState<number>(0);

  // Flash Deal Countdown Timer State (Hours, Minutes, Seconds)
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Hero carousel auto play
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % 3);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  const openProductDetail = (prod: ProProduct) => {
    setActiveModalImgIdx(0);
    setSelectedProduct(prod);
  };

  // Keyboard navigation for image gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProduct) return;
      const imgs =
        selectedProduct.images && selectedProduct.images.length > 0
          ? selectedProduct.images
          : [selectedProduct.imageUrl];

      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else setSelectedProduct(null);
      } else if (e.key === 'ArrowRight') {
        setActiveModalImgIdx((prev) => (prev < imgs.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        setActiveModalImgIdx((prev) => (prev > 0 ? prev - 1 : imgs.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, isLightboxOpen]);

  // Keep selectedProduct in sync with live products state
  useEffect(() => {
    if (selectedProduct) {
      const fresh = products.find((p) => p.id === selectedProduct.id || p.sku === selectedProduct.sku);
      if (fresh && (fresh.stockQuantity !== selectedProduct.stockQuantity || fresh.badge !== selectedProduct.badge)) {
        setSelectedProduct(fresh);
      }
    }
  }, [products]);

  // Warranty Modal
  const [showWarrantyModal, setShowWarrantyModal] = useState<boolean>(false);
  const [serialQuery, setSerialQuery] = useState<string>('');
  const [warrantyResult, setWarrantyResult] = useState<any>(null);
  const [isCheckingWarranty, setIsCheckingWarranty] = useState<boolean>(false);

  // Checkout Form
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'VIETQR' | 'COD'>('VIETQR');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Customer Order Lookup & Self-Service Cancel
  const [showOrderLookupModal, setShowOrderLookupModal] = useState<boolean>(false);
  const [orderLookupQuery, setOrderLookupQuery] = useState<string>('');
  const [orderLookupResult, setOrderLookupResult] = useState<any>(null);
  const [isSearchingOrder, setIsSearchingOrder] = useState<boolean>(false);
  const [orderCancelSuccessMsg, setOrderCancelSuccessMsg] = useState<string>('');
  const [isCancellingOrder, setIsCancellingOrder] = useState<boolean>(false);

  // Retail Interactive Modals & Live Chat States
  const [isLiveChatOpen, setIsLiveChatOpen] = useState<boolean>(false);
  const [isInstallmentOpen, setIsInstallmentOpen] = useState<boolean>(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState<boolean>(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeAdvisorName, setActiveAdvisorName] = useState<string>('');

  // Customer Account States
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => chatSyncService.getCustomerSession());
  const [showCustomerAuthModal, setShowCustomerAuthModal] = useState<boolean>(false);

  // Sync advisor assignment status & customer session
  useEffect(() => {
    const unsub = chatSyncService.subscribe((sessions) => {
      const cust = chatSyncService.getCustomerSession();
      setCustomerUser(cust);
      if (cust) {
        const mySess = sessions.find((s) => s.customer.id === cust.id || s.customer.email === cust.email);
        if (mySess?.assignedStaff) {
          setActiveAdvisorName(`${mySess.assignedStaff.name} (${mySess.assignedStaff.role})`);
        } else {
          setActiveAdvisorName('');
        }
      }
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'PROGEAR_CUSTOMER_SESSION') {
        setCustomerUser(chatSyncService.getCustomerSession());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsub();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Wishlist & Live Toast
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('PRO_GEAR_WISHLIST');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState<{ message: string; show: boolean } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };
  const showNotification = showToast;

  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      const isAdded = !prev.includes(productId);
      const next = isAdded
        ? [...prev, productId]
        : prev.filter((id) => id !== productId);
      try {
        localStorage.setItem('PRO_GEAR_WISHLIST', JSON.stringify(next));
      } catch {}
      showToast(isAdded ? 'Đã thêm vào Yêu Thích ❤️' : 'Đã xóa khỏi Yêu Thích');
      return next;
    });
  };

  // Helper to extract multi-images array from API response
  const parseImagesFromItem = (item: any): string[] => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      const list = item.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl).filter(Boolean);
      if (list.length > 0) return list;
    }
    return [item.imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000'];
  };

  // Load products from Backend API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const mapped: ProProduct[] = data.items.map((item: any) => {
            const itemImgs = parseImagesFromItem(item);
            return {
              id: String(item.id),
              name: item.name,
              slug: item.slug,
              sku: item.sku,
              brand: item.brand?.name || (typeof item.brand === 'string' ? item.brand : 'DJI'),
              category: item.category?.name || (typeof item.category === 'string' ? item.category : 'Máy Ảnh Mirrorless & DSLR'),
              price: Number(item.price),
              originalPrice: Number(item.originalPrice) || Math.round(Number(item.price) * 1.15),
              stockQuantity: Number(item.stockQuantity ?? item.stock ?? 10),
              stock: Number(item.stockQuantity ?? item.stock ?? 10),
              rating: 5.0,
              reviewsCount: 38,
              isFeatured: item.isFeatured ?? false,
              badge: item.brand?.name?.toUpperCase() || 'CHÍNH HÃNG',
              imageUrl: itemImgs[0],
              images: itemImgs,
              shortDesc: item.shortDesc || item.name,
              description: item.description || item.shortDesc || '',
              specifications: item.specifications || {},
            };
          });
          setProducts(mapped);
          setIsBackendConnected(true);
          try {
            localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(mapped));
          } catch {}
          return;
        }
      }
    } catch {
      setIsBackendConnected(false);
      try {
        const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed.map(normalizeStoreProduct));
        }
      } catch {}
    }
  };

  useEffect(() => {
    fetchProducts();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'PROGEAR_SHARED_PRODUCTS' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed.map(normalizeStoreProduct));
        } catch {}
      }
    };
    const handleCustomProductUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setProducts(e.detail.map(normalizeStoreProduct));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('PROGEAR_PRODUCTS_UPDATED', handleCustomProductUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('PROGEAR_PRODUCTS_UPDATED', handleCustomProductUpdate);
    };
  }, []);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'Tất Cả' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'Tất Cả' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);

    let matchPrice = true;
    if (priceFilter === 'UNDER_20M') matchPrice = p.price < 20000000;
    else if (priceFilter === '20M_50M') matchPrice = p.price >= 20000000 && p.price <= 50000000;
    else if (priceFilter === 'OVER_50M') matchPrice = p.price > 50000000;

    return matchCat && matchBrand && matchSearch && matchPrice;
  });

  // Top Flash Deal Items (5 items)
  const flashDealItems = products.slice(0, 5);

  // Cart operations
  const addToCart = (product: ProProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isOutOfStock = (product.stockQuantity ?? 0) <= 0;
    setCart((prev) => {
      const exist = prev.find((item) => item.product.id === product.id);
      if (exist) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    if (isOutOfStock) {
      showToast(`Đã thêm ${product.name} vào danh sách Đặt Chờ Về! 📞`);
    } else {
      showToast(`Đã thêm ${product.name} vào giỏ hàng! 🛒`);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const next = item.quantity + delta;
            return next > 0 ? { ...item, quantity: next } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // SUBMIT ORDER TO API & SHARED SYNC
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    setIsSubmittingOrder(true);

    const hasPreOrderItem = cart.some((i) => (i.product.stockQuantity ?? 0) <= 0);
    const orderPrefixNote = hasPreOrderItem ? '[ĐẶT HÀNG CHỜ VỀ - PRE-ORDER] ' : '';

    const orderPayload = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: customerAddress.trim(),
      paymentMethod,
      note: `${orderPrefixNote}${orderNote.trim() || 'Đơn hàng thiết bị Pro Gear từ Storefront'}`.trim(),
      items: cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    };

    let confirmedOrder: any = null;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        confirmedOrder = await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, using local synchronization fallback:', err);
    }

    // Fallback if backend was offline or mock id
    if (!confirmedOrder || !confirmedOrder.orderNumber) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      confirmedOrder = {
        id: `local-ord-${Date.now()}`,
        orderNumber: hasPreOrderItem ? `PRE-${dateStr}-${randomCode}` : `PRO-${dateStr}-${randomCode}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: customerAddress.trim(),
        paymentMethod,
        totalAmount,
        orderStatus: hasPreOrderItem ? 'PRE_ORDER' : 'PENDING',
        status: hasPreOrderItem ? 'PRE_ORDER' : 'PENDING',
        isPreOrder: hasPreOrderItem,
        orderType: hasPreOrderItem ? 'PRE_ORDER' : 'STANDARD',
        staffCallStatus: 'NOT_CALLED',
        createdAt: 'Vừa xong',
        note: `${orderPrefixNote}${orderNote.trim() || 'Đơn hàng thiết bị Pro Gear từ Storefront'}`.trim(),
        items: cart.map((i) => ({
          productName: i.product.name,
          productSku: i.product.sku,
          price: i.product.price,
          quantity: i.quantity,
          subtotal: i.product.price * i.quantity,
        })),
      };
    } else {
      if (hasPreOrderItem) {
        confirmedOrder.isPreOrder = true;
        confirmedOrder.orderType = 'PRE_ORDER';
        confirmedOrder.staffCallStatus = 'NOT_CALLED';
        if (!confirmedOrder.note || !confirmedOrder.note.includes('PRE-ORDER')) {
          confirmedOrder.note = `${orderPrefixNote}${confirmedOrder.note || ''}`.trim();
        }
      }
    }

    // 1. Tự động trừ tồn kho khi có người đặt hàng
    setProducts((prev) => {
      const updated = prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch && (p.stockQuantity ?? 0) > 0) {
          const remaining = Math.max(0, p.stockQuantity - cartMatch.quantity);
          return {
            ...p,
            stockQuantity: remaining,
            stock: remaining,
            badge: remaining === 0 ? 'TẠM HẾT HÀNG' : p.badge,
          };
        }
        return p;
      });
      try {
        localStorage.setItem('PROGEAR_SHARED_PRODUCTS', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. Persist to shared localStorage sync layer
    try {
      const existingStr = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify([confirmedOrder, ...existing]));
    } catch (storageErr) {
      console.error('Lỗi lưu đơn hàng vào local sync:', storageErr);
    }

    setOrderSuccess(confirmedOrder);
    setCart([]);
    setIsSubmittingOrder(false);
    triggerConfetti();
  };

  // Helper to calculate days remaining
  const calculateDaysRemaining = (expireDateStr?: string) => {
    if (!expireDateStr) return null;
    let exp: Date | null = null;
    if (expireDateStr.includes('/')) {
      const parts = expireDateStr.split('/');
      if (parts.length === 3) {
        exp = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    } else {
      exp = new Date(expireDateStr);
    }
    if (!exp || isNaN(exp.getTime())) return null;
    const now = new Date();
    const diffMs = exp.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const maskCustomerName = (name?: string) => {
    if (!name) return 'Khách Hàng Pro Gear';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2) + '***';
    return parts.map((p, idx) => (idx === 0 ? p : p[0] + '**')).join(' ');
  };

  const maskPhoneNumber = (phone?: string) => {
    if (!phone) return '090***';
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 6) return clean;
    return clean.slice(0, 3) + '****' + clean.slice(-3);
  };

  // WARRANTY CHECK VIA REAL API & SHARED SERIALS (TIN HỌC NGÔI SAO STANDARD)
  const handleCheckWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawQuery = serialQuery.trim();
    if (!rawQuery) return;

    setIsCheckingWarranty(true);
    setWarrantyResult(null);

    // Try backend API first
    try {
      const res = await fetch(`/api/warranty/${encodeURIComponent(rawQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.type === 'ORDER_RESULT' || data.type === 'PHONE_RESULT' || data.serialNumber)) {
          setWarrantyResult(data);
          setIsCheckingWarranty(false);
          return;
        }
      }
    } catch {
      // Backend offline fallback
    }

    const cleanQuery = rawQuery.toUpperCase();

    // Local fallback: Check if query matches an Order Number
    let allOrders: any[] = [];
    try {
      const ordersRaw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (ordersRaw) allOrders = JSON.parse(ordersRaw);
    } catch {}

    const DEFAULT_STORE_ORDERS: any[] = [
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
        createdAt: '16/10/2026',
        items: [
          { productName: 'Sony Cinema Line FX3 Body', productSku: 'ILME-FX3-BODY', price: 94990000, quantity: 1, subtotal: 94990000 },
          { productName: 'DJI RS 4 Pro Gimbal Combo', productSku: 'DJI-RS4PRO-COMBO', price: 19990000, quantity: 1, subtotal: 19990000 },
        ],
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
        createdAt: '16/10/2026',
        items: [
          { productName: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes)', productSku: 'DJI-MAVIC3-PRO-CINE', price: 79990000, quantity: 1, subtotal: 79990000 },
        ],
      },
    ];

    const combinedOrders = [...allOrders, ...DEFAULT_STORE_ORDERS];
    const orderMatch = combinedOrders.find(
      (o) => o.orderNumber && o.orderNumber.toUpperCase() === cleanQuery
    );

    if (orderMatch) {
      const isCompleted = orderMatch.orderStatus === 'COMPLETED' || orderMatch.status === 'COMPLETED';
      const isPaid = orderMatch.paymentStatus === 'PAID' || isCompleted;

      const itemsWithWarranty = (orderMatch.items || []).map((itm: any) => {
        const assignedSn = `${itm.productSku || itm.sku || 'PRO'}-${orderMatch.orderNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}-VN`;
        const warrantyMonths = itm.warrantyMonths || 24;
        const soldDate = orderMatch.createdAt && !orderMatch.createdAt.includes('phút') ? orderMatch.createdAt : '16/10/2026';
        const expDate = '16/10/2028';
        const days = calculateDaysRemaining(expDate);

        return {
          productName: itm.productName,
          productSku: itm.productSku || itm.sku || 'ILME-FX3-BODY',
          quantity: itm.quantity || 1,
          price: itm.price,
          subtotal: itm.subtotal || itm.price * (itm.quantity || 1),
          serialNumber: assignedSn,
          warrantyMonths,
          soldDate,
          warrantyExpires: expDate,
          daysRemaining: isCompleted ? days : warrantyMonths * 30,
          isActivated: isCompleted,
        };
      });

      setWarrantyResult({
        type: 'ORDER_RESULT',
        orderNumber: orderMatch.orderNumber,
        customerName: orderMatch.customerName,
        customerPhone: orderMatch.customerPhone,
        shippingAddress: orderMatch.shippingAddress,
        paymentMethod: orderMatch.paymentMethod,
        paymentStatus: orderMatch.paymentStatus,
        orderStatus: orderMatch.orderStatus || orderMatch.status || 'CONFIRMED',
        totalAmount: orderMatch.totalAmount,
        createdAt: orderMatch.createdAt,
        isCompleted,
        isPaid,
        items: itemsWithWarranty,
        devices: itemsWithWarranty,
      });
      setIsCheckingWarranty(false);
      return;
    }

    // Default Serial Fallback
    if (cleanQuery === 'SONY-FX3-VN-9901') {
      setWarrantyResult({
        type: 'SOLD_ACTIVE',
        serialNumber: 'SONY-FX3-VN-9901',
        productName: 'Sony Cinema Line FX3 Body Chính Hãng',
        productSku: 'ILME-FX3-BODY',
        brand: 'Sony',
        status: 'SOLD',
        warrantyMonths: 24,
        soldDate: '10/02/2026',
        warrantyExpires: '10/02/2028',
        daysRemaining: 728,
        orderNumber: 'PRO-20261016-8942',
        customerName: 'Đoàn Phim CineArt',
        customerPhone: '0908123456',
        soldChannel: 'ONLINE',
      });
      setIsCheckingWarranty(false);
      return;
    }

    // Not found
    setWarrantyResult({
      type: 'NOT_FOUND',
      query: rawQuery,
    });
    setIsCheckingWarranty(false);
  };

  // Self-Service Order Lookup
  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderLookupQuery.trim().toUpperCase();
    if (!query) return;

    setIsSearchingOrder(true);
    setOrderCancelSuccessMsg('');

    let allOrders: any[] = [];
    try {
      const ordersRaw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (ordersRaw) allOrders = JSON.parse(ordersRaw);
    } catch {}

    const match = allOrders.find(
      (o) =>
        (o.orderNumber && o.orderNumber.toUpperCase() === query) ||
        (o.id && o.id.toUpperCase() === query) ||
        (o.customerPhone && o.customerPhone.replace(/[\s\-\.]/g, '') === query.replace(/[\s\-\.]/g, ''))
    );

    setOrderLookupResult(match || 'NOT_FOUND');
    setIsSearchingOrder(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Quý khách có chắc chắn muốn hủy đơn hàng này không?')) return;
    setIsCancellingOrder(true);
    try {
      const ordersRaw = localStorage.getItem('PROGEAR_SHARED_ORDERS');
      if (ordersRaw) {
        const orders = JSON.parse(ordersRaw);
        const updated = orders.map((o: any) =>
          o.id === orderId || o.orderNumber === orderId
            ? { ...o, orderStatus: 'CANCELLED', status: 'CANCELLED' }
            : o
        );
        localStorage.setItem('PROGEAR_SHARED_ORDERS', JSON.stringify(updated));
      }
      setOrderLookupResult((prev: any) =>
        prev && typeof prev === 'object' ? { ...prev, orderStatus: 'CANCELLED', status: 'CANCELLED' } : prev
      );
      setOrderCancelSuccessMsg('Đơn hàng đã được hủy thành công!');
    } catch (err) {
      alert('Không thể hủy đơn hàng, vui lòng thử lại sau.');
    } finally {
      setIsCancellingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 flex flex-col font-sans">
      {/* ----------------- TOPBAR: COMMITMENTS & TICKER ----------------- */}
      <div className="bg-gray-900 text-gray-300 text-xs py-1 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chính Hãng 100%</span>
            </span>
            <span className="hidden sm:inline-block text-gray-600">•</span>
            <span className="hidden sm:flex items-center gap-1 text-gray-300">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Giao Nhanh 2H</span>
            </span>
            <span className="hidden md:inline-block text-gray-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Bảo Hành Tận Nơi 24 Tháng</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 ml-auto text-[11px]">
            <button
              onClick={() => {
                setShowOrderLookupModal(true);
                setOrderLookupResult(null);
                setOrderLookupQuery('');
              }}
              className="text-gray-300 hover:text-white transition flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>Tra cứu đơn hàng</span>
            </button>
            {customerUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center gap-1.5 text-white">
                  <img
                    src={customerUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={customerUser.name}
                    className="w-4 h-4 rounded-full object-cover border border-amber-300"
                  />
                  <span
                    data-testid="customer-name-display"
                    className="font-bold text-amber-300 max-w-[130px] truncate"
                    title={customerUser.name}
                  >
                    {customerUser.name}
                  </span>
                </div>
                <button
                  data-testid="btn-customer-logout"
                  onClick={() => {
                    chatSyncService.clearCustomerSession();
                    setCustomerUser(null);
                  }}
                  title="Đăng xuất tài khoản"
                  className="text-gray-400 hover:text-white transition text-[10px] underline cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                data-testid="btn-customer-login-header"
                onClick={() => setShowCustomerAuthModal(true)}
                className="text-white hover:text-red-300 font-semibold transition flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded cursor-pointer"
              >
                <User className="w-3 h-3 text-red-400" />
                <span>Đăng nhập / Đăng ký</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live System Activity Ticker */}
      <LiveActivityTicker onOpenWarranty={() => setShowWarrantyModal(true)} />

      {/* ----------------- STICKY MAIN HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6">
          {/* Logo Left */}
          <a href="#" className="flex items-center space-x-2 shrink-0 group">
            <div className="w-10 h-10 rounded-md bg-[#E30019] flex items-center justify-center text-white shadow-sm">
              <Camera className="w-6 h-6 transform group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-black tracking-tight text-gray-950 flex items-center gap-1">
                <span className="text-[#E30019]">PRO</span>
                <span>GEAR</span>
              </div>
              <div className="text-[9.5px] font-bold text-gray-500 uppercase tracking-wider hidden sm:block">
                Máy Ảnh & Cinema Flagship
              </div>
            </div>
          </a>

          {/* Category Dropdown Button */}
          <div className="hidden lg:block shrink-0 relative">
            <button
              data-testid="btn-toggle-mega-menu"
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-md flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Menu className="w-4 h-4" />
              <span>DANH MỤC</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Large Search Bar Center */}
          <div className="flex-1 max-w-2xl relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex items-center border-2 border-[#E30019] rounded-md overflow-hidden bg-white shadow-sm"
            >
              <input
                type="text"
                data-testid="search-input"
                placeholder="Bạn muốn tìm máy ảnh, flycam, lens hay phụ kiện gì hôm nay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                data-testid="search-submit"
                className="bg-[#E30019] hover:bg-red-700 text-white px-4 py-2 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            </form>

            {/* Quick Trending Keywords */}
            <div className="hidden md:flex items-center space-x-2 text-[10.5px] text-gray-500 mt-1 truncate">
              <span className="font-semibold text-gray-600">Gợi ý:</span>
              <button onClick={() => setSearchQuery('FX3')} className="hover:text-[#E30019]">Sony FX3</button>
              <span>•</span>
              <button onClick={() => setSearchQuery('Mavic 3')} className="hover:text-[#E30019]">Mavic 3 Pro</button>
              <span>•</span>
              <button onClick={() => setSearchQuery('A7 IV')} className="hover:text-[#E30019]">Sony A7 IV</button>
              <span>•</span>
              <button onClick={() => setSearchQuery('Pocket 3')} className="hover:text-[#E30019]">Osmo Pocket 3</button>
              <span>•</span>
              <button onClick={() => setSearchQuery('RS 4 Pro')} className="hover:text-[#E30019]">Gimbal RS 4</button>
            </div>
          </div>

          {/* Right Section: Hotline, Warranty & Cart */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* Hotline */}
            <a
              href="tel:19008899"
              data-testid="btn-hotline"
              onClick={() => showNotification('Tổng đài tư vấn Pro Gear: 1900 8899 (Miễn cước kết nối 24/7)')}
              className="hidden xl:flex items-center space-x-2 text-left hover:opacity-85 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#E30019] flex items-center justify-center border border-red-200">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-[#E30019] leading-tight">1900 8899</div>
                <div className="text-[10px] text-gray-500">Tư vấn miễn phí</div>
              </div>
            </a>

            {/* Tra Cứu Bảo Hành Button */}
            <button
              onClick={() => {
                setShowWarrantyModal(true);
                setWarrantyResult(null);
                setSerialQuery('');
              }}
              data-testid="btn-open-warranty"
              className="border border-red-500 text-[#E30019] bg-red-50/60 hover:bg-red-100 font-bold text-xs px-2.5 sm:px-3 py-2 rounded-md flex items-center gap-1.5 transition shadow-sm"
              title="Tra cứu bảo hành điện tử chuẩn Tin Học Ngôi Sao"
            >
              <ShieldCheck className="w-4 h-4 text-[#E30019]" />
              <span className="hidden sm:inline">Tra Cứu Bảo Hành</span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setShowCartDrawer(true)}
              data-testid="btn-cart-drawer"
              className="bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs px-3 sm:px-3.5 py-2 rounded-md flex items-center gap-2 shadow-sm transition active:scale-95 relative"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Giỏ hàng</span>
              {totalCartCount > 0 && (
                <span className="hidden lg:inline text-amber-200 font-mono text-[11px]">
                  ({formatVND(totalAmount)})
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Mega Menu anchored directly beneath sticky header */}
        <CategoryMegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setIsMegaMenuOpen(false);
            const catalogEl = document.getElementById('product-catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectBrand={(b) => {
            setSelectedBrand(b);
            setIsMegaMenuOpen(false);
            const catalogEl = document.getElementById('product-catalog');
            if (catalogEl) catalogEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </header>

      {/* ----------------- HERO AREA: 3-COLUMN RETAIL LAYOUT ----------------- */}
      <section className="max-w-7xl mx-auto px-4 pt-3 pb-2 w-full">
        <div className="grid grid-cols-12 gap-3 relative">
          {/* LEFT COLUMN: Vertical Categories Menu (22% - cols 1-3) */}
          <div
            data-testid="hero-category-sidebar"
            onMouseLeave={() => setHoveredCategory(null)}
            className="hidden lg:flex lg:col-span-3 flex-col bg-white rounded-lg border border-gray-200 shadow-sm p-2 justify-between relative z-20"
          >
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-2.5 py-1 mb-1 border-b border-gray-100 flex items-center justify-between">
                <span>DANH MỤC SẢN PHẨM</span>
                <span className="text-[10px] text-red-600 font-semibold">{products.length} SP</span>
              </div>

              {CATEGORIES_MENU.map((cat, idx) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;
                const isHovered = hoveredCategory === cat.name;
                return (
                  <button
                    key={idx}
                    data-testid={`btn-sidebar-category-${cat.shortTitle}`}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setHoveredCategory(null);
                      showToast(`Đang lọc danh mục: ${cat.shortTitle}`);
                      setTimeout(() => {
                        document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isSelected || isHovered
                        ? 'bg-red-50 text-[#E30019] font-bold border-l-2 border-[#E30019] shadow-xs'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#E30019]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isSelected || isHovered ? 'text-[#E30019]' : 'text-gray-500'}`} />
                      <span className="truncate">{cat.shortTitle}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {cat.badge && (
                        <span className="text-[9px] bg-red-100 text-[#E30019] px-1.5 py-0.2 rounded-full font-semibold hidden xl:inline-block">
                          {cat.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3 h-3 transition-transform ${isHovered ? 'translate-x-0.5 text-[#E30019]' : 'text-gray-400'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom mini promo banner */}
            <div
              onClick={() => setIsInstallmentOpen(true)}
              className="mt-2 pt-2 border-t border-gray-100 bg-red-50/50 hover:bg-red-50 p-2 rounded-md text-center cursor-pointer transition"
            >
              <div className="text-[11px] font-bold text-[#E30019] flex items-center justify-center gap-1">
                <Percent className="w-3.5 h-3.5" />
                <span>Trả Góp 0% Lãi Suất</span>
              </div>
              <div className="text-[10px] text-gray-600 mt-0.5">Thủ tục xét duyệt online 5 phút</div>
            </div>
          </div>

          {/* FLYOUT SUBMENU MEGA PANEL (Pops out to the right when hovered) */}
          {(() => {
            const hoveredCatData = CATEGORIES_MENU.find((c) => c.name === hoveredCategory);
            if (!hoveredCatData) return null;
            const countInCat = products.filter((p) => p.category === hoveredCatData.name).length;
            return (
              <div
                data-testid="sidebar-category-flyout"
                onMouseEnter={() => setHoveredCategory(hoveredCatData.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="absolute left-[25.5%] top-0 bottom-0 z-40 w-[600px] bg-white rounded-r-xl border border-gray-200 shadow-2xl p-5 hidden lg:flex flex-col justify-between animate-in fade-in slide-in-from-left-2 duration-150"
              >
                <div>
                  {/* Top bar of Flyout */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E30019]"></span>
                      <span className="font-bold text-sm text-gray-900 uppercase">
                        {hoveredCatData.name}
                      </span>
                      {hoveredCatData.badge && (
                        <span className="bg-red-100 text-[#E30019] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {hoveredCatData.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      {countInCat} sản phẩm sẵn hàng
                    </span>
                  </div>

                  {/* Promo highlight banner inside flyout */}
                  {hoveredCatData.highlightPromo && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-md p-2.5 mb-3.5 text-xs text-red-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E30019] shrink-0" />
                      <span className="font-semibold text-[11px]">{hoveredCatData.highlightPromo}</span>
                    </div>
                  )}

                  {/* Subcategories Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {hoveredCatData.subCategories.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <div className="text-[11.5px] font-bold text-gray-950 flex items-center gap-1 border-b border-gray-100 pb-0.5">
                          <span className="text-[#E30019]">›</span>
                          <span>{sub.title}</span>
                        </div>
                        <div className="space-y-0.5 pt-0.5">
                          {sub.items.map((item, iIdx) => (
                            <button
                              key={iIdx}
                              onClick={() => {
                                setSelectedCategory(hoveredCatData.name);
                                setSearchQuery(item.split(' ')[0] === 'DJI' ? item.split(' ').slice(0, 3).join(' ') : item.split(' ')[0]);
                                setHoveredCategory(null);
                                showToast(`Đang lọc: ${item}`);
                                setTimeout(() => {
                                  document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                                }, 50);
                              }}
                              className="block w-full text-left text-[11px] text-gray-600 hover:text-[#E30019] hover:font-semibold transition py-0.5 truncate cursor-pointer"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Direct Navigation Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(hoveredCatData.name);
                      setHoveredCategory(null);
                      showToast(`Đang xem danh mục: ${hoveredCatData.name}`);
                      setTimeout(() => {
                        document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-md shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Xem Toàn Bộ Sản Phẩm {hoveredCatData.shortTitle}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-gray-500">Chính hãng 100% • Bảo hành 24T</span>
                </div>
              </div>
            );
          })()}

          {/* CENTER COLUMN: Main Banner Carousel (53% - cols 4-9 on lg, cols 1-8 on md) */}
          <div className="col-span-12 md:col-span-8 lg:col-span-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative min-h-[280px] sm:min-h-[340px] flex flex-col justify-between group">
            {/* Slide Items */}
            {heroSlide === 0 && (
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] bg-gradient-to-r from-gray-950 via-gray-900 to-red-950 text-white p-6 sm:p-8 flex flex-col justify-center">
                <div className="absolute top-4 left-4 bg-[#E30019] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  FESTIVAL MÁY ẢNH & CINEMA 2026
                </div>
                <div className="max-w-md relative z-10 mt-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
                    SONY CINEMA FX3 & A7M4 GIẢM ĐẾN 15 TRIỆU
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2">
                    Tặng ngay thẻ nhớ CFexpress Type A 160GB + Pin chính hãng NP-FZ100 trị giá 4.500.000đ khi đặt mua hôm nay.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('Máy Quay Điện Ảnh & Cinema');
                      }}
                      className="bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow transition flex items-center gap-1.5"
                    >
                      <span>Khám Phá Ngay</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowWarrantyModal(true)}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-2.5 rounded-md backdrop-blur border border-white/20 transition"
                    >
                      Bảo Hành 24T
                    </button>
                  </div>
                </div>
              </div>
            )}

            {heroSlide === 1 && (
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-center">
                <div className="absolute top-4 left-4 bg-sky-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  DJI FLAGSHIP STORE
                </div>
                <div className="max-w-md relative z-10 mt-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
                    DJI MAVIC 3 PRO CINE & RS 4 PRO COMBO
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2">
                    Hỗ trợ Apple ProRes 5.1K, 3 camera quang học Hasselblad. Trợ giá gói bảo dưỡng Care Refresh 2 năm.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('Flycam & Drone DJI');
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-md shadow transition flex items-center gap-1.5"
                    >
                      <span>Xem Sản Phẩm DJI</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {heroSlide === 2 && (
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[340px] bg-gradient-to-r from-neutral-950 via-amber-950 to-red-950 text-white p-6 sm:p-8 flex flex-col justify-center">
                <div className="absolute top-4 left-4 bg-amber-500 text-gray-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  CANON & FUJIFILM SHOWROOM
                </div>
                <div className="max-w-md relative z-10 mt-2">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-2">
                    CANON R5 MARK II & FUJI X-T5 BẢN BẠC
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-300 mb-4 line-clamp-2">
                    Quay 8K RAW nội bộ, cảm biến xếp chồng 45MP, 19 giả lập phim Film Simulation độc bản.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsInstallmentOpen(true)}
                      data-testid="btn-hero-installment"
                      className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs px-4 py-2.5 rounded-md shadow transition flex items-center gap-1.5"
                    >
                      <span>Mua Ngay Trả Góp 0%</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Slider Navigation Dots & Arrows */}
            <div className="absolute bottom-3 right-4 flex items-center space-x-1.5 z-20">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setHeroSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    heroSlide === idx ? 'w-6 bg-[#E30019]' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setHeroSlide((prev) => (prev > 0 ? prev - 1 : 2))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setHeroSlide((prev) => (prev < 2 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT COLUMN: 2 Stacked Retail Banners (25% - cols 10-12) */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col gap-3">
            {/* Promo Card 1: Thu cũ đổi mới */}
            <div
              onClick={() => setIsTradeInOpen(true)}
              data-testid="btn-promo-tradein"
              className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm flex flex-col justify-between flex-1 relative overflow-hidden group hover:border-[#E30019] transition cursor-pointer"
            >
              <div className="relative z-10">
                <span className="bg-red-50 text-[#E30019] text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-red-200">
                  THU CŨ LÊN ĐỜI
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-1.5 leading-snug">
                  Trợ giá đến 3.000.000đ khi đổi máy ảnh cũ
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  Áp dụng mọi dòng máy Sony, Canon, Fujifilm, Nikon đổi sang FX3 & A7M4.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#E30019]">
                <span>Xem định giá nhanh</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Promo Card 2: Flash sale phụ kiện */}
            <div
              onClick={() => {
                setSelectedCategory('Ống Kính Lenses');
                document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
              }}
              data-testid="btn-promo-accessories"
              className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm flex flex-col justify-between flex-1 relative overflow-hidden group hover:border-[#E30019] transition cursor-pointer"
            >
              <div className="relative z-10">
                <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-amber-200">
                  PHỤ KIỆN CINEMA
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-1.5 leading-snug">
                  Thẻ CFexpress & Gimbal Ronin giảm 35%
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  Tặng hộp chống sốc chuyên dụng + dây đeo cao cấp khi mua combo.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#E30019]">
                <span>Mua ngay giá sốc</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FLASH DEAL: GIÁ SỐC HÔM NAY ----------------- */}
      <section className="max-w-7xl mx-auto px-4 py-3 w-full">
        <div className="border-2 border-[#E30019] bg-white rounded-lg p-3.5 shadow-sm">
          {/* Flash Deal Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-red-100">
            <div className="flex items-center space-x-3">
              <div className="bg-[#E30019] text-white font-black text-sm sm:text-base px-3 py-1 rounded flex items-center gap-1.5 shadow-sm uppercase tracking-wide">
                <Flame className="w-4 h-4 fill-white" />
                <span>GIÁ SỐC HÔM NAY</span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-gray-500 text-[11px] font-medium hidden sm:inline">Kết thúc trong:</span>
                <div className="bg-gray-900 text-amber-400 font-mono font-bold px-2 py-1 rounded text-xs">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <span className="font-bold text-gray-400">:</span>
                <div className="bg-gray-900 text-amber-400 font-mono font-bold px-2 py-1 rounded text-xs">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <span className="font-bold text-gray-400">:</span>
                <div className="bg-gray-900 text-amber-400 font-mono font-bold px-2 py-1 rounded text-xs">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('Tất Cả');
                setPriceFilter('ALL');
              }}
              className="text-xs font-bold text-[#E30019] hover:text-red-700 flex items-center gap-1"
            >
              <span>Xem tất cả ưu đãi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flash Deal Products (High-density 5 items) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3">
            {flashDealItems.map((prod, idx) => (
              <RetailProductCard
                key={prod.id}
                product={prod}
                onAddToCart={addToCart}
                onQuickView={openProductDetail}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(prod.id)}
                isFlashDeal={true}
                soldCount={14 + idx * 3}
                totalDealStock={20 + idx * 5}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- PRODUCT GRID: CLUSTERS BY CATEGORY (5 ITEMS/ROW) ----------------- */}
      <main className="max-w-7xl mx-auto px-4 py-2 w-full space-y-6">
        {/* Filter Bar with Brand Chips & Price Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Brand Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-gray-700 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#E30019]" />
              <span>Thương hiệu:</span>
            </span>
            {BRANDS.map((br) => (
              <button
                key={br}
                onClick={() => setSelectedBrand(br)}
                className={`px-2.5 py-1 rounded-md text-xs transition ${
                  selectedBrand === br
                    ? 'bg-[#E30019] text-white font-bold shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {br}
              </button>
            ))}
          </div>

          {/* Price Quick Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-gray-700 mr-1">Mức giá:</span>
            <button
              onClick={() => setPriceFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                priceFilter === 'ALL'
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPriceFilter('UNDER_20M')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                priceFilter === 'UNDER_20M'
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dưới 20 triệu
            </button>
            <button
              onClick={() => setPriceFilter('20M_50M')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                priceFilter === '20M_50M'
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              20 - 50 triệu
            </button>
            <button
              onClick={() => setPriceFilter('OVER_50M')}
              className={`px-2.5 py-1 rounded-md text-xs transition ${
                priceFilter === 'OVER_50M'
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Trên 50 triệu
            </button>
          </div>
        </div>

        {/* ----------------- CLUSTER 1: MÁY ẢNH & MÁY QUAY CINEMA ----------------- */}
        <section id="product-catalog" className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm scroll-mt-24">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-5 bg-[#E30019] rounded-sm"></div>
              <h2
                data-testid="catalog-header-title"
                className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2"
              >
                <span>
                  {selectedCategory === 'Tất Cả'
                    ? 'KHO MÁY ẢNH, FLYCAM, GIMBAL & PHỤ KIỆN CHÍNH HÃNG'
                    : `DANH MỤC: ${selectedCategory.toUpperCase()} (${filteredProducts.length} SẢN PHẨM)`}
                </span>
                {selectedCategory !== 'Tất Cả' && (
                  <button
                    data-testid="btn-clear-category-filter"
                    onClick={() => {
                      setSelectedCategory('Tất Cả');
                      showToast('Đã hiển thị toàn bộ sản phẩm');
                    }}
                    className="text-xs bg-red-100 text-[#E30019] hover:bg-red-200 px-2.5 py-0.5 rounded-full font-bold transition flex items-center gap-1 normal-case cursor-pointer"
                  >
                    <span>✕ Xóa lọc</span>
                  </button>
                )}
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => {
                  setSelectedCategory('Máy Ảnh Mirrorless & DSLR');
                  showToast('Đang lọc: Máy Ảnh Mirrorless');
                }}
                className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
              >
                Máy Ảnh Mirrorless
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setSelectedCategory('Máy Quay Điện Ảnh & Cinema');
                  showToast('Đang lọc: Máy Quay Cinema');
                }}
                className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
              >
                Máy Quay Cinema
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setSelectedCategory('Flycam & Drone DJI');
                  showToast('Đang lọc: Flycam & Drone');
                }}
                className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
              >
                Flycam & Drone
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => {
                  setSelectedCategory('Tất Cả');
                  setSelectedBrand('Tất Cả');
                  setPriceFilter('ALL');
                }}
                className="text-[#E30019] font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Xem tất cả ({filteredProducts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High Density Grid (5 cols on Desktop) */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <div className="font-bold text-gray-700 text-sm">Chưa có sản phẩm nào thuộc bộ lọc này</div>
              <p className="text-xs text-gray-500 mt-1">Vui lòng chọn danh mục khác hoặc xóa bộ lọc để duyệt toàn bộ kho máy ảnh & flycam.</p>
              <button
                onClick={() => {
                  setSelectedCategory('Tất Cả');
                  setSelectedBrand('Tất Cả');
                  setPriceFilter('ALL');
                }}
                className="mt-3 px-4 py-2 bg-[#E30019] hover:bg-red-700 text-white font-bold text-xs rounded-md shadow-sm transition cursor-pointer"
              >
                Xem Toàn Bộ Sản Phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map((prod) => (
                <RetailProductCard
                  key={prod.id}
                  product={prod}
                  onAddToCart={addToCart}
                  onQuickView={openProductDetail}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(prod.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ----------------- CLUSTER 2: FLYCAM & THIẾT BỊ CHỐNG RUNG DJI (CHỈ HIỆN KHI CHƯA LỌC DANH MỤC RIÊNG) ----------------- */}
        {selectedCategory === 'Tất Cả' && (
          <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-5 bg-sky-600 rounded-sm"></div>
                <h2 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
                  FLYCAM, DRONE & GIMBAL CHỐNG RUNG CHUYÊN NGHIỆP
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => {
                    setSelectedBrand('DJI');
                    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
                >
                  Thiết Bị DJI
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setSelectedCategory('Flycam & Drone');
                    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
                >
                  Flycam
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    setSelectedCategory('Gimbal Chống Rung');
                    document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-600 hover:text-[#E30019] font-medium cursor-pointer"
                >
                  Gimbal Ronin
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {products
                .filter((p) => p.category.includes('Flycam') || p.category.includes('Gimbal') || p.category.includes('Pocket') || p.brand === 'DJI')
                .slice(0, 5)
                .map((prod) => (
                  <RetailProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={addToCart}
                    onQuickView={openProductDetail}
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlist.includes(prod.id)}
                  />
                ))}
            </div>
          </section>
        )}

        {/* ----------------- RETAIL VALUE PROPOSITIONS ----------------- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-red-50 text-[#E30019] flex items-center justify-center border border-red-200 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs">100% Chính Hãng</div>
              <div className="text-[11px] text-gray-500">Sony, Canon, DJI, Fujifilm VN</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs">Giao Siêu Tốc 2H</div>
              <div className="text-[11px] text-gray-500">Miễn phí ship + Kèm kỹ thuật</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs">Đổi Mới Trong 30 Ngày</div>
              <div className="text-[11px] text-gray-500">Lỗi phần cứng đổi máy mới ngay</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-xs">Bảo Hành Điện Tử SN</div>
              <div className="text-[11px] text-gray-500">Minh bạch chuẩn Tin Học Ngôi Sao</div>
            </div>
          </div>
        </section>
      </main>

      {/* ----------------- FOOTER CHUẨN GEARVN / TIN HỌC NGÔI SAO ----------------- */}
      <footer className="bg-gray-950 text-gray-300 text-xs mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-base font-black text-white flex items-center gap-1.5 mb-2">
              <span className="text-[#E30019]">PRO</span>
              <span>GEAR VIỆT NAM</span>
            </div>
            <p className="text-[11.5px] text-gray-400 mb-3 leading-relaxed">
              Hệ thống bán lẻ máy ảnh, máy quay phim điện ảnh, flycam DJI và camera giám sát thông minh hàng đầu Việt Nam.
            </p>
            <div className="text-[11px] text-gray-400 space-y-1">
              <div>Tổng đài bán hàng: <strong className="text-white">1900 8899</strong> (8:00 - 21:30)</div>
              <div>Hỗ trợ kỹ thuật & BH: <strong className="text-white">0912 345 678</strong></div>
              <div>Email: <strong className="text-white">hotro@progear.vn</strong></div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Hệ Thống Showroom</div>
            <div className="space-y-2 text-[11px] text-gray-400">
              <div>
                <strong className="text-white">Showroom Quận 1 (TP.HCM):</strong>
                <p>Số 12 Nguyễn Cơ Thạch, P. An Lợi Đông, TP. Thủ Đức, TP.HCM</p>
              </div>
              <div>
                <strong className="text-white">Showroom Hoàn Kiếm (Hà Nội):</strong>
                <p>Số 45 Trần Hưng Đạo, P. Hàng Bài, Hoàn Kiếm, Hà Nội</p>
              </div>
            </div>
          </div>

          <div>
            <div className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Chính Sách & Hỗ Trợ</div>
            <ul className="space-y-1.5 text-[11px] text-gray-400">
              <li><button onClick={() => setShowWarrantyModal(true)} className="hover:text-white">Chính sách bảo hành điện tử</button></li>
              <li><button onClick={() => setShowOrderLookupModal(true)} className="hover:text-white">Tra cứu tình trạng đơn hàng</button></li>
              <li><a href="#" className="hover:text-white">Chính sách đổi trả 30 ngày</a></li>
              <li><a href="#" className="hover:text-white">Hướng dẫn thanh toán VietQR</a></li>
              <li><a href="#" className="hover:text-white">Chính sách giao hàng siêu tốc 2h</a></li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-white text-xs mb-3 uppercase tracking-wider">Thanh Toán & Cam Kết</div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 space-y-2">
              <div className="text-[11px] text-gray-300">
                Hỗ trợ thanh toán: <strong>VietQR 24/7</strong>, <strong>COD</strong>, thẻ Visa/Mastercard, Trả góp 0%.
              </div>
              <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã đăng ký với Bộ Công Thương</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-900 py-3 text-center text-[11px] text-gray-500">
          © 2026 PRO GEAR Vietnam — Siêu Thị Máy Ảnh, Cinema Line & Flagship DJI. Chuẩn Bán Lẻ Điện Tử Tin Học Ngôi Sao.
        </div>
      </footer>

      {/* ----------------- CART DRAWER / SLIDE-IN MODAL ----------------- */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-[#E30019]" />
                <h3 className="font-bold text-sm text-gray-900">Giỏ Hàng Của Bạn ({totalCartCount} sản phẩm)</h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto stroke-1 text-gray-300 mb-2" />
                  <p className="text-xs">Chưa có sản phẩm nào trong giỏ hàng</p>
                  <button
                    onClick={() => setShowCartDrawer(false)}
                    className="mt-3 btn-retail-primary text-xs px-4 py-2 rounded-md"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="p-2.5 rounded-lg border border-gray-200 flex gap-3 bg-white">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded bg-gray-50 p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.product.name}</h4>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">Mã: {item.product.sku}</div>
                      <div className="text-xs font-bold text-[#E30019] mt-1">
                        {formatVND(item.product.price)}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="p-1 hover:bg-gray-100 text-gray-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="p-1 hover:bg-gray-100 text-gray-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Checkout Form */}
              {cart.length > 0 && (
                <form onSubmit={handleCheckout} className="pt-3 border-t border-gray-200 space-y-2.5">
                  <div className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                    Thông Tin Đặt Hàng & Giao Tận Nơi
                  </div>

                  <div>
                    <input
                      type="text"
                      data-testid="input-customer-name"
                      placeholder="Họ và tên người nhận *"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#E30019]"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      data-testid="input-customer-phone"
                      placeholder="Số điện thoại nhận hàng *"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#E30019]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      data-testid="input-customer-address"
                      placeholder="Địa chỉ giao hàng chi tiết (Số nhà, đường, phường/xã) *"
                      required
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#E30019]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      data-testid="input-customer-note"
                      placeholder="Ghi chú đơn hàng (nếu có)"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs focus:outline-none focus:border-[#E30019]"
                    />
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-gray-700">Phương thức thanh toán:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        data-testid="payment-method-vietqr"
                        onClick={() => setPaymentMethod('VIETQR')}
                        className={`p-2 rounded-md border text-center font-bold flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'VIETQR'
                            ? 'border-[#E30019] bg-red-50 text-[#E30019]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Quét VietQR (24/7)</span>
                      </button>

                      <button
                        type="button"
                        data-testid="payment-method-cod"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2 rounded-md border text-center font-bold flex items-center justify-center gap-1.5 transition ${
                          paymentMethod === 'COD'
                            ? 'border-[#E30019] bg-red-50 text-[#E30019]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Giao Hàng (COD)</span>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    data-testid="btn-submit-order"
                    disabled={isSubmittingOrder}
                    className="w-full py-3 btn-retail-primary text-white font-bold text-xs rounded-md shadow mt-3 flex items-center justify-center gap-2"
                  >
                    {isSubmittingOrder ? (
                      <span>Đang tạo đơn hàng...</span>
                    ) : (
                      <>
                        <span>XÁC NHẬN ĐẶT HÀNG</span>
                        <span>• {formatVND(totalAmount)}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Drawer Footer Summary */}
            {cart.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-500">Tổng thanh toán:</span>
                <span className="text-base font-bold text-[#E30019]">{formatVND(totalAmount)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ORDER SUCCESS & VIETQR SCAN MODAL ----------------- */}
      {orderSuccess && (
        <div data-testid="order-success-modal" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-6 text-gray-900 shadow-2xl animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="font-bold text-base text-gray-900">Đặt Hàng Thành Công!</h3>
              <p className="text-xs text-gray-500">
                Mã đơn hàng: <strong data-testid="success-order-number" className="text-[#E30019] font-mono text-sm">{orderSuccess.orderNumber}</strong>
              </p>
            </div>

            {orderSuccess.paymentMethod === 'VIETQR' && (
              <div className="mb-4">
                <VietQrPaymentBox
                  orderNumber={orderSuccess.orderNumber}
                  amount={orderSuccess.totalAmount}
                  customerName={orderSuccess.customerName}
                  isCompact={true}
                />
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1 mb-4 text-gray-600">
              <div>Khách hàng: <strong>{orderSuccess.customerName}</strong> ({orderSuccess.customerPhone})</div>
              <div>Tổng tiền: <strong className="text-[#E30019]">{formatVND(orderSuccess.totalAmount)}</strong></div>
              <div>Giao tới: <span>{orderSuccess.shippingAddress}</span></div>
            </div>

            <button
              onClick={() => {
                setOrderSuccess(null);
                setShowCartDrawer(false);
              }}
              className="w-full py-2.5 btn-retail-primary text-white font-bold text-xs rounded-md shadow"
              data-testid="btn-close-success-modal"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      )}

      {/* ----------------- WARRANTY LOOKUP MODAL (TIN HỌC NGÔI SAO STANDARD) ----------------- */}
      {showWarrantyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-xl w-full p-5 relative shadow-2xl text-gray-900 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            <button
              onClick={() => {
                setShowWarrantyModal(false);
                setWarrantyResult(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#E30019] mb-1">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-gray-900">Tra Cứu Bảo Hành Điện Tử Pro Gear</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Nhập Mã Đơn Hàng (VD: PRO-20261016-8942), Số Serial (SN) trên thân máy hoặc Số Điện Thoại mua hàng.
            </p>

            <form onSubmit={handleCheckWarranty} className="flex space-x-2 mb-2">
              <input
                type="text"
                data-testid="warranty-query-input"
                placeholder="Nhập Mã Đơn (PRO-...), Số Serial (SN) hoặc Số Điện Thoại..."
                value={serialQuery}
                onChange={(e) => setSerialQuery(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 font-mono focus:outline-none focus:border-[#E30019]"
              />
              <button
                type="submit"
                data-testid="btn-submit-warranty"
                disabled={isCheckingWarranty}
                className="px-4 py-2 btn-retail-primary text-white text-xs font-bold rounded-md shadow shrink-0 flex items-center gap-1"
              >
                {isCheckingWarranty ? (
                  <span>Đang tra cứu...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Tra Cứu</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Sample Chips */}
            <div className="text-[11px] text-gray-500 mb-4 flex flex-wrap gap-1.5 items-center">
              <span>Mẫu thử:</span>
              <button
                type="button"
                data-testid="chip-warranty-order"
                onClick={() => setSerialQuery('PRO-20261016-8942')}
                className="px-2 py-0.5 rounded bg-red-50 text-[#E30019] border border-red-200 font-mono text-[10px]"
              >
                PRO-20261016-8942 (Mã Đơn Hàng)
              </button>
              <button
                type="button"
                data-testid="chip-warranty-serial"
                onClick={() => setSerialQuery('SONY-FX3-VN-9901')}
                className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px]"
              >
                SONY-FX3-VN-9901 (Serial SN)
              </button>
              <button
                type="button"
                data-testid="chip-warranty-phone"
                onClick={() => setSerialQuery('0988776655')}
                className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[10px]"
              >
                0988776655 (Theo SĐT)
              </button>
            </div>

            {/* WARRANTY RESULT DISPLAY */}
            {warrantyResult && (
              <div data-testid="warranty-result" className="border-t border-gray-200 pt-3 space-y-3">
                {/* CASE 1: ORDER_RESULT */}
                {warrantyResult.type === 'ORDER_RESULT' && (
                  <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>CHỨNG NHẬN BẢO HÀNH ĐIỆN TỬ THEO ĐƠN HÀNG</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {warrantyResult.isCompleted ? 'Đang Bảo Hành' : 'Chờ Giao Máy'}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-md border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-700">
                      <div>Mã Đơn: <strong className="text-[#E30019] font-mono">{warrantyResult.orderNumber}</strong></div>
                      <div>Khách hàng: <strong className="text-gray-900">{maskCustomerName(warrantyResult.customerName)}</strong></div>
                      <div>SĐT: <strong className="text-gray-900 font-mono">{maskPhoneNumber(warrantyResult.customerPhone)}</strong></div>
                      <div>Thanh toán: <strong className="text-emerald-700 font-mono">{warrantyResult.paymentMethod || 'VIETQR'} • {warrantyResult.isPaid ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}</strong></div>
                      <div className="sm:col-span-2 text-gray-500">Địa chỉ: <span>{warrantyResult.shippingAddress}</span></div>
                    </div>

                    {/* Devices list with SKU & Serial */}
                    <div className="space-y-2">
                      <div className="font-bold text-gray-900 text-xs">Danh Sách Thiết Bị Bảo Hành:</div>
                      {(warrantyResult.items || []).map((itm: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-white rounded-md border border-gray-200 space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="font-bold text-gray-900 text-xs">{itm.productName}</div>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-300 text-amber-800 font-mono text-[10px] font-bold">
                                  Mã Hàng (SKU): {itm.productSku || 'ILME-FX3-BODY'}
                                </span>
                                <span className="text-gray-500 text-[11px]">x{itm.quantity || 1}</span>
                              </div>
                            </div>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                              Đang Bảo Hành
                            </span>
                          </div>

                          <div className="border-t border-gray-100 pt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-600">
                            <div>Mã Serial (SN): <strong className="text-[#E30019] font-mono">{itm.serialNumber}</strong></div>
                            <div>Thời hạn BH: <strong className="text-gray-900">24 Tháng</strong></div>
                            <div>Hạn BH tới: <strong className="text-emerald-700 font-mono">{itm.warrantyExpires}</strong></div>
                            <div>
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Còn {itm.daysRemaining || 728} ngày hiệu lực</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CASE 2: SOLD_ACTIVE */}
                {warrantyResult.type === 'SOLD_ACTIVE' && (
                  <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>THIẾT BỊ ĐANG TRONG THỜI HẠN BẢO HÀNH</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Đang Hiệu Lực
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-md border border-gray-200 space-y-1 text-[11px] text-gray-700">
                      <div>Thiết bị: <strong className="text-gray-900">{warrantyResult.productName}</strong></div>
                      <div>Mã Hàng (SKU): <strong className="text-amber-800 font-mono">{warrantyResult.productSku || 'ILME-FX3-BODY'}</strong></div>
                      <div>Mã Serial (SN): <strong className="text-[#E30019] font-mono">{warrantyResult.serialNumber}</strong></div>
                      <div>Thời hạn BH: <strong className="text-gray-900">{warrantyResult.warrantyMonths} Tháng</strong> (Hạn tới: <span className="text-emerald-700 font-mono font-bold">{warrantyResult.warrantyExpires}</span>)</div>
                      <div className="text-emerald-700 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Còn {warrantyResult.daysRemaining} ngày hiệu lực</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 3: NOT_FOUND */}
                {warrantyResult.type === 'NOT_FOUND' && (
                  <div className="p-3.5 rounded-lg border border-red-300 bg-red-50 text-xs text-red-700 space-y-1">
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Không Tìm Thấy Thông Tin Bảo Hành</span>
                    </div>
                    <p className="text-[11.5px] text-red-600">
                      Không tìm thấy mã &quot;{warrantyResult.query}&quot; trên hệ thống. Quý khách vui lòng kiểm tra lại tem dán trên thân máy hoặc liên hệ hotline 1900 8899.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ORDER LOOKUP MODAL (CUSTOMER SELF-SERVICE) ----------------- */}
      {showOrderLookupModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-5 relative shadow-2xl text-gray-900">
            <button
              onClick={() => setShowOrderLookupModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#E30019] mb-1">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold text-base text-gray-900">Tra Cứu Đơn Hàng Của Bạn</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Nhập Mã Đơn Hàng (VD: PRO-20261016-8942) hoặc Số Điện Thoại mua hàng.
            </p>

            <form onSubmit={handleSearchOrder} className="flex space-x-2 mb-3">
              <input
                type="text"
                placeholder="Nhập Mã Đơn hoặc SĐT..."
                value={orderLookupQuery}
                onChange={(e) => setOrderLookupQuery(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#E30019]"
              />
              <button
                type="submit"
                disabled={isSearchingOrder}
                className="btn-retail-primary text-white text-xs font-bold px-4 py-2 rounded-md shadow"
              >
                Tra Cứu
              </button>
            </form>

            {orderCancelSuccessMsg && (
              <div className="p-2.5 rounded bg-emerald-50 text-emerald-800 text-xs mb-2 border border-emerald-200">
                {orderCancelSuccessMsg}
              </div>
            )}

            {orderLookupResult && orderLookupResult !== 'NOT_FOUND' && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Mã: {orderLookupResult.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    orderLookupResult.orderStatus === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : orderLookupResult.orderStatus === 'CANCELLED'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {orderLookupResult.orderStatus === 'COMPLETED' ? 'Đã Giao Thành Công' : orderLookupResult.orderStatus === 'CANCELLED' ? 'Đã Hủy' : 'Đang Xử Lý'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600">Khách: <strong>{orderLookupResult.customerName}</strong> ({orderLookupResult.customerPhone})</div>
                <div className="text-[11px] text-gray-600">Tổng tiền: <strong className="text-[#E30019]">{formatVND(orderLookupResult.totalAmount)}</strong></div>

                {orderLookupResult.orderStatus !== 'CANCELLED' && orderLookupResult.orderStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => handleCancelOrder(orderLookupResult.id)}
                    disabled={isCancellingOrder}
                    className="w-full mt-2 py-1.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded transition"
                  >
                    Hủy Đơn Hàng Này
                  </button>
                )}
              </div>
            )}

            {orderLookupResult === 'NOT_FOUND' && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700">
                Không tìm thấy đơn hàng tương ứng. Vui lòng kiểm tra lại mã đơn hoặc số điện thoại.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- PRODUCT QUICK VIEW / DETAIL MODAL ----------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-3xl w-full p-5 relative shadow-2xl text-gray-900 max-h-[92vh] overflow-y-auto animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image & Gallery */}
              <div>
                <div className="aspect-square bg-white rounded-lg border border-gray-200 p-4 mb-2 flex items-center justify-center">
                  <img
                    src={
                      selectedProduct.images && selectedProduct.images[activeModalImgIdx]
                        ? selectedProduct.images[activeModalImgIdx]
                        : selectedProduct.imageUrl
                    }
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thumbnails */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImgIdx(idx)}
                        className={`w-14 h-14 rounded border p-1 shrink-0 ${
                          activeModalImgIdx === idx ? 'border-[#E30019]' : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Specs */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#E30019] uppercase mb-1">
                    {selectedProduct.brand} • {selectedProduct.category}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {selectedProduct.name}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono mb-3">Mã SKU: {selectedProduct.sku}</div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-[#E30019]">
                      {formatVND(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatVND(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Technical Specs Table */}
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1.5 mb-4">
                    <div className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-1">
                      Thông Số Kỹ Thuật Nổi Bật:
                    </div>
                    {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([k, v]) => {
                      const specLabelMap: Record<string, string> = {
                        sensor: 'Cảm biến (Sensor)',
                        video: 'Quay Video',
                        stabilization: 'Chống rung (Stabilization)',
                        weight: 'Trọng lượng',
                        battery: 'Thời lượng Pin / Nguồn',
                        flighttime: 'Thời gian bay',
                        payload: 'Tải trọng chịu lực',
                        features: 'Tính năng nổi bật',
                        storage: 'Bộ nhớ / Ổ cứng',
                        screen: 'Màn hình hiển thị',
                      };
                      const label = specLabelMap[k.toLowerCase()] || k;
                      return (
                        <div key={k} className="flex justify-between text-gray-600 border-b border-gray-200/60 pb-1">
                          <span className="font-medium text-gray-600">{label}:</span>
                          <strong className="text-gray-900 text-right max-w-[220px] truncate">{String(v)}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-2.5 btn-retail-primary text-white font-bold text-xs rounded-md shadow flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="p-2.5 rounded-md border border-gray-200 hover:bg-gray-50 text-gray-600"
                    title="Yêu thích"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-md shadow-2xl text-xs font-semibold flex items-center space-x-2 border border-gray-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Floating Contact Bubbles (Zalo + Live Advisor Chat) */}
      <FloatingContactWidget
        onOpenLiveChat={() => setIsLiveChatOpen(true)}
        activeAdvisorName={activeAdvisorName}
      />

      {/* Customer Live Chat Drawer with Email/FB Login */}
      <CustomerChatDrawer
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        currentProductName="Sony FX3 Cinema Line Body"
      />

      {/* Installment 0% Modal */}
      <InstallmentModal
        isOpen={isInstallmentOpen}
        onClose={() => setIsInstallmentOpen(false)}
      />

      {/* Trade-in Upgrade Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
      />

      {/* Customer Authentication Modal */}
      <CustomerAuthModal
        isOpen={showCustomerAuthModal}
        onClose={() => setShowCustomerAuthModal(false)}
        onSuccess={(user) => {
          setCustomerUser(user);
          showNotification(`Đăng nhập thành công! Chào mừng ${user.name}`);
        }}
      />
    </div>
  );
}

export default App;
