package com.webcamera.platform.ui.store;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.webcamera.platform.ui.theme.UiTokens;

public final class StoreHeader extends VerticalLayout {
    public StoreHeader(TextField search, Runnable openCart, Runnable openWarranty, Runnable openLogin) {
        setPadding(false);
        setSpacing(false);
        setWidthFull();

        HorizontalLayout utility = new HorizontalLayout(
                text("✓ Cam kết chính hãng 100%"),
                text("🚚 Giao nhanh toàn quốc"),
                text("☎ 1900 8899"),
                action("Tra cứu đơn hàng", VaadinIcon.FILE_TEXT_O, () -> {}),
                action("Đăng nhập / Đăng ký", VaadinIcon.USER, openLogin));
        utility.setWidthFull();
        utility.setJustifyContentMode(JustifyContentMode.CENTER);
        utility.setAlignItems(Alignment.CENTER);
        utility.getStyle().set("background", UiTokens.CHARCOAL).set("color", "white")
                .set("padding", "6px 16px").set("box-sizing", "border-box").set("font-size", "11px")
                .set("flex-wrap", "wrap");

        HorizontalLayout ticker = new HorizontalLayout(new Span("● ĐƠN HÀNG LIVE"),
                new Span("Khách hàng tại TP.HCM vừa đặt Sony Alpha 7 IV • Bảo hành điện tử 24 tháng"));
        ticker.setWidthFull();
        ticker.setJustifyContentMode(JustifyContentMode.CENTER);
        ticker.getStyle().set("background", "#FFF7ED").set("color", "#7C2D12")
                .set("padding", "6px 16px").set("box-sizing", "border-box").set("font-size", "11px");

        Div logoMark = new Div(new Icon(VaadinIcon.CAMERA));
        logoMark.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("width", "42px")
                .set("height", "42px").set("border-radius", "6px").set("display", "flex")
                .set("align-items", "center").set("justify-content", "center");
        Span logo = new Span("PRO GEAR");
        logo.getStyle().set("font-size", "21px").set("font-weight", "900").set("color", "#111827");
        Span tagline = new Span("MÁY ẢNH & CINEMA FLAGSHIP");
        tagline.getStyle().set("font-size", "9px").set("font-weight", "800").set("color", "#6B7280")
                .set("letter-spacing", ".08em");
        VerticalLayout logoText = new VerticalLayout(logo, tagline);
        logoText.setPadding(false);
        logoText.setSpacing(false);
        HorizontalLayout brand = new HorizontalLayout(logoMark, logoText);
        brand.setAlignItems(Alignment.CENTER);
        brand.setSpacing(true);

        Button categories = new Button("DANH MỤC", new Icon(VaadinIcon.MENU));
        categories.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-weight", "800");

        search.setId("qa-search-input");
        search.getElement().setAttribute("data-testid", "search-input");
        search.setPlaceholder("Bạn muốn tìm máy ảnh, flycam, lens hay phụ kiện gì hôm nay...");
        search.setClearButtonVisible(true);
        search.setPrefixComponent(new Icon(VaadinIcon.SEARCH));
        search.setWidthFull();
        search.getStyle().set("--vaadin-input-field-border-width", "2px")
                .set("--vaadin-input-field-border-color", UiTokens.BRAND_RED);

        Button warranty = action("Tra Cứu Bảo Hành", VaadinIcon.SHIELD, openWarranty);
        warranty.setId("open-warranty");
        warranty.getElement().setAttribute("data-testid", "btn-open-warranty");
        warranty.getStyle().set("border", "1px solid " + UiTokens.BRAND_RED).set("color", UiTokens.BRAND_RED)
                .set("background", "#FEF2F2").set("font-weight", "800");

        Button cart = action("Giỏ hàng", VaadinIcon.CART, openCart);
        cart.setId("cart-drawer-button");
        cart.getElement().setAttribute("data-testid", "btn-cart-drawer");
        cart.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-weight", "800");

        HorizontalLayout main = new HorizontalLayout(brand, categories, search, warranty, cart);
        main.setWidthFull();
        main.setMaxWidth(UiTokens.CONTENT_WIDTH);
        main.setAlignItems(Alignment.CENTER);
        main.setFlexGrow(1, search);
        main.getStyle().set("padding", "10px 16px").set("box-sizing", "border-box")
                .set("margin", "0 auto").set("flex-wrap", "wrap").set("max-width", "100vw")
                .set("overflow", "hidden");

        Div mainShell = new Div(main);
        mainShell.setWidthFull();
        mainShell.getStyle().set("background", "white").set("border-bottom", "1px solid " + UiTokens.BORDER)
                .set("box-shadow", "0 2px 5px rgba(15,23,42,.08)").set("position", "sticky")
                .set("top", "0").set("z-index", "20");
        add(utility, ticker, mainShell);
    }

    private static Span text(String value) {
        Span span = new Span(value);
        span.getStyle().set("white-space", "nowrap");
        return span;
    }

    private static Button action(String label, VaadinIcon icon, Runnable action) {
        Button button = new Button(label, new Icon(icon), event -> action.run());
        button.getStyle().set("font-size", "11px");
        return button;
    }
}
