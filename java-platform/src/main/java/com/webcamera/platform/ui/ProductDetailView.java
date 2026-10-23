package com.webcamera.platform.ui;

import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.NotFoundException;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.service.CatalogService;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.UUID;

@Route(value = "products", layout = MainLayout.class)
@PageTitle("Product | Camera Platform")
@AnonymousAllowed
public class ProductDetailView extends VerticalLayout implements HasUrlParameter<String> {
    private final CatalogService catalog;

    public ProductDetailView(CatalogService catalog) {
        this.catalog = catalog;
        setMaxWidth("900px");
        setMargin(true);
    }

    @Override
    public void setParameter(BeforeEvent event, String parameter) {
        removeAll();
        try {
            Product product = catalog.activeProduct(UUID.fromString(parameter));
            add(new H2(product.getName()),
                    new Span("SKU: " + product.getSku()),
                    new Span(NumberFormat.getCurrencyInstance(Locale.US).format(product.getPrice())),
                    new Span(product.getStockQuantity() > 0
                            ? product.getStockQuantity() + " unit(s) available" : "Out of stock"),
                    new Paragraph(product.getDescription() == null ? "" : product.getDescription()));
        } catch (IllegalArgumentException exception) {
            throw new NotFoundException();
        }
    }
}
