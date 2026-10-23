package com.webcamera.platform.web;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.service.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    public record LineRequest(@NotNull UUID productId, @Positive int quantity) {}
    public record PlaceOrderRequest(@NotEmpty List<@Valid LineRequest> lines) {}
    public record OrderResponse(UUID id, String orderNumber, Order.Status status,
                                Order.PaymentStatus paymentStatus, BigDecimal total) {}
    public record StatusRequest(@NotNull Order.Status status) {}
    public record CancelRequest(String reason) {}

    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;
    public OrderController(OrderService orders, UserService users, PaymentService payments) {
        this.orders = orders; this.users = users; this.payments = payments;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> place(@Valid @RequestBody PlaceOrderRequest request, Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        Order order = orders.place(customer.getId(), request.lines().stream()
                .map(line -> new OrderService.Line(line.productId(), line.quantity())).toList());
        payments.createForOrder(order.getId());
        return ResponseEntity.created(URI.create("/api/orders/" + order.getId()))
                .body(toResponse(order));
    }

    @GetMapping("/{id}/payment")
    public PaymentService.Instructions payment(@PathVariable UUID id, Principal principal) {
        return payments.instructions(id, principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<OrderResponse> list() {
        return orders.allOrders().stream().map(this::toResponse).toList();
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public OrderResponse changeStatus(@PathVariable UUID id, @Valid @RequestBody StatusRequest request) {
        return toResponse(orders.changeStatus(id, request.status()));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public OrderResponse cancel(@PathVariable UUID id, @RequestBody CancelRequest request) {
        return toResponse(orders.cancel(id, request.reason()));
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(order.getId(), order.getOrderNumber(), order.getStatus(),
                order.getPaymentStatus(), order.total());
    }
}
