import { PrismaClient, Role, SerialStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding camera business database...');

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash('admin123456', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@camerasmart.vn' },
    update: {},
    create: {
      email: 'admin@camerasmart.vn',
      fullName: 'Quản Trị Viên Hệ Thống',
      passwordHash,
      role: Role.ADMIN,
      phone: '0988888888',
      address: 'Hà Nội, Việt Nam',
    },
  });
  console.log(`Created Admin user: ${admin.email}`);

  // 2. Seed Brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'hikvision' },
      update: {},
      create: { name: 'Hikvision', slug: 'hikvision', origin: 'Toàn cầu', logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200' },
    }),
    prisma.brand.upsert({
      where: { slug: 'dahua' },
      update: {},
      create: { name: 'Dahua Technology', slug: 'dahua', origin: 'Toàn cầu', logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200' },
    }),
    prisma.brand.upsert({
      where: { slug: 'ezviz' },
      update: {},
      create: { name: 'Ezviz', slug: 'ezviz', origin: 'Toàn cầu', logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200' },
    }),
    prisma.brand.upsert({
      where: { slug: 'imou' },
      update: {},
      create: { name: 'Imou Life', slug: 'imou', origin: 'Toàn cầu', logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200' },
    }),
  ]);

  // 3. Seed Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'camera-wifi-trong-nha' },
      update: {},
      create: { name: 'Camera Wifi Trong Nhà', slug: 'camera-wifi-trong-nha', description: 'Camera xoay 360 độ, đàm thoại 2 chiều, theo dõi chuyển động' },
    }),
    prisma.category.upsert({
      where: { slug: 'camera-ngoai-troi-chong-nuoc' },
      update: {},
      create: { name: 'Camera Ngoài Trời Chống Nước', slug: 'camera-ngoai-troi-chong-nuoc', description: 'Chuẩn chống nước IP66/IP67, có màu ban đêm ColorVu, còi hú báo động' },
    }),
    prisma.category.upsert({
      where: { slug: 'camera-nang-luong-mat-troi-4g' },
      update: {},
      create: { name: 'Camera Năng Lượng Mặt Trời (4G/Sim)', slug: 'camera-nang-luong-mat-troi-4g', description: 'Không cần kéo dây điện và mạng, thích hợp trang trại, công trình' },
    }),
    prisma.category.upsert({
      where: { slug: 'dau-ghi-hinh-nvr-dvr' },
      update: {},
      create: { name: 'Đầu Ghi Hình & Ổ Cứng', slug: 'dau-ghi-hinh-nvr-dvr', description: 'Đầu ghi 4K PoE 4/8/16 kênh, ổ cứng chuyên dụng lưu trữ 24/7' },
    }),
  ]);

  // 4. Seed Camera Products with realistic specs JSONB
  const p1 = await prisma.product.upsert({
    where: { slug: 'hikvision-colorvu-4mp-ds-2cd2047g2-lu' },
    update: {},
    create: {
      name: 'Camera IP Hikvision ColorVu 4MP DS-2CD2047G2-LU (Ban đêm có màu 24/7)',
      slug: 'hikvision-colorvu-4mp-ds-2cd2047g2-lu',
      sku: 'DS-2CD2047G2-LU',
      price: 1850000,
      originalPrice: 2200000,
      stockQuantity: 45,
      isFeatured: true,
      shortDesc: 'Hình ảnh màu sắc rực rỡ 24/7, độ phân giải 4MP siêu nét, tích hợp Mic thu âm.',
      description: 'Camera IP Thân Trụ ColorVu 4.0 Megapixel thế hệ mới, tích hợp công nghệ AI AcuSense phân biệt người và phương tiện, giảm báo động giả 98%. Ống kính khẩu độ lớn F1.0 cho ánh sáng tối đa.',
      categoryId: categories[1].id,
      brandId: brands[0].id,
      specifications: {
        resolution: '4.0 Megapixel (2688 × 1520)',
        lens: '2.8mm / 4mm Fixed Lens',
        nightVision: 'ColorVu có màu 24/7 tầm xa 40m',
        audio: 'Tích hợp Microphone thu âm thanh thực',
        weatherproof: 'IP67 chống bụi và nước hoàn toàn',
        aiFeatures: ['Phát hiện người và phương tiện (AcuSense)', 'Hàng rào ảo', 'Bảo vệ khu vực'],
        power: 'PoE 802.3af hoặc 12V DC',
        compression: 'H.265+ / H.265 / H.264+',
        storage: 'Khe cắm thẻ nhớ MicroSD lên đến 256GB',
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: 'ezviz-c6n-4mp-2k-xoay-360' },
    update: {},
    create: {
      name: 'Camera Wifi Ezviz C6N 4MP 2K+ Xoay 360 Độ Thông Minh',
      slug: 'ezviz-c6n-4mp-2k-xoay-360',
      sku: 'EZVIZ-C6N-4MP',
      price: 690000,
      originalPrice: 950000,
      stockQuantity: 120,
      isFeatured: true,
      shortDesc: 'Độ phân giải 2K+ sắc nét, theo dõi chuyển động tự động, đàm thoại 2 chiều.',
      description: 'Camera an ninh trong nhà phổ biến nhất cho gia đình và văn phòng. Khả năng quay quét 360 độ loại bỏ điểm mù, chế độ ngủ bảo vệ quyền riêng tư.',
      categoryId: categories[0].id,
      brandId: brands[2].id,
      specifications: {
        resolution: '4.0 Megapixel 2K+ (2560 × 1440)',
        lens: '4mm @ F2.2, góc nhìn 85°',
        rotation: 'Quay ngang 340°, quay dọc 55°',
        nightVision: 'Hồng ngoại thông minh Smart IR 10m',
        audio: 'Đàm thoại 2 chiều loa to rõ ràng',
        aiFeatures: ['Tự động xoay theo đối tượng di chuyển', 'Phát hiện tiếng khóc trẻ em'],
        power: 'Cổng Micro-USB 5V/2A',
        storage: 'Hỗ trợ thẻ nhớ MicroSD tới 256GB hoặc Ezviz CloudPlay',
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?w=600', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: 'imou-cruiser-dual-6mp-2-mat' },
    update: {},
    create: {
      name: 'Camera Ngoài Trời Imou Cruiser Dual 6MP (2 Mắt Kép 3MP + 3MP)',
      slug: 'imou-cruiser-dual-6mp-2-mat',
      sku: 'IMOU-IPC-S7XP-6M0WED',
      price: 1350000,
      originalPrice: 1650000,
      stockQuantity: 60,
      isFeatured: true,
      shortDesc: 'Giám sát 2 hướng đồng thời với 1 mắt cố định và 1 mắt quay 360 độ.',
      description: 'Đột phá công nghệ camera an ninh ngoài trời: 1 mắt cố định giám sát cửa chính, 1 mắt quay quét theo dõi kẻ gian xung quanh. 4 chế độ nhìn ban đêm thông minh.',
      categoryId: categories[1].id,
      brandId: brands[3].id,
      specifications: {
        resolution: '6.0 Megapixel (3MP mắt cố định + 3MP mắt quay quét)',
        nightVision: '4 chế độ màu ban đêm, đèn Spotlight trợ sáng 30m',
        audio: 'Đàm thoại 2 chiều và Còi hú báo động 110dB',
        weatherproof: 'IP66 chịu mưa bão khắc nghiệt',
        aiFeatures: ['IMOU SENSE AI phát hiện người & xe chính xác', 'Theo dõi chuyển động Smart Tracking'],
        connectivity: 'Wifi 6 băng thông cao hoặc cổng LAN RJ45',
      },
      images: {
        create: [
          { imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  // 5. Seed some Serial Numbers for warranty tracking
  await prisma.cameraSerial.createMany({
    data: [
      { productId: p1.id, serialNumber: 'DS2CD2047G2LU-20260101-001', status: SerialStatus.IN_STOCK, warrantyMonths: 24 },
      { productId: p1.id, serialNumber: 'DS2CD2047G2LU-20260101-002', status: SerialStatus.IN_STOCK, warrantyMonths: 24 },
      { productId: p2.id, serialNumber: 'EZVIZC6N-20260102-101', status: SerialStatus.IN_STOCK, warrantyMonths: 24 },
      { productId: p3.id, serialNumber: 'IMOUCRUISER-20260103-501', status: SerialStatus.IN_STOCK, warrantyMonths: 24 },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
