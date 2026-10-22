package com.webcamera.platform.service;

import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.UserRepository;
import java.util.Locale;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users; this.passwordEncoder = passwordEncoder;
    }
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) {
        User user = users.findByEmailIgnoreCase(username).orElseThrow(() -> new UsernameNotFoundException("Unknown account"));
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPasswordHash()).roles(user.getRole().name()).disabled(!user.isEnabled()).build();
    }
    @Transactional(readOnly = true)
    public User requireDomainUser(String email) {
        return users.findByEmailIgnoreCase(email).orElseThrow(() -> new UsernameNotFoundException("Unknown account"));
    }
    @Transactional
    public User create(String email, String displayName, String rawPassword, User.Role role) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        if (users.findByEmailIgnoreCase(normalized).isPresent()) throw new IllegalArgumentException("Email already exists");
        return users.save(new User(normalized, displayName, passwordEncoder.encode(rawPassword), role));
    }
}
