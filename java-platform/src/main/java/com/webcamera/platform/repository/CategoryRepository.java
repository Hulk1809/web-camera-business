package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Category;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByActiveTrueOrderByNameAsc();
    Optional<Category> findBySlug(String slug);
}
