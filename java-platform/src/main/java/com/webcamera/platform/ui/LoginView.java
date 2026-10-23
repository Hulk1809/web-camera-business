package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.UserService;
import com.webcamera.platform.ui.theme.UiTokens;

@Route(value = "login", autoLayout = false)
@PageTitle("Đăng nhập | PRO GEAR")
@AnonymousAllowed
public class LoginView extends VerticalLayout implements BeforeEnterObserver {
    private final LoginForm login = new LoginForm();
    private final UserService users;

    public LoginView(UserService users) {
        this.users = users;
        setSizeFull();
        setPadding(true);
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
        setId("qa-login-screen");
        getStyle().set("background", "linear-gradient(135deg,#030712,#111827 55%,#7F1D1D)")
                .set("font-family", "Arial, Helvetica, sans-serif");

        Span logo = new Span("PRO GEAR");
        logo.getStyle().set("font-size", "30px").set("font-weight", "900").set("color", "white");
        Paragraph subtitle = new Paragraph("Máy ảnh • Cinema • DJI Flagship");
        subtitle.getStyle().set("color", "#D1D5DB").set("margin", "0 0 18px");

        login.setId("qa-login-form");
        login.setAction("login");
        login.setForgotPasswordButtonVisible(false);
        VerticalLayout signIn = panel(new H2("Đăng nhập"), new Paragraph("Sử dụng tài khoản khách hàng hoặc nhân viên PRO GEAR."), login);

        TextField name = new TextField("Họ và tên");
        EmailField email = new EmailField("Email");
        PasswordField password = new PasswordField("Mật khẩu");
        PasswordField confirmation = new PasswordField("Nhập lại mật khẩu");
        name.setWidthFull();
        email.setWidthFull();
        password.setWidthFull();
        confirmation.setWidthFull();
        Button register = new Button("TẠO TÀI KHOẢN KHÁCH HÀNG",
                event -> register(name, email, password, confirmation));
        register.setWidthFull();
        register.getStyle().set("background", UiTokens.BRAND_RED).set("color", "white").set("font-weight", "900");
        VerticalLayout signUp = panel(new H2("Đăng ký thành viên"),
                new Paragraph("Theo dõi đơn hàng, nhận VietQR và quản lý bảo hành điện tử."),
                name, email, password, confirmation, register);

        FlexLayout cards = new FlexLayout(signIn, signUp);
        cards.setWidthFull();
        cards.setMaxWidth("900px");
        cards.getStyle().set("gap", "18px").set("flex-wrap", "wrap").set("justify-content", "center");
        signIn.getStyle().set("flex", "1 1 340px");
        signUp.getStyle().set("flex", "1 1 340px");
        add(logo, subtitle, cards);
    }

    private void register(TextField name, EmailField email, PasswordField password, PasswordField confirmation) {
        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Notification.show("Vui lòng nhập đầy đủ thông tin đăng ký.");
            return;
        }
        if (password.getValue().length() < 8) {
            Notification.show("Mật khẩu cần tối thiểu 8 ký tự.");
            return;
        }
        if (!password.getValue().equals(confirmation.getValue())) {
            Notification.show("Mật khẩu nhập lại chưa khớp.");
            return;
        }
        try {
            users.create(email.getValue(), name.getValue(), password.getValue(), User.Role.CUSTOMER);
            Notification.show("Tạo tài khoản thành công. Bạn có thể đăng nhập ngay.", 5000,
                    Notification.Position.MIDDLE);
            email.clear();
            name.clear();
            password.clear();
            confirmation.clear();
        } catch (RuntimeException exception) {
            Notification.show(exception.getMessage(), 5000, Notification.Position.MIDDLE);
        }
    }

    private static VerticalLayout panel(com.vaadin.flow.component.Component... components) {
        VerticalLayout panel = new VerticalLayout(components);
        panel.setWidthFull();
        panel.setMaxWidth("430px");
        panel.getStyle().set("background", "white").set("border-radius", "12px").set("padding", "24px")
                .set("box-shadow", "0 20px 50px rgba(0,0,0,.3)").set("box-sizing", "border-box");
        return panel;
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        if (event.getLocation().getQueryParameters().getParameters().containsKey("error")) login.setError(true);
    }
}
