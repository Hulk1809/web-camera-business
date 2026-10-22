package com.webcamera.platform.ui;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Nav;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.router.RouterLink;
import com.vaadin.flow.server.auth.AccessAnnotationChecker;

public class MainLayout extends AppLayout {
    public MainLayout(AccessAnnotationChecker accessChecker) {
        H1 title = new H1("Camera Platform");
        title.getStyle().set("font-size", "var(--lumo-font-size-l)").set("margin", "0");
        addToNavbar(new DrawerToggle(), title);
        Nav nav = new Nav();
        nav.add(new RouterLink("Store", StoreView.class));
        if (accessChecker.hasAccess(AdminView.class)) nav.add(new RouterLink("Admin", AdminView.class));
        addToDrawer(new Scroller(nav));
    }
}
