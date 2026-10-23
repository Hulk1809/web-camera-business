package com.webcamera.platform.ui;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Nav;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.router.RouterLink;

public final class AdminLayout extends AppLayout {
    public AdminLayout() {
        addClassName("admin-shell");
        setPrimarySection(Section.DRAWER);
        Div brand = new Div();
        brand.addClassName("admin-brand");
        Span name = new Span("PRO GEAR");
        name.addClassName("admin-brand-name");
        Span copy = new Span("TRUNG TÂM VẬN HÀNH");
        copy.addClassName("admin-brand-copy");
        brand.add(name, new Div(copy));
        Nav nav = new Nav();
        nav.addClassName("admin-nav");
        nav.add(new RouterLink("Tổng quan", AdminView.class),
                new RouterLink("Bán hàng tại quầy", PosView.class), new RouterLink("Xem cửa hàng", StoreView.class));
        addToDrawer(brand, nav);
        H2 title = new H2("Quản trị PRO GEAR");
        title.getStyle().set("margin", "0").set("font-size", "18px").set("color", "#111827");
        addToNavbar(new DrawerToggle(), title);
    }
}
