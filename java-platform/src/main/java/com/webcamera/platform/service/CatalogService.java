package com.webcamera.platform.service;

import com.webcamera.platform.domain.Product;
import com.webcamera.platform.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {
    private final ProductRepository products;
    public CatalogService(ProductRepository products) { this.products = products; }
    @Transactional(readOnly = true)
    public List<Product> activeProducts() { return products.findByActiveTrueOrderByNameAsc(); }
    @Transactional(readOnly = true)
    public List<Product> allProducts() { return products.findAll(); }
    @Transactional
    public Product save(Product product) { return products.save(product); }
}
