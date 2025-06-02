package com.example.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
