package com.example.crm.service;

import com.example.crm.config.JwtTokenProvider;
import com.example.crm.model.RefreshToken;
import com.example.crm.model.User;
import com.example.crm.repository.RefreshTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final int maxActiveTokensPerUser;
    private final SecureRandom secureRandom;

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            JwtTokenProvider jwtTokenProvider,
            @Value("${jwt.max-active-refresh-tokens-per-user:5}") int maxActiveTokensPerUser
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.maxActiveTokensPerUser = maxActiveTokensPerUser;
        this.secureRandom = new SecureRandom();
    }

    public RefreshToken createRefreshToken(User user, HttpServletRequest request) {
        // Clean up old tokens if user has too many
        cleanupExcessiveTokens(user);

        // Generate cryptographically secure refresh token
        String tokenValue = generateSecureToken();
        
        // Get device and IP information
        String deviceInfo = extractDeviceInfo(request);
        String ipAddress = extractIpAddress(request);

        OffsetDateTime now = OffsetDateTime.now();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(tokenValue)
                .user(user)
                .createdAt(now)
                .expiryDate(now.plusDays(jwtTokenProvider.getRefreshTokenValidityInDays()))
                .deviceInfo(deviceInfo)
                .ipAddress(ipAddress)
                .isRevoked(false)
                .build();

        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        log.info("Created refresh token for user: {} from IP: {}", user.getUsername(), ipAddress);
        
        return saved;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByTokenAndIsRevokedFalse(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public void revokeToken(String token) {
        refreshTokenRepository.revokeByToken(token, OffsetDateTime.now());
        log.info("Revoked refresh token: {}", token.substring(0, 10) + "...");
    }

    public void revokeAllUserTokens(User user) {
        refreshTokenRepository.revokeAllByUser(user, OffsetDateTime.now());
        log.info("Revoked all refresh tokens for user: {}", user.getUsername());
    }

    public List<RefreshToken> getActiveTokensByUser(User user) {
        return refreshTokenRepository.findByUserAndIsRevokedFalse(user);
    }

    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteExpiredAndRevokedTokens(OffsetDateTime.now());
        log.debug("Cleaned up expired and revoked refresh tokens");
    }

    private void cleanupExcessiveTokens(User user) {
        long activeTokenCount = refreshTokenRepository.countActiveTokensByUser(user, OffsetDateTime.now());
        
        if (activeTokenCount >= maxActiveTokensPerUser) {
            List<RefreshToken> activeTokens = refreshTokenRepository.findByUserAndIsRevokedFalse(user);
            
            // Sort by creation date and revoke oldest tokens
            activeTokens.stream()
                    .sorted((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()))
                    .limit(activeTokenCount - maxActiveTokensPerUser + 1)
                    .forEach(token -> {
                        token.setIsRevoked(true);
                        token.setRevokedAt(OffsetDateTime.now());
                        refreshTokenRepository.save(token);
                    });
            
            log.info("Cleaned up {} excessive refresh tokens for user: {}", 
                    activeTokenCount - maxActiveTokensPerUser + 1, user.getUsername());
        }
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String extractDeviceInfo(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        if (userAgent != null && userAgent.length() > 500) {
            userAgent = userAgent.substring(0, 500);
        }
        return userAgent;
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
} 