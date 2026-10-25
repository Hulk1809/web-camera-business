package com.webcamera.platform.repository;

import com.webcamera.platform.domain.CameraSerial;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface CameraSerialRepository extends JpaRepository<CameraSerial, UUID> {
    Optional<CameraSerial> findBySerialNumberIgnoreCase(String serialNumber);
    List<CameraSerial> findAllByOrderByCreatedAtDesc();
    List<CameraSerial> findByProductIdAndStatus(UUID productId, CameraSerial.Status status);
    List<CameraSerial> findByOrderItemOrderIdAndStatus(UUID orderId, CameraSerial.Status status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from CameraSerial s where s.id = :id")
    Optional<CameraSerial> findByIdForUpdate(UUID id);
}
