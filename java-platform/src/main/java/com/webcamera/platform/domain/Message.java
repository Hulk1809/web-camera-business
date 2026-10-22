package com.webcamera.platform.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "chat_message", schema = "camera_platform")
public class Message extends BaseEntity {
    public enum Sender { CUSTOMER, AGENT, SYSTEM }
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private ChatSession session;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Sender sender;
    @Column(nullable = false, length = 4000)
    private String content;
    protected Message() {}
    Message(ChatSession session, Sender sender, String content) {
        this.session = session; this.sender = sender; this.content = content;
    }
    public Sender getSender() { return sender; }
    public String getContent() { return content; }
}
