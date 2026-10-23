package com.webcamera.platform.web;

import com.webcamera.platform.service.TaxonomyService;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TaxonomyController {
    public record TaxonomyResponse(UUID id, String name, String slug) {}
    private final TaxonomyService taxonomy;

    public TaxonomyController(TaxonomyService taxonomy) { this.taxonomy = taxonomy; }

    @GetMapping("/categories")
    public List<TaxonomyResponse> categories() {
        return taxonomy.activeCategories().stream()
                .map(item -> new TaxonomyResponse(item.getId(), item.getName(), item.getSlug())).toList();
    }

    @GetMapping("/brands")
    public List<TaxonomyResponse> brands() {
        return taxonomy.activeBrands().stream()
                .map(item -> new TaxonomyResponse(item.getId(), item.getName(), item.getSlug())).toList();
    }
}
