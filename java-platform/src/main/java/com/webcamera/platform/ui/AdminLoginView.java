package com.webcamera.platform.ui;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

@Route(value = "admin/login", autoLayout = false)
@PageTitle("Đăng nhập nhân viên | PRO GEAR")
@AnonymousAllowed
public final class AdminLoginView extends VerticalLayout implements BeforeEnterObserver {
    private final LoginForm login = new LoginForm();

    public AdminLoginView() {
        setSizeFull();
        setId("admin-login-view");
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);
        addClassName("admin-auth");

        Span brand = new Span("PRO GEAR OPERATIONS");
        brand.addClassName("admin-auth-brand");
        H1 title = new H1("Đăng nhập nhân viên");
        Paragraph copy = new Paragraph("Cổng nội bộ dành cho nhân viên được cấp quyền. Khách hàng không đăng nhập tại đây.");
        copy.addClassName("admin-auth-copy");

        login.setAction("login");
        login.setId("admin-login-form");
        login.setI18n(VietnameseLoginI18n.create("Tài khoản nhân viên"));
        login.setForgotPasswordButtonVisible(false);
        VerticalLayout card = new VerticalLayout(brand, title, copy, login);
        card.addClassName("admin-auth-card");
        add(card);
    }

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        if (event.getLocation().getQueryParameters().getParameters().containsKey("error")) login.setError(true);
    }
}
