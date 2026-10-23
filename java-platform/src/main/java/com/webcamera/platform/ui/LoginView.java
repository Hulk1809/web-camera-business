package com.webcamera.platform.ui;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.login.LoginForm;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

@Route(value = "login", autoLayout = false)
@PageTitle("Sign in | Camera Platform")
@AnonymousAllowed
public class LoginView extends VerticalLayout implements BeforeEnterObserver {
    private final LoginForm login = new LoginForm();
    public LoginView() {
        setSizeFull(); setAlignItems(Alignment.CENTER); setJustifyContentMode(JustifyContentMode.CENTER);
        setId("qa-login-screen");
        login.setId("qa-login-form");
        login.setAction("login");
        add(new H1("Camera Platform"), login);
    }
    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        if (event.getLocation().getQueryParameters().getParameters().containsKey("error")) login.setError(true);
    }
}
