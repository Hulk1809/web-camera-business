package com.webcamera.platform.repository;

import com.webcamera.platform.domain.ChatSession;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
    List<ChatSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<ChatSession> findAllByOrderByCreatedAtDesc();
}
