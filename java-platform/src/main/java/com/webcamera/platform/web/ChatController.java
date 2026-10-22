package com.webcamera.platform.web;

import com.webcamera.platform.domain.ChatSession;
import com.webcamera.platform.domain.User;
import com.webcamera.platform.service.ChatService;
import com.webcamera.platform.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.net.URI;
import java.security.Principal;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    public record StartChatRequest(@NotBlank @Size(max = 4000) String message) {}
    public record ChatResponse(UUID id) {}
    private final ChatService chats;
    private final UserService users;
    public ChatController(ChatService chats, UserService users) { this.chats = chats; this.users = users; }

    @PostMapping
    public ResponseEntity<ChatResponse> start(@Valid @RequestBody StartChatRequest request, Principal principal) {
        User user = users.requireDomainUser(principal.getName());
        ChatSession session = chats.start(user.getId(), request.message());
        return ResponseEntity.created(URI.create("/api/chats/" + session.getId())).body(new ChatResponse(session.getId()));
    }
}
