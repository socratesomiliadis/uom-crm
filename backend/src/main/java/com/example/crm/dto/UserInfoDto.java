package com.example.crm.dto;

import com.example.crm.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

@Getter @AllArgsConstructor @Builder
public class UserInfoDto {
    private Long id;
    private String username;
    private String email;
    private User.Role role;
    private OffsetDateTime lastLoginAt;
    private OffsetDateTime createdAt;

    public static UserInfoDto fromUser(User user) {
        return UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
} 