package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Payment;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @EntityGraph(attributePaths = {"order", "order.customer"})
    List<Payment> findAllByOrderByCreatedAtDesc();
    @EntityGraph(attributePaths = {"order", "order.customer"})
    Optional<Payment> findByOrderId(UUID orderId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Payment p join fetch p.order where p.id = :id")
    Optional<Payment> findByIdForUpdate(@Param("id") UUID id);
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Payment payment where payment.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") UUID orderId);
}
