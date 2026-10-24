package com.webcamera.platform.service;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.OrderStatusEvent;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.OrderStatusEventRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    public record Line(UUID productId, int quantity) {}
    public record DeliveryDetails(String recipientName, String email, String phone, String address,
                                  String paymentMethod) {}
    public record OrderSummary(UUID id, String orderNumber, Instant createdAt, BigDecimal total,
                               Order.Status status, Order.PaymentStatus paymentStatus, boolean cancellable) {}
    public record ItemSnapshot(String sku, String name, BigDecimal unitPrice, int quantity, BigDecimal subtotal) {}
    public record StatusEvent(Order.Status status, Instant recordedAt, String note) {}
    public record TrackingDetails(UUID id, String orderNumber, Instant createdAt, BigDecimal total,
                                  Order.Status status, Order.PaymentStatus paymentStatus,
                                  String recipientName, String recipientEmail, String recipientPhone,
                                  String shippingAddress, String paymentMethod, String cancellationReason,
                                  Instant cancelledAt, boolean cancellable, List<ItemSnapshot> items,
                                  List<StatusEvent> timeline) {}
    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;
    private final OrderStatusEventRepository statusEvents;
    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users,
                        OrderStatusEventRepository statusEvents) {
        this.orders = orders; this.products = products; this.users = users; this.statusEvents = statusEvents;
    }
    @Transactional
    public Order place(UUID customerId, List<Line> lines) {
        User customer = users.findById(customerId).orElseThrow(() -> new IllegalArgumentException("Unknown customer"));
        return place(customer, lines, new DeliveryDetails(customer.getDisplayName(), customer.getEmail(), "", "", "UNSPECIFIED"));
    }

    @Transactional
    public Order place(UUID customerId, List<Line> lines, DeliveryDetails delivery) {
        User customer = users.findById(customerId).orElseThrow(() -> new IllegalArgumentException("Unknown customer"));
        requireDelivery(delivery);
        return place(customer, lines, delivery);
    }

    @Transactional
    public Order checkout(UUID customerId, String idempotencyKey, List<Line> lines, DeliveryDetails delivery) {
        String key = requireIdempotencyKey(idempotencyKey);
        requireDelivery(delivery);
        List<Line> normalizedLines = normalizeLines(lines);
        String fingerprint = fingerprint(normalizedLines, delivery);
        User customer = users.findByIdForUpdate(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Unknown customer"));
        return orders.findByCustomerIdAndIdempotencyKey(customerId, key)
                .map(existing -> requireMatchingCheckout(existing, fingerprint))
                .orElseGet(() -> {
                    Order created = place(customer, normalizedLines, delivery);
                    created.identifyCheckout(key, fingerprint);
                    return created;
                });
    }

    private Order place(User customer, List<Line> lines, DeliveryDetails delivery) {
        if (lines == null || lines.isEmpty()) throw new IllegalArgumentException("At least one line is required");
        Order order = new Order(customer);
        order.snapshotDelivery(delivery.recipientName(), delivery.email(), delivery.phone(), delivery.address(), delivery.paymentMethod());
        for (Line line : lines) {
            Product product = products.findByIdForUpdate(line.productId()).orElseThrow(() -> new IllegalArgumentException("Unknown product"));
            if (!product.isActive()) throw new IllegalStateException("Product is inactive");
            product.reserve(line.quantity());
            order.addItem(product, line.quantity());
        }
        order.place();
        Order saved = orders.save(order);
        statusEvents.save(new OrderStatusEvent(saved, saved.getStatus(), "Đơn hàng đã được tiếp nhận"));
        return saved;
    }

    @Transactional
    public Order placePos(UUID staffOrCustomerId, List<Line> lines) {
        if (lines == null || lines.isEmpty()) throw new IllegalArgumentException("At least one line is required");
        User user = users.findById(staffOrCustomerId).orElseThrow(() -> new IllegalArgumentException("Unknown customer or staff"));
        Order order = new Order(user, Order.SalesChannel.POS);
        for (Line line : lines) {
            Product product = products.findByIdForUpdate(line.productId()).orElseThrow(() -> new IllegalArgumentException("Unknown product"));
            if (!product.isActive()) throw new IllegalStateException("Product is inactive");
            product.reserve(line.quantity());
            order.addItem(product, line.quantity());
        }
        order.completePosSale();
        Order saved = orders.save(order);
        statusEvents.save(new OrderStatusEvent(saved, saved.getStatus(), "Hoàn tất tại quầy"));
        return saved;
    }
    @Transactional(readOnly = true)
    public List<Order> allOrders() { return orders.findAllByOrderByCreatedAtDesc(); }

    @Transactional(readOnly = true)
    public List<Order> customerOrders(UUID customerId) {
        return orders.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    @Transactional(readOnly = true)
    public List<OrderSummary> customerOrderSummaries(UUID customerId) {
        return orders.findByCustomerIdOrderByCreatedAtDesc(customerId).stream().map(this::summary).toList();
    }

    @Transactional(readOnly = true)
    public TrackingDetails customerOrder(UUID customerId, String orderNumber) {
        Order order = orders.findByOrderNumberAndCustomerId(normalizeOrderNumber(orderNumber), customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));
        List<StatusEvent> timeline = statusEvents.findByOrderIdOrderByRecordedAtAsc(order.getId()).stream()
                .map(event -> new StatusEvent(event.getStatus(), event.getRecordedAt(), event.getNote())).toList();
        if (timeline.isEmpty()) {
            timeline = List.of(new StatusEvent(order.getStatus(), order.getCreatedAt(), "Trạng thái hiện tại"));
        }
        return details(order, timeline);
    }

    @Transactional
    public Order changeStatus(UUID orderId, Order.Status status) {
        Order order = orders.findByIdForUpdate(orderId).orElseThrow(() -> new IllegalArgumentException("Unknown order"));
        order.changeStatus(status);
        statusEvents.save(new OrderStatusEvent(order, status, "Trạng thái được cập nhật"));
        return order;
    }

    @Transactional
    public Order cancel(UUID orderId, String reason) {
        Order order = orders.findByIdForUpdate(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Unknown order"));
        order.cancel(reason);
        order.getItems().forEach(item -> item.getProduct().release(item.getQuantity()));
        statusEvents.save(new OrderStatusEvent(order, Order.Status.CANCELLED, "Đơn hàng đã hủy"));
        return order;
    }

    @Transactional
    public TrackingDetails cancelForCustomer(UUID customerId, String orderNumber, String reason) {
        Order order = orders.findCustomerOrderForUpdate(normalizeOrderNumber(orderNumber), customerId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));
        if (!isCustomerCancellable(order)) throw new IllegalStateException("Đơn hàng không còn có thể hủy trực tuyến");
        order.cancel(reason);
        order.getItems().forEach(item -> item.getProduct().release(item.getQuantity()));
        statusEvents.save(new OrderStatusEvent(order, Order.Status.CANCELLED, "Khách hàng yêu cầu hủy"));
        statusEvents.flush();
        List<StatusEvent> timeline = statusEvents.findByOrderIdOrderByRecordedAtAsc(order.getId()).stream()
                .map(item -> new StatusEvent(item.getStatus(), item.getRecordedAt(), item.getNote())).toList();
        return details(order, timeline);
    }

    private OrderSummary summary(Order order) {
        return new OrderSummary(order.getId(), order.getOrderNumber(), order.getCreatedAt(), order.total(),
                order.getStatus(), order.getPaymentStatus(), isCustomerCancellable(order));
    }

    private TrackingDetails details(Order order, List<StatusEvent> timeline) {
        List<ItemSnapshot> items = order.getItems().stream()
                .map(item -> new ItemSnapshot(item.getProductSku(), item.getProductName(), item.getUnitPrice(),
                        item.getQuantity(), item.subtotal())).toList();
        return new TrackingDetails(order.getId(), order.getOrderNumber(), order.getCreatedAt(), order.total(),
                order.getStatus(), order.getPaymentStatus(), order.getRecipientName(), order.getRecipientEmail(),
                order.getRecipientPhone(), order.getShippingAddress(), order.getPaymentMethod(),
                order.getCancellationReason(), order.getCancelledAt(), isCustomerCancellable(order), items, timeline);
    }

    private static boolean isCustomerCancellable(Order order) {
        return order.getStatus() == Order.Status.PLACED || order.getStatus() == Order.Status.PENDING_PAYMENT;
    }

    private static void requireDelivery(DeliveryDetails delivery) {
        if (delivery == null || blank(delivery.recipientName()) || blank(delivery.email())
                || blank(delivery.phone()) || blank(delivery.address()) || blank(delivery.paymentMethod())) {
            throw new IllegalArgumentException("Delivery details are required");
        }
    }

    private static String normalizeOrderNumber(String orderNumber) {
        if (blank(orderNumber)) throw new IllegalArgumentException("Không tìm thấy đơn hàng");
        return orderNumber.trim().toUpperCase(java.util.Locale.ROOT);
    }

    private static boolean blank(String value) { return value == null || value.isBlank(); }

    private static Order requireMatchingCheckout(Order order, String fingerprint) {
        if (!fingerprint.equals(order.getCheckoutFingerprint())) {
            throw new IllegalStateException("Idempotency key was already used for another checkout");
        }
        return order;
    }

    private static String requireIdempotencyKey(String value) {
        if (blank(value)) throw new IllegalArgumentException("Idempotency-Key is required");
        String key = value.trim();
        if (key.length() > 100) throw new IllegalArgumentException("Idempotency-Key is too long");
        return key;
    }

    private static List<Line> normalizeLines(List<Line> lines) {
        if (lines == null || lines.isEmpty()) throw new IllegalArgumentException("At least one line is required");
        Map<UUID, Integer> quantities = new LinkedHashMap<>();
        for (Line line : lines) {
            if (line == null || line.productId() == null || line.quantity() < 1) {
                throw new IllegalArgumentException("Product and positive quantity are required");
            }
            quantities.merge(line.productId(), line.quantity(), Math::addExact);
        }
        return quantities.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new Line(entry.getKey(), entry.getValue()))
                .toList();
    }

    private static String fingerprint(List<Line> lines, DeliveryDetails delivery) {
        List<String> values = new ArrayList<>();
        lines.stream().sorted(Comparator.comparing(Line::productId)).forEach(line -> {
            values.add(line.productId().toString());
            values.add(Integer.toString(line.quantity()));
        });
        values.add(cleanFingerprintValue(delivery.recipientName()));
        values.add(cleanFingerprintValue(delivery.email()).toLowerCase(Locale.ROOT));
        values.add(cleanFingerprintValue(delivery.phone()));
        values.add(cleanFingerprintValue(delivery.address()));
        values.add(cleanFingerprintValue(delivery.paymentMethod()));
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(String.join("\u001f", values).getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException impossible) {
            throw new IllegalStateException("SHA-256 unavailable", impossible);
        }
    }

    private static String cleanFingerprintValue(String value) { return value.trim(); }
}
