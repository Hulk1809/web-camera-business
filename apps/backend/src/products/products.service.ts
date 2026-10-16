import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    categoryId?: number;
    brandId?: number;
    search?: string;
    isFeatured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.brandId) where.brandId = Number(query.brandId);
    if (query.isFeatured !== undefined) where.isFeatured = String(query.isFeatured) === 'true';

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = Number(query.minPrice);
      if (query.maxPrice) where.price.lte = Number(query.maxPrice);
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
        { shortDesc: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          include: { user: { select: { fullName: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm camera này');
    }

    return product;
  }

  async create(data: any) {
    let categoryId = data.categoryId ? Number(data.categoryId) : undefined;
    if (!categoryId && data.category) {
      const slug = String(data.category).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const cat = await this.prisma.category.upsert({
        where: { slug },
        update: {},
        create: { name: String(data.category), slug },
      });
      categoryId = cat.id;
    }
    if (!categoryId) {
      const firstCat = await this.prisma.category.findFirst();
      if (firstCat) categoryId = firstCat.id;
      else {
        const cat = await this.prisma.category.create({
          data: { name: 'Camera Wifi Trong Nhà', slug: 'camera-wifi-trong-nha' },
        });
        categoryId = cat.id;
      }
    }

    let brandId = data.brandId ? Number(data.brandId) : undefined;
    if (!brandId && data.brand) {
      const slug = String(data.brand).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const br = await this.prisma.brand.upsert({
        where: { slug },
        update: {},
        create: { name: String(data.brand), slug },
      });
      brandId = br.id;
    }
    if (!brandId) {
      const firstBrand = await this.prisma.brand.findFirst();
      if (firstBrand) brandId = firstBrand.id;
      else {
        const br = await this.prisma.brand.create({
          data: { name: 'Hikvision', slug: 'hikvision' },
        });
        brandId = br.id;
      }
    }

    const name = data.name || 'Camera giám sát thông minh';
    const timestamp = Date.now();
    const slug = data.slug || (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + timestamp);
    const sku = data.sku || ('CAM-' + Math.floor(1000 + Math.random() * 9000));
    const price = Number(data.price) || 850000;
    const originalPrice = Number(data.originalPrice) || Math.round(price * 1.25);
    const stockQuantity = Number(data.stockQuantity || data.stock) || 10;
    const shortDesc = data.shortDesc || name;
    const description = data.description || shortDesc;
    const specifications = data.specifications || {
      resolution: data.resolution || '4.0 MP 2K',
      nightVision: data.nightVision || 'ColorVu có màu 24/7',
      aiFeatures: data.aiFeatures || (data.aiFeature ? [data.aiFeature] : ['Phát hiện người và phương tiện']),
    };

    const imageUrl = data.imageUrl || (data.images?.[0]?.imageUrl) || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600';

    return this.prisma.product.create({
      data: {
        name,
        slug,
        sku,
        price,
        originalPrice,
        stockQuantity,
        shortDesc,
        description,
        isFeatured: true,
        isActive: true,
        specifications,
        categoryId,
        brandId,
        images: {
          create: [{ imageUrl, isPrimary: true, sortOrder: 0 }],
        },
      },
      include: { category: true, brand: true, images: true },
    });
  }

  async update(id: string, data: any) {
    const { images, ...productData } = data;
    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true, brand: true, images: true },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.cameraSerial.deleteMany({ where: { productId: id } });
      await this.prisma.review.deleteMany({ where: { productId: id } });
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      return await this.prisma.product.delete({ where: { id } });
    } catch (err) {
      // Product may already be deleted or not found
      return { id, deleted: true };
    }
  }

  async seed() {
    await this.prisma.autoSeed();
    return this.findAll({ limit: 100 });
  }
}
