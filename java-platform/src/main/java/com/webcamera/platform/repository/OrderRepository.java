package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Order;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    @EntityGraph(attributePaths = {"items", "customer"})
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderNumber(String orderNumber);
}
