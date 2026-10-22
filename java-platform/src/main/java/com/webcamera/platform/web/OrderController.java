package com.webcamera.platform.web;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.UserService;
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

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    public record LineRequest(@NotNull UUID productId, @Positive int quantity) {}
    public record PlaceOrderRequest(@NotEmpty List<@Valid LineRequest> lines) {}
    public record OrderResponse(UUID id, Order.Status status, BigDecimal total) {}

    private final OrderService orders;
    private final UserService users;
    public OrderController(OrderService orders, UserService users) { this.orders = orders; this.users = users; }

    @PostMapping
    public ResponseEntity<OrderResponse> place(@Valid @RequestBody PlaceOrderRequest request, Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        Order order = orders.place(customer.getId(), request.lines().stream()
                .map(line -> new OrderService.Line(line.productId(), line.quantity())).toList());
        return ResponseEntity.created(URI.create("/api/orders/" + order.getId()))
                .body(new OrderResponse(order.getId(), order.getStatus(), order.total()));
    }
}
