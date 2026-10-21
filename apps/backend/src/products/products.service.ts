import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const limit = Number(query.limit) || 50;
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
      throw new NotFoundException('Không tìm thấy thiết bị này');
    }

    return product;
  }

  async create(data: any) {
    const stockQuantity = Number(data.stockQuantity ?? data.stock ?? 10);
    if (!Number.isSafeInteger(stockQuantity) || stockQuantity < 0) {
      throw new BadRequestException('Tồn kho phải là số nguyên không âm');
    }
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
          data: { name: 'Máy Ảnh Mirrorless & DSLR', slug: 'may-anh-mirrorless-dslr' },
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
          data: { name: 'Sony', slug: 'sony' },
        });
        brandId = br.id;
      }
    }

    const name = data.name || 'Thiết bị Nhiếp Ảnh & Điện Ảnh Chuyên Nghiệp';
    const timestamp = Date.now();
    const slug = data.slug || (name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + timestamp);
    const sku = data.sku || ('PRO-' + Math.floor(1000 + Math.random() * 9000));
    const price = Number(data.price) || 25000000;
    const originalPrice = Number(data.originalPrice) || Math.round(price * 1.15);
    const shortDesc = data.shortDesc || name;
    const description = data.description || shortDesc;
    const specifications = data.specifications || {
      sensor: data.sensor || 'Full-Frame BSI CMOS',
      video: data.video || '4K 60p 10-bit 4:2:2',
      stabilization: data.stabilization || 'Chống rung IBIS 5 trục',
      weight: data.weight || '650g',
      features: Array.isArray(data.features) ? data.features : ['Quay 4K HDR', 'Lấy nét AI'],
    };

    let imageList: string[] = [];
    if (Array.isArray(data.images)) {
      imageList = data.images.map((img: any) => typeof img === 'string' ? img.trim() : (img.imageUrl || img.url || '')).filter(Boolean);
    } else if (Array.isArray(data.imageUrls)) {
      imageList = data.imageUrls.map((img: any) => typeof img === 'string' ? img.trim() : (img.imageUrl || img.url || '')).filter(Boolean);
    } else if (typeof data.images === 'string' && data.images.trim()) {
      imageList = data.images.split('\n').map((s: string) => s.trim()).filter(Boolean);
    } else if (data.imageUrl && typeof data.imageUrl === 'string') {
      imageList = [data.imageUrl.trim()];
    }

    if (imageList.length === 0) {
      imageList = ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'];
    }

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
          create: imageList.map((url, idx) => ({
            imageUrl: url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        },
      },
      include: { category: true, brand: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async update(id: string, data: any) {
    const { images, imageUrls, imageUrl, ...rawData } = data;
    const productData: any = {};
    for (const key of ['name', 'slug', 'sku', 'shortDesc', 'description', 'isFeatured', 'isActive', 'specifications']) {
      if (rawData[key] !== undefined) productData[key] = rawData[key];
    }
    for (const key of ['price', 'originalPrice']) {
      if (rawData[key] !== undefined) productData[key] = Number(rawData[key]);
    }
    if (rawData.stockQuantity !== undefined) productData.stockQuantity = rawData.stockQuantity;

    if (rawData.categoryId !== undefined) productData.categoryId = Number(rawData.categoryId);
    else if (typeof rawData.category === 'string' && rawData.category.trim()) {
      const name = rawData.category.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const category = await this.prisma.category.upsert({ where: { slug }, update: {}, create: { name, slug } });
      productData.categoryId = category.id;
    }
    if (rawData.brandId !== undefined) productData.brandId = Number(rawData.brandId);
    else if (typeof rawData.brand === 'string' && rawData.brand.trim()) {
      const name = rawData.brand.trim();
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const brand = await this.prisma.brand.upsert({ where: { slug }, update: {}, create: { name, slug } });
      productData.brandId = brand.id;
    }

    if (productData.stockQuantity !== undefined &&
        (!Number.isSafeInteger(productData.stockQuantity) || productData.stockQuantity < 0)) {
      throw new BadRequestException('Tồn kho phải là số nguyên không âm');
    }

    const hasNewImages = images !== undefined || imageUrls !== undefined || imageUrl !== undefined;
    if (hasNewImages) {
      let imageList: string[] = [];
      if (Array.isArray(images)) {
        imageList = images.map((img: any) => typeof img === 'string' ? img.trim() : (img.imageUrl || img.url || '')).filter(Boolean);
      } else if (Array.isArray(imageUrls)) {
        imageList = imageUrls.map((img: any) => typeof img === 'string' ? img.trim() : (img.imageUrl || img.url || '')).filter(Boolean);
      } else if (typeof images === 'string' && images.trim()) {
        imageList = images.split('\n').map((s: string) => s.trim()).filter(Boolean);
      } else if (imageUrl && typeof imageUrl === 'string') {
        imageList = [imageUrl.trim()];
      }

      if (imageList.length > 0) {
        await this.prisma.productImage.deleteMany({ where: { productId: id } });
        await this.prisma.productImage.createMany({
          data: imageList.map((url, idx) => ({
            productId: id,
            imageUrl: url,
            isPrimary: idx === 0,
            sortOrder: idx,
          })),
        });
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: productData,
      include: { category: true, brand: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.cameraSerial.deleteMany({ where: { productId: id } });
      await this.prisma.review.deleteMany({ where: { productId: id } });
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      return await this.prisma.product.delete({ where: { id } });
    } catch (err) {
      return this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }
  }

  async seed() {
    await this.prisma.autoSeed(true);
    return this.findAll({ limit: 100 });
  }
}
