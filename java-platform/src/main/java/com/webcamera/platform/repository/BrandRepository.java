package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Brand;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, UUID> {
    List<Brand> findByActiveTrueOrderByNameAsc();
    Optional<Brand> findBySlug(String slug);
}
