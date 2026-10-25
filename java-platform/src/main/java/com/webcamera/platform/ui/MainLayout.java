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
        setId("customer-shell");
        H1 title = new H1("PRO GEAR");
        title.getStyle().set("font-size", "var(--lumo-font-size-l)").set("margin", "0");
        addToNavbar(new DrawerToggle(), title);
        Nav nav = new Nav();
        nav.setId("customer-navigation");
        nav.getStyle().set("display", "flex").set("flex-direction", "column").set("padding", "1rem").set("gap", "0.75rem");
        nav.add(new RouterLink("Cửa hàng", StoreView.class));
        nav.add(new RouterLink("Tra cứu bảo hành", WarrantyView.class));
        if (accessChecker.hasAccess(CustomerOrdersView.class)) nav.add(new RouterLink("Đơn hàng của tôi", CustomerOrdersView.class));
        if (accessChecker.hasAccess(PosView.class)) nav.add(new RouterLink("Quầy POS", PosView.class));
        if (accessChecker.hasAccess(AdminView.class)) nav.add(new RouterLink("Quản trị", AdminView.class));
        addToDrawer(new Scroller(nav));
    }
}
