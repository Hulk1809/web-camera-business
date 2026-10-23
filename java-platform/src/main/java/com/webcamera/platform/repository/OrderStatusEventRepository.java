package com.webcamera.platform.repository;

import com.webcamera.platform.domain.OrderStatusEvent;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface OrderStatusEventRepository extends JpaRepository<OrderStatusEvent, UUID> {
    List<OrderStatusEvent> findByOrderIdOrderByRecordedAtAsc(UUID orderId);
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from OrderStatusEvent event where event.order.id = :orderId")
    void deleteByOrderId(UUID orderId);
}
