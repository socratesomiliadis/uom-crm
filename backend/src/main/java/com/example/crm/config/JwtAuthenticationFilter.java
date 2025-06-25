package com.example.crm.config;

import com.example.crm.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;

    public JwtAuthenticationFilter(
            JwtTokenProvider tokenProvider, 
            CustomUserDetailsService userDetailsService,
            AuthService authService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;
            String sessionId = null;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                
                if (tokenProvider.validateAccessToken(token)) {
                    username = tokenProvider.getUsernameFromAccessToken(token);
                    sessionId = tokenProvider.getSessionIdFromToken(token);
                    
                    // Validate session if sessionId is present
                    if (sessionId != null && !authService.isSessionValid(sessionId)) {
                        log.warn("Invalid session {} for user {}", sessionId, username);
                        username = null; // Invalidate authentication
                    } else if (sessionId != null) {
                        // Update session activity
                        authService.updateSessionActivity(sessionId);
                    }
                } else {
                    log.debug("Invalid access token received");
                }
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities()
                            );
                    
                    // Add additional details
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Set authentication in security context
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    log.debug("Successfully authenticated user: {} with session: {}", username, sessionId);
                    
                } catch (UsernameNotFoundException e) {
                    log.warn("User not found during token validation: {}", username);
                }
            }
        } catch (Exception e) {
            log.error("Error during JWT authentication", e);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // Skip filter for public endpoints
        return path.startsWith("/api/auth/login") ||
               path.startsWith("/api/auth/register") ||
               path.startsWith("/api/auth/refresh") ||
               path.startsWith("/h2-console") ||
               path.startsWith("/actuator") ||
               path.startsWith("/swagger") ||
               path.startsWith("/api-docs");
    }
}
