package com.example.crm.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "user_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String sessionId;

    @Column(nullable = false)
    private String ipAddress;

    @Column
    private String userAgent;

    @Column
    private String deviceInfo;

    @Column
    private String location;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(nullable = false)
    private OffsetDateTime lastAccessedAt = OffsetDateTime.now();

    @Column
    private OffsetDateTime expiredAt;

    @Column(nullable = false)
    private Boolean isActive = true;

    public boolean isExpired() {
        return expiredAt != null && OffsetDateTime.now().isAfter(expiredAt);
    }

    public boolean isValid() {
        return isActive && !isExpired();
    }
} 