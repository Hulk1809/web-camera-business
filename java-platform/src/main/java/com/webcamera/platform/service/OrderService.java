package com.webcamera.platform.service;

import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.OrderRepository;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    public record Line(UUID productId, int quantity) {}
    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;
    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users) {
        this.orders = orders; this.products = products; this.users = users;
    }
    @Transactional
    public Order place(UUID customerId, List<Line> lines) {
        if (lines == null || lines.isEmpty()) throw new IllegalArgumentException("At least one line is required");
        User customer = users.findById(customerId).orElseThrow(() -> new IllegalArgumentException("Unknown customer"));
        Order order = new Order(customer);
        for (Line line : lines) {
            Product product = products.findByIdForUpdate(line.productId()).orElseThrow(() -> new IllegalArgumentException("Unknown product"));
            if (!product.isActive()) throw new IllegalStateException("Product is inactive");
            product.reserve(line.quantity());
            order.addItem(product, line.quantity());
        }
        order.place();
        return orders.save(order);
    }
}
