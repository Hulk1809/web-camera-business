import React, { useState, useEffect } from 'react';
import {
  Camera,
  Film,
  Video,
  ShieldCheck,
  ShoppingBag,
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
  Calendar,
  AlertCircle,
  PhoneCall
} from 'lucide-react';
import { DayNightVisionShowcase } from './components/DayNightVisionShowcase';
import { SpotlightProductCard } from './components/SpotlightProductCard';
import { triggerConfetti } from './utils/confetti';

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

const DEFAULT_PRODUCTS: ProProduct[] = [
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
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=1000',
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
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
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
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1000',
    ],
    shortDesc: 'Cảm biến Exmor R CMOS 33MP Full-Frame, quay 4K 60p 10-bit 4:2:2, lấy nét theo mắt Real-time Eye-AF đỉnh cao.',
    description: 'Sony Alpha 7 IV là chuẩn mực máy ảnh hybrid cho nhiếp ảnh gia và nhà sáng tạo video hiện đại. Trang bị chip xử lý hình ảnh BIONZ XR thế hệ mới, bộ lọc màu S-Cinetone kế thừa từ dòng Cinema cao cấp, chống rung thân máy IBIS 5.5 stops.',
    specifications: {
      sensor: 'Full-Frame 33.0 Megapixel Exmor R BSI CMOS',
      video: '4K 60p (Super 35) & 4K 30p 7K oversampled 10-bit 4:2:2',
      stabilization: 'Chống rung cảm biến IBIS 5 trục 5.5 stops',
      weight: '658g (Kèm pin)',
      storage: '2 khe cắm CFexpress Type A / SD UHS-II',
      screen: 'Màn hình xoay lật đa góc 3.0 inch',
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
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    ],
    shortDesc: 'Cần trục sợi Carbon thế hệ 2, thuật toán chống rung RS 4th Gen, hỗ trợ Focus Pro LiDAR 76.800 điểm.',
    description: 'Hệ thống gimbal flagship phục vụ quay phim điện ảnh. Trang bị cánh tay trục sợi carbon siêu cứng chịu tải 4.5kg, tương thích với hầu hết máy quay cinema FX6, RED Komodo, Canon C70 cùng ống kính nặng. Hệ thống khóa trục tự động 2nd Gen khởi động quay tức thì trong 1 giây.',
    specifications: {
      payload: 'Tải trọng 4.5kg (Khung carbon siêu cứng)',
      flightTime: 'Thời lượng pin 13 tiếng hoạt động liên tục',
      stabilization: 'Thuật toán chống rung RS 4th Gen tối ưu góc nghiêng cao',
      weight: '1.6kg (Bao gồm tay cầm và pin)',
      screen: 'Màn hình cảm ứng màu OLED 1.8 inch',
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
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    images: [
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1000',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000',
    ],
    shortDesc: 'Cảm biến 1-inch CMOS, quay 4K 120fps, màn hình OLED xoay 2 inch, chống rung cơ học 3 trục, kèm Mic 2.',
    description: 'Camera sáng tạo nội dung bỏ túi bán chạy nhất thế giới. Cảm biến 1-inch cho chất lượng hình ảnh đêm xuất sắc, màu 10-bit D-Log M, lấy nét thần tốc full-pixel, theo dõi khuôn mặt ActiveTrack 6.0, combo bao gồm bộ phát không dây DJI Mic 2 và tay cầm pin phụ.',
    specifications: {
      sensor: '1-inch CMOS độ phân giải cao thu sáng tối ưu ban đêm',
      video: '4K 120fps Slow-mo, 4K 60fps HDR, 10-bit D-Log M & HLG',
      stabilization: 'Chống rung cơ học 3 trục thực thụ (không giật hình)',
      weight: 'Chỉ 179g bỏ túi siêu nhẹ',
      screen: 'Màn hình cảm ứng OLED xoay ngang/dọc 2.0 inch',
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
    imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    images: [
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000',
    ],
    shortDesc: 'Cảm biến xếp chồng 45MP BSI, chip kép DIGIC Accelerator + DIGIC X, quay 8K 60p RAW nội bộ, Eye Control AF thế hệ mới.',
    description: 'Cỗ máy đỉnh cao của Canon cho các nhiếp ảnh gia thương mại và thể thao. Khả năng chụp liên tiếp 30fps không chớp đen, lấy nét điều khiển bằng mắt người chụp Eye Control AF chuẩn xác, chống rung phối hợp thân máy và ống kính lên tới 8.5 stops.',
    specifications: {
      sensor: '45.0 Megapixel Back-Illuminated Stacked Full-Frame CMOS',
      video: '8K 60p RAW / 4K 120p 10-bit Canon Log 2/3 & HDR-HLG',
      stabilization: 'IBIS chống rung 5 trục hiệu quả tới 8.5 stops',
      weight: '746g (Kèm pin LP-E6P)',
      storage: '1 khe CFexpress Type B + 1 khe SD UHS-II',
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
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000',
    ],
    shortDesc: 'Trọng lượng siêu nhẹ dưới 249g, cảm biến chướng ngại vật đa hướng 360°, quay 4K 60p HDR dọc chân thực.',
    description: 'Flycam mini mạnh mẽ nhất hiện nay. Không cần đăng ký giấy phép bay khắt khe tại nhiều quốc gia nhờ trọng lượng dưới 249g, trang bị cảm biến va chạm 360 độ, camera xoay dọc 90 độ vật lý hoàn hảo cho video TikTok/Reels chất lượng cao.',
    specifications: {
      weight: 'Dưới 249g siêu nhẹ bỏ vừa túi áo khoác',
      video: '4K 60fps HDR, 4K 100fps Slow-mo, 10-bit D-Log M & HLG',
      flightTime: '45 phút với pin Intelligent Flight Battery Plus',
      stabilization: 'Gimbal xoay dọc 90 độ vật lý True Vertical',
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
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000',
    ],
    shortDesc: 'Cảm biến Full-Frame 6K 6048x4032, dải tương phản 13 stops, ngàm L-Mount, màn hình cảm ứng HDR 5 inch 1500 nits.',
    description: 'Máy quay điện ảnh thế hệ mới nhất từ Blackmagic Design với cảm biến Full-Frame 6K sắc nét kinh ngạc, ghi hình Blackmagic RAW 12-bit vào thẻ CFexpress B hoặc ổ cứng SSD ngoài qua cổng USB-C, kèm phần mềm DaVinci Resolve Studio bản quyền.',
    specifications: {
      sensor: 'Full-Frame 6K (6048 x 4032) Open Gate 3:2',
      video: '6K 36fps Open Gate, 6K 48fps 17:9, Blackmagic RAW 12-bit',
      stabilization: 'Tương thích mọi thiết bị chống rung và Tripod chuẩn điện ảnh',
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
      'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=1000',
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
      'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=1000',
    ],
    shortDesc: 'Ống kính tiêu chuẩn G Master thế hệ II nhẹ nhất thế giới, khẩu độ F2.8 toàn dải, 4 động cơ lấy nét XD Linear.',
    description: 'Ống kính zoom đa dụng số 1 cho các nhiếp ảnh gia và nhà quay phim chuyên nghiệp. Nhẹ hơn 22% so với đời 1, độ sắc nét vượt trội từ tâm đến rìa ảnh, bokeh tròn mịn với 11 lá khẩu, vòng chỉnh khẩu độ có nấc gạt de-click mượt mà cho quay phim.',
    specifications: {
      sensor: 'Tiêu cự 24-70mm Full-Frame ngàm E-Mount',
      video: 'Tối ưu độ thở ống kính (Focus Breathing) cực thấp cho điện ảnh',
      stabilization: 'Tương thích chống rung thân máy SteadyShot Active',
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
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000',
    ],
    shortDesc: 'Thu âm 32-bit Float nội bộ chống vỡ tiếng, chống ồn thông minh DSP, phạm vi truyền 250m, hộp sạc pin 18 giờ.',
    description: 'Tiêu chuẩn vàng cho âm thanh video creator và phóng viên. Tính năng ghi âm 32-bit float giúp không bao giờ bị méo tiếng dù tiếng hét lớn hay thì thầm nhỏ, kết nối Bluetooth trực tiếp với điện thoại hoặc máy quay qua jack 3.5mm / Type-C / Lightning.',
    specifications: {
      sensor: 'Thu âm 32-bit Float nội bộ 8GB, 48kHz / 24-bit chất lượng cao',
      flightTime: 'Thời lượng hoạt động 6 giờ (18 giờ kèm hộp sạc)',
      stabilization: 'Khử ồn thông minh DSP lọc sạch tiếng gió và môi trường',
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
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1000',
    ],
    shortDesc: 'Cảm biến xếp chồng 45.7MP không màn trập cơ học, quay 8.3K 60p N-RAW nội bộ, chụp 120fps.',
    description: 'Được mệnh danh là "Baby Z9", Nikon Z8 gói gọn sức mạnh của máy ảnh flagship thể thao vào thân máy nhỏ hơn 30%. Loại bỏ hoàn toàn màn trập cơ học nhờ tốc độ đọc cảm biến cực nhanh, nhận diện 9 loại chủ thể thông minh theo thời gian thực.',
    specifications: {
      sensor: '45.7 Megapixel Stacked BSI CMOS Full-Frame',
      video: '8.3K 60p N-RAW 12-bit & 4.1K 120p, Apple ProRes 422 HQ',
      stabilization: 'Synchro VR chống rung kết hợp thân máy và ống kính 6.0 stops',
      weight: '910g (Kèm pin)',
    },
  },
];

