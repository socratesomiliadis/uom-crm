package com.example.crm.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private OffsetDateTime expiryDate;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column
    private OffsetDateTime revokedAt;

    @Column
    private String deviceInfo;

    @Column
    private String ipAddress;

    @Column(nullable = false)
    private Boolean isRevoked = false;

    public boolean isExpired() {
        return OffsetDateTime.now().isAfter(this.expiryDate);
    }

    public boolean isActive() {
        return !isRevoked && !isExpired();
    }
} 