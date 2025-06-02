package com.example.crm.controller;

import com.example.crm.dto.AuthRequest;
import com.example.crm.dto.AuthResponse;
import com.example.crm.model.User;
import com.example.crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
        // Expects JSON with username, email, passwordHash (temporarily reused for raw password),
        // role will be set by the service.
        authService.register(user);
        return ResponseEntity.ok("User registered successfully");
    }
}
