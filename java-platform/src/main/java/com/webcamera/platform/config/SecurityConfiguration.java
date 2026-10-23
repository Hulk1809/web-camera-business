package com.webcamera.platform.config;

import com.vaadin.flow.spring.security.VaadinSecurityConfigurer;
import com.webcamera.platform.ui.LoginView;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfiguration {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/orders/**", "/api/dashboard/**").authenticated()
                .requestMatchers("/actuator/health", "/actuator/health/**", "/api/products/**",
                        "/api/categories", "/api/brands", "/api/warranty/**", "/api/**").permitAll());
        http.exceptionHandling(exceptions -> exceptions
                .defaultAuthenticationEntryPointFor(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                        new AntPathRequestMatcher("/api/**")));
        http.headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                        "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; "
                                + "img-src 'self' data: https:; font-src 'self' data:; "
                                + "style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                                + "connect-src 'self' wss:"))
                .referrerPolicy(referrer -> referrer.policy(
                        org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                .permissionsPolicy(permissions -> permissions.policy(
                        "camera=(), microphone=(), geolocation=(), payment=()")));
        http.with(VaadinSecurityConfigurer.vaadin(), vaadin -> vaadin.loginView(LoginView.class));
        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
}
