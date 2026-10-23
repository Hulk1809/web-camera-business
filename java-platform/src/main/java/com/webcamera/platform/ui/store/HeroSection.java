package com.webcamera.platform.ui.store;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.webcamera.platform.ui.theme.UiTokens;
import java.util.List;
import java.util.function.Consumer;

public final class HeroSection extends HorizontalLayout {
    private static final List<String> CATEGORIES = List.of(
            "Máy Ảnh Mirrorless", "Máy Quay Cinema", "Flycam & Drone", "Gimbal Chống Rung",
            "Action Cam & Vlog", "Ống Kính Lenses", "Micro & Đèn Studio");

    public HeroSection(Consumer<String> categorySelected, Runnable openInstallment, Runnable openTradeIn) {
        setWidthFull();
        setAlignItems(Alignment.STRETCH);
        addClassName("store-hero");

        VerticalLayout categories = new VerticalLayout();
        categories.setPadding(true);
        categories.setSpacing(false);
        categories.setWidth("250px");
        categories.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("border-radius", "8px").set("box-sizing", "border-box");
        Span title = new Span("DANH MỤC SẢN PHẨM");
        title.getStyle().set("font-size", "11px").set("font-weight", "800").set("color", UiTokens.MUTED);
        categories.add(title);
        for (String category : CATEGORIES) {
            Button button = new Button(category, new Icon(VaadinIcon.CHEVRON_RIGHT), event -> categorySelected.accept(category));
            button.setWidthFull();
            button.setIconAfterText(true);
            button.getStyle().set("justify-content", "space-between").set("font-size", "12px")
                    .set("color", "#374151").set("background", "transparent");
            categories.add(button);
        }
        Button installment = new Button("Trả góp 0% lãi suất", new Icon(VaadinIcon.CREDIT_CARD), event -> openInstallment.run());
        installment.setWidthFull();
        installment.getStyle().set("background", "#FEF2F2").set("color", UiTokens.BRAND_RED).set("font-weight", "800");
        categories.add(installment);

        VerticalLayout banner = new VerticalLayout();
        banner.addClassName("store-hero-banner");
        banner.setPadding(true);
        banner.setJustifyContentMode(JustifyContentMode.CENTER);
        banner.setMinHeight("340px");
        banner.getStyle().set("background", "linear-gradient(110deg,#030712 0%,#111827 55%,#7F1D1D 100%)")
                .set("color", "white").set("border-radius", "8px").set("padding", "30px")
                .set("box-sizing", "border-box").set("min-width", "0").set("max-width", "100%");
        Span campaign = new Span("FESTIVAL MÁY ẢNH & CINEMA 2026");
        campaign.getStyle().set("background", UiTokens.BRAND_RED).set("padding", "4px 8px")
                .set("border-radius", "4px").set("font-size", "10px").set("font-weight", "900");
        H2 headline = new H2("SONY CINEMA FX3 & A7M4 GIẢM ĐẾN 15 TRIỆU");
        headline.getStyle().set("font-size", "clamp(22px,3vw,34px)").set("line-height", "1.15")
                .set("max-width", "620px").set("margin", "12px 0 4px");
        Paragraph copy = new Paragraph("Tặng thẻ CFexpress Type A 160GB + pin chính hãng NP-FZ100 khi đặt mua hôm nay.");
        copy.getStyle().set("color", "#D1D5DB").set("font-size", "13px").set("max-width", "560px");
        Button explore = new Button("Khám Phá Ngay", new Icon(VaadinIcon.ARROW_RIGHT),
                event -> categorySelected.accept("Máy Quay Cinema"));
        explore.setIconAfterText(true);
        explore.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-weight", "800");
        banner.add(campaign, headline, copy, explore);

        VerticalLayout promos = new VerticalLayout(
                promo("THU CŨ LÊN ĐỜI", "Trợ giá đến 3.000.000đ khi đổi máy ảnh cũ", "Xem định giá nhanh", openTradeIn),
                promo("PHỤ KIỆN CINEMA", "Thẻ CFexpress & Gimbal Ronin giảm 35%", "Mua ngay giá sốc", () -> categorySelected.accept("Ống Kính Lenses")));
        promos.setPadding(false);
        promos.setWidth("270px");
        promos.setAlignItems(Alignment.STRETCH);

        add(categories, banner, promos);
        setFlexGrow(1, banner);
    }

    private static VerticalLayout promo(String badge, String title, String action, Runnable callback) {
        Span badgeText = new Span(badge);
        badgeText.getStyle().set("color", UiTokens.BRAND_RED).set("background", "#FEF2F2")
                .set("border", "1px solid #FECACA").set("padding", "3px 7px").set("border-radius", "4px")
                .set("font-size", "10px").set("font-weight", "800");
        H3 heading = new H3(title);
        heading.getStyle().set("font-size", "14px").set("margin", "8px 0").set("line-height", "1.35");
        Button button = new Button(action, new Icon(VaadinIcon.CHEVRON_RIGHT), event -> callback.run());
        button.setIconAfterText(true);
        button.getStyle().set("color", UiTokens.BRAND_RED).set("font-weight", "800").set("font-size", "11px");
        VerticalLayout card = new VerticalLayout(badgeText, heading, button);
        card.setPadding(true);
        card.setSpacing(false);
        card.getStyle().set("background", "white").set("border", "1px solid " + UiTokens.BORDER)
                .set("border-radius", "8px").set("box-sizing", "border-box");
        card.expand(heading);
        return card;
    }
}
