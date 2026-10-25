package com.webcamera.platform.ui;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
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
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;
import com.vaadin.flow.component.textfield.IntegerField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.OrderItem;
import com.webcamera.platform.domain.Payment;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.CatalogService;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.PosCheckoutService;
import com.webcamera.platform.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;

@Route(value = "pos", layout = MainLayout.class)
@PageTitle("Point of Sale (POS) | Camera Platform")
@RolesAllowed({"ADMIN", "STAFF"})
public class PosView extends VerticalLayout {
    private final CatalogService catalog;
    private final PaymentService payments;
    private final PosCheckoutService checkout;
    private final UserService users;

    private final ComboBox<Product> productSelect = new ComboBox<>("Select Product");
    private final IntegerField quantityField = new IntegerField("Quantity");
    private final Button addToOrderBtn = new Button("Add to Cart");
    private final Grid<CartItem> cartGrid = new Grid<>(CartItem.class, false);
    private final Span totalLabel = new Span("Total: $0.00");
    private final RadioButtonGroup<String> paymentMethod = new RadioButtonGroup<>();
    private final Button checkoutBtn = new Button("Complete Sale & Print Receipt");
    private final List<CartItem> cartItems = new ArrayList<>();

    public record CartItem(Product product, int quantity) {}

    public PosView(CatalogService catalog, PaymentService payments, UserService users,
                   PosCheckoutService checkout) {
        this.catalog = catalog;
        this.payments = payments;
        this.users = users;
        this.checkout = checkout;

        setSizeFull();
        setId("pos-view");
        add(new H2("POS - Point of Sale Counter"),
                new Paragraph("In-store counter sales with instant VietQR / Cash checkout and receipt printing."));

        configureCatalogInputs();
        configureCartGrid();

        HorizontalLayout addRow = new HorizontalLayout(productSelect, quantityField, addToOrderBtn);
        addRow.setAlignItems(Alignment.END);

        paymentMethod.setLabel("Payment Method");
        paymentMethod.setId("pos-payment-method");
        paymentMethod.setItems("Cash", "VietQR MB Bank", "Credit Card");
        paymentMethod.setValue("VietQR MB Bank");

        totalLabel.getStyle().set("font-size", "var(--lumo-font-size-xl)")
                .set("font-weight", "bold")
                .set("color", "var(--lumo-primary-text-color)");
        totalLabel.setId("pos-total");

        checkoutBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_SUCCESS);
        checkoutBtn.setId("pos-checkout");
        checkoutBtn.addClickListener(event -> processCheckout());

        HorizontalLayout actionRow = new HorizontalLayout(paymentMethod, totalLabel, checkoutBtn);
        actionRow.setAlignItems(Alignment.CENTER);
        actionRow.setWidthFull();
        actionRow.setJustifyContentMode(JustifyContentMode.BETWEEN);

