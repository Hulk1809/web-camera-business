package com.webcamera.platform.web;

import com.webcamera.platform.service.QaFixtureService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/qa/fixtures")
@ConditionalOnProperty(name = "app.qa-fixtures.enabled", havingValue = "true")
public class QaFixtureController {
    public record CreateRequest(@NotBlank String scenario, @Min(60) @Max(900) int ttlSeconds) {}

    private final QaFixtureService fixtures;
    private final byte[] expectedToken;

    public QaFixtureController(QaFixtureService fixtures, @Value("${app.qa-fixtures.token:}") String token) {
        if (token.length() < 32) throw new IllegalStateException("QA fixture token must contain at least 32 characters");
        this.fixtures = fixtures;
        this.expectedToken = token.getBytes(StandardCharsets.UTF_8);
    }

    @PostMapping
    public ResponseEntity<QaFixtureService.FixtureView> create(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
            @Valid @RequestBody CreateRequest request) {
        authorize(authorization);
        QaFixtureService.FixtureView fixture = fixtures.create(request.scenario(), request.ttlSeconds());
        return ResponseEntity.created(URI.create("/qa/fixtures/" + fixture.id())).body(fixture);
    }

    @GetMapping("/{id}")
    public QaFixtureService.FixtureView get(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                            @PathVariable UUID id) {
        authorize(authorization);
        try {
            return fixtures.get(id);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "QA fixture not found");
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.GONE, exception.getMessage());
        }
    }

    @PostMapping("/{id}/advance")
    public QaFixtureService.FixtureView advance(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                                @PathVariable UUID id) {
        authorize(authorization);
        try {
            return fixtures.advance(id);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "QA fixture not found");
        } catch (IllegalStateException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cleanup(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization,
                                        @PathVariable UUID id) {
        authorize(authorization);
        fixtures.cleanup(id);
        return ResponseEntity.noContent().build();
    }

    private void authorize(String authorization) {
        String prefix = "Bearer ";
        byte[] supplied = authorization != null && authorization.startsWith(prefix)
                ? authorization.substring(prefix.length()).getBytes(StandardCharsets.UTF_8) : new byte[0];
        if (!MessageDigest.isEqual(expectedToken, supplied)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid QA fixture token");
        }
    }
}
