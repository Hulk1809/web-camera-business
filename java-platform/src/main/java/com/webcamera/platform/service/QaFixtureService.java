package com.webcamera.platform.service;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Payment;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.QaFixture;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.OrderStatusEventRepository;
import com.webcamera.platform.repository.PaymentRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.QaFixtureRepository;
import com.webcamera.platform.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

@Service
@ConditionalOnProperty(name = "app.qa-fixtures.enabled", havingValue = "true")
public class QaFixtureService {
    public record FixtureView(UUID id, String status, String orderNumber, Order.Status orderStatus,
                              Order.PaymentStatus paymentStatus, String productSku, Instant expiresAt,
                              List<OrderService.StatusEvent> timeline) {}

    private static final String SCENARIO = "order-readback";
    private static final String EMAIL_PREFIX = "qa-fixture+";
    private static final String SKU_PREFIX = "QA-FIXTURE-";

    private final QaFixtureRepository fixtures;
    private final UserRepository users;
    private final ProductRepository products;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderStatusEventRepository statusEvents;
    private final OrderService orders;
    private final PaymentService payments;
    private final PasswordEncoder passwordEncoder;

    public QaFixtureService(QaFixtureRepository fixtures, UserRepository users, ProductRepository products,
                            OrderRepository orderRepository, PaymentRepository paymentRepository,
                            OrderStatusEventRepository statusEvents, OrderService orders,
                            PaymentService payments, PasswordEncoder passwordEncoder) {
        this.fixtures = fixtures;
        this.users = users;
        this.products = products;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.statusEvents = statusEvents;
        this.orders = orders;
        this.payments = payments;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public FixtureView create(String scenario, int ttlSeconds) {
        if (!SCENARIO.equals(scenario)) throw new IllegalArgumentException("Unsupported QA scenario");
        if (ttlSeconds < 60 || ttlSeconds > 900) throw new IllegalArgumentException("TTL must be between 60 and 900 seconds");
        cleanupExpiredFixtures();

        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT);
        User customer = users.save(new User(EMAIL_PREFIX + suffix.toLowerCase(Locale.ROOT) + "@example.invalid",
                "QA Fixture Customer", passwordEncoder.encode(UUID.randomUUID().toString()), User.Role.CUSTOMER));
        User staff = users.save(new User(EMAIL_PREFIX + "staff-" + suffix.toLowerCase(Locale.ROOT) + "@example.invalid",
                "QA Fixture Staff", passwordEncoder.encode(UUID.randomUUID().toString()), User.Role.STAFF));
        Product product = products.save(new Product(SKU_PREFIX + suffix, "QA Fixture Camera", new BigDecimal("1234567"), 3));
        Order order = orders.place(customer.getId(), List.of(new OrderService.Line(product.getId(), 1)),
                new OrderService.DeliveryDetails("QA Fixture", customer.getEmail(), "0900000000",
                        "QA ONLY - AUTO CLEANUP", "VietQR MB Bank"));
        Payment payment = payments.createForOrder(order.getId());
        QaFixture fixture = fixtures.save(new QaFixture(SCENARIO, customer.getId(), staff.getId(), product.getId(),
                order.getId(), payment.getId(), Instant.now().plusSeconds(ttlSeconds)));
        return view(fixture);
    }

    @Transactional(readOnly = true)
    public FixtureView get(UUID fixtureId) {
        QaFixture fixture = fixtures.findById(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("QA fixture not found"));
        if (fixture.getExpiresAt().isBefore(Instant.now())) throw new IllegalStateException("QA fixture expired");
        return view(fixture);
    }

    @Transactional
    public FixtureView advance(UUID fixtureId) {
        QaFixture fixture = requireActive(fixtureId);
        OrderService.TrackingDetails tracking = orders.customerOrder(fixture.getCustomerId(), orderNumber(fixture));
        switch (tracking.status()) {
            case PENDING_PAYMENT -> payments.confirm(fixture.getPaymentId(), fixture.getStaffId(),
                    "QA-" + fixture.getId());
            case PAID -> orders.changeStatus(fixture.getOrderId(), Order.Status.CONFIRMED);
            case CONFIRMED -> orders.changeStatus(fixture.getOrderId(), Order.Status.PROCESSING);
            case PROCESSING -> orders.changeStatus(fixture.getOrderId(), Order.Status.SHIPPED);
            case SHIPPED -> orders.changeStatus(fixture.getOrderId(), Order.Status.COMPLETED);
            case COMPLETED -> { }
            default -> throw new IllegalStateException("Fixture cannot advance from " + tracking.status());
        }
        return view(fixture);
    }

    @Transactional
    public void cleanup(UUID fixtureId) {
        fixtures.findById(fixtureId).ifPresent(this::cleanupFixture);
    }

    private QaFixture requireActive(UUID fixtureId) {
        QaFixture fixture = fixtures.findById(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("QA fixture not found"));
        if (fixture.getExpiresAt().isBefore(Instant.now())) {
            cleanupFixture(fixture);
            throw new IllegalStateException("QA fixture expired");
        }
        return fixture;
    }

    @Scheduled(fixedDelayString = "${app.qa-fixtures.cleanup-interval-ms:300000}")
    @Transactional
    public void cleanupExpiredFixtures() {
        fixtures.findByExpiresAtBefore(Instant.now()).forEach(this::cleanupFixture);
    }

    private void cleanupFixture(QaFixture fixture) {
        Product product = products.findById(fixture.getProductId())
                .orElseThrow(() -> new IllegalStateException("Fixture product missing"));
        User customer = users.findById(fixture.getCustomerId())
                .orElseThrow(() -> new IllegalStateException("Fixture customer missing"));
        User staff = users.findById(fixture.getStaffId())
                .orElseThrow(() -> new IllegalStateException("Fixture staff missing"));
        if (!product.getSku().startsWith(SKU_PREFIX)
                || !customer.getEmail().startsWith(EMAIL_PREFIX)
                || !staff.getEmail().startsWith(EMAIL_PREFIX)) {
            throw new IllegalStateException("Refusing cleanup outside QA fixture namespace");
        }

        paymentRepository.deleteByOrderId(fixture.getOrderId());
        statusEvents.deleteByOrderId(fixture.getOrderId());
        orderRepository.deleteById(fixture.getOrderId());
        orderRepository.flush();
        products.delete(product);
        users.delete(customer);
        users.delete(staff);
        fixtures.delete(fixture);
    }

    private FixtureView view(QaFixture fixture) {
        OrderService.TrackingDetails tracking = orders.customerOrder(fixture.getCustomerId(), orderNumber(fixture));
        String sku = products.findById(fixture.getProductId()).map(Product::getSku)
                .orElseThrow(() -> new IllegalStateException("Fixture product missing"));
        return new FixtureView(fixture.getId(), fixture.getStatus(), tracking.orderNumber(), tracking.status(),
                tracking.paymentStatus(), sku, fixture.getExpiresAt(), tracking.timeline());
    }

    private String orderNumber(QaFixture fixture) {
        return orderRepository.findById(fixture.getOrderId()).map(Order::getOrderNumber)
                .orElseThrow(() -> new IllegalStateException("Fixture order missing"));
    }
}
