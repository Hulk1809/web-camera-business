package com.webcamera.platform.ui;

import com.vaadin.flow.component.login.LoginI18n;

final class VietnameseLoginI18n {
    private VietnameseLoginI18n() {}

    static LoginI18n create(String title) {
        LoginI18n i18n = LoginI18n.createDefault();
        LoginI18n.Form form = i18n.getForm();
        form.setTitle(title);
        form.setUsername("Email");
        form.setPassword("Mật khẩu");
        form.setSubmit("Đăng nhập");
        form.setForgotPassword("Quên mật khẩu");
        LoginI18n.ErrorMessage error = i18n.getErrorMessage();
        error.setTitle("Đăng nhập không thành công");
        error.setMessage("Email hoặc mật khẩu không đúng. Vui lòng kiểm tra và thử lại.");
        return i18n;
    }
}
