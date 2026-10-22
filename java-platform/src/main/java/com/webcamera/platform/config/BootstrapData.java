package com.webcamera.platform.config;

import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.UserRepository;
import com.webcamera.platform.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class BootstrapData implements ApplicationRunner {
    private final UserRepository users;
    private final UserService userService;
    private final boolean enabled;
    private final String email;
    private final String password;

    public BootstrapData(UserRepository users, UserService userService,
                         @Value("${app.bootstrap-admin.enabled:false}") boolean enabled,
                         @Value("${app.bootstrap-admin.email:}") String email,
                         @Value("${app.bootstrap-admin.password:}") String password) {
        this.users = users; this.userService = userService; this.enabled = enabled; this.email = email; this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) return;
        if (email.isBlank() || password.length() < 12) {
            throw new IllegalStateException("Bootstrap admin requires an email and password of at least 12 characters");
        }
        if (users.findByEmailIgnoreCase(email).isEmpty()) {
            userService.create(email, "Administrator", password, User.Role.ADMIN);
        }
    }
}
