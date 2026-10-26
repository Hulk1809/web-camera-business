package com.webcamera.platform.ui.store;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.ui.theme.UiTokens;
import java.util.function.Consumer;

public final class ProductCard extends VerticalLayout {
    public ProductCard(Product product, Consumer<Product> addToCart) {
        setId("product-card-" + product.getSku());
        getElement().setAttribute("data-testid", "product-card");
        getElement().setAttribute("data-sku", product.getSku());
        setPadding(true);
        setSpacing(false);
        setWidthFull();
        setHeightFull();
        getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("border-radius", "8px").set("box-shadow", "0 1px 2px rgba(15,23,42,.06)")
                .set("cursor", "pointer").set("box-sizing", "border-box");

        Span discount = new Span("-10%");
        discount.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white")
                .set("font-size", "11px").set("font-weight", "800").set("padding", "2px 7px")
                .set("border-radius", "4px");

        Button wish = new Button(new Icon(VaadinIcon.HEART_O));
        wish.setAriaLabel("Thêm vào yêu thích");
        wish.getStyle().set("color", "#9CA3AF").set("min-width", "30px");
        HorizontalLayout badges = new HorizontalLayout(discount, wish);
        badges.setWidthFull();
        badges.setJustifyContentMode(JustifyContentMode.BETWEEN);
        badges.setAlignItems(Alignment.CENTER);

        Image image = new Image(StorePresentation.image(product), product.getName());
        image.setWidthFull();
        image.setHeight("190px");
        image.getStyle().set("object-fit", "contain").set("background", "white");
        Anchor imageLink = new Anchor("/products/" + product.getId(), image);
        imageLink.getElement().setAttribute("data-testid", "product-detail-link");
        imageLink.getElement().setAttribute("router-ignore", true);
        imageLink.getElement().setAttribute("aria-label", "Xem chi tiết " + product.getName());
        imageLink.getStyle().set("display", "block").set("width", "100%");

        HorizontalLayout specs = new HorizontalLayout();
        specs.setSpacing(true);
        specs.add(pill(firstSpecification(product)), pill("BH 24T"));
        specs.getStyle().set("overflow", "hidden");

        Span name = new Span(product.getName());
        name.getStyle().set("font-size", "14px").set("font-weight", "700").set("color", "#1F2937")
                .set("line-height", "1.35").set("min-height", "38px").set("display", "-webkit-box")
                .set("-webkit-line-clamp", "2").set("-webkit-box-orient", "vertical").set("overflow", "hidden");
        Anchor nameLink = new Anchor("/products/" + product.getId(), name);
        nameLink.getElement().setAttribute("data-testid", "product-detail-link");
        nameLink.getElement().setAttribute("router-ignore", true);
        nameLink.getStyle().set("text-decoration", "none");

        Span price = new Span(StorePresentation.money(product.getPrice()));
        price.getStyle().set("color", UiTokens.BRAND_RED).set("font-size", "17px").set("font-weight", "800");
        Span oldPrice = new Span(StorePresentation.money(StorePresentation.originalPrice(product)));
        oldPrice.getStyle().set("color", "#9CA3AF").set("font-size", "11px").set("text-decoration", "line-through");
        HorizontalLayout prices = new HorizontalLayout(price, oldPrice);
        prices.setAlignItems(Alignment.BASELINE);
        prices.setSpacing(true);

        boolean inStock = product.getStockQuantity() > 0;
        Span stock = new Span(inStock ? "✓ Còn hàng" : "◷ Đặt chờ về");
        stock.getStyle().set("color", inStock ? UiTokens.SUCCESS : "#D97706")
                .set("font-size", "11px").set("font-weight", "700");
        Button add = new Button(new Icon(VaadinIcon.CART), event -> addToCart.accept(product));
        add.setId("quick-add-" + product.getSku());
        add.getElement().setAttribute("data-testid", "btn-quick-add-cart");
        add.setAriaLabel("Thêm " + product.getName() + " vào giỏ hàng");
        add.getStyle().set("color", UiTokens.BRAND_RED).set("background", "#FEF2F2")
                .set("border", "1px solid #FECACA");
        HorizontalLayout footer = new HorizontalLayout(stock, add);
        footer.setWidthFull();
        footer.setAlignItems(Alignment.CENTER);
        footer.setJustifyContentMode(JustifyContentMode.BETWEEN);
        footer.getStyle().set("border-top", "1px solid #F3F4F6").set("padding-top", "8px");

        add(badges, imageLink, specs, nameLink, prices, footer);
        expand(nameLink);
    }

    private static Span pill(String text) {
        Span pill = new Span(text);
        pill.getStyle().set("background", "#F3F4F6").set("border", "1px solid #E5E7EB")
                .set("border-radius", "4px").set("padding", "2px 6px").set("font-size", "10px")
                .set("color", "#4B5563").set("white-space", "nowrap").set("max-width", "135px")
                .set("overflow", "hidden").set("text-overflow", "ellipsis");
        return pill;
    }

    private static String firstSpecification(Product product) {
        return product.getSpecifications().values().stream().findFirst().orElse("Chính hãng 100%");
    }
}
