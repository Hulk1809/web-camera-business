package com.webcamera.platform.service;

import com.webcamera.platform.domain.ChatSession;
import com.webcamera.platform.domain.Message;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.repository.ChatSessionRepository;
import com.webcamera.platform.repository.UserRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService {
    private final ChatSessionRepository sessions;
    private final UserRepository users;
    public ChatService(ChatSessionRepository sessions, UserRepository users) { this.sessions = sessions; this.users = users; }
    @Transactional
    public ChatSession start(UUID userId, String message) {
        User user = userId == null ? null : users.findById(userId).orElseThrow(() -> new IllegalArgumentException("Unknown user"));
        ChatSession session = new ChatSession(user);
        session.addMessage(Message.Sender.CUSTOMER, message);
        return sessions.save(session);
    }
    @Transactional
    public ChatSession reply(UUID sessionId, Message.Sender sender, String message) {
        ChatSession session = sessions.findById(sessionId).orElseThrow(() -> new IllegalArgumentException("Unknown session"));
        session.addMessage(sender, message);
        return session;
    }
}
