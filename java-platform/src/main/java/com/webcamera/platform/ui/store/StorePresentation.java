package com.webcamera.platform.ui.store;

import com.webcamera.platform.domain.Product;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;

public final class StorePresentation {
    private static final String FALLBACK = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900";
    private static final Map<String, String> IMAGES = Map.ofEntries(
            Map.entry("DJI-MAVIC3-PRO-CINE", "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=900"),
            Map.entry("ILME-FX3-BODY", "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900"),
            Map.entry("ILCE-7M4-BODY", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900"),
            Map.entry("DJI-RS4-PRO-COMBO", "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900"),
            Map.entry("DJI-POCKET3-CREATOR", "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=900"),
            Map.entry("CANON-R5-M2-BODY", "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=900"),
            Map.entry("DJI-MINI4-PRO-RC2", "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900"),
            Map.entry("BMD-CINEMA-6K-FF", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=900"),
            Map.entry("FUJI-XT5-BODY-SILVER", "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=900"),
            Map.entry("SEL2470GM2", "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=900"),
            Map.entry("DJI-MIC2-COMBO", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900"),
            Map.entry("NIKON-Z8-BODY", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900")
    );

    private StorePresentation() {}

    public static String image(Product product) {
        return IMAGES.getOrDefault(product.getSku(), FALLBACK);
    }

    public static BigDecimal originalPrice(Product product) {
        return product.getPrice().multiply(new BigDecimal("1.10")).setScale(-3, RoundingMode.UP);
    }

    public static String money(BigDecimal amount) {
        NumberFormat format = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN"));
        format.setMaximumFractionDigits(0);
        return format.format(amount);
    }

    public static String category(Product product) {
        return product.getCategory() == null ? "Máy Ảnh & Thiết Bị" : product.getCategory().getName();
    }

    public static String brand(Product product) {
        return product.getBrand() == null ? brandFromSku(product.getSku()) : product.getBrand().getName();
    }

    private static String brandFromSku(String sku) {
        String value = sku.toUpperCase(Locale.ROOT);
        if (value.contains("DJI")) return "DJI";
        if (value.contains("ILME") || value.contains("ILCE") || value.contains("SEL")) return "Sony";
        if (value.contains("CANON")) return "Canon";
        if (value.contains("FUJI")) return "Fujifilm";
        if (value.contains("NIKON")) return "Nikon";
        if (value.contains("BMD")) return "Blackmagic Design";
        return "PRO GEAR";
    }
}
