package com.webcamera.platform.repository;

import com.webcamera.platform.domain.Message;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, UUID> {}
