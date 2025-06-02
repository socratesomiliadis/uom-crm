package com.example.crm.dto;

import com.example.crm.model.enums.OpportunityStage;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter @Setter
public class OpportunityDto {
    private Long id;
    private Long contactId;
    private String title;
    private BigDecimal amount;
    private OpportunityStage stage;
    private LocalDate closeDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
