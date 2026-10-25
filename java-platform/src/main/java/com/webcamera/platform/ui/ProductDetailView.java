package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
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
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.NotFoundException;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.service.CatalogService;
import com.webcamera.platform.ui.store.StoreFooter;
import com.webcamera.platform.ui.store.StoreHeader;
import com.webcamera.platform.ui.store.StorePresentation;
import com.webcamera.platform.ui.theme.UiTokens;
import java.util.Map;
import java.util.UUID;

@Route("products")
@PageTitle("Chi tiết sản phẩm | PRO GEAR")
@AnonymousAllowed
public class ProductDetailView extends VerticalLayout implements HasUrlParameter<String> {
    private final CatalogService catalog;

    public ProductDetailView(CatalogService catalog) {
        this.catalog = catalog;
        setPadding(false);
        setId("product-detail-view");
        setSpacing(false);
        setSizeFull();
        getStyle().set("background", UiTokens.PAGE).set("font-family", "Arial, Helvetica, sans-serif");
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        removeAll();
        try {
            Product product = catalog.activeProduct(UUID.fromString(parameter));
            TextField search = new TextField();
            search.addValueChangeListener(change -> getUI().ifPresent(ui -> ui.navigate(StoreView.class)));
            add(new StoreHeader(search, () -> Notification.show("Mở giỏ hàng tại trang chủ"),
                    () -> getUI().ifPresent(ui -> ui.navigate(WarrantyView.class)),
                    () -> getUI().ifPresent(ui -> ui.navigate(LoginView.class))));
            add(detail(product), new StoreFooter());
        } catch (IllegalArgumentException exception) {
            throw new NotFoundException();
        }
    }

    private VerticalLayout detail(Product product) {
        Button back = new Button("Về trang sản phẩm", new Icon(VaadinIcon.ARROW_LEFT),
                event -> getUI().ifPresent(ui -> ui.navigate(StoreView.class)));
        back.getStyle().set("color", UiTokens.BRAND_RED);
        back.setId("product-detail-back");

        Image image = new Image(StorePresentation.image(product), product.getName());
        image.setId("product-detail-image");
        image.setWidthFull();
        image.setMaxWidth("520px");
        image.setHeight("480px");
        image.getStyle().set("object-fit", "contain").set("background", "white").set("border-radius", "8px");

        Span category = new Span(StorePresentation.category(product) + " • " + StorePresentation.brand(product));
        category.getStyle().set("color", UiTokens.BRAND_RED).set("font-size", "12px").set("font-weight", "800");
        H1 name = new H1(product.getName());
        name.setId("product-detail-name");
        name.getStyle().set("font-size", "clamp(24px,3vw,34px)").set("line-height", "1.2").set("margin", "8px 0");
        Span sku = new Span("SKU: " + product.getSku() + "  •  ★ 5.0");
        sku.getStyle().set("font-size", "12px").set("color", UiTokens.MUTED);
        Span price = new Span(StorePresentation.money(product.getPrice()));
        price.getStyle().set("font-size", "30px").set("font-weight", "900").set("color", UiTokens.BRAND_RED);
        Span oldPrice = new Span(StorePresentation.money(StorePresentation.originalPrice(product)) + "  (-10%)");
        oldPrice.getStyle().set("font-size", "13px").set("text-decoration", "line-through").set("color", "#9CA3AF");
        Span stock = new Span(product.getStockQuantity() > 0 ? "✓ Còn hàng — giao ngay" : "◷ Đặt hàng chờ về");
        stock.setId("product-detail-stock");
        stock.getStyle().set("color", product.getStockQuantity() > 0 ? UiTokens.SUCCESS : "#D97706")
                .set("font-weight", "800").set("font-size", "13px");
        Paragraph description = new Paragraph(product.getDescription());
        description.getStyle().set("color", "#4B5563").set("line-height", "1.7");

        Button buy = new Button("MUA NGAY — VIETQR", new Icon(VaadinIcon.CART),
                event -> getUI().ifPresent(ui -> ui.navigate(StoreView.class)));
        buy.setWidthFull();
        buy.setId("product-detail-buy");
        buy.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-weight", "900")
                .set("height", "48px");
        Button installment = new Button("TRẢ GÓP 0%", new Icon(VaadinIcon.CREDIT_CARD));
        installment.setId("product-detail-installment");
        installment.setWidthFull();
        installment.getStyle().set("border", "1px solid " + UiTokens.BRAND_RED).set("color", UiTokens.BRAND_RED)
                .set("font-weight", "800");
        HorizontalLayout actions = new HorizontalLayout(buy, installment);
        actions.setWidthFull();
        actions.setFlexGrow(2, buy);
        actions.setFlexGrow(1, installment);

        VerticalLayout info = new VerticalLayout(category, name, sku, price, oldPrice, stock, description, actions,
                new Span("✓ Chính hãng 100%  •  ✓ Bảo hành điện tử 24 tháng  •  ✓ Đổi mới 30 ngày"));
        info.setPadding(true);
        info.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("border-radius", "8px").set("box-sizing", "border-box");

        FlexLayout top = new FlexLayout(image, info);
        top.setWidthFull();
        top.getStyle().set("gap", "20px").set("flex-wrap", "wrap");
        image.getElement().getStyle().set("flex", "1 1 420px");
        info.getElement().getStyle().set("flex", "1 1 420px");

        VerticalLayout specs = new VerticalLayout(new H3("Thông số kỹ thuật nổi bật"));
        specs.setId("product-detail-specifications");
        specs.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("border-radius", "8px");
        if (product.getSpecifications().isEmpty()) {
            specs.add(new Span("Thông số chi tiết đang được cập nhật."));
        } else {
            for (Map.Entry<String, String> entry : product.getSpecifications().entrySet()) {
                HorizontalLayout row = new HorizontalLayout(new Span(label(entry.getKey())), new Span(entry.getValue()));
                row.setWidthFull();
                row.getChildren().findFirst().ifPresent(component -> component.getElement().getStyle()
                        .set("font-weight", "800").set("min-width", "180px"));
                row.getStyle().set("border-top", "1px solid #F3F4F6").set("padding", "8px 0");
                specs.add(row);
            }
        }

        VerticalLayout content = new VerticalLayout(back, top, specs);
        content.setWidthFull();
        content.setMaxWidth(UiTokens.CONTENT_WIDTH);
        content.getStyle().set("margin", "0 auto").set("box-sizing", "border-box");
        return content;
    }

    private static String label(String key) {
        return switch (key) {
            case "sensor" -> "Cảm biến";
            case "video" -> "Video";
            case "stabilization" -> "Chống rung";
            case "weight" -> "Trọng lượng";
            case "payload" -> "Tải trọng";
            case "audio" -> "Âm thanh";
            case "battery" -> "Pin";
            default -> key;
        };
    }
}
