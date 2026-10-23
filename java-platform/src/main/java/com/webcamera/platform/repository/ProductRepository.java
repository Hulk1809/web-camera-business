package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Product;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    @EntityGraph(attributePaths = {"category", "brand"})
    List<Product> findByActiveTrueOrderByNameAsc();
    Optional<Product> findBySkuIgnoreCase(String sku);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Optional<Product> findByIdForUpdate(UUID id);
}
