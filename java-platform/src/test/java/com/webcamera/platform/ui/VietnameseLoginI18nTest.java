package com.webcamera.platform.ui;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VietnameseLoginI18nTest {
    @Test
    void localizesAllVisibleLoginFormCopy() {
        var i18n = VietnameseLoginI18n.create("Tài khoản khách hàng");

        assertThat(i18n.getForm().getTitle()).isEqualTo("Tài khoản khách hàng");
        assertThat(i18n.getForm().getUsername()).isEqualTo("Email");
        assertThat(i18n.getForm().getPassword()).isEqualTo("Mật khẩu");
        assertThat(i18n.getForm().getSubmit()).isEqualTo("Đăng nhập");
        assertThat(i18n.getErrorMessage().getTitle()).isEqualTo("Đăng nhập không thành công");
        assertThat(i18n.getErrorMessage().getMessage()).doesNotContain("Incorrect", "username", "password");
    }
}
