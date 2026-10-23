package com.webcamera.platform.web;

import com.webcamera.platform.service.CatalogService;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    public record ProductResponse(UUID id, String sku, String name, String description, BigDecimal price, int stock) {}
    private final CatalogService catalog;
    public ProductController(CatalogService catalog) { this.catalog = catalog; }
    @GetMapping
    public List<ProductResponse> list() {
        return catalog.activeProducts().stream().map(p -> new ProductResponse(
                p.getId(), p.getSku(), p.getName(), p.getDescription(), p.getPrice(), p.getStockQuantity())).toList();
    }
    @GetMapping("/{id}")
    public ProductResponse detail(@PathVariable UUID id) {
        var product = catalog.activeProduct(id);
        return new ProductResponse(product.getId(), product.getSku(), product.getName(), product.getDescription(),
                product.getPrice(), product.getStockQuantity());
    }
}
