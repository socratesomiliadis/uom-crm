package com.example.crm.controller;

import com.example.crm.dto.AuthRequest;
import com.example.crm.dto.AuthResponse;
import com.example.crm.dto.RefreshTokenRequest;
import com.example.crm.dto.UserInfoDto;
import com.example.crm.model.User;
import com.example.crm.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest) {
        try {
            AuthResponse response = authService.login(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for user: {}", request.getUsername(), e);
            throw e;
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {
        try {
            AuthResponse response = authService.refreshToken(request, httpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token refresh failed", e);
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "refreshToken", required = false) String refreshToken,
            @RequestParam(value = "sessionId", required = false) String sessionId) {
        try {
            authService.logout(sessionId, refreshToken);
            
            // Clear security context
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            log.error("Logout failed", e);
            return ResponseEntity.ok("Logout completed with errors");
        }
    }

    @PostMapping("/logout-all")
    public ResponseEntity<String> logoutAll() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            authService.logoutAll(username);
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok("All sessions logged out successfully");
        } catch (Exception e) {
            log.error("Logout all failed", e);
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
        try {
            // Expects JSON with username, email, passwordHash (temporarily reused for raw password)
            authService.register(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            log.error("Registration failed for user: {}", user.getUsername(), e);
            throw e;
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        // If this endpoint is reached, the token is valid (due to security filter)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Token is valid for user: " + authentication.getName());
    }

    @GetMapping("/profile")
    public ResponseEntity<UserInfoDto> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Get user from the service
        User user = authService.getUserByUsername(username);
        UserInfoDto userInfo = UserInfoDto.fromUser(user);
        
        return ResponseEntity.ok(userInfo);
    }
}
