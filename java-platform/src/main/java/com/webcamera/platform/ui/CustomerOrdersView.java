package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.OptionalParameter;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.router.RouteAlias;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.service.OrderService;
import com.webcamera.platform.service.PaymentService;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.ui.store.StorePresentation;
import jakarta.annotation.security.RolesAllowed;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import org.springframework.security.core.context.SecurityContextHolder;

@Route(value = "tai-khoan/don-hang", layout = MainLayout.class)
@RouteAlias(value = "my-orders", layout = MainLayout.class)
@PageTitle("Đơn hàng của tôi | PRO GEAR")
@RolesAllowed("CUSTOMER")
public class CustomerOrdersView extends VerticalLayout implements HasUrlParameter<String> {
    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final OrderService orders;
    private final UserService users;
    private final PaymentService payments;

    public CustomerOrdersView(OrderService orders, UserService users, PaymentService payments) {
        this.orders = orders;
        this.users = users;
        this.payments = payments;
        setSizeFull();
        setId("customer-orders-view");
        addClassName("customer-orders");
    }

    @Override
    public void setParameter(BeforeEvent event, @OptionalParameter String orderNumber) {
        if (orderNumber == null || orderNumber.isBlank()) renderList();
        else renderDetails(orderNumber);
    }

    private void renderList() {
        removeAll();
        add(new H2("Đơn hàng của tôi"),
                new Paragraph("Theo dõi trạng thái xử lý, thanh toán và giao nhận thiết bị PRO GEAR."));

        Grid<OrderService.OrderSummary> grid = new Grid<>(OrderService.OrderSummary.class, false);
        grid.setId("customer-orders-grid");
        grid.addColumn(OrderService.OrderSummary::orderNumber).setHeader("Mã đơn").setAutoWidth(true);
        grid.addColumn(order -> date(order.createdAt())).setHeader("Ngày đặt").setAutoWidth(true);
        grid.addColumn(order -> StorePresentation.money(order.total())).setHeader("Tổng tiền").setAutoWidth(true);
        grid.addColumn(order -> statusLabel(order.status())).setHeader("Trạng thái").setAutoWidth(true);
        grid.addColumn(order -> paymentLabel(order.paymentStatus())).setHeader("Thanh toán").setAutoWidth(true);
        grid.addComponentColumn(order -> {
            Button details = new Button("Xem chi tiết", click -> navigate(order.orderNumber()));
            details.getElement().setAttribute("data-testid", "customer-order-details");
            details.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
            return details;
        }).setHeader("Thao tác").setAutoWidth(true);
        grid.setWidthFull();
        grid.setItems(orders.customerOrderSummaries(currentCustomerId()));
        add(grid);
        expand(grid);
    }

    private void renderDetails(String orderNumber) {
        removeAll();
        try {
            OrderService.TrackingDetails order = orders.customerOrder(currentCustomerId(), orderNumber);
            Button back = new Button("← Tất cả đơn hàng", click -> getUI().ifPresent(ui -> ui.navigate(CustomerOrdersView.class)));
            back.setId("customer-order-back");
            back.addThemeVariants(ButtonVariant.LUMO_TERTIARY);
            add(back, new H2("Đơn hàng " + order.orderNumber()));

            HorizontalLayout summary = new HorizontalLayout(
                    metric("Ngày đặt", date(order.createdAt())),
                    metric("Trạng thái", statusLabel(order.status())),
                    metric("Thanh toán", paymentLabel(order.paymentStatus())),
                    metric("Tổng tiền", StorePresentation.money(order.total())));
            summary.setWidthFull();
            summary.setId("customer-order-summary");
            summary.addClassName("order-summary-cards");
            add(summary);

            add(new H3("Tiến trình đơn hàng"), timeline(order));
            add(new H3("Sản phẩm"));
            order.items().forEach(item -> add(itemRow(item)));

            VerticalLayout delivery = new VerticalLayout(
                    new Span("Người nhận: " + fallback(order.recipientName())),
                    new Span("Điện thoại: " + fallback(order.recipientPhone())),
                    new Span("Email: " + fallback(order.recipientEmail())),
                    new Span("Địa chỉ: " + fallback(order.shippingAddress())),
                    new Span("Phương thức: " + paymentMethodLabel(order.paymentMethod())));
            delivery.setPadding(false);
            delivery.setId("customer-order-delivery");
            add(new H3("Thông tin nhận hàng"), delivery);

            HorizontalLayout actions = new HorizontalLayout();
            if (order.paymentStatus() == Order.PaymentStatus.PENDING) {
                Button payment = new Button("Xem VietQR", click -> showPayment(order));
                payment.setId("customer-order-payment");
                payment.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
                actions.add(payment);
            }
            if (order.cancellable()) {
                Button cancel = new Button("Yêu cầu hủy đơn", click -> confirmCancellation(order));
                cancel.setId("customer-order-cancel");
                cancel.addThemeVariants(ButtonVariant.LUMO_ERROR, ButtonVariant.LUMO_TERTIARY);
                actions.add(cancel);
            }
            add(actions);
        } catch (IllegalArgumentException exception) {
            add(new H2("Không tìm thấy đơn hàng"),
                    new Paragraph("Đơn hàng không tồn tại hoặc không thuộc tài khoản của bạn."),
                    new Button("Về danh sách đơn hàng", click -> getUI().ifPresent(ui -> ui.navigate(CustomerOrdersView.class))));
        }
    }