        add(addRow, cartGrid, actionRow);
        expand(cartGrid);
    }

    private void configureCatalogInputs() {
        productSelect.setItems(catalog.activeProducts());
        productSelect.setId("pos-product-select");
        productSelect.setItemLabelGenerator(p -> p.getName() + " (" + money(p.getPrice()) + ", Stock: " + p.getStockQuantity() + ")");
        productSelect.setWidth("400px");

        quantityField.setValue(1);
        quantityField.setId("pos-quantity");
        quantityField.setMin(1);
        quantityField.setStepButtonsVisible(true);

        addToOrderBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        addToOrderBtn.setId("pos-add-item");
        addToOrderBtn.addClickListener(e -> {
            Product product = productSelect.getValue();
            if (product == null) {
                Notification.show("Select a product.");
                return;
            }
            int qty = quantityField.getValue() != null ? quantityField.getValue() : 1;
            if (qty > product.getStockQuantity()) {
                Notification.show("Not enough stock available (" + product.getStockQuantity() + ").");
                return;
            }

            cartItems.add(new CartItem(product, qty));
            refreshCart();
            productSelect.clear();
            quantityField.setValue(1);
        });
    }

    private void configureCartGrid() {
        cartGrid.addColumn(item -> item.product.getName()).setHeader("Product").setFlexGrow(1);
        cartGrid.setId("pos-cart-grid");
        cartGrid.addColumn(item -> item.product.getSku()).setHeader("SKU").setAutoWidth(true);
        cartGrid.addColumn(item -> money(item.product.getPrice())).setHeader("Unit Price").setAutoWidth(true);
        cartGrid.addColumn(item -> item.quantity).setHeader("Qty").setAutoWidth(true);
        cartGrid.addColumn(item -> money(item.product.getPrice().multiply(BigDecimal.valueOf(item.quantity))))
                .setHeader("Subtotal").setAutoWidth(true);
        cartGrid.addComponentColumn(item -> new Button("Remove", e -> {
            cartItems.remove(item);
            refreshCart();
        })).setHeader("Actions").setAutoWidth(true);

        cartGrid.setWidthFull();
    }

    private void refreshCart() {
        cartGrid.setItems(new ArrayList<>(cartItems));
        BigDecimal total = cartItems.stream()
                .map(i -> i.product.getPrice().multiply(BigDecimal.valueOf(i.quantity)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        totalLabel.setText("Total: " + money(total));
    }

    private void processCheckout() {
        if (cartItems.isEmpty()) {
            Notification.show("Cart is empty.");
            return;
        }

        try {
            String staffEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User staff = users.requireDomainUser(staffEmail);

            List<OrderService.Line> lines = cartItems.stream()
                    .map(item -> new OrderService.Line(item.product.getId(), item.quantity))
                    .toList();

            PosCheckoutService.Result result = checkout.checkout(staff.getId(), lines, selectedMethod());
            Order order = result.order();
            Payment payment = result.payment();

            showReceiptDialog(order, payment);
            cartItems.clear();
            refreshCart();
            Notification.show(payment == null ? "Đã hoàn tất giao dịch tại quầy." : "Đơn hàng đang chờ xác nhận VietQR.");
        } catch (Exception ex) {
            Notification.show("Checkout error: " + ex.getMessage(), 5000, Notification.Position.MIDDLE);
        }
    }

    private void showReceiptDialog(Order order, Payment payment) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("Sale Receipt - " + order.getOrderNumber());

        VerticalLayout layout = new VerticalLayout();
        layout.setId("pos-receipt-content");
        layout.setWidth("420px");

        layout.add(new H3("PROGEAR CAMERA STORE"));
        layout.add(new Span("Order: " + order.getOrderNumber()));
        layout.add(new Span("Channel: POS In-Store"));
        layout.add(new Span("Payment Method: " + paymentMethod.getValue()));
        layout.add(new Span("Status: " + order.getStatus()));
        layout.add(new Span("Date: " + DateTimeFormatter.ISO_INSTANT.format(order.getCreatedAt())));

        VerticalLayout itemsLayout = new VerticalLayout();
        itemsLayout.setPadding(false);
        for (OrderItem oi : order.getItems()) {
            itemsLayout.add(new Span(oi.getQuantity() + "x " + oi.getProduct().getName() + " - " + money(oi.subtotal())));
        }
        layout.add(itemsLayout);

        Span totalSpan = new Span((payment == null ? "TOTAL PAID: " : "TOTAL PENDING: ") + money(order.total()));
        totalSpan.getStyle().set("font-weight", "bold").set("font-size", "var(--lumo-font-size-l)");
        layout.add(totalSpan);

        if (payment != null) {
            Image qr = new Image(payments.toInstructions(payment).qrUrl(), "MB Bank VietQR");
            qr.setWidth("200px");
            qr.setHeight("200px");
            layout.add(new Span("MB Bank VietQR Payment:"), qr);
        }

        Button printBtn = new Button("Print", event -> {
            UI.getCurrent().getPage().executeJs("window.print()");
        });
        printBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Button closeBtn = new Button("Close", event -> dialog.close());

        dialog.add(layout);
        dialog.getFooter().add(printBtn, closeBtn);
        dialog.open();
    }

    private PosCheckoutService.Method selectedMethod() {
        return switch (paymentMethod.getValue()) {
            case "Cash" -> PosCheckoutService.Method.CASH;
            case "VietQR MB Bank" -> PosCheckoutService.Method.VIETQR;
            case "Credit Card" -> PosCheckoutService.Method.CREDIT_CARD;
            default -> throw new IllegalArgumentException("Unsupported payment method");
        };
    }

    private static String money(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(Locale.US).format(amount);
    }
}
