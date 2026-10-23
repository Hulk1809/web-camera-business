package com.webcamera.platform.ui;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.webcamera.platform.domain.Warranty;
import com.webcamera.platform.service.InventoryService;

@Route(value = "warranty-check", layout = MainLayout.class)
@PageTitle("Warranty Check & Claim | Camera Platform")
@AnonymousAllowed
public class WarrantyView extends VerticalLayout {
    private final InventoryService inventory;
    private final TextField serialField = new TextField("Camera Serial Number");
    private final Button checkBtn = new Button("Lookup Warranty");
    private final VerticalLayout resultCard = new VerticalLayout();
    private final Button claimBtn = new Button("Submit Warranty Claim");
    private Warranty currentWarranty;

    public WarrantyView(InventoryService inventory) {
        this.inventory = inventory;
        setSizeFull();
        setMaxWidth("800px");

        add(new H2("Warranty Verification & Claims"),
                new Paragraph("Enter your camera body or lens serial number to verify coverage or initiate a warranty service claim."));

        serialField.setPlaceholder("e.g. SN-A7M4-001");
        serialField.setWidth("350px");

        checkBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY);
        checkBtn.addClickListener(event -> lookupWarranty());

        HorizontalLayout inputRow = new HorizontalLayout(serialField, checkBtn);
        inputRow.setAlignItems(Alignment.END);

        resultCard.setVisible(false);
        resultCard.getStyle()
                .set("border", "1px solid var(--lumo-contrast-20pct)")
                .set("border-radius", "8px")
                .set("padding", "20px")
                .set("background", "var(--lumo-base-color)");

        claimBtn.addThemeVariants(ButtonVariant.LUMO_PRIMARY, ButtonVariant.LUMO_ERROR);
        claimBtn.addClickListener(event -> submitClaim());

        add(inputRow, resultCard);
    }

    private void lookupWarranty() {
        String serial = serialField.getValue();
        if (serial == null || serial.isBlank()) {
            Notification.show("Please enter a serial number.");
            return;
        }

        try {
            currentWarranty = inventory.warrantyBySerial(serial.trim());
            displayWarranty(currentWarranty);
        } catch (IllegalArgumentException ex) {
            resultCard.setVisible(true);
            resultCard.removeAll();
            resultCard.add(new H3("No Warranty Found"),
                    new Span("No active warranty record found for serial: " + serial.trim()));
        }
    }

    private void displayWarranty(Warranty w) {
        resultCard.setVisible(true);
        resultCard.removeAll();

        resultCard.add(new H3("Warranty Details"));
        resultCard.add(new Span("Product: " + w.getCameraSerial().getProduct().getName()));
        resultCard.add(new Span("Serial Number: " + w.getCameraSerial().getSerialNumber()));
        resultCard.add(new Span("Order Number: " + w.getOrder().getOrderNumber()));
        resultCard.add(new Span("Coverage Period: " + w.getStartsOn() + " to " + w.getExpiresOn()));

        Span statusSpan = new Span("Status: " + w.getStatus());
        statusSpan.getStyle().set("font-weight", "bold");
        if (w.getStatus() == Warranty.Status.ACTIVE) {
            statusSpan.getStyle().set("color", "var(--lumo-success-text-color)");
        } else {
            statusSpan.getStyle().set("color", "var(--lumo-error-text-color)");
        }
        resultCard.add(statusSpan);

        claimBtn.setEnabled(w.getStatus() == Warranty.Status.ACTIVE);
        resultCard.add(claimBtn);
    }

    private void submitClaim() {
        if (currentWarranty == null) return;
        try {
            inventory.claimWarranty(currentWarranty.getCameraSerial().getSerialNumber());
            currentWarranty = inventory.warrantyBySerial(currentWarranty.getCameraSerial().getSerialNumber());
            displayWarranty(currentWarranty);
            Notification.show("Warranty claim submitted successfully. Service center will review your camera.");
        } catch (RuntimeException ex) {
            Notification.show("Cannot submit claim: " + ex.getMessage(), 4000, Notification.Position.MIDDLE);
        }
    }
}
