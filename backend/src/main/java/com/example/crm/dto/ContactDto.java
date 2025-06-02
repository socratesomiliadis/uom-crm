package com.example.crm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter @Setter
public class ContactDto {
    private Long id;
    private Long companyId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String jobTitle;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