const CATEGORIES = [
  'Tất Cả',
  'Máy Ảnh Mirrorless & DSLR',
  'Máy Quay Điện Ảnh & Cinema',
  'Flycam & Drone DJI',
  'Gimbal & Chống Rung DJI Ronin',
  'Action Cam & Pocket Creator',
  'Ống Kính Chuyên Dụng (Lenses)',
  'Âm Thanh & Ánh Sáng Studio',
];

const BRANDS = ['Tất Cả', 'DJI', 'Sony', 'Canon', 'Fujifilm', 'Blackmagic Design', 'Nikon'];

export function App() {
  const [products, setProducts] = useState<ProProduct[]>(() => {
    try {
      const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PRODUCTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất Cả');
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất Cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState<boolean>(false);

  // Detail Modal & Multi-Image Gallery State
  const [selectedProduct, setSelectedProduct] = useState<ProProduct | null>(null);
  const [activeModalImgIdx, setActiveModalImgIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const openProductDetail = (prod: ProProduct) => {
    setActiveModalImgIdx(0);
    setSelectedProduct(prod);
  };

  // Keyboard navigation for image gallery & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProduct) return;
      const imgs = (selectedProduct.images && selectedProduct.images.length > 0)
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

  // Gen Z Shopper Wishlist & Live Floating Toast
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('PRO_GEAR_WISHLIST');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showOnlyWishlist, setShowOnlyWishlist] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; show: boolean } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

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
      showToast(isAdded ? 'Đã thêm thiết bị vào danh sách Yêu Thích ❤️' : 'Đã xóa khỏi Yêu Thích');
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
              stockQuantity: Number(item.stockQuantity ?? 10),
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
        } else if (data && Array.isArray(data.items) && data.items.length === 0) {
          await fetch('/api/products/seed');
          const retryRes = await fetch('/api/products?limit=100');
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            if (retryData && Array.isArray(retryData.items) && retryData.items.length > 0) {
              const mapped: ProProduct[] = retryData.items.map((item: any) => {
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
                  stockQuantity: Number(item.stockQuantity ?? 10),
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
        }
      }
    } catch {
      // Backend not running, load from persistent storage
      setIsBackendConnected(false);
      try {
        const local = localStorage.getItem('PROGEAR_SHARED_PRODUCTS');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
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
          if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchWishlist = !showOnlyWishlist || wishlist.includes(p.id);
    const matchCat = selectedCategory === 'Tất Cả' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'Tất Cả' || p.brand.toLowerCase() === selectedBrand.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query);
    return matchWishlist && matchCat && matchBrand && matchSearch;
  });

  // Hot Featured Product for Hero Section (Configured by Admin)
  const hotProduct = products.find((p) => p.isFeatured) || null;

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
      showToast(`Đã thêm ${product.name} vào danh sách Đặt Hàng Chờ Về (Pre-Order)! 📞`);
    } else {
      showToast(`Đã thêm ${product.name} vào giỏ hàng! 🛒`);
    }
    setShowCartDrawer(true);
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

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // SUBMIT ORDER TO API - THÔNG API VỚI ADMIN!
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

    // 2. Always persist to shared localStorage sync layer so Admin and Storefront stay 100% in sync
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

  // WARRANTY CHECK VIA REAL API
  const handleCheckWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = serialQuery.trim().toUpperCase();
    if (!query) return;

    setIsCheckingWarranty(true);
    setWarrantyResult(null);

    try {
      const res = await fetch(`/api/warranty/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setWarrantyResult(data);
        setIsCheckingWarranty(false);
        return;
      }
    } catch {
      // API error or offline fallback
    }

    // Smart fallback check for common demo serials
    const validSampleSerials: Record<string, any> = {
      'DJI-M3PRO-2026-8899': {
        serialNumber: 'DJI-M3PRO-2026-8899',
        productName: 'DJI Mavic 3 Pro Cine Combo (Apple ProRes)',
        brand: 'DJI',
        warrantyMonths: 24,
        soldDate: '15/03/2026',
        warrantyExpires: '15/03/2028 (Còn 720 ngày)',
        isGenuine: true,
      },
      'SONY-FX3-VN-9901': {
        serialNumber: 'SONY-FX3-VN-9901',
        productName: 'Sony Cinema Line FX3 Body Chính Hãng',
        brand: 'Sony',
        warrantyMonths: 24,
        soldDate: '10/02/2026',
        warrantyExpires: '10/02/2028 (Còn 690 ngày)',
        isGenuine: true,
      },
      'DJI-POCKET3-2026-5521': {
        serialNumber: 'DJI-POCKET3-2026-5521',
        productName: 'DJI Osmo Pocket 3 Creator Combo',
        brand: 'DJI',
        warrantyMonths: 12,
        soldDate: '01/04/2026',
        warrantyExpires: '01/04/2027 (Còn 350 ngày)',
        isGenuine: true,
      },
      'SONY-A7M4-VN-1102': {
        serialNumber: 'SONY-A7M4-VN-1102',
        productName: 'Sony Alpha 7 IV (A7M4) Body',
        brand: 'Sony',
        warrantyMonths: 24,
        soldDate: '20/01/2026',
        warrantyExpires: '20/01/2028 (Còn 650 ngày)',
        isGenuine: true,
      },
    };

    if (validSampleSerials[query]) {
      setWarrantyResult(validSampleSerials[query]);
    } else {
      setWarrantyResult({
        serialNumber: query,
        isGenuine: false,
        message: 'Mã Serial Number không tồn tại trên hệ thống bảo hành hoặc chưa được kích hoạt xuất kho.',
      });
    }

    setIsCheckingWarranty(false);
  };

  // Tra cứu đơn hàng & Hủy đơn hàng từ phía khách
  const handleLookupOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderLookupQuery.trim().toUpperCase();
    if (!query) return;
    setIsSearchingOrder(true);
    setOrderCancelSuccessMsg('');
    setOrderLookupResult(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && (data.id || data.orderNumber)) {
          setOrderLookupResult(data);
          setIsSearchingOrder(false);
          return;
        }
      }
    } catch {
      // offline fallback
    }

    // Local storage fallback lookup
    const localSync = localStorage.getItem('PRO_GEAR_ORDERS_SYNC');
    if (localSync) {
      try {
        const parsed = JSON.parse(localSync);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (o: any) =>
              (o.orderNumber && o.orderNumber.toUpperCase() === query) ||
              (o.customerPhone && o.customerPhone.includes(query)) ||
              (o.id && String(o.id) === query)
          );
          if (match) {
            setOrderLookupResult(match);
            setIsSearchingOrder(false);
            return;
          }
        }
      } catch {}
    }

    setOrderLookupResult({ notFound: true, query });
    setIsSearchingOrder(false);
  };

  const handleCancelOrderCustomer = async (orderIdOrNumber: string) => {
    if (!window.confirm('Quý khách có chắc chắn muốn hủy đơn hàng này không?')) return;
    setIsCancellingOrder(true);

    try {
      await fetch(`/api/orders/${orderIdOrNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
    } catch {}

    setOrderLookupResult((prev: any) => prev ? { ...prev, orderStatus: 'CANCELLED', status: 'CANCELLED' } : null);
    const localSync = localStorage.getItem('PRO_GEAR_ORDERS_SYNC');
    if (localSync) {
      try {
        const parsed = JSON.parse(localSync);
        const updated = parsed.map((o: any) =>
          (o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber)
            ? { ...o, orderStatus: 'CANCELLED', status: 'CANCELLED' }
            : o
        );
        localStorage.setItem('PRO_GEAR_ORDERS_SYNC', JSON.stringify(updated));
      } catch {}
    }

    setOrderCancelSuccessMsg('Đơn hàng đã được hủy thành công!');
    setIsCancellingOrder(false);
  };

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* ----------------- TOP STATUS BAR ----------------- */}
      <div className="bg-gradient-to-r from-red-950/80 via-black to-slate-900 border-b border-red-900/30 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-red-400 font-semibold">
              <Flame className="w-3.5 h-3.5 animate-pulse text-red-500" />
              <span>ĐẠI LÝ ỦY QUYỀN CHÍNH THỨC: DJI • SONY • CANON • FUJIFILM</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Bảo hành điện tử 12-24 tháng theo số Serial • Đổi mới 30 ngày
            </span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <button
              onClick={() => setShowWarrantyModal(true)}
              className="hover:text-red-400 flex items-center space-x-1 transition font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Tra Cứu Bảo Hành Serial</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">Hotline: <strong className="text-white">1900 8899</strong></span>
          </div>
        </div>
      </div>

      {/* ----------------- MAIN HEADER ----------------- */}
      <header className="sticky top-0 z-40 bg-[#070A11]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setSelectedCategory('Tất Cả'); setSelectedBrand('Tất Cả'); setSearchQuery(''); }}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950">
              <Camera className="w-5 h-5 text-white" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center space-x-1">
                <span>PRO</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">GEAR</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/30 rounded ml-1">CINEMA</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                Máy Ảnh • Cinema • Flycam DJI
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm Sony A7M4, DJI Mavic 3 Pro, Pocket 3, FX3, RS 4 Pro, Canon R5..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 text-sm border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                setShowOnlyWishlist((prev) => !prev);
                if (!showOnlyWishlist) {
                  showToast(wishlist.length > 0 ? `Đang lọc ${wishlist.length} thiết bị yêu thích ❤️` : 'Danh sách yêu thích đang trống! Nhấn ❤️ trên máy để thêm');
                } else {
                  showToast('Đang hiển thị toàn bộ sản phẩm');
                }
              }}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition active:scale-95 ${
                showOnlyWishlist
                  ? 'bg-red-500/20 border-red-500/80 text-red-400 shadow-lg shadow-red-950 ring-1 ring-red-500/50'
                  : wishlist.length > 0
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                  : 'btn-secondary-genz text-slate-300'
              }`}
              title="Danh sách thiết bị yêu thích"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-red-500 text-red-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Yêu Thích</span>
              {wishlist.length > 0 && (
                <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Order Lookup & Cancel Button */}
            <button
              onClick={() => {
                setShowOrderLookupModal(true);
                setOrderCancelSuccessMsg('');
              }}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl btn-secondary-genz text-slate-300 text-xs font-semibold"
              title="Tra cứu tình trạng đơn hàng hoặc hủy đơn"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Tra Cứu & Hủy Đơn</span>
            </button>

            {/* Warranty Button */}
            <button
              onClick={() => setShowWarrantyModal(true)}
              className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl btn-secondary-genz text-slate-300 text-xs font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Bảo Hành</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative btn-primary-genz flex items-center space-x-2 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg shadow-red-950 transition active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ Hàng</span>
              {cart.length > 0 && (
                <span className="bg-amber-400 text-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black animate-bounce">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-2 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm máy ảnh, máy quay, flycam DJI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1.5 py-1.5 whitespace-nowrap text-xs">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat && !showOnlyWishlist;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowOnlyWishlist(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition ${
                    active
                      ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}

            {/* Wishlist Quick Filter Pill */}
            <button
              onClick={() => setShowOnlyWishlist((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center space-x-1.5 ${
                showOnlyWishlist
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-950 ring-1 ring-red-400'
                  : 'text-red-400/90 hover:text-red-300 hover:bg-slate-900 border border-red-500/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyWishlist || wishlist.length > 0 ? 'fill-current' : ''}`} />
              <span>Yêu Thích ({wishlist.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- HERO PROMO SHOWCASE ----------------- */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0F1424] via-[#090D17] to-[#070A11] py-8 lg:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className={hotProduct ? "lg:col-span-7 space-y-4" : "lg:col-span-12 space-y-4 max-w-4xl"}>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Hệ Thống Thiết Bị Nhiếp Ảnh & Điện Ảnh Chuyên Nghiệp</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              MÁY ẢNH • MÁY QUAY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-amber-200">
                FLYCAM DJI & GIMBAL CHÍNH HÃNG
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Trang bị đầy đủ hệ sinh thái quay chụp chuyên nghiệp: Cảm biến Full-Frame sắc nét, quay phim 8K/4K 120p, Apple ProRes, dải động 15+ stops, flycam Hasselblad bay 43 phút.
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span>4K 120P & 8K RAW</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>APPLE PRORES 422 HQ</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>FULL-FRAME 35MM</span>
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>BẢO HÀNH THEO SERIAL</span>
              </span>
            </div>

            {/* Brand Chips */}
            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Thương hiệu:</span>
              <div className="flex flex-wrap gap-1.5">
                {BRANDS.map((br) => (
                  <button
                    key={br}
                    onClick={() => setSelectedBrand(br)}
                    className={`px-2.5 py-1 rounded text-xs transition ${
                      selectedBrand === br
                        ? 'bg-red-500 text-white font-bold'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flagship Hero Card - Đồng bộ động trực tiếp từ Admin khi quản trị viên chọn "Hàng HOT" */}
          {hotProduct && (
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl glass-panel glass-panel-hover p-6 border border-slate-700/60 shadow-2xl overflow-hidden group">
                <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                  <button
                    onClick={(e) => toggleWishlist(hotProduct.id, e)}
                    className={`p-2 rounded-full backdrop-blur-md border transition active:scale-75 ${
                      wishlist.includes(hotProduct.id)
                        ? 'bg-red-600 border-red-400 text-white'
                        : 'bg-black/60 border-white/10 text-slate-300 hover:text-red-400'
                    }`}
                    title="Lưu yêu thích"
                  >
                    <Heart className={`w-3.5 h-3.5 ${wishlist.includes(hotProduct.id) ? 'fill-current' : ''}`} />
                  </button>
                  <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase shadow flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" />
                    <span>HOT PRODUCT 2026</span>
                  </div>
                </div>

                <div className="text-xs text-red-400 font-bold tracking-wider uppercase mb-1">
                  {hotProduct.brand} • {hotProduct.category}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {hotProduct.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  {hotProduct.shortDesc || hotProduct.description}
                </p>

                <div className="relative h-48 rounded-2xl overflow-hidden bg-black/40 mb-4 flex items-center justify-center">
                  <img
                    src={hotProduct.imageUrl}
                    alt={hotProduct.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] text-amber-300 font-mono font-bold">
                    {hotProduct.specifications?.sensor || hotProduct.badge || 'Chính Hãng'}
                  </div>
                  {(hotProduct.stockQuantity ?? 0) <= 0 && (
                    <div className="absolute top-2 left-2 bg-amber-500/90 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow">
                      Hết Sẵn • Đặt Chờ Về
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {hotProduct.originalPrice && hotProduct.originalPrice > hotProduct.price && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatVND(hotProduct.originalPrice)}
                      </div>
                    )}
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-300">
                      {formatVND(hotProduct.price)}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(hotProduct)}
                    className={`px-5 py-2.5 ${
                      (hotProduct.stockQuantity ?? 0) <= 0
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-950/40'
                        : 'btn-primary-genz shadow-red-950'
                    } animate-shimmer text-white text-xs font-black rounded-xl shadow-lg transition flex items-center space-x-1.5 active:scale-95`}
                  >
                    {(hotProduct.stockQuantity ?? 0) <= 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Đặt Chờ Về</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Mua Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ----------------- VALUE PROPOSITIONS ----------------- */}
      <section className="bg-slate-950 border-b border-slate-800/80 py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Award className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">100% Chính Hãng</div>
              <div className="text-slate-400 text-[11px]">DJI, Sony, Canon, Fuji VN</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Truck className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">Giao Hỏa Tốc Toàn Quốc</div>
              <div className="text-slate-400 text-[11px]">Miễn phí ship + Kèm kỹ thuật</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">Bảo Hành Serial Trực Tuyến</div>
              <div className="text-slate-400 text-[11px]">Tra cứu SN điện tử minh bạch</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Headphones className="w-6 h-6 text-sky-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-200">Tư Vấn Setup Đoàn Phim</div>
              <div className="text-slate-400 text-[11px]">Hỗ trợ kỹ thuật 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- INTERACTIVE OPTICAL LENS & DAY/NIGHT VISION SHOWCASE ----------------- */}
      <DayNightVisionShowcase />

      {/* ----------------- PRODUCT LISTING SECTION ----------------- */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Listing Title & Count */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{selectedCategory}</span>
              {selectedBrand !== 'Tất Cả' && (
                <span className="text-xs bg-red-600/30 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-normal">
                  {selectedBrand}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Hiển thị {filteredProducts.length} thiết bị nhiếp ảnh, điện ảnh & flycam cao cấp
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Hãng:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-red-500"
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 glass-panel">
            {showOnlyWishlist ? (
              <>
                <Heart className="w-12 h-12 text-red-500/60 mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-slate-200 mb-1">Chưa có thiết bị nào trong danh sách Yêu Thích</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  Hãy nhấn biểu tượng trái tim ❤️ trên bất kỳ chiếc máy ảnh, ống kính hay flycam nào để lưu lại danh sách riêng của bạn!
                </p>
                <button
                  onClick={() => setShowOnlyWishlist(false)}
                  className="px-5 py-2.5 btn-primary-genz text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-950"
                >
                  Khám Phá Toàn Bộ Thiết Bị
                </button>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300 mb-1">Không tìm thấy thiết bị phù hợp</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Hãy thử tìm kiếm với từ khóa khác như "A7M4", "Pocket 3", "Mavic 3", "FX3" hoặc chọn danh mục Tất Cả.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Tất Cả');
                    setSelectedBrand('Tất Cả');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 btn-primary-genz text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-950"
                >
                  Xem Tất Cả Thiết Bị
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <SpotlightProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
                onOpenDetail={openProductDetail}
                formatVND={formatVND}
              />
            ))}
          </div>
        )}
      </main>

      {/* ----------------- DETAIL MODAL ----------------- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 sm:p-7 relative shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsLightboxOpen(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-red-600 transition z-20"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Multi-Image Interactive Gallery (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-3">
                {(() => {
                  const galleryImages = (selectedProduct.images && selectedProduct.images.length > 0)
                    ? selectedProduct.images
                    : [selectedProduct.imageUrl];
                  const activeIdx = Math.min(activeModalImgIdx, galleryImages.length - 1);
                  const currentImg = galleryImages[activeIdx] || selectedProduct.imageUrl;

                  return (
                    <div className="space-y-3">
                      {/* Main Large Image Container */}
                      <div
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/80 border border-slate-800 shadow-xl group cursor-zoom-in"
                        onClick={() => setIsLightboxOpen(true)}
                      >
                        <img
                          src={currentImg}
                          alt={`${selectedProduct.name} - Góc ${activeIdx + 1}`}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        />

                        {/* Top-Left: Angle Counter Badge */}
                        <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none">
                          <span className="bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-1.5 shadow-lg">
                            <Camera className="w-3.5 h-3.5 text-red-400" />
                            <span>Góc chụp {activeIdx + 1} / {galleryImages.length}</span>
                          </span>
                        </div>

                        {/* Top-Right: Lightbox Zoom Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLightboxOpen(true);
                          }}
                          className="absolute top-3 right-3 px-2.5 py-1.5 bg-black/75 hover:bg-black/95 text-white rounded-xl border border-white/10 transition shadow-lg flex items-center space-x-1.5 text-xs font-semibold backdrop-blur-md"
                          title="Phóng to ảnh toàn màn hình"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-red-400" />
                          <span className="text-[11px]">Phóng to</span>
                        </button>

                        {/* Prev / Next Navigation Arrows */}
                        {galleryImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalImgIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
                              }}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110"
                              title="Góc chụp trước"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModalImgIdx((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
                              }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/15 transition-all shadow-xl hover:scale-110"
                              title="Góc chụp tiếp theo"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail Strip (Selector) */}
                      {galleryImages.length > 1 && (
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-0.5">
                            <span className="font-semibold text-slate-300 flex items-center space-x-1">
                              <span>Bộ sưu tập ảnh thiết bị ({galleryImages.length} góc chụp)</span>
                            </span>
                            <span className="text-[10px] text-slate-500">Nhấp vào ảnh để chuyển góc nhìn</span>
                          </div>
                          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 pt-0.5">
                            {galleryImages.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveModalImgIdx(idx)}
                                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                  activeIdx === idx
                                    ? 'border-red-500 ring-2 ring-red-500/50 scale-105 shadow-md shadow-red-500/30'
                                    : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                                }`}
                                title={`Xem góc chụp ${idx + 1}`}
                              >
                                <img src={img} alt={`Góc ${idx + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white px-1.5 py-0.2 rounded">
                                  {idx + 1}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Product Info & Actions (5 cols on lg) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-red-600/30 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-lg font-bold">
                    {selectedProduct.brand}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">SKU: {selectedProduct.sku}</span>
                  <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                    Sẵn hàng
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white leading-snug">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-baseline space-x-3">
                  <div className="text-2xl font-black text-amber-400">
                    {formatVND(selectedProduct.price)}
                  </div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-xs text-slate-400 line-through font-normal">
                      {formatVND(selectedProduct.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Bảo hành chính hãng 24 tháng theo số Serial Number (SN)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Truck className="w-4 h-4 text-sky-400" />
                    <span>Giao hàng hỏa tốc trong 2 giờ tại Hà Nội & TP.HCM</span>
                  </div>
                </div>

                {/* Out of Stock Notice vs In Stock Pill */}
                {(selectedProduct.stockQuantity ?? 0) <= 0 ? (
                  <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/40 text-xs text-amber-200 flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <div className="font-bold text-white">Thiết bị hiện đang tạm hết hàng sẵn tại showroom</div>
                      <div className="text-[11px] text-amber-300/80 mt-0.5">
                        Bạn có thể gửi đơn đặt trước (Pre-Order). Đơn hàng sẽ được chuyển trực tiếp tới chuyên viên Pro Gear để gọi điện thoại hẹn ngày hàng về sớm nhất!
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Sẵn hàng: Còn {selectedProduct.stockQuantity} máy tại showroom Pro Gear</span>
                  </div>
                )}

                <div className="pt-2 flex items-center space-x-2.5">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className={`flex-1 py-3.5 animate-shimmer text-white font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 active:scale-98 ${
                      (selectedProduct.stockQuantity ?? 0) <= 0
                        ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 shadow-amber-950/60'
                        : 'btn-primary-genz shadow-red-950/60'
                    }`}
                  >
                    {(selectedProduct.stockQuantity ?? 0) <= 0 ? (
                      <>
                        <Clock className="w-5 h-5 text-amber-200" />
                        <span>Đặt Hàng Chờ Về (Pre-Order) — CSKH Hẹn Ngày Giao</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        <span>Thêm Vào Giỏ Hàng Ngay</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                    className={`p-3.5 rounded-2xl border transition-all active:scale-90 ${
                      wishlist.includes(selectedProduct.id)
                        ? 'bg-red-500/20 border-red-500/60 text-red-400'
                        : 'btn-secondary-genz text-slate-300 hover:text-red-400'
                    }`}
                    title="Lưu yêu thích"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-current text-red-500' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Specifications Detailed Table */}
            <div className="mt-8 pt-5 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-red-500" />
                <span>Thông Số Kỹ Thuật Chi Tiết (Technical Specifications)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 font-semibold capitalize block text-[11px] mb-0.5">
                      {key === 'sensor'
                        ? 'Cảm Biến (Sensor)'
                        : key === 'video'
                        ? 'Quay Phim (Video Codec)'
                        : key === 'stabilization'
                        ? 'Chống Rung (Stabilization)'
                        : key === 'flightTime'
                        ? 'Thời Lượng Bay (Flight Time)'
                        : key === 'payload'
                        ? 'Tải Trọng (Payload)'
                        : key === 'weight'
                        ? 'Trọng Lượng (Weight)'
                        : key === 'storage'
                        ? 'Thẻ Nhớ / Lưu Trữ'
                        : key === 'screen'
                        ? 'Màn Hình (Screen)'
                        : key === 'autofocus'
                        ? 'Lấy Nét (Autofocus)'
                        : key === 'colorProfiles'
                        ? 'Hệ Màu Điện Ảnh'
                        : key}:
                    </span>
                    <span className="text-slate-200 font-medium">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- FULLSCREEN LIGHTBOX ----------------- */}
      {isLightboxOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Header */}
          {(() => {
            const galleryImages = (selectedProduct.images && selectedProduct.images.length > 0)
              ? selectedProduct.images
              : [selectedProduct.imageUrl];
            const activeIdx = Math.min(activeModalImgIdx, galleryImages.length - 1);

            return (
              <>
                <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-3 text-white">
                    <Camera className="w-5 h-5 text-red-500" />
                    <div>
                      <h3 className="text-sm sm:text-base font-bold">{selectedProduct.name}</h3>
                      <p className="text-xs text-slate-400">
                        Góc chụp {activeIdx + 1} / {galleryImages.length} • Phím mũi tên Trái/Phải để chuyển ảnh, Esc để đóng
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-600 text-white transition shadow-lg"
                    title="Đóng chế độ phóng to (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Center Image with Prev/Next Navigation */}
                <div className="relative flex-1 flex items-center justify-center my-3 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={galleryImages[activeIdx] || selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-300"
                  />

                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveModalImgIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-red-600 text-white transition shadow-2xl backdrop-blur-md border border-white/10"
                        title="Góc chụp trước (Phím mũi tên Trái)"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => setActiveModalImgIdx((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-red-600 text-white transition shadow-2xl backdrop-blur-md border border-white/10"
                        title="Góc chụp tiếp theo (Phím mũi tên Phải)"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Bottom Thumbnails */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center justify-center space-x-3 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveModalImgIdx(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeIdx === idx
                            ? 'border-red-500 ring-4 ring-red-500/40 scale-110 shadow-xl'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ----------------- CART & CHECKOUT DRAWER ----------------- */}
      {showCartDrawer && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end"
          onClick={() => setShowCartDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-base">Giỏ Hàng Thiết Bị</h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/40 transition flex items-center space-x-1"
                    title="Hủy toàn bộ giỏ hàng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hủy giỏ</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowCartDrawer(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition flex items-center"
                  title="Đóng / Hủy xem giỏ hàng"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-slate-700" />
                  <p>Giỏ hàng của bạn đang trống.</p>
                  <p className="text-[11px] mt-1">Hãy chọn sản phẩm máy ảnh hoặc flycam để trải nghiệm.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center space-x-3 group hover:border-slate-700 transition"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-black shrink-0 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition shrink-0"
                          title="Hủy sản phẩm này khỏi giỏ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-xs text-amber-400 font-mono font-bold">
                          {formatVND(item.product.price)}
                        </span>
                        {(item.product.stockQuantity ?? 0) <= 0 && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                            ĐẶT CHỜ VỀ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[10px] text-slate-500 hover:text-red-400 transition"
                        >
                          Xóa món
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Checkout Form */}
              {cart.length > 0 && (
                <form onSubmit={handleCheckout} className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-red-500" />
                    <span>Thông Tin Nhận Hàng & Thanh Toán</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Họ và tên khách hàng *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Số điện thoại liên hệ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Địa chỉ giao hàng chi tiết *</label>
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Ghi chú kỹ thuật (nếu có)</label>
                    <input
                      type="text"
                      placeholder="VD: Cần bay test trước khi giao, xuất hóa đơn VAT công ty..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Phương thức thanh toán</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('VIETQR')}
                        className={`p-2.5 rounded-lg border text-left transition flex items-center space-x-2 ${
                          paymentMethod === 'VIETQR'
                            ? 'border-red-500 bg-red-950/30 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-[11px]">VietQR Ngân Hàng</div>
                          <div className="text-[9px] text-slate-500">Quét mã QR tức thì</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`p-2.5 rounded-lg border text-left transition flex items-center space-x-2 ${
                          paymentMethod === 'COD'
                            ? 'border-red-500 bg-red-950/30 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400'
                        }`}
                      >
                        <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-[11px]">Thanh toán COD</div>
                          <div className="text-[9px] text-slate-500">Nhận hàng thanh toán</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Pre-order notification if cart contains out-of-stock items */}
                  {cart.some((i) => (i.product.stockQuantity ?? 0) <= 0) && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start space-x-2 text-xs text-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-300">Đơn hàng chứa sản phẩm Đặt Chờ Về:</div>
                        <p className="text-[11px] text-amber-300/80 mt-0.5 leading-relaxed">
                          Sản phẩm tạm hết sẵn sẽ được chuyển thành đơn Đặt Trước. Sau khi gửi đơn, nhân viên CSKH Pro Gear sẽ gọi điện qua số điện thoại của bạn để thông báo lịch hàng về và hẹn ngày giao máy.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit & Cancel Buttons */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowCartDrawer(false)}
                        className="w-24 py-3.5 btn-secondary-genz text-slate-300 hover:text-white font-bold text-xs rounded-2xl transition flex items-center justify-center space-x-1.5 active:scale-95"
                      >
                        <X className="w-4 h-4" />
                        <span>Hủy</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmittingOrder}
                        className={`flex-1 py-3.5 ${
                          cart.some((i) => (i.product.stockQuantity ?? 0) <= 0)
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-950/40'
                            : 'btn-primary-genz shadow-red-950'
                        } animate-shimmer text-white font-black text-xs rounded-2xl shadow-xl transition flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95`}
                      >
                        {isSubmittingOrder ? (
                          <span>Đang xử lý đặt hàng...</span>
                        ) : cart.some((i) => (i.product.stockQuantity ?? 0) <= 0) ? (
                          <>
                            <Calendar className="w-4 h-4 text-amber-200" />
                            <span>Gửi Đơn Đặt Trước & Hẹn Lịch ({formatVND(totalAmount)})</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Xác Nhận Đặt Hàng ({formatVND(totalAmount)})</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-red-400/80 hover:text-red-400 transition flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hủy giỏ hàng (Xóa tất cả)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowCartDrawer(false)}
                        className="text-slate-400 hover:text-slate-200 transition"
                      >
                        Tiếp tục xem sản phẩm →
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Total */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Tổng tiền thanh toán:</div>
                  <div className="text-lg font-black text-amber-400">{formatVND(totalAmount)}</div>
                </div>
                <div className="text-[10px] text-slate-500 text-right">
                  Đã bao gồm VAT & Free Ship
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ORDER SUCCESS MODAL ----------------- */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => {
                setOrderSuccess(null);
                setShowCartDrawer(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={`w-14 h-14 ${orderSuccess.isPreOrder ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'} border rounded-full flex items-center justify-center mx-auto mb-3`}>
              {orderSuccess.isPreOrder ? (
                <PhoneCall className="w-8 h-8 animate-bounce" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {orderSuccess.isPreOrder ? 'TIẾP NHẬN ĐƠN ĐẶT HÀNG CHỜ VỀ!' : 'ĐẶT HÀNG THÀNH CÔNG!'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {orderSuccess.isPreOrder ? (
                <span className="text-amber-200">
                  Hệ thống đã chuyển đơn tới Admin. Nhân viên CSKH sẽ <strong>gọi điện cho bạn qua số {orderSuccess.customerPhone}</strong> để hẹn lịch hàng về và giao máy sớm nhất!
                </span>
              ) : (
                'Đơn hàng của bạn đã được chuyển tới hệ thống điều phối Pro Gear Operations.'
              )}
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs mb-4">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Mã đơn hàng:</span>
                <span className="font-mono font-bold text-red-400 text-sm">
                  {orderSuccess.orderNumber || orderSuccess.id}
                </span>
              </div>
              {orderSuccess.isPreOrder && (
                <div className="flex justify-between border-b border-slate-800/80 pb-2 text-amber-300">
                  <span className="text-slate-400">Loại đơn hàng:</span>
                  <span className="font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Đặt Hàng Chờ Về (CSKH Sẽ Gọi Hẹn Ngày)
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Khách hàng:</span>
                <span className="text-white font-medium">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Điện thoại:</span>
                <span className="text-white font-medium">{orderSuccess.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tổng thanh toán:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {formatVND(orderSuccess.totalAmount)}
                </span>
              </div>
            </div>

            {/* VietQR Quick Scan */}
            {orderSuccess.paymentMethod === 'VIETQR' && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-red-500/30 mb-4 text-center">
                <div className="text-xs font-bold text-amber-400 flex items-center justify-center space-x-1.5 mb-2">
                  <QrCode className="w-4 h-4" />
                  <span>Quét Mã VietQR Chuyển Khoản Nhanh 24/7</span>
                </div>
                <div className="w-36 h-36 bg-white rounded-lg p-2 mx-auto flex items-center justify-center shadow">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=247PAY_${orderSuccess.orderNumber}_${orderSuccess.totalAmount}`}
                    alt="VietQR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Ngân hàng: <strong>MBBank (Quân Đội)</strong> • STK: <strong>8888 9999 6688</strong>
                </div>
                <div className="text-[11px] text-slate-400">
                  Nội dung chuyển khoản: <strong className="text-red-400 font-mono">{orderSuccess.orderNumber}</strong>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  setShowCartDrawer(false);
                }}
                className="w-full py-3 btn-primary-genz text-white font-bold text-xs rounded-xl shadow-lg shadow-red-950 transition flex items-center justify-center space-x-1.5"
              >
                <span>Tiếp Tục Mua Sắm</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- WARRANTY LOOKUP MODAL ----------------- */}
      {showWarrantyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl text-slate-100">
            <button
              onClick={() => {
                setShowWarrantyModal(false);
                setWarrantyResult(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-red-500 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">Tra Cứu Bảo Hành Điện Tử Serial</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Nhập mã số Serial Number in trên thân máy ảnh, gimbal hoặc hộp máy DJI để xác thực xuất xứ chính hãng và thời hạn bảo hành.
            </p>

            <form onSubmit={handleCheckWarranty} className="flex space-x-2 mb-4">
              <input
                type="text"
                placeholder="VD: DJI-M3PRO-2026-8899, SONY-FX3-VN-9901..."
                value={serialQuery}
                onChange={(e) => setSerialQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono uppercase"
              />
              <button
                type="submit"
                disabled={isCheckingWarranty}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1"
              >
                {isCheckingWarranty ? (
                  <span>Đang tra cứu...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Kiểm Tra</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Serial Pills */}
            <div className="text-[11px] text-slate-400 mb-4">
              <span className="text-slate-500">Mã mẫu test: </span>
              <button
                type="button"
                onClick={() => setSerialQuery('DJI-M3PRO-2026-8899')}
                className="text-red-400 hover:underline font-mono mr-2"
              >
                DJI-M3PRO-2026-8899
              </button>
              <button
                type="button"
                onClick={() => setSerialQuery('SONY-FX3-VN-9901')}
                className="text-red-400 hover:underline font-mono mr-2"
              >
                SONY-FX3-VN-9901
              </button>
              <button
                type="button"
                onClick={() => setSerialQuery('DJI-POCKET3-2026-5521')}
                className="text-red-400 hover:underline font-mono"
              >
                DJI-POCKET3-2026-5521
              </button>
            </div>

            {/* Shimmer Skeleton Loading */}
            {isCheckingWarranty && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
                <div className="h-4 w-2/5 bg-slate-800 rounded animate-shimmer" />
                <div className="h-3 w-4/5 bg-slate-800/60 rounded animate-shimmer" />
                <div className="h-3 w-3/5 bg-slate-800/60 rounded animate-shimmer" />
                <div className="h-3 w-1/2 bg-slate-800/60 rounded animate-shimmer" />
              </div>
            )}

            {/* Warranty Result Details */}
            {warrantyResult && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  warrantyResult.isGenuine
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/20 border-red-500/40 text-red-300'
                }`}
              >
                {warrantyResult.isGenuine ? (
                  <>
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>SẢN PHẨM CHÍNH HÃNG — ĐÃ KÍCH HOẠT BẢO HÀNH</span>
                    </div>
                    <div className="border-t border-emerald-900/50 pt-2 space-y-1 text-slate-200">
                      <div>
                        Thiết bị: <strong className="text-white">{warrantyResult.productName}</strong>
                      </div>
                      <div>
                        Thương hiệu: <strong className="text-white">{warrantyResult.brand}</strong>
                      </div>
                      <div>
                        Mã Serial: <strong className="text-amber-400 font-mono">{warrantyResult.serialNumber}</strong>
                      </div>
                      <div>
                        Thời hạn bảo hành: <strong>{warrantyResult.warrantyMonths} tháng chính hãng</strong>
                      </div>
                      <div>
                        Hạn bảo hành tới: <strong className="text-emerald-400">{warrantyResult.warrantyExpires || '15/03/2028'}</strong>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="font-bold text-red-400 mb-1 flex items-center space-x-1.5">
                      <X className="w-4 h-4" />
                      <span>Không tìm thấy thông tin bảo hành</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      {warrantyResult.message || 'Mã Serial không tồn tại trên hệ thống. Quý khách vui lòng kiểm tra lại dãy ký tự in trên thân máy hoặc liên hệ hotline 1900 8899.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ORDER LOOKUP & CANCEL MODAL ----------------- */}
      {showOrderLookupModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowOrderLookupModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Truck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Tra Cứu & Quản Lý Đơn Hàng
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kiểm tra tiến độ giao hàng, chi tiết đơn hoặc hủy đơn hàng trực tuyến
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderLookupModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleLookupOrder} className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Nhập Mã đơn hàng (VD: PRO-XXXXXX) hoặc Số điện thoại đặt hàng:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  required
                  placeholder="VD: PRO-102938 hoặc 0912345678"
                  value={orderLookupQuery}
                  onChange={(e) => setOrderLookupQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isSearchingOrder}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1 shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingOrder ? 'Đang tìm...' : 'Tra Cứu'}</span>
                </button>
              </div>
            </form>

            {/* Cancel Success Message */}
            {orderCancelSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{orderCancelSuccessMsg}</span>
              </div>
            )}

            {/* Shimmer Skeleton Loading */}
            {isSearchingOrder && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3 pt-4">
                <div className="h-4 w-1/3 bg-slate-800 rounded animate-shimmer" />
                <div className="h-3 w-4/5 bg-slate-800/60 rounded animate-shimmer" />
                <div className="h-3 w-2/3 bg-slate-800/60 rounded animate-shimmer" />
                <div className="h-10 w-full bg-slate-800/40 rounded-xl animate-shimmer" />
              </div>
            )}

            {/* Search Result */}
            {orderLookupResult && (
              <div className="pt-2">
                {orderLookupResult.notFound ? (
                  <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                    Không tìm thấy đơn hàng với thông tin: <strong className="font-mono text-white">{orderLookupResult.query}</strong>. Vui lòng kiểm tra lại mã đơn hàng hoặc số điện thoại.
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mã Đơn Hàng</span>
                        <span className="font-mono font-bold text-sm text-red-400">
                          {orderLookupResult.orderNumber || orderLookupResult.id}
                        </span>
                      </div>
                      <div>
                        {(() => {
                          const st = orderLookupResult.orderStatus || orderLookupResult.status || 'PENDING';
                          const statusMap: Record<string, { label: string; color: string }> = {
                            PENDING: { label: 'Chờ Xác Nhận', color: 'bg-amber-900/40 text-amber-400 border-amber-500/30' },
                            CONFIRMED: { label: 'Đã Xác Nhận', color: 'bg-blue-900/40 text-blue-400 border-blue-500/30' },
                            SHIPPING: { label: 'Đang Giao Hàng', color: 'bg-orange-900/40 text-orange-400 border-orange-500/30' },
                            COMPLETED: { label: 'Đã Hoàn Tất', color: 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' },
                            CANCELLED: { label: 'Đã Hủy Đơn', color: 'bg-red-900/40 text-red-400 border-red-500/30' },
                          };
                          const current = statusMap[st] || statusMap['PENDING'];
                          return (
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${current.color}`}>
                              {current.label}
                            </span>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-300 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Khách hàng:</span>
                        <strong className="text-white">{orderLookupResult.customerName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Số điện thoại:</span>
                        <strong className="text-white font-mono">{orderLookupResult.customerPhone}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Địa chỉ nhận hàng:</span>
                        <span className="text-slate-200">{orderLookupResult.shippingAddress || orderLookupResult.customerAddress}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Thanh toán:</span>
                        <span>{orderLookupResult.paymentMethod === 'VIETQR' ? 'VietQR Ngân hàng' : 'Thanh toán COD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Tổng tiền:</span>
                        <strong className="text-amber-400 font-mono text-xs">
                          {formatVND(orderLookupResult.totalAmount || 0)}
                        </strong>
                      </div>
                    </div>

                    {/* Items preview */}
                    {Array.isArray(orderLookupResult.items) && orderLookupResult.items.length > 0 && (
                      <div className="border-t border-slate-800 pt-2 space-y-1.5">
                        <span className="text-slate-400 text-[11px] block font-semibold">Danh sách thiết bị:</span>
                        {orderLookupResult.items.map((itm: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-[11px] bg-slate-900/60 p-2 rounded-lg">
                            <span className="text-slate-200 truncate max-w-xs">{itm.productName || itm.name || 'Thiết bị Pro Gear'} (x{itm.quantity})</span>
                            <span className="text-amber-400 font-mono font-semibold">{formatVND(itm.price * itm.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Cancel action if PENDING */}
                    {(orderLookupResult.orderStatus === 'PENDING' || orderLookupResult.status === 'PENDING') && (
                      <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] text-slate-400 max-w-xs">
                          Đơn hàng đang chờ nhân viên liên hệ xác nhận. Bạn có thể tự hủy đơn ngay nếu muốn đổi thiết bị khác.
                        </p>
                        <button
                          type="button"
                          disabled={isCancellingOrder}
                          onClick={() => handleCancelOrderCustomer(orderLookupResult.id || orderLookupResult.orderNumber)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isCancellingOrder ? 'Đang hủy...' : 'Hủy Đơn Hàng Này'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- FOOTER ----------------- */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="text-base font-black text-white flex items-center space-x-1">
              <span>PRO</span>
              <span className="text-red-500">GEAR</span>
              <span className="text-[10px] text-slate-400">CINEMA & CAMERA</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Hệ thống bán lẻ và phân phối máy ảnh, máy quay phim điện ảnh, flycam DJI & phụ kiện làm phim chuyên nghiệp hàng đầu Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-2">Dòng Sản Phẩm Chủ Đạo</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>Flycam DJI Mavic 3 Pro / Mini 4 Pro</li>
              <li>Máy quay Cinema Sony FX3 / FX6</li>
              <li>Máy ảnh Sony Alpha 7 IV / A7R V</li>
              <li>Gimbal chống rung DJI RS 4 Pro</li>
              <li>DJI Osmo Pocket 3 Creator Combo</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-2">Chính Sách & Bảo Hành</h4>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>Tra cứu Serial Number điện tử</li>
              <li>Chính sách 1 đổi 1 trong 30 ngày</li>
              <li>Bảo hành chính hãng 12-24 tháng</li>
              <li>Hỗ trợ trả góp 0% lãi suất</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-2">Hệ Thống Showroom</h4>
            <p className="text-slate-400 text-[11px]">Hà Nội: 88 Phố Huế, Q. Hai Bà Trưng</p>
            <p className="text-slate-400 text-[11px]">TP.HCM: 120 Trần Hưng Đạo, Quận 1</p>
            <p className="text-slate-400 text-[11px] mt-1 font-semibold text-white">Hotline: 1900 8899 (Hỗ trợ 24/7)</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
          <div>© 2026 PRO GEAR Vietnam. All rights reserved.</div>
          <div className="flex items-center space-x-3">
            <span>Trạng thái hệ thống:</span>
            <span className="inline-flex items-center space-x-1 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đồng Bộ Trực Tuyến & Bảo Mật SSL</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Gen Z Live Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-2xl border border-red-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center shrink-0 shadow-md">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">{toast.message}</div>
            <div className="text-[10px] text-slate-400">Đã cập nhật tức thì vào phiên mua sắm.</div>
          </div>
          <button
            onClick={() => setShowCartDrawer(true)}
            className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold transition ml-2 shadow active:scale-95"
          >
            Xem giỏ
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
