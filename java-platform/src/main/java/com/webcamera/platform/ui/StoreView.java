package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.details.Details;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.value.ValueChangeMode;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouterLink;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.CatalogService;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.UserService;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Route(value = "", layout = MainLayout.class)
@PageTitle("Store | Camera Platform")
@AnonymousAllowed
public class StoreView extends VerticalLayout {
    private enum Availability { ALL, IN_STOCK, OUT_OF_STOCK }

    private final CatalogService catalog;
    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;
    private final Grid<Product> productGrid = new Grid<>(Product.class, false);
    private final Grid<CartLine> cartGrid = new Grid<>(CartLine.class, false);
    private final Map<UUID, CartLine> cart = new LinkedHashMap<>();
    private final TextField search = new TextField("Search catalog");
    private final ComboBox<Availability> availability = new ComboBox<>("Availability");
    private final Span resultCount = new Span();
    private final Span cartSummary = new Span("Cart is empty");
    private final VerticalLayout paymentPanel = new VerticalLayout();
    private List<Product> products = List.of();

    public StoreView(CatalogService catalog, OrderService orders, UserService users, PaymentService payments) {
        this.catalog = catalog;
        this.orders = orders;
        this.users = users;
        this.payments = payments;

        setSizeFull();
        add(new H2("Camera store"), new Paragraph("Browse the live catalog, build a draft cart, and place an account order."));
        configureFilters();
        configureProductGrid();
        configureCartGrid();

        HorizontalLayout filters = new HorizontalLayout(search, availability, resultCount);
        filters.setWidthFull();
        filters.setAlignItems(Alignment.END);
        filters.setFlexGrow(1, search);

        Details checkout = new Details("Checkout", createCheckoutForm());
        checkout.setWidthFull();
        paymentPanel.setVisible(false);
        add(filters, productGrid, new H3("Draft cart"), cartSummary, cartGrid, checkout, paymentPanel);
        productGrid.setWidthFull();
        cartGrid.setWidthFull();
        refreshCatalog();
    }

    private void configureFilters() {
        search.setId("qa-search-input");
        search.setPlaceholder("Name, SKU, or description");
        search.setClearButtonVisible(true);
        search.setValueChangeMode(ValueChangeMode.LAZY);
        search.addValueChangeListener(event -> applyFilters());
        availability.setItems(Availability.values());
        availability.setItemLabelGenerator(value -> switch (value) {
            case ALL -> "All products";
            case IN_STOCK -> "In stock";
            case OUT_OF_STOCK -> "Out of stock";
        });
        availability.setValue(Availability.ALL);
        availability.addValueChangeListener(event -> applyFilters());
    }

    private void configureProductGrid() {
        productGrid.setId("qa-product-grid");
        productGrid.addColumn(Product::getName).setHeader("Product").setAutoWidth(true).setFlexGrow(1);
        productGrid.addColumn(Product::getSku).setHeader("SKU").setAutoWidth(true);
        productGrid.addColumn(product -> money(product.getPrice())).setHeader("Price").setAutoWidth(true);
        productGrid.addColumn(product -> product.getStockQuantity() > 0 ? product.getStockQuantity() + " available" : "Out of stock")
                .setHeader("Availability").setAutoWidth(true);
        productGrid.addComponentColumn(product -> {
            RouterLink details = new RouterLink("Details", ProductDetailView.class, product.getId().toString());
            Button add = new Button("Add", event -> addToCart(product));
            add.setEnabled(product.getStockQuantity() > quantityInCart(product));
            return new HorizontalLayout(details, add);
        }).setHeader("Actions").setAutoWidth(true);
        productGrid.setEmptyStateText("No products match these filters.");
        productGrid.setAllRowsVisible(true);
    }

    private void configureCartGrid() {
        cartGrid.addColumn(line -> line.product().getName()).setHeader("Product").setFlexGrow(1);
        cartGrid.addColumn(CartLine::quantity).setHeader("Qty").setAutoWidth(true);
        cartGrid.addColumn(line -> money(line.subtotal())).setHeader("Subtotal").setAutoWidth(true);
        cartGrid.addComponentColumn(line -> {
            Button decrease = new Button("−", event -> changeQuantity(line, -1));
            decrease.setAriaLabel("Remove one " + line.product().getName());
            Button increase = new Button("+", event -> changeQuantity(line, 1));
            increase.setAriaLabel("Add one " + line.product().getName());
            increase.setEnabled(line.quantity() < line.product().getStockQuantity());
            Button remove = new Button("Remove", event -> removeFromCart(line));
            return new HorizontalLayout(decrease, increase, remove);
        }).setHeader("Actions").setAutoWidth(true);
        cartGrid.setEmptyStateText("Add a product to start a draft order.");
        cartGrid.setAllRowsVisible(true);
        refreshCart();
    }

    private VerticalLayout createCheckoutForm() {
        TextField name = new TextField("Contact name");
        EmailField email = new EmailField("Contact email");
        TextField phone = new TextField("Phone");
        TextArea address = new TextArea("Shipping address");
        Checkbox acknowledgement = new Checkbox("I confirm contact and shipping details are correct");
        Button placeOrder = new Button("Place account order", event -> placeOrder(name, email, phone, address, acknowledgement));
        placeOrder.addThemeVariants(ButtonVariant.LUMO_PRIMARY);

        Paragraph limitation = new Paragraph("Payment uses MB Bank transfer. Order remains pending until staff verifies bank transaction.");
        VerticalLayout form = new VerticalLayout(limitation, name, email, phone, address, acknowledgement, placeOrder);
        form.setPadding(false);
        form.setSpacing(true);
        form.setWidthFull();
        return form;
    }

