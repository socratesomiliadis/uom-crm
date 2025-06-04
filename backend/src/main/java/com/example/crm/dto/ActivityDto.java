package com.example.crm.dto;

import com.example.crm.model.enums.ActivityType;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter @Setter
public class ActivityDto {
    private Long id;
    private Long contactId;
    private ActivityType type;
    private String subject;
    private String description;
    private OffsetDateTime activityDate;
    private OffsetDateTime dueDate;
    private Boolean completed;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
