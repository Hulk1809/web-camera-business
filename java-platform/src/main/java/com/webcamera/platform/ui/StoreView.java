package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.data.value.ValueChangeMode;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.CatalogService;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.ui.store.HeroSection;
import com.webcamera.platform.ui.store.ProductCard;
import com.webcamera.platform.ui.store.StoreFooter;
import com.webcamera.platform.ui.store.StoreHeader;
import com.webcamera.platform.ui.store.StorePresentation;
import com.webcamera.platform.ui.theme.UiTokens;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Route("")
@PageTitle("PRO GEAR — Siêu Thị Máy Ảnh, Cinema & DJI Flagship")
@AnonymousAllowed
public class StoreView extends VerticalLayout {
    private static final List<String> BRANDS = List.of("Tất Cả", "Sony", "DJI", "Canon", "Fujifilm", "Nikon", "Blackmagic Design");

    private final CatalogService catalog;
    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;
    private final Map<UUID, CartLine> cart = new LinkedHashMap<>();
    private final TextField search = new TextField();
    private final FormLayout catalogCards = cardsLayout();
    private final FormLayout flashCards = cardsLayout();
    private final Span resultCount = new Span();
    private final Span cartCount = new Span();
    private final Dialog cartDialog = new Dialog();
    private final VerticalLayout cartLines = new VerticalLayout();
    private List<Product> products = List.of();
    private String selectedBrand = "Tất Cả";
    private String selectedCategory = "Tất Cả";

    public StoreView(CatalogService catalog, OrderService orders, UserService users, PaymentService payments) {
        this.catalog = catalog;
        this.orders = orders;
        this.users = users;
        this.payments = payments;
        setPadding(false);
        setSpacing(false);
        setSizeFull();
        getStyle().set("background", UiTokens.PAGE).set("font-family", "Arial, Helvetica, sans-serif")
                .set("max-width", "100vw").set("overflow-x", "hidden").set("box-sizing", "border-box");

        configureSearch();
        configureCartDialog();
        add(new StoreHeader(search, cartDialog::open, () -> getUI().ifPresent(ui -> ui.navigate(WarrantyView.class)),
                () -> getUI().ifPresent(ui -> ui.navigate(LoginView.class))));

        VerticalLayout content = new VerticalLayout();
        content.setPadding(true);
        content.setSpacing(true);
        content.setWidthFull();
        content.setMaxWidth(UiTokens.CONTENT_WIDTH);
        content.getStyle().set("margin", "0 auto").set("box-sizing", "border-box");
        content.add(new HeroSection(this::selectCategory, this::showInstallmentDialog, this::showTradeInDialog),
                createFlashDeal(), createCatalog(), createBenefits());
        add(content, new StoreFooter());
        refreshCatalog();
    }

    private void configureSearch() {
        search.setValueChangeMode(ValueChangeMode.LAZY);
        search.addValueChangeListener(event -> applyFilters());
    }

    private VerticalLayout createFlashDeal() {
        H2 title = new H2("🔥 GIÁ SỐC HÔM NAY");
        title.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-size", "16px")
                .set("padding", "8px 12px").set("border-radius", "5px").set("margin", "0");
        Span countdown = new Span("Kết thúc trong: 05 : 42 : 18");
        countdown.getStyle().set("background", "#111827").set("color", "#FBBF24").set("padding", "7px 10px")
                .set("border-radius", "5px").set("font-family", "monospace").set("font-weight", "800");
        HorizontalLayout header = new HorizontalLayout(title, countdown);
        header.setAlignItems(Alignment.CENTER);
        header.getStyle().set("flex-wrap", "wrap");
        VerticalLayout box = new VerticalLayout(header, flashCards);
        box.setWidthFull();
        box.getStyle().set("background", "white").set("border", "2px solid " + UiTokens.BRAND_RED)
                .set("border-radius", "8px").set("box-sizing", "border-box");
        return box;
    }

