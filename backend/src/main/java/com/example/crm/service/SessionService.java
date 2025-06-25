package com.example.crm.service;

import com.example.crm.model.User;
import com.example.crm.model.UserSession;
import com.example.crm.repository.UserSessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@Slf4j
public class SessionService {
    private final UserSessionRepository sessionRepository;
    private final int maxActiveSessions;
    private final int sessionTimeoutMinutes;

    public SessionService(
            UserSessionRepository sessionRepository,
            @Value("${session.max-active-sessions-per-user:3}") int maxActiveSessions,
            @Value("${session.timeout-minutes:30}") int sessionTimeoutMinutes
    ) {
        this.sessionRepository = sessionRepository;
        this.maxActiveSessions = maxActiveSessions;
        this.sessionTimeoutMinutes = sessionTimeoutMinutes;
    }

    public UserSession createSession(User user, HttpServletRequest request) {
        // Clean up old sessions if user has too many
        cleanupExcessiveSessions(user);

        String sessionId = UUID.randomUUID().toString();
        String ipAddress = extractIpAddress(request);
        String userAgent = request.getHeader("User-Agent");
        String deviceInfo = extractDeviceInfo(userAgent);

        OffsetDateTime now = OffsetDateTime.now();
        UserSession session = UserSession.builder()
                .user(user)
                .sessionId(sessionId)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .deviceInfo(deviceInfo)
                .createdAt(now)
                .lastAccessedAt(now)
                .expiredAt(now.plusMinutes(sessionTimeoutMinutes))
                .isActive(true)
                .build();

        UserSession saved = sessionRepository.save(session);
        log.info("Created session {} for user: {} from IP: {}", sessionId, user.getUsername(), ipAddress);
        
        return saved;
    }

    public Optional<UserSession> findActiveSession(String sessionId) {
        return sessionRepository.findBySessionIdAndIsActiveTrue(sessionId);
    }

    public void updateSessionActivity(String sessionId) {
        OffsetDateTime now = OffsetDateTime.now();
        sessionRepository.updateLastAccessedTime(sessionId, now);
        
        // Extend session expiry
        Optional<UserSession> sessionOpt = findActiveSession(sessionId);
        if (sessionOpt.isPresent()) {
            UserSession session = sessionOpt.get();
            session.setExpiredAt(now.plusMinutes(sessionTimeoutMinutes));
            sessionRepository.save(session);
        }
    }

    public void deactivateSession(String sessionId) {
        sessionRepository.deactivateBySessionId(sessionId);
        log.info("Deactivated session: {}", sessionId);
    }

    public void deactivateAllUserSessions(User user) {
        sessionRepository.deactivateAllByUser(user);
        log.info("Deactivated all sessions for user: {}", user.getUsername());
    }

    public List<UserSession> getActiveSessions(User user) {
        return sessionRepository.findByUserAndIsActiveTrue(user);
    }

    public boolean isSessionValid(String sessionId) {
        Optional<UserSession> sessionOpt = findActiveSession(sessionId);
        return sessionOpt.map(UserSession::isValid).orElse(false);
    }

    public void cleanupExpiredSessions() {
        sessionRepository.deleteExpiredAndInactiveSessions(OffsetDateTime.now());
        log.debug("Cleaned up expired and inactive sessions");
    }

    private void cleanupExcessiveSessions(User user) {
        long activeSessionCount = sessionRepository.countActiveSessionsByUser(user);
        
        if (activeSessionCount >= maxActiveSessions) {
            List<UserSession> activeSessions = sessionRepository.findByUserAndIsActiveTrue(user);
            
            // Sort by last accessed time and deactivate oldest sessions
            activeSessions.stream()
                    .sorted((s1, s2) -> s1.getLastAccessedAt().compareTo(s2.getLastAccessedAt()))
                    .limit(activeSessionCount - maxActiveSessions + 1)
                    .forEach(session -> {
                        session.setIsActive(false);
                        sessionRepository.save(session);
                    });
            
            log.info("Cleaned up {} excessive sessions for user: {}", 
                    activeSessionCount - maxActiveSessions + 1, user.getUsername());
        }
    }

    private String extractIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private String extractDeviceInfo(String userAgent) {
        if (userAgent == null) {
            return "Unknown Device";
        }
        
        // Simple device detection - can be enhanced with a proper library
        if (userAgent.contains("Mobile") || userAgent.contains("Android") || userAgent.contains("iPhone")) {
            return "Mobile Device";
        } else if (userAgent.contains("Tablet") || userAgent.contains("iPad")) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    }
} 