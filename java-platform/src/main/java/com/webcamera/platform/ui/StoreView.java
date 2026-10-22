package com.webcamera.platform.ui;

import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.service.CatalogService;

@Route(value = "", layout = MainLayout.class)
@PageTitle("Store | Camera Platform")
@AnonymousAllowed
public class StoreView extends VerticalLayout {
    public StoreView(CatalogService catalog) {
        add(new H2("Camera store"));
        Grid<Product> grid = new Grid<>(Product.class, false);
        grid.addColumn(Product::getSku).setHeader("SKU");
        grid.addColumn(Product::getName).setHeader("Product").setFlexGrow(1);
        grid.addColumn(Product::getPrice).setHeader("Price");
        grid.addColumn(Product::getStockQuantity).setHeader("In stock");
        grid.setItems(catalog.activeProducts());
        grid.setEmptyStateText("No products are currently available.");
        add(grid);
        setSizeFull();
        grid.setSizeFull();
    }
}