    private VerticalLayout createCatalog() {
        H2 title = new H2("MÁY ẢNH, CINEMA & DJI CHÍNH HÃNG");
        title.getStyle().set("font-size", "20px").set("margin", "0");
        resultCount.getStyle().set("color", UiTokens.MUTED).set("font-size", "12px");

        FlexLayout brandFilters = new FlexLayout();
        brandFilters.getStyle().set("gap", "6px").set("flex-wrap", "wrap");
        for (String brand : BRANDS) {
            Button chip = new Button(brand, event -> {
                selectedBrand = brand;
                applyFilters();
            });
            chip.getStyle().set("font-size", "11px").set("border-radius", "6px");
            if ("Tất Cả".equals(brand)) chip.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white");
            brandFilters.add(chip);
        }
        Button allPrices = new Button("Tất cả mức giá", new Icon(VaadinIcon.FILTER));
        allPrices.getStyle().set("font-size", "11px");
        HorizontalLayout filterBar = new HorizontalLayout(brandFilters, allPrices);
        filterBar.setWidthFull();
        filterBar.setJustifyContentMode(JustifyContentMode.BETWEEN);
        filterBar.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("padding", "10px").set("border-radius", "8px").set("box-sizing", "border-box")
                .set("flex-wrap", "wrap");

        catalogCards.setId("qa-product-grid");
        catalogCards.getElement().setAttribute("data-testid", "product-grid");
        VerticalLayout section = new VerticalLayout(new HorizontalLayout(title, resultCount), filterBar, catalogCards);
        section.setPadding(false);
        section.setWidthFull();
        section.getElement().setAttribute("id", "product-catalog");
        return section;
    }

    private FlexLayout createBenefits() {
        FlexLayout benefits = new FlexLayout(
                benefit(VaadinIcon.TRUCK, "Giao Hàng Siêu Tốc 2H", "Nội thành Hà Nội & TP.HCM"),
                benefit(VaadinIcon.REFRESH, "Đổi Mới Trong 30 Ngày", "Lỗi phần cứng đổi máy mới ngay"),
                benefit(VaadinIcon.SHIELD, "Bảo Hành Điện Tử SN", "Minh bạch, tra cứu trực tuyến"),
                benefit(VaadinIcon.HEADSET, "Tư Vấn Chuyên Gia", "Hỗ trợ kỹ thuật 8:00 - 21:30"));
        benefits.setWidthFull();
        benefits.getStyle().set("gap", "12px").set("flex-wrap", "wrap");
        benefits.getChildren().forEach(component -> component.getElement().getStyle().set("flex", "1 1 250px"));
        return benefits;
    }

    private HorizontalLayout benefit(VaadinIcon iconType, String title, String copy) {
        Icon icon = new Icon(iconType);
        icon.setSize("24px");
        icon.getStyle().set("color", UiTokens.BRAND_RED);
        Span heading = new Span(title);
        heading.getStyle().set("font-size", "12px").set("font-weight", "800");
        Span description = new Span(copy);
        description.getStyle().set("font-size", "11px").set("color", UiTokens.MUTED);
        VerticalLayout text = new VerticalLayout(heading, description);
        text.setPadding(false);
        text.setSpacing(false);
        HorizontalLayout card = new HorizontalLayout(icon, text);
        card.setAlignItems(Alignment.CENTER);
        card.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("padding", "14px").set("border-radius", "8px").set("box-sizing", "border-box");
        return card;
    }

    private void configureCartDialog() {
        cartDialog.setHeaderTitle("Giỏ Hàng Của Bạn");
        cartDialog.setWidth("min(480px, 95vw)");
        cartDialog.setHeight("min(780px, 92vh)");
        cartLines.setPadding(false);
        cartLines.setWidthFull();

        TextField name = new TextField("Họ và tên");
        EmailField email = new EmailField("Email");
        TextField phone = new TextField("Số điện thoại");
        TextArea address = new TextArea("Địa chỉ giao hàng");
        RadioButtonGroup<String> method = new RadioButtonGroup<>("Thanh toán", "VietQR MB Bank", "COD");
        method.setValue("VietQR MB Bank");
        Checkbox confirm = new Checkbox("Tôi xác nhận thông tin nhận hàng chính xác");
        Button checkout = new Button("ĐẶT HÀNG", event -> placeOrder(name, email, phone, address, method, confirm));
        checkout.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        checkout.setWidthFull();
        checkout.getStyle().set("background", UiTokens.BRAND_RED).set("font-weight", "900");

        cartCount.getStyle().set("font-weight", "800").set("color", UiTokens.BRAND_RED);
        VerticalLayout body = new VerticalLayout(cartCount, cartLines, name, email, phone, address, method, confirm, checkout);
        body.setPadding(false);
        body.setWidthFull();
        cartDialog.add(body);
    }

