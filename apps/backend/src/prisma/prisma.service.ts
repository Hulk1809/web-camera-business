import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Role, SerialStatus } from '@prisma/client';
import { exec } from 'child_process';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.connectWithRetry();
  }

  private async connectWithRetry(retries = 30, delay = 4000) {
    for (let i = 1; i <= retries; i++) {
      try {
        await this.$connect();
        this.logger.log('✅ Successfully connected to PostgreSQL Database');
        exec('npx prisma db push --skip-generate', async (err) => {
          if (!err) {
            this.logger.log('✅ Database schema synchronized');
          }
          await this.autoSeed();
        });
        return;
      } catch (error) {
        this.logger.warn(`⏳ Waiting for PostgreSQL database to be ready... Attempt ${i}/${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    this.logger.error('❌ Could not connect to PostgreSQL after multiple retries');
  }

  public async autoSeed() {
    try {
      const productCount = await this.product.count();
      if (productCount > 0) {
        this.logger.log(`📦 Database already has ${productCount} products.`);
        return;
      }

      this.logger.log('🌱 Database is empty. Seeding initial Pro Camera, Cinema & DJI products...');

      // 1. Admin user
      const passwordHash = await bcrypt.hash('admin123456', 10);
      await this.user.upsert({
        where: { email: 'admin@camerasmart.vn' },
        update: {},
        create: {
          email: 'admin@camerasmart.vn',
          fullName: 'Quản Trị Viên Pro Camera & Film Gear',
          passwordHash,
          role: Role.ADMIN,
          phone: '0988888888',
          address: 'Hà Nội, Việt Nam',
        },
      });

      // 2. Brands
      const brands = await Promise.all([
        this.brand.upsert({
          where: { slug: 'dji' },
          update: {},
          create: { name: 'DJI', slug: 'dji', origin: 'Thâm Quyến', logoUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=200' },
        }),
        this.brand.upsert({
          where: { slug: 'sony' },
          update: {},
          create: { name: 'Sony', slug: 'sony', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
        }),
        this.brand.upsert({
          where: { slug: 'canon' },
          update: {},
          create: { name: 'Canon', slug: 'canon', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=200' },
        }),
        this.brand.upsert({
          where: { slug: 'fujifilm' },
          update: {},
          create: { name: 'Fujifilm', slug: 'fujifilm', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=200' },
        }),
        this.brand.upsert({
          where: { slug: 'blackmagic-design' },
          update: {},
          create: { name: 'Blackmagic Design', slug: 'blackmagic-design', origin: 'Úc', logoUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200' },
        }),
        this.brand.upsert({
          where: { slug: 'nikon' },
          update: {},
          create: { name: 'Nikon', slug: 'nikon', origin: 'Nhật Bản', logoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200' },
        }),
      ]);

      const [dji, sony, canon, fujifilm, blackmagic, nikon] = brands;

      // 3. Categories
      const categories = await Promise.all([
        this.category.upsert({
          where: { slug: 'may-anh-mirrorless-dslr' },
          update: {},
          create: { name: 'Máy Ảnh Mirrorless & DSLR', slug: 'may-anh-mirrorless-dslr', description: 'Máy ảnh cảm biến Full-Frame, APS-C chuyên nghiệp' },
        }),
        this.category.upsert({
          where: { slug: 'may-quay-dien-anh-cinema' },
          update: {},
          create: { name: 'Máy Quay Điện Ảnh & Cinema', slug: 'may-quay-dien-anh-cinema', description: 'Máy quay điện ảnh chuyên nghiệp: FX3, FX6, Cinema 6K' },
        }),
        this.category.upsert({
          where: { slug: 'flycam-drone-dji' },
          update: {},
          create: { name: 'Flycam & Drone DJI', slug: 'flycam-drone-dji', description: 'Flycam DJI Mavic 3 Pro, Mini 4 Pro, Air 3S, Avata 2' },
        }),
        this.category.upsert({
          where: { slug: 'gimbal-chong-rung-dji' },
          update: {},
          create: { name: 'Gimbal & Chống Rung DJI Ronin', slug: 'gimbal-chong-rung-dji', description: 'Gimbal chống rung chuyên nghiệp DJI RS 4 Pro, RS 3 Mini' },
        }),
        this.category.upsert({
          where: { slug: 'action-cam-pocket-creator' },
          update: {},
          create: { name: 'Action Cam & Pocket Creator', slug: 'action-cam-pocket-creator', description: 'Camera bỏ túi DJI Osmo Pocket 3 Creator, Action 4' },
        }),
        this.category.upsert({
          where: { slug: 'ong-kinh-lens' },
          update: {},
          create: { name: 'Ống Kính Chuyên Dụng (Lenses)', slug: 'ong-kinh-lens', description: 'Ống kính Sony G-Master, Canon RF, Sigma Art cao cấp' },
        }),
        this.category.upsert({
          where: { slug: 'am-thanh-anh-sang-studio' },
          update: {},
          create: { name: 'Âm Thanh & Ánh Sáng Studio', slug: 'am-thanh-anh-sang-studio', description: 'Micro thu âm không dây DJI Mic 2, Rode Wireless PRO' },
        }),
      ]);

      const [catMirrorless, catCinema, catDrone, catGimbal, catAction, catLens, catAudio] = categories;

      // 4. Products
      const productsData = [
        {
          name: 'Sony Alpha 7 IV (A7M4) Body - Máy ảnh Full-Frame Hybrid 33MP',
          slug: 'sony-alpha-7-iv-a7m4-body',
          sku: 'ILCE-7M4-BODY',
          price: 53990000,
          originalPrice: 59990000,
          stockQuantity: 18,
          isFeatured: true,
          shortDesc: 'Cảm biến Exmor R CMOS 33MP Full-Frame, quay 4K 60p 10-bit 4:2:2, lấy nét theo mắt Real-time AF AI.',
          description: 'Sony Alpha 7 IV là chuẩn mực máy ảnh hybrid cho nhiếp ảnh gia và nhà sáng tạo video hiện đại. Trang bị chip xử lý hình ảnh BIONZ XR thế hệ mới, bộ lọc màu S-Cinetone kế thừa từ dòng Cinema cao cấp, chống rung thân máy IBIS 5.5 stops.',
          categoryId: catMirrorless.id,
          brandId: sony.id,
          specifications: {
            sensor: 'Full-Frame 33.0 Megapixel Exmor R BSI CMOS',
            video: '4K 60p (Super 35) & 4K 30p 7K oversampling 10-bit 4:2:2 All-Intra',
            stabilization: 'Chống rung cảm biến IBIS 5 trục 5.5 stops + Chế độ Active Mode',
            autofocus: '759 điểm lấy nét theo pha, Real-time Eye AF người/động vật/chim',
            screen: 'Màn hình cảm ứng xoay lật đa góc 3.0-inch 1.03 triệu điểm',
            storage: '2 khe cắm thẻ CFexpress Type A / SD UHS-II',
            weight: '658g (Kèm pin và thẻ nhớ)',
            colorProfiles: 'S-Cinetone, S-Log3, S-Gamut3.Cine, HLG (BT.2020)',
          },
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        },
        {
          name: 'DJI Mavic 3 Pro Cine Combo - Flycam 3 Camera Hasselblad Apple ProRes',
          slug: 'dji-mavic-3-pro-cine-combo',
          sku: 'DJI-MAVIC3-PRO-CINE',
          price: 79990000,
          originalPrice: 87500000,
          stockQuantity: 12,
          isFeatured: true,
          shortDesc: 'Hệ thống 3 camera quang học: Hasselblad 4/3 CMOS 20MP, Tele tầm trung 70mm, Tele 166mm. Hỗ trợ Apple ProRes.',
          description: 'Đỉnh cao flycam điện ảnh dân dụng thế giới. Tích hợp bộ mã hóa Apple ProRes 422 HQ trên cả 3 camera quang học, SSD 1TB gắn trong, thời gian bay ấn tượng lên tới 43 phút và hệ thống truyền video DJI O3+ 15km.',
          categoryId: catDrone.id,
          brandId: dji.id,
          specifications: {
            sensor: 'Camera chính 4/3 CMOS Hasselblad 20MP + Medium Tele 1/1.3" CMOS 48MP + Tele 1/2" CMOS 12MP',
            video: 'Apple ProRes 5.1K/50fps, D-Log 10-bit, 4K/120fps slow-motion',
            flightTime: 'Thời gian bay tối đa 43 phút liên tục',
            transmission: 'DJI O3+ truyền tín hiệu video 1080p/60fps lên đến 15km',
            obstacleAvoidance: 'Cảm biến chướng ngại vật đa hướng APAS 5.0 360 độ',
            internalStorage: 'Bộ nhớ trong SSD 1TB tốc độ cao tích hợp',
            weight: '958g (Đầy đủ pin và cánh quạt)',
          },
          imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800',
        },
        {
          name: 'Sony Cinema Line FX3 (ILME-FX3) - Máy quay Full-Frame chuyên nghiệp',
          slug: 'sony-cinema-line-fx3-body',
          sku: 'ILME-FX3-BODY',
          price: 94990000,
          originalPrice: 102000000,
          stockQuantity: 8,
          isFeatured: true,
          shortDesc: 'Cảm biến Full-Frame 12.1MP, Dual Base ISO 800/12800, quạt tản nhiệt chủ động, tay cầm XLR.',
          description: 'Máy quay điện ảnh nhỏ gọn được ưa chuộng bậc nhất Hollywood và các đoàn làm phim quảng cáo. Khả năng quay 4K 120p không giới hạn thời gian nhờ hệ thống quạt tản nhiệt chủ động, dải động 15+ stops, S-Cinetone cho tone màu da điện ảnh hoàn hảo.',
          categoryId: catCinema.id,
          brandId: sony.id,
          specifications: {
            sensor: 'Full-Frame 12.1 Megapixel Back-Illuminated Exmor R CMOS',
            video: '4K 120p 10-bit 4:2:2, FHD 240p, Xuất 16-bit RAW qua cổng full HDMI',
            isoRange: 'Dual Base ISO 800 / 12800, dải tương phản động 15+ stops',
            cooling: 'Quạt tản nhiệt chủ động quay 4K 60p không bao giờ quá nhiệt',
            audioHandle: 'Kèm tay cầm Top Handle với 2 cổng XLR/TRS âm thanh 4 kênh 24-bit',
            stabilization: 'Chống rung IBIS 5 trục + Active Mode tối ưu cho gimbal và cầm tay',
            weight: '715g (Thân máy)',
          },
          imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800',
        },
        {
          name: 'DJI RS 4 Pro Gimbal Combo - Tay cầm chống rung tải trọng 4.5kg',
          slug: 'dji-rs-4-pro-gimbal-combo',
          sku: 'DJI-RS4-PRO-COMBO',
          price: 19990000,
          originalPrice: 22500000,
          stockQuantity: 25,
          isFeatured: true,
          shortDesc: 'Cần trục sợi Carbon thế hệ 2, thuật toán chống rung RS 4th Gen, hỗ trợ Focus Pro LiDAR 76.800 điểm.',
          description: 'Hệ thống gimbal flagship phục vụ quay phim điện ảnh. Trang bị cánh tay trục sợi carbon siêu cứng chịu tải 4.5kg, tương thích với hầu hết máy quay cinema FX6, RED Komodo, Canon C70 cùng ống kính nặng. Hệ thống khóa trục tự động 2nd Gen khởi động quay tức thì trong 1 giây.',
          categoryId: catGimbal.id,
          brandId: dji.id,
          specifications: {
            payload: 'Tải trọng 4.5kg (Khung carbon nhẹ chỉ 1.6kg)',
            battery: 'Pin BG30 thời lượng sử dụng tới 13 tiếng, sạc nhanh PD 24W',
            axisLock: 'Khóa trục tự động thế hệ thứ 2, mở máy sẵn sàng quay trong 1 giây',
            screen: 'Màn hình cảm ứng màu OLED 1.8-inch phản hồi xúc giác',
            lidarSupport: 'Hỗ trợ DJI Focus Pro LiDAR lấy nét tự động 20m, 76.800 điểm đo',
            wireless: 'Điều khiển không dây qua Bluetooth & Bộ truyền hình ảnh Ronin Transmission',
          },
          imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
        },
        {
          name: 'DJI Osmo Pocket 3 Creator Combo - Camera Vlogging Cảm biến 1-inch',
          slug: 'dji-osmo-pocket-3-creator-combo',
          sku: 'DJI-POCKET3-CREATOR',
          price: 15890000,
          originalPrice: 17900000,
          stockQuantity: 30,
          isFeatured: true,
          shortDesc: 'Cảm biến 1-inch CMOS, quay 4K 120fps, màn hình OLED xoay 2 inch, chống rung cơ học 3 trục, kèm Mic 2.',
          description: 'Camera sáng tạo nội dung bỏ túi bán chạy nhất thế giới. Cảm biến 1-inch cho chất lượng hình ảnh đêm xuất sắc, màu 10-bit D-Log M, lấy nét thần tốc full-pixel, theo dõi khuôn mặt ActiveTrack 6.0, combo bao gồm bộ phát không dây DJI Mic 2 và tay cầm pin phụ.',
          categoryId: catAction.id,
          brandId: dji.id,
          specifications: {
            sensor: '1-inch CMOS độ phân giải cao thu sáng vượt trội',
            video: '4K 120fps Slow-motion, 4K 60fps HDR, 10-bit D-Log M & HLG',
            screen: 'Màn hình cảm ứng OLED xoay ngang/dọc 2.0-inch thông minh',
            tracking: 'ActiveTrack 6.0 nhận diện khuôn mặt và bố cục vàng tự động',
            audio: '3 micro thu âm định hướng vòm + Kết nối trực tiếp 2 micro DJI Mic 2',
            battery: 'Sạc 80% chỉ trong 16 phút, thời lượng quay lên tới 166 phút',
            weight: '179g bỏ túi siêu nhẹ',
          },
          imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=800',
        },
        {
          name: 'Canon EOS R5 Mark II Body - 45MP Stacked CMOS & 8K 60p RAW',
          slug: 'canon-eos-r5-mark-ii-body',
          sku: 'CANON-R5-M2-BODY',
          price: 104990000,
          originalPrice: 115000000,
          stockQuantity: 6,
          isFeatured: true,
          shortDesc: 'Cảm biến xếp chồng 45MP BSI, chip kép DIGIC Accelerator + DIGIC X, quay 8K 60p RAW nội bộ, Eye Control AF thế hệ mới.',
          description: 'Cỗ máy đỉnh cao của Canon cho các nhiếp ảnh gia thương mại và thể thao. Khả năng chụp liên tiếp 30fps không chớp đen, lấy nét điều khiển bằng mắt người chụp Eye Control AF chuẩn xác, chống rung phối hợp thân máy và ống kính lên tới 8.5 stops.',
          categoryId: catMirrorless.id,
          brandId: canon.id,
          specifications: {
            sensor: '45.0 Megapixel Back-Illuminated Stacked Full-Frame CMOS',
            video: '8K 60p RAW / 4K 120p 10-bit Canon Log 2/3 & HDR-HLG',
            burstRate: 'Chụp liên tiếp 30 fps màn trập điện tử với AF/AE Tracking',
            stabilization: 'IBIS chống rung 5 trục hiệu quả tới 8.5 stops tại trung tâm',
            aiFocus: 'Eye Control AF điều khiển điểm lấy nét bằng ánh mắt người chụp',
            storage: '1 khe CFexpress Type B + 1 khe SD UHS-II',
            weight: '746g (Kèm pin LP-E6P)',
          },
          imageUrl: 'https://images.unsplash.com/photo-1502982720700-bfff97f2da71?w=800',
        },
        {
          name: 'DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2) - Flycam dưới 249g',
          slug: 'dji-mini-4-pro-fly-more-combo-plus',
          sku: 'DJI-MINI4-PRO-RC2',
          price: 24890000,
          originalPrice: 27900000,
          stockQuantity: 20,
          isFeatured: true,
          shortDesc: 'Trọng lượng siêu nhẹ dưới 249g, cảm biến chướng ngại vật đa hướng 360°, quay 4K 60p HDR dọc chân thực.',
          description: 'Flycam mini mạnh mẽ nhất hiện nay. Không cần đăng ký giấy phép bay khắt khe tại nhiều quốc gia nhờ trọng lượng dưới 249g, trang bị cảm biến va chạm 360 độ, camera xoay dọc 90 độ vật lý hoàn hảo cho video TikTok/Reels chất lượng cao.',
          categoryId: catDrone.id,
          brandId: dji.id,
          specifications: {
            weight: 'Dưới 249g siêu gọn bỏ vừa túi áo khoác',
            video: '4K 60fps HDR, 4K 100fps Slow-mo, 10-bit D-Log M & HLG',
            cameraRotation: 'Xoay trục dọc True Vertical Shooting 90 độ cơ học',
            flightTime: 'Thời gian bay 45 phút với pin thông minh Plus',
            sensors: 'Cảm biến chướng ngại vật đa hướng APAS 5.0 toàn diện',
            controller: 'Tay cầm điều khiển DJI RC 2 tích hợp màn hình FHD siêu sáng',
          },
          imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        },
        {
          name: 'Blackmagic Cinema Camera 6K (Full-Frame L-Mount)',
          slug: 'blackmagic-cinema-camera-6k-fullframe',
          sku: 'BMD-CINEMA-6K-FF',
          price: 62500000,
          originalPrice: 68000000,
          stockQuantity: 10,
          isFeatured: true,
          shortDesc: 'Cảm biến Full-Frame 6K 6048x4032, dải tương phản 13 stops, ngàm L-Mount, màn hình cảm ứng HDR 5 inch 1500 nits.',
          description: 'Máy quay điện ảnh thế hệ mới nhất từ Blackmagic Design với cảm biến Full-Frame 6K sắc nét kinh ngạc, ghi hình Blackmagic RAW 12-bit vào thẻ CFexpress B hoặc ổ cứng SSD ngoài qua cổng USB-C, kèm phần mềm DaVinci Resolve Studio bản quyền.',
          categoryId: catCinema.id,
          brandId: blackmagic.id,
          specifications: {
            sensor: 'Full-Frame 6K (6048 x 4032) HDR Open Gate 3:2',
            video: '6K 36fps Open Gate, 6K 48fps 17:9, 4K 60fps Super 35, 120fps FHD',
            lensMount: 'Ngàm L-Mount linh hoạt (Leica, Panasonic, Sigma)',
            recording: 'Blackmagic RAW 12-bit nội bộ vào thẻ CFexpress B hoặc SSD rời',
            screen: 'Màn hình cảm ứng nghiêng 5.0-inch 1500 nits cực sáng ngoài trời',
            colorScience: 'Blackmagic Generation 5 Color Science điện ảnh',
            dynamicRange: '13 Stops dải tần nhạy sáng, Dual Native ISO 400 & 3200',
          },
          imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
        },
        {
          name: 'Fujifilm X-T5 Body (Silver) - 40.2MP Cảm biến X-Trans CMOS 5 HR',
          slug: 'fujifilm-x-t5-body-silver',
          sku: 'FUJI-XT5-BODY-SILVER',
          price: 41900000,
          originalPrice: 45900000,
          stockQuantity: 15,
          isFeatured: true,
          shortDesc: 'Độ phân giải 40.2MP siêu nét, 19 chế độ giả lập màu phim Film Simulation, quay 6.2K 30p, thiết kế hoài cổ đẳng cấp.',
          description: 'Mẫu máy ảnh hoài cổ biểu tượng được giới nhiếp ảnh đường phố và du lịch mê đắm. Vòng xoay cơ học kim loại sang trọng, cảm biến APS-C 40.2MP cao nhất từ trước đến nay của Fujifilm, thuật toán lấy nét AI nhận diện chủ thể động vật, xe cộ, chim chóc.',
          categoryId: catMirrorless.id,
          brandId: fujifilm.id,
          specifications: {
            sensor: '40.2 Megapixel APS-C X-Trans CMOS 5 HR thế hệ mới',
            filmSimulation: '19 chế độ giả lập màu phim kinh điển: Nostalgic Neg, Classic Chrome...',
            video: '6.2K 30p 4:2:2 10-bit nội bộ, 4K HQ 60p oversampled',
            stabilization: 'IBIS chống rung cảm biến 5 trục lên tới 7.0 stops',
            shutterSpeed: 'Màn trập điện tử siêu tốc 1/180.000 giây',
            viewfinder: 'Kính ngắm OLED 3.69 triệu điểm ảnh độ phóng đại 0.8x',
            design: 'Vỏ hợp kim magie kháng thời tiết chống bụi nước và lạnh -10°C',
          },
          imageUrl: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800',
        },
        {
          name: 'Ống kính Sony FE 24-70mm F2.8 GM II (SEL2470GM2)',
          slug: 'sony-fe-24-70mm-f2-8-gm-ii',
          sku: 'SEL2470GM2',
          price: 49990000,
          originalPrice: 54900000,
          stockQuantity: 14,
          isFeatured: true,
          shortDesc: 'Ống kính tiêu chuẩn G Master thế hệ II nhẹ nhất thế giới, khẩu độ F2.8 toàn dải, 4 động cơ lấy nét XD Linear.',
          description: 'Ống kính zoom đa dụng số 1 cho các nhiếp ảnh gia và nhà quay phim chuyên nghiệp. Nhẹ hơn 22% so với đời 1, độ sắc nét vượt trội từ tâm đến rìa ảnh, bokeh tròn mịn với 11 lá khẩu, vòng chỉnh khẩu độ có nấc gạt de-click mượt mà cho quay phim.',
          categoryId: catLens.id,
          brandId: sony.id,
          specifications: {
            focalLength: '24-70mm (Góc nhìn 84° đến 34°)',
            maxAperture: 'F2.8 toàn dải tiêu cự, 11 lá khẩu tròn cho bokeh hoàn mỹ',
            optics: '2 thấu kính XA, 3 thấu kính Aspherical, 2 thấu kính ED, 2 thấu kính Super ED',
            motors: '4 động cơ XD Linear siêu êm, lấy nét chuẩn từng khung hình 120fps',
            coating: 'Lớp phủ Nano AR Coating II triệt tiêu bóng ma và lóa sáng',
            weight: 'Chỉ 695g, nhẹ nhất trong phân khúc 24-70 F2.8 toàn cầu',
          },
          imageUrl: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        },
        {
          name: 'Bộ Micro Thu Âm Không Dây DJI Mic 2 (2 TX + 1 RX + Hộp sạc)',
          slug: 'dji-mic-2-wireless-microphone-combo',
          sku: 'DJI-MIC2-COMBO',
          price: 8490000,
          originalPrice: 9490000,
          stockQuantity: 40,
          isFeatured: true,
          shortDesc: 'Thu âm 32-bit Float nội bộ chống vỡ tiếng, chống ồn thông minh AI, phạm vi truyền 250m, hộp sạc pin 18 giờ.',
          description: 'Tiêu chuẩn vàng cho âm thanh video creator và phóng viên. Tính năng ghi âm 32-bit float giúp không bao giờ bị méo tiếng dù tiếng hét lớn hay thì thầm nhỏ, kết nối Bluetooth trực tiếp với điện thoại hoặc máy quay qua jack 3.5mm / Type-C / Lightning.',
          categoryId: catAudio.id,
          brandId: dji.id,
          specifications: {
            audioQuality: 'Thu âm 32-bit Float nội bộ 8GB, tần số 48kHz / 24-bit',
            noiseCancelling: 'Khử ồn thông minh AI lọc tạp âm gió và động cơ xuất sắc',
            range: 'Khoảng cách truyền không dây ổn định 250m không vật cản',
            battery: 'Thời lượng hoạt động 6 tiếng cho micro, 18 tiếng kèm hộp sạc',
            compatibility: 'Tương thích máy ảnh DSLR/Mirrorless, iPhone, Android, PC',
          },
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        },
        {
          name: 'Nikon Z8 Body - Máy ảnh Mirrorless 45.7MP Quay 8.3K N-RAW',
          slug: 'nikon-z8-body',
          sku: 'NIKON-Z8-BODY',
          price: 86900000,
          originalPrice: 95000000,
          stockQuantity: 9,
          isFeatured: true,
          shortDesc: 'Cảm biến xếp chồng 45.7MP không màn trập cơ học, quay 8.3K 60p N-RAW nội bộ, chụp 120fps.',
          description: 'Được mệnh danh là "Baby Z9", Nikon Z8 gói gọn sức mạnh của máy ảnh flagship thể thao vào thân máy nhỏ hơn 30%. Loại bỏ hoàn toàn màn trập cơ học nhờ tốc độ đọc cảm biến cực nhanh, nhận diện 9 loại chủ thể bằng Deep Learning AI.',
          categoryId: catMirrorless.id,
          brandId: nikon.id,
          specifications: {
            sensor: '45.7 Megapixel Stacked BSI CMOS Full-Frame không màn trập cơ',
            video: '8.3K 60p N-RAW 12-bit & 4.1K 120p, Apple ProRes 422 HQ nội bộ',
            burstRate: 'Chụp liên tục 20fps RAW, 120fps ảnh JPEG độ phân giải 11MP',
            viewfinder: 'Kính ngắm Real-Life Viewfinder không chớp sáng 3.69M điểm',
            durability: 'Chống chịu thời tiết tương đương dòng máy chuyên nghiệp D6',
            weight: '910g (Kèm pin EN-EL15c)',
          },
          imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
        },
      ];

      for (const item of productsData) {
        const { imageUrl, ...pData } = item;
        await this.product.upsert({
          where: { slug: item.slug },
          update: {},
          create: {
            ...pData,
            images: {
              create: [{ imageUrl, isPrimary: true, sortOrder: 0 }],
            },
          },
        });
      }

      // 5. Seed Serial Numbers
      const seededProducts = await this.product.findMany();
      const serials = [
        { sku: 'DJI-MAVIC3-PRO-CINE', sn: 'DJI-M3PRO-2026-8899', months: 24 },
        { sku: 'DJI-MAVIC3-PRO-CINE', sn: 'DJI-M3PRO-2026-8900', months: 24 },
        { sku: 'DJI-POCKET3-CREATOR', sn: 'DJI-POCKET3-2026-5521', months: 12 },
        { sku: 'DJI-RS4-PRO-COMBO', sn: 'DJI-RS4P-2026-3341', months: 12 },
        { sku: 'ILME-FX3-BODY', sn: 'SONY-FX3-VN-9901', months: 24 },
        { sku: 'ILCE-7M4-BODY', sn: 'SONY-A7M4-VN-1102', months: 24 },
        { sku: 'CANON-R5-M2-BODY', sn: 'CANON-R5M2-2026-7733', months: 24 },
        { sku: 'FUJI-XT5-BODY-SILVER', sn: 'FUJI-XT5-VN-4410', months: 24 },
        { sku: 'DJI-MINI4-PRO-RC2', sn: 'DJI-MINI4P-2026-1205', months: 12 },
        { sku: 'SEL2470GM2', sn: 'SONY-2470GM2-VN-8820', months: 24 },
      ];

      for (const s of serials) {
        const prod = seededProducts.find((p) => p.sku === s.sku);
        if (prod) {
          await this.cameraSerial.upsert({
            where: { serialNumber: s.sn },
            update: {},
            create: {
              productId: prod.id,
              serialNumber: s.sn,
              status: SerialStatus.IN_STOCK,
              warrantyMonths: s.months,
              soldDate: new Date('2026-03-15'),
              warrantyExpires: new Date(Date.now() + s.months * 30 * 24 * 3600 * 1000),
            },
          });
        }
      }

      this.logger.log('🎉 Auto-seed Pro Camera & DJI Gear completed successfully!');
    } catch (err) {
      this.logger.error('Error during autoSeed:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
