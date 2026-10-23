package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Warranty;
import com.webcamera.platform.service.InventoryService;

@Route(value = "warranty-check", layout = MainLayout.class)
@PageTitle("Tra cứu bảo hành | PRO GEAR")
@AnonymousAllowed
public class WarrantyView extends VerticalLayout {
    private final InventoryService inventory;
    private final TextField serialField = new TextField("Số serial sản phẩm");
    private final Button checkBtn = new Button("Tra cứu bảo hành");
    private final VerticalLayout resultCard = new VerticalLayout();

    public WarrantyView(InventoryService inventory) {
        this.inventory = inventory;
        setSizeFull();
        setMaxWidth("800px");

        add(new H2("Tra cứu bảo hành PRO GEAR"),
                new Paragraph("Nhập serial máy ảnh, ống kính hoặc phụ kiện để kiểm tra thời hạn bảo hành."));

        serialField.setPlaceholder("e.g. SN-A7M4-001");
        serialField.setWidth("350px");

        checkBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        checkBtn.addClickListener(event -> lookupWarranty());

        HorizontalLayout inputRow = new HorizontalLayout(serialField, checkBtn);
        inputRow.setAlignItems(Alignment.END);

        resultCard.setVisible(false);
        resultCard.getStyle()
                .set("border", "1px solid var(--lumo-contrast-20pct)")
                .set("border-radius", "8px")
                .set("padding", "20px")
                .set("background", "var(--lumo-base-color)");

        add(inputRow, resultCard);
    }

    private void lookupWarranty() {
        String serial = serialField.getValue();
        if (serial == null || serial.isBlank()) {
            Notification.show("Vui lòng nhập số serial.");
            return;
        }

        try {
            displayWarranty(inventory.warrantyBySerial(serial.trim()));
        } catch (IllegalArgumentException ex) {
            resultCard.setVisible(true);
            resultCard.removeAll();
            resultCard.add(new H3("Không tìm thấy bảo hành"),
                    new Span("Kiểm tra lại serial hoặc liên hệ trung tâm bảo hành PRO GEAR."));
        }
    }

    private void displayWarranty(Warranty w) {
        resultCard.setVisible(true);
        resultCard.removeAll();

        resultCard.add(new H3("Thông tin bảo hành"));
        resultCard.add(new Span("Sản phẩm: " + w.getCameraSerial().getProduct().getName()));
        resultCard.add(new Span("Serial: " + maskSerial(w.getCameraSerial().getSerialNumber())));
        resultCard.add(new Span("Thời hạn: " + w.getStartsOn() + " đến " + w.getExpiresOn()));

        Span statusSpan = new Span("Trạng thái: " + statusLabel(w.getStatus()));
        statusSpan.getStyle().set("font-weight", "bold");
        if (w.getStatus() == Warranty.Status.ACTIVE) {
            statusSpan.getStyle().set("color", "var(--lumo-success-text-color)");
        } else {
            statusSpan.getStyle().set("color", "var(--lumo-error-text-color)");
        }
        resultCard.add(statusSpan);

        resultCard.add(new Paragraph("Yêu cầu bảo hành cần xác minh chủ sở hữu. Vui lòng đăng nhập hoặc liên hệ trung tâm PRO GEAR."));
    }

    private static String maskSerial(String serial) {
        return serial.length() <= 4 ? "••••" : "••••" + serial.substring(serial.length() - 4);
    }

    private static String statusLabel(Warranty.Status status) {
        return switch (status) {
            case ACTIVE -> "Còn hiệu lực";
            case EXPIRED -> "Hết hạn";
            case VOIDED -> "Đã hủy";
            case CLAIMED -> "Đang xử lý";
        };
    }
}