    private void placeOrder(TextField name, EmailField email, TextField phone, TextArea address,
                            Checkbox acknowledgement) {
        if (cart.isEmpty()) {
            Notification.show("Your cart is empty.");
            return;
        }
        if (name.isEmpty() || email.isEmpty() || phone.isEmpty() || address.isEmpty()) {
            Notification.show("Complete the checkout contact form before placing the order.");
            return;
        }
        if (!Boolean.TRUE.equals(acknowledgement.getValue())) {
            Notification.show("Please acknowledge the current checkout limitation.");
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            Notification.show("Sign in with a customer account to place this order.");
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
            return;
        }
        try {
            User customer = users.requireDomainUser(authentication.getName());
            List<OrderService.Line> lines = cart.values().stream()
                    .map(line -> new OrderService.Line(line.product().getId(), line.quantity()))
                    .toList();
            Order order = orders.place(customer.getId(), lines);
            PaymentService.Instructions payment = payments.toInstructions(payments.createForOrder(order.getId()));
            cart.clear();
            refreshCart();
            refreshCatalog();
            showPayment(payment, order.getOrderNumber());
            Notification.show("Order " + order.getOrderNumber() + " placed. Transfer exact amount and content shown below.",
                    7000, Notification.Position.MIDDLE);
        } catch (RuntimeException ex) {
            Notification.show("Order was not placed: " + safeMessage(ex), 6000, Notification.Position.MIDDLE);
        }
    }

    private void showPayment(PaymentService.Instructions payment, String orderNumber) {
        Image qr = new Image(payment.qrUrl(), "VietQR for order " + orderNumber);
        qr.setWidth("320px");
        paymentPanel.removeAll();
        paymentPanel.add(new H3("MB Bank transfer"), qr,
                new Span("Account: " + payment.accountNumber()),
                new Span("Name: " + payment.accountName()),
                new Span("Amount: " + payment.amount().toPlainString()),
                new Span("Transfer content: " + payment.transferContent()),
                new Paragraph("Status: pending manual bank verification. Do not change transfer content."));
        paymentPanel.setVisible(true);
    }

    private void refreshCatalog() {
        products = catalog.activeProducts();
        applyFilters();
    }

    private void applyFilters() {
        String query = search.getValue() == null ? "" : search.getValue().trim().toLowerCase(Locale.ROOT);
        Availability selected = availability.getValue() == null ? Availability.ALL : availability.getValue();
        List<Product> filtered = products.stream()
                .filter(product -> query.isBlank()
                        || product.getName().toLowerCase(Locale.ROOT).contains(query)
                        || product.getSku().toLowerCase(Locale.ROOT).contains(query)
                        || text(product.getDescription()).toLowerCase(Locale.ROOT).contains(query))
                .filter(product -> selected == Availability.ALL
                        || selected == Availability.IN_STOCK && product.getStockQuantity() > 0
                        || selected == Availability.OUT_OF_STOCK && product.getStockQuantity() == 0)
                .toList();
        productGrid.setItems(filtered);
        resultCount.setText(filtered.size() + (filtered.size() == 1 ? " result" : " results"));
    }

    private void addToCart(Product product) {
        CartLine current = cart.get(product.getId());
        int next = current == null ? 1 : current.quantity() + 1;
        if (next > product.getStockQuantity()) {
            Notification.show("No more stock is available for " + product.getName() + ".");
            return;
        }
        cart.put(product.getId(), new CartLine(product, next));
        refreshCart();
        productGrid.getDataProvider().refreshAll();
    }

    private void changeQuantity(CartLine line, int delta) {
        int next = line.quantity() + delta;
        if (next <= 0) {
            cart.remove(line.product().getId());
        } else if (next <= line.product().getStockQuantity()) {
            cart.put(line.product().getId(), new CartLine(line.product(), next));
        }
        refreshCart();
        productGrid.getDataProvider().refreshAll();
    }

    private void removeFromCart(CartLine line) {
        cart.remove(line.product().getId());
        refreshCart();
        productGrid.getDataProvider().refreshAll();
    }

    private void refreshCart() {
        List<CartLine> lines = new ArrayList<>(cart.values());
        cartGrid.setItems(lines);
        int itemCount = lines.stream().mapToInt(CartLine::quantity).sum();
        BigDecimal total = lines.stream().map(CartLine::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        cartSummary.setText(itemCount == 0 ? "Cart is empty" : itemCount + " item(s) · Draft total " + money(total));
    }

    private int quantityInCart(Product product) {
        CartLine line = cart.get(product.getId());
        return line == null ? 0 : line.quantity();
    }

    private static String money(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(Locale.US).format(amount);
    }

    private static String text(String value) {
        return value == null ? "" : value;
    }

    private static String safeMessage(RuntimeException exception) {
        return exception.getMessage() == null || exception.getMessage().isBlank()
                ? exception.getClass().getSimpleName() : exception.getMessage();
    }

    private record CartLine(Product product, int quantity) {
        private BigDecimal subtotal() {
            return product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
    }
}
