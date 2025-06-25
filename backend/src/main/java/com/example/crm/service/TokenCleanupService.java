package com.example.crm.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TokenCleanupService {
    
    private final RefreshTokenService refreshTokenService;
    private final SessionService sessionService;

    public TokenCleanupService(RefreshTokenService refreshTokenService, SessionService sessionService) {
        this.refreshTokenService = refreshTokenService;
        this.sessionService = sessionService;
    }

    /**
     * Clean up expired refresh tokens every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 ms
    public void cleanupExpiredRefreshTokens() {
        try {
            log.debug("Starting cleanup of expired refresh tokens");
            refreshTokenService.cleanupExpiredTokens();
            log.debug("Completed cleanup of expired refresh tokens");
        } catch (Exception e) {
            log.error("Error during refresh token cleanup", e);
        }
    }

    /**
     * Clean up expired sessions every 30 minutes
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes = 1800000 ms
    public void cleanupExpiredSessions() {
        try {
            log.debug("Starting cleanup of expired sessions");
            sessionService.cleanupExpiredSessions();
            log.debug("Completed cleanup of expired sessions");
        } catch (Exception e) {
            log.error("Error during session cleanup", e);
        }
    }
} 