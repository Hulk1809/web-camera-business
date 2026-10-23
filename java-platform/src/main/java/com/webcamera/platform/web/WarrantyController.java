package com.webcamera.platform.web;

import com.webcamera.platform.domain.Warranty;
import com.webcamera.platform.service.InventoryService;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/warranty")
public class WarrantyController {
    public record WarrantyResponse(UUID id, String serialNumber, String productName, String orderNumber,
                                   LocalDate startsOn, LocalDate expiresOn, Warranty.Status status) {}

    private final InventoryService inventory;
    public WarrantyController(InventoryService inventory) { this.inventory = inventory; }

    @GetMapping("/{serialNumber}")
    public org.springframework.http.ResponseEntity<?> lookup(@PathVariable String serialNumber) {
        try {
            Warranty warranty = inventory.warrantyBySerial(serialNumber);
            return org.springframework.http.ResponseEntity.ok(new WarrantyResponse(warranty.getId(), warranty.getCameraSerial().getSerialNumber(),
                    warranty.getCameraSerial().getProduct().getName(), warranty.getOrder().getOrderNumber(),
                    warranty.getStartsOn(), warranty.getExpiresOn(), warranty.getStatus()));
        } catch (IllegalArgumentException exception) {
            return org.springframework.http.ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("error", "Not Found", "message", "Warranty not found for serial: " + serialNumber));
        }
    }
}
