package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.OrderItem;
import com.webcamera.platform.domain.Payment;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.springframework.security.core.context.SecurityContextHolder;

@Route(value = "my-orders", layout = MainLayout.class)
@PageTitle("My Orders | Camera Platform")
@RolesAllowed({"CUSTOMER", "ADMIN", "STAFF"})
public class CustomerOrdersView extends VerticalLayout {
    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;
    private final Grid<Order> orderGrid = new Grid<>(Order.class, false);

    public CustomerOrdersView(OrderService orders, UserService users, PaymentService payments) {
        this.orders = orders;
        this.users = users;
        this.payments = payments;

        setSizeFull();
        add(new H2("Order History & Warranties"),
                new Paragraph("View your previous equipment orders, payment status, and bank transfer QR codes."));

        configureGrid();
        add(orderGrid);
        expand(orderGrid);
        loadOrders();
    }

    private void configureGrid() {
        orderGrid.addColumn(Order::getOrderNumber).setHeader("Order #").setAutoWidth(true);
        orderGrid.addColumn(o -> DateTimeFormatter.ISO_INSTANT.format(o.getCreatedAt())).setHeader("Date").setAutoWidth(true);
        orderGrid.addColumn(o -> money(o.total())).setHeader("Total").setAutoWidth(true);
        orderGrid.addColumn(Order::getStatus).setHeader("Order Status").setAutoWidth(true);
        orderGrid.addColumn(Order::getPaymentStatus).setHeader("Payment Status").setAutoWidth(true);
        orderGrid.addComponentColumn(order -> {
            Button viewBtn = new Button("Details", event -> showOrderDetails(order));
            if (order.getPaymentStatus() == Order.PaymentStatus.PENDING) {
                Button payBtn = new Button("Pay VietQR", event -> showPaymentQr(order));
                payBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
                return new HorizontalLayout(viewBtn, payBtn);
            }
            return viewBtn;
        }).setHeader("Actions").setAutoWidth(true);
        orderGrid.setWidthFull();
    }

    private void loadOrders() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            User customer = users.requireDomainUser(email);
            List<Order> list = orders.customerOrders(customer.getId());
            orderGrid.setItems(list);
        } catch (Exception ex) {
            orderGrid.setItems(List.of());
        }
    }

    private void showOrderDetails(Order order) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("Order: " + order.getOrderNumber());

        VerticalLayout layout = new VerticalLayout();
        layout.add(new Span("Status: " + order.getStatus() + " | Payment: " + order.getPaymentStatus()));

        VerticalLayout itemsLayout = new VerticalLayout();
        for (OrderItem item : order.getItems()) {
            itemsLayout.add(new Span(item.getQuantity() + "x " + item.getProduct().getName() + " - " + money(item.subtotal())));
        }
        layout.add(new H3("Items:"), itemsLayout);
        layout.add(new Span("Total: " + money(order.total())));

        Button closeBtn = new Button("Close", e -> dialog.close());
        dialog.add(layout);
        dialog.getFooter().add(closeBtn);
        dialog.open();
    }

    private void showPaymentQr(Order order) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("VietQR Payment - " + order.getOrderNumber());

        VerticalLayout layout = new VerticalLayout();
        Payment payment = payments.all().stream()
                .filter(p -> p.getOrder().getId().equals(order.getId()) && p.getStatus() == Payment.Status.PENDING)
                .findFirst()
                .orElse(null);

        if (payment == null) {
            payment = payments.createForOrder(order.getId());
        }

        Image qr = new Image(payments.toInstructions(payment).qrUrl(), "VietQR MB Bank");
        qr.setWidth("220px");
        qr.setHeight("220px");

        layout.add(new Paragraph("Scan using MB Bank or any banking app supporting VietQR:"),
                qr,
                new Span("Account: " + payment.getTransferContent()),
                new Span("Amount: " + money(payment.getAmount())));

        Button closeBtn = new Button("Close", e -> dialog.close());
        dialog.add(layout);
        dialog.getFooter().add(closeBtn);
        dialog.open();
    }

    private static String money(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(Locale.US).format(amount);
    }
}
