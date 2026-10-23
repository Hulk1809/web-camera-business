package com.webcamera.platform.service;

import com.webcamera.platform.domain.Brand;
import com.webcamera.platform.domain.Category;
import com.webcamera.platform.repository.BrandRepository;
import com.webcamera.platform.repository.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaxonomyService {
    private final CategoryRepository categories;
    private final BrandRepository brands;

    public TaxonomyService(CategoryRepository categories, BrandRepository brands) {
        this.categories = categories;
        this.brands = brands;
    }

    @Transactional(readOnly = true)
    public List<Category> activeCategories() { return categories.findByActiveTrueOrderByNameAsc(); }

    @Transactional(readOnly = true)
    public List<Brand> activeBrands() { return brands.findByActiveTrueOrderByNameAsc(); }
}
