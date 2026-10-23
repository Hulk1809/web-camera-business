package com.webcamera.platform.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.webcamera.platform.domain.CameraSerial;
import com.webcamera.platform.domain.Order;
import com.webcamera.platform.domain.Product;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.domain.Warranty;
import com.webcamera.platform.domain.ChatSession;
import com.webcamera.platform.domain.Message;
import com.webcamera.platform.repository.ProductRepository;
import com.webcamera.platform.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.default_schema=camera_platform",
        "spring.datasource.url=jdbc:h2:mem:pos_test;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;INIT=CREATE SCHEMA IF NOT EXISTS camera_platform",
        "spring.flyway.enabled=false",
        "app.bank-transfer.account-number=0000000000",
        "app.bank-transfer.account-name=TEST ACCOUNT"
})
@Import({OrderService.class, InventoryService.class, PaymentService.class, ChatService.class})
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PosAndWarrantyTest {
    @Autowired
    private OrderService orderService;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private ChatService chatService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    @Test
    void posSaleAssignsSerialAndCreatesWarranty() {
        User staff = userRepository.save(new User("pos-staff@test.com", "hash", "POS Staff", User.Role.STAFF));
        Product camera = productRepository.save(new Product("CAM-ALPHA", "Sony Alpha A7 IV", BigDecimal.valueOf(2499.00), 5));
        CameraSerial serial = inventoryService.register(camera.getId(), "SN-A7IV-9999");

        Order posOrder = orderService.placePos(staff.getId(), List.of(new OrderService.Line(camera.getId(), 1)));
        assertThat(posOrder.getSalesChannel()).isEqualTo(Order.SalesChannel.POS);
        assertThat(posOrder.getStatus()).isEqualTo(Order.Status.COMPLETED);

        Warranty warranty = inventoryService.sell(serial.getId(), posOrder.getItems().get(0).getId(), 24);
        assertThat(warranty.getStatus()).isEqualTo(Warranty.Status.ACTIVE);
        assertThat(warranty.getCameraSerial().getSerialNumber()).isEqualTo("SN-A7IV-9999");

        Warranty claimed = inventoryService.claimWarranty("SN-A7IV-9999");
        assertThat(claimed.getStatus()).isEqualTo(Warranty.Status.CLAIMED);
    }

    @Test
    void chatSessionLifecycle() {
        User customer = userRepository.save(new User("chat-user@test.com", "hash", "Chat User", User.Role.CUSTOMER));
        ChatSession session = chatService.start(customer.getId(), "Hello, need advice on 35mm lens");
        assertThat(session.getMessages()).hasSize(1);
        assertThat(session.getMessages().get(0).getContent()).contains("35mm lens");

        ChatSession replied = chatService.reply(session.getId(), Message.Sender.AGENT, "We recommend the FE 35mm F1.4 GM!");
        assertThat(replied.getMessages()).hasSize(2);
        assertThat(chatService.allSessions()).isNotEmpty();
    }
}
