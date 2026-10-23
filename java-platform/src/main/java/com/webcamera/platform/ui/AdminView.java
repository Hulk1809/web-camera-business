package com.webcamera.platform.ui;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.tabs.Tab;
import com.vaadin.flow.component.tabs.Tabs;
import com.vaadin.flow.component.textfield.IntegerField;
import com.vaadin.flow.component.textfield.NumberField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.service.CatalogService;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.domain.Payment;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.annotation.security.RolesAllowed;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Route(value = "admin", layout = MainLayout.class)
@PageTitle("Admin | Camera Platform")
@RolesAllowed("ADMIN")
public class AdminView extends VerticalLayout {
    private final CatalogService catalog;
    private final OrderService orders;
    private final PaymentService payments;
    private final UserService users;
    private final Grid<Product> productGrid = new Grid<>(Product.class, false);
    private final VerticalLayout content = new VerticalLayout();
    private final Map<Tab, Component> pages = new LinkedHashMap<>();
    private VerticalLayout dashboard;
    private Product selectedProduct;

    private final TextField sku = new TextField("SKU");
    private final TextField name = new TextField("Name");
    private final TextArea description = new TextArea("Description");
    private final NumberField price = new NumberField("Price");
    private final IntegerField stock = new IntegerField("Stock");
    private final Checkbox active = new Checkbox("Active");
    private final Button save = new Button("Create product");
    private final Button cancel = new Button("Clear selection");

    public AdminView(CatalogService catalog, OrderService orders, PaymentService payments, UserService users) {
        this.catalog = catalog;
        this.orders = orders;
        this.payments = payments;
        this.users = users;
        setSizeFull();
        add(new H2("Administration"));

        Tabs tabs = new Tabs();
        addPage(tabs, "Dashboard", createDashboard());
        addPage(tabs, "Products", createProductsPage());
        addPage(tabs, "Orders", createOrdersPage());
        addPage(tabs, "Payments", createPaymentsPage());
        addPage(tabs, "Warranty", unavailablePage("Warranty administration",
                "No warranty domain or service exists yet. Claims cannot be viewed or changed here."));
        addPage(tabs, "Chat", unavailablePage("Chat administration",
                "Chat can be started or replied to only when a session ID is already known; no service API lists sessions for agents."));
        tabs.addSelectedChangeListener(event -> showPage(event.getSelectedTab()));

        content.setSizeFull();
        content.setPadding(false);
        add(tabs, content);
        expand(content);
        showPage(tabs.getSelectedTab());
    }

    private VerticalLayout createPaymentsPage() {
        Grid<Payment> grid = new Grid<>(Payment.class, false);
        grid.addColumn(payment -> payment.getOrder().getOrderNumber()).setHeader("Order").setAutoWidth(true);
        grid.addColumn(Payment::getTransferContent).setHeader("Transfer content").setAutoWidth(true);
        grid.addColumn(payment -> money(payment.getAmount())).setHeader("Amount").setAutoWidth(true);
        grid.addColumn(Payment::getStatus).setHeader("Status").setAutoWidth(true);
        grid.addColumn(Payment::getProviderReference).setHeader("Bank reference").setAutoWidth(true);
        grid.addComponentColumn(payment -> {
            TextField reference = new TextField();
            reference.setPlaceholder("Bank transaction ID");
            Button confirm = new Button("Confirm paid", event -> confirmPayment(payment, reference, grid));
            confirm.setEnabled(payment.getStatus() == Payment.Status.PENDING);
            return new HorizontalLayout(reference, confirm);
        }).setHeader("Manual verification").setFlexGrow(1);
        grid.setItems(payments.all());
        grid.setWidthFull();
        VerticalLayout page = new VerticalLayout(new H3("MB Bank payments"),
                new Paragraph("Verify amount, transfer content, and transaction in MB Bank before confirming."), grid);
        page.setPadding(false); page.setSizeFull(); page.expand(grid);
        return page;
    }

