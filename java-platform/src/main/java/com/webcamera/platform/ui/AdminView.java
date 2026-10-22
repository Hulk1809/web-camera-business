package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.IntegerField;
import com.vaadin.flow.component.textfield.NumberField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.service.CatalogService;
import jakarta.annotation.security.RolesAllowed;
import java.math.BigDecimal;

@Route(value = "admin", layout = MainLayout.class)
@PageTitle("Admin | Camera Platform")
@RolesAllowed("ADMIN")
public class AdminView extends VerticalLayout {
    private final CatalogService catalog;
    private final Grid<Product> grid = new Grid<>(Product.class, false);

    public AdminView(CatalogService catalog) {
        this.catalog = catalog;
        add(new H2("Product administration"));
        configureGrid();
        TextField sku = new TextField("SKU");
        TextField name = new TextField("Name");
        NumberField price = new NumberField("Price");
        IntegerField stock = new IntegerField("Stock");
        Button add = new Button("Add product", event -> {
            try {
                Product product = new Product(sku.getValue().trim(), name.getValue().trim(),
                        BigDecimal.valueOf(price.getValue()), stock.getValue());
                catalog.save(product);
                refresh();
                sku.clear(); name.clear(); price.clear(); stock.clear();
            } catch (RuntimeException ex) {
                Notification.show("Could not add product: " + ex.getMessage());
            }
        });
        add(new HorizontalLayout(sku, name, price, stock, add), grid);
        setSizeFull();
        grid.setSizeFull();
        refresh();
    }

    private void configureGrid() {
        grid.addColumn(Product::getSku).setHeader("SKU");
        grid.addColumn(Product::getName).setHeader("Name");
        grid.addColumn(Product::getPrice).setHeader("Price");
        grid.addColumn(Product::getStockQuantity).setHeader("Stock");
        grid.addColumn(Product::isActive).setHeader("Active");
    }
    private void refresh() { grid.setItems(catalog.allProducts()); }
}
