package com.webcamera.platform.web;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import com.webcamera.platform.service.QaFixtureService;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class QaFixtureControllerTest {
    @Test
    void rejectsInvalidBearerTokenBeforeAccessingFixtureService() {
        QaFixtureController controller = new QaFixtureController(mock(QaFixtureService.class),
                "0123456789abcdef0123456789abcdef");

        assertThatThrownBy(() -> controller.get("Bearer wrong-token", UUID.randomUUID()))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("401 UNAUTHORIZED");
    }
}
