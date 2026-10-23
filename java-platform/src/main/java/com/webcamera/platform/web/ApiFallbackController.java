package com.webcamera.platform.web;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiFallbackController {
    @RequestMapping("/api/**")
    public ResponseEntity<Map<String, String>> handleMissingApiRoute() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Not Found", "message", "API endpoint not found"));
    }
}
