package com.webcamera.platform.config;

import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.UserRepository;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.Brand;
import com.webcamera.platform.domain.Category;
import com.webcamera.platform.repository.BrandRepository;
import com.webcamera.platform.repository.CategoryRepository;
import com.webcamera.platform.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class BootstrapData implements ApplicationRunner {
    private final UserRepository users;
    private final UserService userService;
    private final boolean enabled;
    private final String email;
    private final String password;
    private final ProductRepository products;
    private final CategoryRepository categories;
    private final BrandRepository brands;
    private final boolean sampleCatalogEnabled;

    public BootstrapData(UserRepository users, UserService userService, ProductRepository products,
                           CategoryRepository categories, BrandRepository brands,
                          @Value("${app.bootstrap-admin.enabled:false}") boolean enabled,
                          @Value("${app.bootstrap-admin.email:}") String email,
                          @Value("${app.bootstrap-admin.password:}") String password,
                          @Value("${app.bootstrap-sample-catalog.enabled:false}") boolean sampleCatalogEnabled) {
        this.users = users; this.userService = userService; this.products = products;
        this.categories = categories; this.brands = brands;
        this.enabled = enabled; this.email = email; this.password = password;
        this.sampleCatalogEnabled = sampleCatalogEnabled;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (enabled) {
            if (email.isBlank() || password.length() < 12) {
                throw new IllegalStateException("Bootstrap admin requires an email and password of at least 12 characters");
            }
            if (users.findByEmailIgnoreCase(email).isEmpty()) {
                userService.create(email, "Administrator", password, User.Role.ADMIN);
            }
        }
        if (sampleCatalogEnabled) seedRetailCatalog();
    }

    private void seedRetailCatalog() {
        Category cameras = category("Máy Ảnh Mirrorless & DSLR", "may-anh-mirrorless-dslr");
        Category cinema = category("Máy Quay Điện Ảnh & Cinema", "may-quay-cinema");
        Category drones = category("Flycam & Drone DJI", "flycam-drone-dji");
        Category gimbals = category("Gimbal & Chống Rung DJI Ronin", "gimbal-chong-rung");
        Category creator = category("Action Cam & Pocket Creator", "action-cam-pocket");
        Category lenses = category("Ống Kính Chuyên Dụng (Lenses)", "ong-kinh-lenses");
        Category audio = category("Âm Thanh & Ánh Sáng Studio", "am-thanh-anh-sang");

        Brand dji = brand("DJI", "dji");
        Brand sony = brand("Sony", "sony");
        Brand canon = brand("Canon", "canon");
        Brand fuji = brand("Fujifilm", "fujifilm");
        Brand nikon = brand("Nikon", "nikon");
        Brand blackmagic = brand("Blackmagic Design", "blackmagic-design");

        product("DJI-MAVIC3-PRO-CINE", "DJI Mavic 3 Pro Cine Combo - 3 Camera Hasselblad Apple ProRes",
                "79990000", 12, drones, dji, "Hệ thống 3 camera quang học Hasselblad, Apple ProRes 5.1K và SSD 1TB.",
                Map.of("sensor", "Hasselblad 4/3 CMOS 20MP", "video", "Apple ProRes 5.1K/50fps"));
        product("ILME-FX3-BODY", "Sony Cinema Line FX3 (ILME-FX3) - Máy quay Full-Frame chuyên nghiệp",
                "94990000", 8, cinema, sony, "Full-Frame 12.1MP, Dual Base ISO và quay 4K 120p không giới hạn.",
                Map.of("sensor", "Full-Frame Exmor R CMOS", "video", "4K 120p 10-bit 4:2:2"));
        product("ILCE-7M4-BODY", "Sony Alpha 7 IV (A7M4) Body - Máy ảnh Full-Frame Hybrid 33MP",
                "53990000", 18, cameras, sony, "Máy ảnh hybrid 33MP, quay 4K 60p và Real-time Eye AF.",
                Map.of("sensor", "Full-Frame 33MP Exmor R", "stabilization", "IBIS 5 trục 5.5 stops"));
        product("DJI-RS4-PRO-COMBO", "DJI RS 4 Pro Gimbal Combo - Tay cầm chống rung tải trọng 4.5kg",
                "19990000", 25, gimbals, dji, "Cần trục carbon thế hệ 2 và thuật toán chống rung RS thế hệ 4.",
                Map.of("payload", "Tải trọng 4.5kg", "stabilization", "RS 4th Gen"));
        product("DJI-POCKET3-CREATOR", "DJI Osmo Pocket 3 Creator Combo - Camera Vlogging Cảm biến 1-inch",
                "15890000", 30, creator, dji, "Cảm biến 1-inch, quay 4K 120fps, OLED xoay 2 inch và DJI Mic 2.",
                Map.of("sensor", "1-inch CMOS", "video", "4K 120fps 10-bit D-Log M"));
        product("CANON-R5-M2-BODY", "Canon EOS R5 Mark II Body - 45MP Stacked CMOS & 8K 60p RAW",
                "104990000", 6, cameras, canon, "Cảm biến stacked 45MP, quay 8K 60p RAW và Eye Control AF.",
                Map.of("sensor", "45MP Stacked Full-Frame", "video", "8K 60p RAW"));
        product("DJI-MINI4-PRO-RC2", "DJI Mini 4 Pro Fly More Combo Plus (DJI RC 2) - Dưới 249g",
                "24890000", 20, drones, dji, "Flycam dưới 249g, cảm biến vật cản đa hướng và quay dọc 4K HDR.",
                Map.of("weight", "Dưới 249g", "video", "4K 60fps HDR"));
        product("BMD-CINEMA-6K-FF", "Blackmagic Cinema Camera 6K (Full-Frame L-Mount)",
                "62500000", 10, cinema, blackmagic, "Full-Frame 6K Open Gate, Blackmagic RAW 12-bit và L-Mount.",
                Map.of("sensor", "Full-Frame 6K", "video", "Blackmagic RAW 12-bit"));
        product("FUJI-XT5-BODY-SILVER", "Fujifilm X-T5 Body Silver - 40.2MP X-Trans CMOS 5 HR",
                "41900000", 15, cameras, fuji, "Thiết kế hoài cổ, 40.2MP và 19 giả lập màu phim Film Simulation.",
                Map.of("sensor", "40.2MP X-Trans CMOS 5 HR", "video", "6.2K 30p 10-bit"));
        product("SEL2470GM2", "Ống kính Sony FE 24-70mm F2.8 GM II (SEL2470GM2)",
                "49990000", 14, lenses, sony, "Ống kính G Master thế hệ II, khẩu độ F2.8 toàn dải và 4 motor XD.",
                Map.of("optics", "24-70mm F2.8 Full-Frame", "weight", "695g"));
        product("DJI-MIC2-COMBO", "Bộ Micro Thu Âm Không Dây DJI Mic 2 (2 TX + 1 RX + Hộp sạc)",
                "8490000", 40, audio, dji, "Thu âm 32-bit Float, chống ồn thông minh và phạm vi truyền 250m.",
                Map.of("audio", "32-bit Float 48kHz", "battery", "18 giờ kèm hộp sạc"));
        product("NIKON-Z8-BODY", "Nikon Z8 Body - Máy ảnh Mirrorless 45.7MP Quay 8.3K N-RAW",
                "86900000", 9, cameras, nikon, "Cảm biến stacked 45.7MP, quay 8.3K N-RAW và chụp 120fps.",
                Map.of("sensor", "45.7MP Stacked BSI CMOS", "video", "8.3K 60p N-RAW"));
    }

    private Category category(String name, String slug) {
        return categories.findBySlug(slug).orElseGet(() -> categories.save(new Category(name, slug)));
    }

    private Brand brand(String name, String slug) {
        return brands.findBySlug(slug).orElseGet(() -> brands.save(new Brand(name, slug)));
    }

    private void product(String sku, String name, String price, int stock, Category category, Brand brand,
                         String description, Map<String, String> specifications) {
        if (products.findBySkuIgnoreCase(sku).isPresent()) return;
        Product product = new Product(sku, name, new BigDecimal(price), stock);
        product.setCategory(category);
        product.setBrand(brand);
        product.setDescription(description);
        product.setSpecifications(specifications);
        products.save(product);
    }
}
