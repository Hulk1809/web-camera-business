package com.webcamera.platform.web;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.CheckoutService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    public record LineRequest(@NotNull UUID productId, @Positive int quantity) {}
    public record DeliveryRequest(@NotBlank String recipientName, @NotBlank @Email String email,
                                  @NotBlank String phone, @NotBlank String address,
                                  @NotBlank @Pattern(regexp = "COD|VietQR MB Bank") String paymentMethod) {}
    public record PlaceOrderRequest(@NotEmpty List<@Valid LineRequest> lines, @Valid @NotNull DeliveryRequest delivery) {}
    public record OrderResponse(UUID id, String orderNumber, Order.Status status,
                                Order.PaymentStatus paymentStatus, BigDecimal total) {}
    public record StatusRequest(@NotNull Order.Status status) {}
    public record CancelRequest(String reason) {}

    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;
    private final CheckoutService checkout;
    public OrderController(OrderService orders, UserService users, PaymentService payments, CheckoutService checkout) {
        this.orders = orders; this.users = users; this.payments = payments; this.checkout = checkout;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> place(@RequestHeader("Idempotency-Key") String idempotencyKey,
                                               @Valid @RequestBody PlaceOrderRequest request, Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        DeliveryRequest delivery = request.delivery();
        Order order;
        try {
            order = checkout.checkout(customer.getId(), idempotencyKey, request.lines().stream()
                            .map(line -> new OrderService.Line(line.productId(), line.quantity())).toList(),
                    new OrderService.DeliveryDetails(delivery.recipientName(), delivery.email(), delivery.phone(),
                            delivery.address(), delivery.paymentMethod()));
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage());
        }
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

    @GetMapping("/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<OrderService.OrderSummary> mine(Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        return orders.customerOrderSummaries(customer.getId());
    }

    @GetMapping("/mine/{orderNumber}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderService.TrackingDetails mineDetail(@PathVariable String orderNumber, Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        try {
            return orders.customerOrder(customer.getId(), orderNumber);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng");
        }
    }

    @PostMapping("/mine/{orderNumber}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public OrderService.TrackingDetails cancelMine(@PathVariable String orderNumber,
                                                    @RequestBody CancelRequest request, Principal principal) {
        User customer = users.requireDomainUser(principal.getName());
        try {
            return orders.cancelForCustomer(customer.getId(), orderNumber, request.reason());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng");
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage());
        }
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