    private void refreshCatalog() {
        products = catalog.activeProducts();
        applyFilters();
    }

    private void applyFilters() {
        String query = search.getValue() == null ? "" : search.getValue().trim().toLowerCase(Locale.ROOT);
        List<Product> filtered = products.stream()
                .filter(product -> query.isBlank() || product.getName().toLowerCase(Locale.ROOT).contains(query)
                        || product.getSku().toLowerCase(Locale.ROOT).contains(query)
                        || safe(product.getDescription()).toLowerCase(Locale.ROOT).contains(query))
                .filter(product -> "Tất Cả".equals(selectedBrand) || StorePresentation.brand(product).equalsIgnoreCase(selectedBrand))
                .filter(product -> "Tất Cả".equals(selectedCategory)
                        || StorePresentation.category(product).toLowerCase(Locale.ROOT).contains(selectedCategory.toLowerCase(Locale.ROOT))
                        || product.getName().toLowerCase(Locale.ROOT).contains(selectedCategory.toLowerCase(Locale.ROOT)))
                .toList();
        catalogCards.removeAll();
        filtered.forEach(product -> catalogCards.add(new ProductCard(product, this::addToCart, this::openProduct)));
        flashCards.removeAll();
        products.stream().limit(5).forEach(product -> flashCards.add(new ProductCard(product, this::addToCart, this::openProduct)));
        resultCount.setText(filtered.size() + " sản phẩm");
    }

    private void selectCategory(String category) {
        selectedCategory = category;
        applyFilters();
        Notification.show("Đang lọc danh mục: " + category);
    }

    private void openProduct(Product product) {
        getUI().ifPresent(ui -> ui.navigate(ProductDetailView.class, product.getId().toString()));
    }

    private void addToCart(Product product) {
        CartLine current = cart.get(product.getId());
        int next = current == null ? 1 : current.quantity() + 1;
        if (next > product.getStockQuantity()) {
            Notification.show("Sản phẩm đã đạt số lượng tồn kho.");
            return;
        }
        cart.put(product.getId(), new CartLine(product, next));
        refreshCart();
        Notification.show("Đã thêm " + product.getName() + " vào giỏ hàng");
    }

