package com.webcamera.platform.repository;

import com.webcamera.platform.domain.OrderStatusEvent;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusEventRepository extends JpaRepository<OrderStatusEvent, UUID> {
    List<OrderStatusEvent> findByOrderIdOrderByRecordedAtAsc(UUID orderId);
}
