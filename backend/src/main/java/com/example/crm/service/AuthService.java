package com.example.crm.service;

import com.example.crm.config.JwtTokenProvider;
import com.example.crm.dto.AuthRequest;
import com.example.crm.dto.AuthResponse;
import com.example.crm.dto.RefreshTokenRequest;
import com.example.crm.dto.UserInfoDto;
import com.example.crm.model.RefreshToken;
import com.example.crm.model.User;
import com.example.crm.model.UserSession;
import com.example.crm.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final SessionService sessionService;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       RefreshTokenService refreshTokenService,
                       SessionService sessionService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenService = refreshTokenService;
        this.sessionService = sessionService;
    }

    public AuthResponse login(AuthRequest request, HttpServletRequest httpRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Load user details
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));

            // Check if user is enabled
            if (!user.getIsEnabled()) {
                throw new BadCredentialsException("User account is disabled");
            }

            // Create session
            UserSession session = sessionService.createSession(user, httpRequest);

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user, session.getSessionId());
            RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(user, httpRequest);

            // Update user last login
            user.setLastLoginAt(OffsetDateTime.now());
            userRepository.save(user);

            OffsetDateTime issuedAt = OffsetDateTime.now();
            OffsetDateTime expiresAt = jwtTokenProvider.getExpirationFromAccessToken(accessToken);

            log.info("User {} successfully logged in from IP: {}", 
                    user.getUsername(), extractIpAddress(httpRequest));

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshTokenEntity.getToken())
                    .tokenType("Bearer")
                    .expiresIn(jwtTokenProvider.getAccessTokenValidityInMinutes() * 60)
                    .sessionId(session.getSessionId())
                    .user(UserInfoDto.fromUser(user))
                    .issuedAt(issuedAt)
                    .expiresAt(expiresAt)
                    .build();

        } catch (AuthenticationException e) {
            log.warn("Failed login attempt for username: {} from IP: {}", 
                    request.getUsername(), extractIpAddress(httpRequest));
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request, HttpServletRequest httpRequest) {
        String refreshTokenValue = request.getRefreshToken();

        // Find and validate refresh token
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        refreshToken = refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();

        // Check if user is still enabled
        if (!user.getIsEnabled()) {
            refreshTokenService.revokeToken(refreshTokenValue);
            throw new RuntimeException("User account is disabled");
        }

        // Create new session
        UserSession session = sessionService.createSession(user, httpRequest);

        // Generate new access token
        String accessToken = jwtTokenProvider.generateAccessToken(user, session.getSessionId());

        OffsetDateTime issuedAt = OffsetDateTime.now();
        OffsetDateTime expiresAt = jwtTokenProvider.getExpirationFromAccessToken(accessToken);

        log.info("Token refreshed for user: {} from IP: {}", 
                user.getUsername(), extractIpAddress(httpRequest));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue) // Keep the same refresh token
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenValidityInMinutes() * 60)
                .sessionId(session.getSessionId())
                .user(UserInfoDto.fromUser(user))
                .issuedAt(issuedAt)
                .expiresAt(expiresAt)
                .build();
    }

    public void logout(String sessionId, String refreshToken) {
        if (sessionId != null) {
            sessionService.deactivateSession(sessionId);
        }
        
        if (refreshToken != null) {
            refreshTokenService.revokeToken(refreshToken);
        }

        log.info("User logged out - Session: {}, Refresh token revoked", sessionId);
    }

    public void logoutAll(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        sessionService.deactivateAllUserSessions(user);
        refreshTokenService.revokeAllUserTokens(user);

        log.info("All sessions and tokens revoked for user: {}", username);
    }

    public User register(User user) {
        // Check uniqueness
        Optional<User> byUsername = userRepository.findByUsername(user.getUsername());
        if (byUsername.isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        Optional<User> byEmail = userRepository.findByEmail(user.getEmail());
        if (byEmail.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Check if email is valid
        if (!user.getEmail().matches("^[a-zA-Z0-9._%+-]+@curema\\.com$")) {
            throw new RuntimeException("Invalid email address. Please use a @curema.com email address.");
        }

        // Hash password
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        // Set default values
        user.setIsEnabled(true);
        user.setIsAccountNonExpired(true);
        user.setIsAccountNonLocked(true);
        user.setIsCredentialsNonExpired(true);
        user.setRole(User.Role.ADMIN);

        User savedUser = userRepository.save(user);
        log.info("New user registered: {}", savedUser.getUsername());
        
        return savedUser;
    }

    public boolean isSessionValid(String sessionId) {
        return sessionService.isSessionValid(sessionId);
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateSessionActivity(String sessionId) {
        sessionService.updateSessionActivity(sessionId);
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