    private void refreshCart() {
        cartLines.removeAll();
        int count = cart.values().stream().mapToInt(CartLine::quantity).sum();
        BigDecimal total = cart.values().stream().map(CartLine::subtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
        cartCount.setText(count == 0 ? "Giỏ hàng đang trống" : count + " sản phẩm • " + StorePresentation.money(total));
        for (CartLine line : new ArrayList<>(cart.values())) {
            Image image = new Image(StorePresentation.image(line.product()), line.product().getName());
            image.setWidth("64px");
            image.setHeight("64px");
            image.getStyle().set("object-fit", "contain");
            Span name = new Span(line.product().getName());
            name.getStyle().set("font-size", "12px").set("font-weight", "700");
            Span quantity = new Span("SL: " + line.quantity() + " • " + StorePresentation.money(line.subtotal()));
            quantity.getStyle().set("font-size", "11px").set("color", UiTokens.BRAND_RED);
            VerticalLayout text = new VerticalLayout(name, quantity);
            text.setPadding(false);
            text.setSpacing(false);
            Button remove = new Button(new Icon(VaadinIcon.TRASH), event -> {
                cart.remove(line.product().getId());
                refreshCart();
            });
            HorizontalLayout row = new HorizontalLayout(image, text, remove);
            row.setWidthFull();
            row.setAlignItems(Alignment.CENTER);
            row.setFlexGrow(1, text);
            row.getStyle().set("border-bottom", "1px solid " + UiTokens.BORDER).set("padding", "8px 0");
            cartLines.add(row);
        }
    }

    private void placeOrder(TextField name, EmailField email, TextField phone, TextArea address,
                            RadioButtonGroup<String> method, Checkbox confirmation) {
        if (cart.isEmpty() || name.isEmpty() || email.isEmpty() || phone.isEmpty() || address.isEmpty()
                || !Boolean.TRUE.equals(confirmation.getValue())) {
            Notification.show("Vui lòng hoàn tất giỏ hàng và thông tin nhận hàng.");
            return;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication instanceof AnonymousAuthenticationToken) {
            Notification.show("Vui lòng đăng nhập tài khoản khách hàng để đặt hàng.");
            getUI().ifPresent(ui -> ui.navigate(LoginView.class));
            return;
        }
        try {
            User customer = users.requireDomainUser(authentication.getName());
            List<OrderService.Line> lines = cart.values().stream()
                    .map(line -> new OrderService.Line(line.product().getId(), line.quantity())).toList();
            Order order = orders.place(customer.getId(), lines);
            PaymentService.Instructions payment = payments.toInstructions(payments.createForOrder(order.getId()));
            cart.clear();
            refreshCart();
            cartDialog.close();
            showPayment(order, payment, method.getValue());
            refreshCatalog();
        } catch (RuntimeException ex) {
            Notification.show("Không thể đặt hàng: " + safe(ex), 6000, Notification.Position.MIDDLE);
        }
    }

    private void showPayment(Order order, PaymentService.Instructions payment, String method) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("Đặt hàng thành công — " + order.getOrderNumber());
        VerticalLayout body = new VerticalLayout(new Paragraph("Cảm ơn bạn đã mua hàng tại PRO GEAR."));
        if ("VietQR MB Bank".equals(method)) {
            Image qr = new Image(payment.qrUrl(), "VietQR MB Bank");
            qr.setWidth("260px");
            body.add(qr, new Span("MB Bank • " + payment.accountNumber()),
                    new Span(payment.accountName()), new Span("Số tiền: " + StorePresentation.money(payment.amount())),
                    new Span("Nội dung: " + payment.transferContent()));
        } else {
            body.add(new Span("Thanh toán COD khi nhận hàng."));
        }
        Button close = new Button("Đóng", event -> dialog.close());
        dialog.add(body);
        dialog.getFooter().add(close);
        dialog.open();
    }

    private void showInstallmentDialog() {
        infoDialog("Trả góp 0% lãi suất", "Hỗ trợ Visa/Mastercard và hồ sơ online. Nhân viên PRO GEAR sẽ xác nhận phương án phù hợp trong 5 phút.");
    }

    private void showTradeInDialog() {
        infoDialog("Thu cũ lên đời", "Định giá máy ảnh cũ minh bạch, trợ giá đến 3.000.000đ khi nâng cấp thiết bị mới.");
    }

    private void infoDialog(String title, String message) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle(title);
        dialog.add(new Paragraph(message));
        dialog.getFooter().add(new Button("Đóng", event -> dialog.close()));
        dialog.open();
    }

    private static FormLayout cardsLayout() {
        FormLayout layout = new FormLayout();
        layout.setWidthFull();
        layout.setResponsiveSteps(new FormLayout.ResponsiveStep("0", 1),
                new FormLayout.ResponsiveStep("440px", 2), new FormLayout.ResponsiveStep("680px", 3),
                new FormLayout.ResponsiveStep("940px", 4),
                new FormLayout.ResponsiveStep("1180px", 5));
        layout.getStyle().set("gap", "12px");
        return layout;
    }

    private static String safe(String value) { return value == null ? "" : value; }
    private static String safe(RuntimeException exception) {
        return exception.getMessage() == null ? exception.getClass().getSimpleName() : exception.getMessage();
    }

    private record CartLine(Product product, int quantity) {
        BigDecimal subtotal() { return product.getPrice().multiply(BigDecimal.valueOf(quantity)); }
    }
}