    private Div timeline(OrderService.TrackingDetails order) {
        Div timeline = new Div();
        timeline.addClassName("order-timeline");
        timeline.setId("customer-order-timeline");
        order.timeline().forEach(event -> {
            Div step = new Div(new Span(statusLabel(event.status())),
                    new Span(date(event.recordedAt())), new Paragraph(event.note()));
            step.addClassName("order-timeline-step");
            timeline.add(step);
        });
        return timeline;
    }

    private HorizontalLayout itemRow(OrderService.ItemSnapshot item) {
        Span product = new Span(item.quantity() + " × " + item.name() + " (" + item.sku() + ")");
        Span amount = new Span(StorePresentation.money(item.subtotal()));
        HorizontalLayout row = new HorizontalLayout(product, amount);
        row.setWidthFull();
        row.setJustifyContentMode(JustifyContentMode.BETWEEN);
        row.addClassName("order-item-row");
        return row;
    }

    private VerticalLayout metric(String label, String value) {
        Span caption = new Span(label);
        Span content = new Span(value);
        content.getStyle().set("font-weight", "800");
        VerticalLayout card = new VerticalLayout(caption, content);
        card.setSpacing(false);
        card.addClassName("order-summary-card");
        return card;
    }

    private void showPayment(OrderService.TrackingDetails order) {
        try {
            PaymentService.Instructions instructions = payments.instructions(order.id(), currentEmail());
            Dialog dialog = new Dialog();
            dialog.setHeaderTitle("VietQR — " + order.orderNumber());
            Image qr = new Image(instructions.qrUrl(), "VietQR MB Bank cho đơn " + order.orderNumber());
            qr.setWidth("240px");
            dialog.add(new Paragraph("Quét mã bằng ứng dụng ngân hàng hỗ trợ VietQR."), qr,
                    new Span("MB Bank • " + instructions.accountNumber()),
                    new Span(instructions.accountName()),
                    new Span("Số tiền: " + StorePresentation.money(instructions.amount())),
                    new Span("Nội dung: " + instructions.transferContent()));
            dialog.getFooter().add(new Button("Đóng", click -> dialog.close()));
            dialog.open();
        } catch (RuntimeException exception) {
            Notification.show("Không thể tải thông tin thanh toán.", 4000, Notification.Position.MIDDLE);
        }
    }

    private void confirmCancellation(OrderService.TrackingDetails order) {
        Dialog dialog = new Dialog();
        dialog.setHeaderTitle("Hủy đơn " + order.orderNumber());
        TextArea reason = new TextArea("Lý do hủy");
        reason.setId("customer-order-cancel-reason");
        reason.setWidthFull();
        reason.setMaxLength(500);
        Button confirm = new Button("Xác nhận hủy", click -> {
            try {
                orders.cancelForCustomer(currentCustomerId(), order.orderNumber(), reason.getValue());
                dialog.close();
                Notification.show("Đã hủy đơn hàng.");
                renderDetails(order.orderNumber());
            } catch (RuntimeException exception) {
                Notification.show("Không thể hủy đơn hàng: " + exception.getMessage(), 5000, Notification.Position.MIDDLE);
            }
        });
        confirm.setId("customer-order-cancel-confirm");
        confirm.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_ERROR);
        dialog.add(new Paragraph("Tồn kho sẽ được hoàn lại sau khi hủy thành công."), reason);
        dialog.getFooter().add(new Button("Đóng", click -> dialog.close()), confirm);
        dialog.open();
    }

    private void navigate(String orderNumber) {
        getUI().ifPresent(ui -> ui.navigate("tai-khoan/don-hang/" + orderNumber));
    }

    private java.util.UUID currentCustomerId() { return users.requireDomainUser(currentEmail()).getId(); }
    private String currentEmail() { return SecurityContextHolder.getContext().getAuthentication().getName(); }
    private static String date(java.time.Instant instant) { return DATE_TIME.format(instant.atZone(VIETNAM)); }
    private static String fallback(String value) { return value == null || value.isBlank() ? "Chưa có dữ liệu" : value; }

    private static String statusLabel(Order.Status status) {
        return switch (status) {
            case DRAFT -> "Bản nháp";
            case PLACED -> "Đã tiếp nhận";
            case PENDING_PAYMENT -> "Chờ thanh toán";
            case PAID -> "Đã thanh toán";
            case CONFIRMED -> "Đã xác nhận";
            case PROCESSING -> "Đang chuẩn bị";
            case SHIPPED -> "Đang giao";
            case COMPLETED -> "Hoàn tất";
            case CANCELLED -> "Đã hủy";
        };
    }

    private static String paymentLabel(Order.PaymentStatus status) {
        return switch (status) {
            case UNPAID -> "Chưa thanh toán";
            case PENDING -> "Đang chờ";
            case AUTHORIZED -> "Đã ủy quyền";
            case PAID -> "Đã thanh toán";
            case PARTIALLY_REFUNDED -> "Hoàn tiền một phần";
            case REFUNDED -> "Đã hoàn tiền";
            case FAILED -> "Thất bại";
        };
    }

    private static String paymentMethodLabel(String method) {
        if (method == null) return "Chưa có dữ liệu";
        return switch (method) {
            case "VietQR MB Bank" -> "Chuyển khoản VietQR";
            case "COD" -> "Thanh toán khi nhận hàng";
            default -> method;
        };
    }
}
