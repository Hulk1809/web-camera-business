package com.webcamera.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CameraPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(CameraPlatformApplication.class, args);
    }
}
