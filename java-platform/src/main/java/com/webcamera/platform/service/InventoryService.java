package com.webcamera.platform.service;

import com.webcamera.platform.domain.CameraSerial;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.OrderItem;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.Warranty;
import com.webcamera.platform.repository.CameraSerialRepository;
import com.webcamera.platform.repository.OrderItemRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.WarrantyRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {
    private final CameraSerialRepository serials;
    private final WarrantyRepository warranties;
    private final ProductRepository products;
    private final OrderItemRepository items;

    public InventoryService(CameraSerialRepository serials, WarrantyRepository warranties,
                            ProductRepository products, OrderItemRepository items) {
        this.serials = serials; this.warranties = warranties; this.products = products; this.items = items;
    }
    @Transactional
    public CameraSerial register(UUID productId, String serialNumber) {
        Product product = products.findById(productId).orElseThrow(() -> new IllegalArgumentException("Unknown product"));
        if (serialNumber == null || serialNumber.isBlank()) throw new IllegalArgumentException("Serial number is required");
        if (serials.findBySerialNumberIgnoreCase(serialNumber.trim()).isPresent())
            throw new IllegalArgumentException("Serial number already exists");
        return serials.save(new CameraSerial(product, serialNumber));
    }
    @Transactional
    public Warranty sell(UUID serialId, UUID orderItemId, int warrantyMonths) {
        if (warrantyMonths < 1) throw new IllegalArgumentException("Warranty months must be positive");
        CameraSerial serial = serials.findByIdForUpdate(serialId).orElseThrow(() -> new IllegalArgumentException("Unknown serial"));
        OrderItem item = items.findById(orderItemId).orElseThrow(() -> new IllegalArgumentException("Unknown order item"));
        serial.sell(item);
        Order order = item.getOrder();
        LocalDate start = LocalDate.now();
        return warranties.save(new Warranty(serial, order.getCustomer(), order, start, start.plusMonths(warrantyMonths)));
    }
    @Transactional(readOnly = true)
    public List<CameraSerial> serials() { return serials.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true)
    public List<CameraSerial> availableSerials(UUID productId) {
        return serials.findByProductIdAndStatus(productId, CameraSerial.Status.IN_STOCK);
    }
    @Transactional(readOnly = true)
    public List<Warranty> warranties() { return warranties.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true)
    public Warranty warrantyBySerial(String serialNumber) {
        if (serialNumber == null || serialNumber.isBlank()) throw new IllegalArgumentException("Serial number is required");
        return warranties.findByCameraSerialSerialNumberIgnoreCase(serialNumber.trim())
                .orElseThrow(() -> new IllegalArgumentException("Warranty not found"));
    }
    @Transactional
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public Warranty claimWarranty(String serialNumber) {
        Warranty warranty = warrantyBySerial(serialNumber);
        warranty.claim();
        return warranty;
    }
}
