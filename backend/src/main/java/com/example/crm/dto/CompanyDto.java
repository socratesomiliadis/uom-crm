package com.example.crm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter @Setter
public class CompanyDto {
    private Long id;
    private String name;
    private String industry;
    private String website;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
