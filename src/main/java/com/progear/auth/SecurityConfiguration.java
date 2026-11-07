package com.progear.auth;

import jakarta.servlet.DispatcherType;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    public record AppUserRow(long id, String email, String passwordHash, String fullName,
                             String address, String role, boolean enabled) {}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(JdbcClient jdbc) {
        return username -> jdbc.sql("""
                        SELECT id, email, password_hash, full_name, address, role, enabled
                        FROM app_user
                        WHERE lower(email) = lower(btrim(:email))
                        """)
                .param("email", username == null ? "" : username)
                .query(AppUserRow.class)
                .optional()
                .map(u -> User.withUsername(u.email())
                        .password(u.passwordHash())
                        .authorities(List.of(new SimpleGrantedAuthority(u.role())))
                        .disabled(!u.enabled())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers(HttpMethod.GET, "/", "/products", "/products/{id}", "/warranty", "/login", "/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/register").permitAll()
                .requestMatchers("/pos", "/pos/**").hasAnyAuthority("ROLE_STAFF", "ROLE_ADMIN")
                .requestMatchers("/admin", "/admin/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/cart", "/cart/**", "/checkout", "/orders", "/orders/**", "/profile", "/profile/**").authenticated()
                .anyRequest().authenticated())
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/products", false)
                .permitAll())
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/products")
                .permitAll());
        return http.build();
    }
}
