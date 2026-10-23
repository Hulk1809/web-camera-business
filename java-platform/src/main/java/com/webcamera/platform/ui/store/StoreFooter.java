package com.webcamera.platform.ui.store;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.webcamera.platform.ui.theme.UiTokens;

public final class StoreFooter extends VerticalLayout {
    public StoreFooter() {
        setWidthFull();
        setPadding(false);
        setSpacing(false);
        getStyle().set("background", "#030712").set("color", "#D1D5DB").set("margin-top", "36px");
        FlexLayout columns = new FlexLayout(
                column("PRO GEAR VIỆT NAM", "Hệ thống bán lẻ máy ảnh, máy quay điện ảnh, flycam DJI hàng đầu Việt Nam.", "1900 8899 • hotro@progear.vn"),
                column("HỆ THỐNG SHOWROOM", "TP.HCM: 12 Nguyễn Cơ Thạch, TP. Thủ Đức", "Hà Nội: 45 Trần Hưng Đạo, Hoàn Kiếm"),
                column("CHÍNH SÁCH & HỖ TRỢ", "Bảo hành điện tử • Đổi trả 30 ngày", "Giao hàng siêu tốc • VietQR 24/7"),
                column("THANH TOÁN & CAM KẾT", "VietQR, COD, Visa/Mastercard, trả góp 0%", "✓ Đã đăng ký với Bộ Công Thương"));
        columns.setWidthFull();
        columns.setMaxWidth(UiTokens.CONTENT_WIDTH);
        columns.getStyle().set("margin", "0 auto").set("padding", "28px 16px").set("box-sizing", "border-box")
                .set("gap", "24px").set("flex-wrap", "wrap");
        columns.getChildren().forEach(component -> component.getElement().getStyle().set("flex", "1 1 240px"));
        Span copyright = new Span("© 2026 PRO GEAR Vietnam — Siêu Thị Máy Ảnh, Cinema Line & Flagship DJI.");
        copyright.getStyle().set("width", "100%").set("text-align", "center").set("padding", "12px")
                .set("border-top", "1px solid #111827").set("font-size", "11px").set("box-sizing", "border-box");
        add(columns, copyright);
    }

    private static VerticalLayout column(String title, String first, String second) {
        H3 heading = new H3(title);
        heading.getStyle().set("font-size", "12px").set("color", "white").set("margin", "0 0 8px");
        Paragraph one = new Paragraph(first);
        Paragraph two = new Paragraph(second);
        one.getStyle().set("margin", "0").set("font-size", "11px").set("line-height", "1.6");
        two.getStyle().set("margin", "4px 0 0").set("font-size", "11px").set("line-height", "1.6");
        VerticalLayout column = new VerticalLayout(heading, one, two);
        column.setPadding(false);
        column.setSpacing(false);
        return column;
    }
}
