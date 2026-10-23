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
    public WarrantyResponse lookup(@PathVariable String serialNumber) {
        try {
            Warranty warranty = inventory.warrantyBySerial(serialNumber);
            return new WarrantyResponse(warranty.getId(), warranty.getCameraSerial().getSerialNumber(),
                    warranty.getCameraSerial().getProduct().getName(), warranty.getOrder().getOrderNumber(),
                    warranty.getStartsOn(), warranty.getExpiresOn(), warranty.getStatus());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Warranty not found");
        }
    }
}
