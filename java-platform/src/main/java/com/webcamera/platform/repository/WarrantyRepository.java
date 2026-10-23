package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Warranty;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarrantyRepository extends JpaRepository<Warranty, UUID> {
    @EntityGraph(attributePaths = {"cameraSerial", "customer", "order"})
    List<Warranty> findAllByOrderByCreatedAtDesc();
    Optional<Warranty> findByCameraSerialId(UUID cameraSerialId);
    @EntityGraph(attributePaths = {"cameraSerial", "cameraSerial.product", "order"})
    Optional<Warranty> findByCameraSerialSerialNumberIgnoreCase(String serialNumber);
}
