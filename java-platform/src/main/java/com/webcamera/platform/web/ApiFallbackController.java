package com.webcamera.platform.web;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ApiFallbackController {
    @RequestMapping("/api/**")
    public void handleMissingApiRoute() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "API endpoint not found");
    }
}