    private void confirmPayment(Payment payment, TextField reference, Grid<Payment> grid) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            payments.confirm(payment.getId(), users.requireDomainUser(email).getId(), reference.getValue());
            grid.setItems(payments.all());
            Notification.show("Payment confirmed.");
        } catch (RuntimeException exception) {
            Notification.show("Payment was not confirmed: " + safeMessage(exception));
        }
    }

    private void addPage(Tabs tabs, String label, Component page) {
        Tab tab = new Tab(label);
        tabs.add(tab);
        pages.put(tab, page);
    }

    private void showPage(Tab tab) {
        content.removeAll();
        Component page = pages.get(tab);
        if (page != null) {
            if (page == dashboard) refreshDashboard();
            content.add(page);
            content.expand(page);
        }
    }

    private VerticalLayout createDashboard() {
        dashboard = new VerticalLayout();
        dashboard.setPadding(false);
        refreshDashboard();
        return dashboard;
    }

    private void refreshDashboard() {
        if (dashboard == null) return;
        List<Product> products = catalog.allProducts();
        List<Order> orderList = orders.allOrders();
        long activeProducts = products.stream().filter(Product::isActive).count();
        long lowStock = products.stream().filter(Product::isActive).filter(product -> product.getStockQuantity() < 5).count();
        int units = products.stream().mapToInt(Product::getStockQuantity).sum();
        BigDecimal inventoryValue = products.stream()
                .map(product -> product.getPrice().multiply(BigDecimal.valueOf(product.getStockQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.removeAll();
        dashboard.add(new H3("Catalog overview"),
                new Span("Products: " + products.size()),
                new Span("Active products: " + activeProducts),
                new Span("Low-stock active products: " + lowStock),
                new Span("Units in inventory: " + units),
                new Span("Inventory value at catalog price: " + money(inventoryValue)),
                new Span("Orders: " + orderList.size()),
                new Span("Order value: " + money(orderList.stream().map(Order::total).reduce(BigDecimal.ZERO, BigDecimal::add))),
                new Paragraph("Warranty and chat totals remain unavailable until those Java services expose list operations."));
    }

    private VerticalLayout createProductsPage() {
        configureProductGrid();
        configureProductForm();
        HorizontalLayout actions = new HorizontalLayout(save, cancel);
        VerticalLayout form = new VerticalLayout(new H3("Product editor"), sku, name, description, price, stock, active, actions);
        form.setPadding(false);
        form.setWidthFull();
        VerticalLayout page = new VerticalLayout(productGrid, form);
        page.setPadding(false);
        page.setSizeFull();
        page.expand(productGrid);
        refreshProducts();
        return page;
    }

    private void configureProductGrid() {
        productGrid.addColumn(Product::getSku).setHeader("SKU").setAutoWidth(true);
        productGrid.addColumn(Product::getName).setHeader("Name").setFlexGrow(1);
        productGrid.addColumn(product -> money(product.getPrice())).setHeader("Price").setAutoWidth(true);
        productGrid.addColumn(Product::getStockQuantity).setHeader("Stock").setAutoWidth(true);
        productGrid.addColumn(product -> product.isActive() ? "Active" : "Inactive").setHeader("Status").setAutoWidth(true);
        productGrid.setEmptyStateText("No products exist yet.");
        productGrid.asSingleSelect().addValueChangeListener(event -> editProduct(event.getValue()));
        productGrid.setWidthFull();
    }

    private void configureProductForm() {
        description.setMaxLength(2000);
        description.setWidthFull();
        price.setMin(0);
        price.setStep(0.01);
        stock.setMin(0);
        active.setValue(true);
        save.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        save.addClickListener(event -> saveProduct());
        cancel.addClickListener(event -> clearEditor());
    }

    private void editProduct(Product product) {
        selectedProduct = product;
        if (product == null) {
            clearEditor();
            return;
        }
        sku.setValue(product.getSku());
        sku.setReadOnly(true);
        name.setValue(value(product.getName()));
        description.setValue(value(product.getDescription()));
        price.setValue(product.getPrice().doubleValue());
        stock.setValue(product.getStockQuantity());
        active.setValue(product.isActive());
        save.setText("Save changes");
    }

    private void saveProduct() {
        if (sku.isEmpty() || name.isEmpty() || price.isEmpty() || stock.isEmpty()) {
            Notification.show("SKU, name, price, and stock are required.");
            return;
        }
        if (price.getValue() < 0 || stock.getValue() < 0) {
            Notification.show("Price and stock must be non-negative.");
            return;
        }
        try {
            Product product = selectedProduct;
            if (product == null) {
                product = new Product(sku.getValue().trim(), name.getValue().trim(),
                        BigDecimal.valueOf(price.getValue()), stock.getValue());
            } else {
                product.setName(name.getValue().trim());
                product.setPrice(BigDecimal.valueOf(price.getValue()));
                product.setStockQuantity(stock.getValue());
            }
            product.setDescription(description.getValue().trim());
            product.setActive(active.getValue());
            catalog.save(product);
            Notification.show(selectedProduct == null ? "Product created." : "Product updated.");
            clearEditor();
            refreshProducts();
            refreshDashboard();
        } catch (RuntimeException ex) {
            Notification.show("Product was not saved: " + safeMessage(ex), 6000, Notification.Position.MIDDLE);
        }
    }

    private void clearEditor() {
        selectedProduct = null;
        productGrid.deselectAll();
        sku.clear();
        sku.setReadOnly(false);
        name.clear();
        description.clear();
        price.clear();
        stock.clear();
        active.setValue(true);
        save.setText("Create product");
    }

    private void refreshProducts() {
        productGrid.setItems(catalog.allProducts());
    }

    private VerticalLayout createOrdersPage() {
        Grid<Order> grid = new Grid<>(Order.class, false);
        grid.addColumn(Order::getOrderNumber).setHeader("Order").setAutoWidth(true);
        grid.addColumn(order -> order.getCustomer().getDisplayName()).setHeader("Customer").setFlexGrow(1);
        grid.addColumn(order -> money(order.total())).setHeader("Total").setAutoWidth(true);
        grid.addColumn(Order::getPaymentStatus).setHeader("Payment").setAutoWidth(true);
        grid.addColumn(Order::getStatus).setHeader("Status").setAutoWidth(true);
        grid.addComponentColumn(order -> {
            Button confirm = new Button("Confirm", event -> updateOrderStatus(order, Order.Status.CONFIRMED, grid));
            Button ship = new Button("Ship", event -> updateOrderStatus(order, Order.Status.SHIPPED, grid));
            Button complete = new Button("Complete", event -> updateOrderStatus(order, Order.Status.COMPLETED, grid));
            confirm.setEnabled(order.getStatus() == Order.Status.PLACED
                    || order.getStatus() == Order.Status.PENDING_PAYMENT || order.getStatus() == Order.Status.PAID);
            ship.setEnabled(order.getStatus() == Order.Status.CONFIRMED || order.getStatus() == Order.Status.PROCESSING);
            complete.setEnabled(order.getStatus() == Order.Status.SHIPPED);
            return new HorizontalLayout(confirm, ship, complete);
        }).setHeader("Actions").setAutoWidth(true);
        grid.setItems(orders.allOrders());
        grid.setWidthFull();
        VerticalLayout page = new VerticalLayout(new H3("Order administration"), grid);
        page.setPadding(false);
        page.setSizeFull();
        page.expand(grid);
        return page;
    }

    private void updateOrderStatus(Order order, Order.Status status, Grid<Order> grid) {
        try {
            orders.changeStatus(order.getId(), status);
            grid.setItems(orders.allOrders());
            refreshDashboard();
            Notification.show("Order status updated.");
        } catch (RuntimeException exception) {
            Notification.show("Order was not updated: " + safeMessage(exception));
        }
    }

    private static VerticalLayout unavailablePage(String heading, String reason) {
        VerticalLayout page = new VerticalLayout(new H3(heading), new Paragraph(reason),
                new Span("Unavailable — backend capability required."));
        page.setPadding(false);
        return page;
    }

    private static String money(BigDecimal amount) {
        return NumberFormat.getCurrencyInstance(Locale.US).format(amount);
    }

    private static String value(String value) {
        return value == null ? "" : value;
    }

    private static String safeMessage(RuntimeException exception) {
        return exception.getMessage() == null || exception.getMessage().isBlank()
                ? exception.getClass().getSimpleName() : exception.getMessage();
    }
}
