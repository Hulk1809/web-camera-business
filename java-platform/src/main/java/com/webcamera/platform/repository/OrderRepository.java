package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Order;
import java.util.List;
import java.util.UUID;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    @EntityGraph(attributePaths = {"items"})
    List<Order> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);
    @EntityGraph(attributePaths = {"items", "customer"})
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderNumber(String orderNumber);
    @EntityGraph(attributePaths = {"items"})
    Optional<Order> findByOrderNumberAndCustomerId(String orderNumber, UUID customerId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"items", "items.product"})
    @Query("select o from Order o where o.orderNumber = :orderNumber and o.customer.id = :customerId")
    Optional<Order> findCustomerOrderForUpdate(String orderNumber, UUID customerId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"items", "items.product"})
    @Query("select o from Order o where o.id = :id")
    Optional<Order> findByIdForUpdate(UUID id);
}
