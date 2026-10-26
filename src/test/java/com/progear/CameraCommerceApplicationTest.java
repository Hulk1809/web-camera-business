package com.progear;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CameraCommerceApplicationTest {

    @Test
    void applicationClassLoads() {
        assertThat(CameraCommerceApplication.class).isNotNull();
    }
}
