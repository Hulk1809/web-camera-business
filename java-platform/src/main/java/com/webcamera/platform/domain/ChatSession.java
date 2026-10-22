package com.webcamera.platform.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_session", schema = "camera_platform")
public class ChatSession extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
    protected ChatSession() {}
    public ChatSession(User user) { this.user = user; }
    public void addMessage(Message.Sender sender, String content) { messages.add(new Message(this, sender, content)); }
    public User getUser() { return user; }
    public List<Message> getMessages() { return List.copyOf(messages); }
}
