package com.example.crm.config;

import com.example.crm.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
public class JwtTokenProvider {
    private final Key accessTokenKey;
    private final Key refreshTokenKey;
    private final long accessTokenValidityInMinutes;
    private final long refreshTokenValidityInDays;

    public JwtTokenProvider(
            @Value("${jwt.access-token.secret}") String accessTokenSecret,
            @Value("${jwt.refresh-token.secret}") String refreshTokenSecret,
            @Value("${jwt.access-token.expiration-minutes}") long accessTokenValidityInMinutes,
            @Value("${jwt.refresh-token.expiration-days}") long refreshTokenValidityInDays
    ) {
        this.accessTokenKey = Keys.hmacShaKeyFor(accessTokenSecret.getBytes());
        this.refreshTokenKey = Keys.hmacShaKeyFor(refreshTokenSecret.getBytes());
        this.accessTokenValidityInMinutes = accessTokenValidityInMinutes;
        this.refreshTokenValidityInDays = refreshTokenValidityInDays;
    }

    public String generateAccessToken(User user, String sessionId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("sessionId", sessionId);
        claims.put("tokenType", "access");

        Date now = new Date();
        Date expiry = new Date(now.getTime() + (accessTokenValidityInMinutes * 60 * 1000));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .setId(UUID.randomUUID().toString())
                .signWith(accessTokenKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("tokenType", "refresh");

        Date now = new Date();
        Date expiry = new Date(now.getTime() + (refreshTokenValidityInDays * 24 * 60 * 60 * 1000));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .setId(UUID.randomUUID().toString())
                .signWith(refreshTokenKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromAccessToken(String token) {
        try {
            return getClaimsFromAccessToken(token).getSubject();
        } catch (Exception e) {
            log.error("Error extracting username from access token", e);
            return null;
        }
    }

    public String getUsernameFromRefreshToken(String token) {
        try {
            return getClaimsFromRefreshToken(token).getSubject();
        } catch (Exception e) {
            log.error("Error extracting username from refresh token", e);
            return null;
        }
    }

    public String getSessionIdFromToken(String token) {
        try {
            Claims claims = getClaimsFromAccessToken(token);
            return claims.get("sessionId", String.class);
        } catch (Exception e) {
            log.error("Error extracting session ID from token", e);
            return null;
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = getClaimsFromAccessToken(token);
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            log.error("Error extracting user ID from token", e);
            return null;
        }
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = getClaimsFromAccessToken(token);
            return "access".equals(claims.get("tokenType", String.class));
        } catch (Exception e) {
            log.debug("Access token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = getClaimsFromRefreshToken(token);
            return "refresh".equals(claims.get("tokenType", String.class));
        } catch (Exception e) {
            log.debug("Refresh token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public OffsetDateTime getExpirationFromAccessToken(String token) {
        try {
            Claims claims = getClaimsFromAccessToken(token);
            return claims.getExpiration().toInstant().atOffset(OffsetDateTime.now().getOffset());
        } catch (Exception e) {
            log.error("Error extracting expiration from access token", e);
            return null;
        }
    }

    public long getAccessTokenValidityInMinutes() {
        return accessTokenValidityInMinutes;
    }

    public long getRefreshTokenValidityInDays() {
        return refreshTokenValidityInDays;
    }

    private Claims getClaimsFromAccessToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(accessTokenKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Claims getClaimsFromRefreshToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(refreshTokenKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
