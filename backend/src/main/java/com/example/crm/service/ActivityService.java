package com.example.crm.service;

import com.example.crm.dto.ActivityDto;
import com.example.crm.model.Activity;
import com.example.crm.model.Contact;
import com.example.crm.model.User;
import com.example.crm.repository.ActivityRepository;
import com.example.crm.repository.ContactRepository;
import com.example.crm.repository.UserRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ActivityService {
    private final ActivityRepository activityRepo;
    private final ContactRepository contactRepo;
    private final UserRepository userRepo;

    public ActivityService(ActivityRepository activityRepo,
                           ContactRepository contactRepo,
                           UserRepository userRepo) {
        this.activityRepo = activityRepo;
        this.contactRepo = contactRepo;
        this.userRepo = userRepo;
    }

    public List<ActivityDto> getAll() {
        return activityRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ActivityDto> getByContact(Long contactId) {
        return activityRepo.findByContactId(contactId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ActivityDto> getPendingTasks() {
        OffsetDateTime now = OffsetDateTime.now();
        return activityRepo.findByDueDateBeforeAndCompletedFalse(now).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ActivityDto getById(Long id) {
        Activity a = activityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        return toDto(a);
    }

    public ActivityDto create(ActivityDto dto) {
        Activity a = toEntity(dto);
        a.setCreatedAt(OffsetDateTime.now());
        a.setUpdatedAt(OffsetDateTime.now());
        Activity saved = activityRepo.save(a);
        return toDto(saved);
    }

    public ActivityDto update(Long id, ActivityDto dto) {
        Activity existing = activityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));
        existing.setType(dto.getType());
        existing.setSubject(dto.getSubject());
        existing.setDescription(dto.getDescription());
        existing.setActivityDate(dto.getActivityDate());
        existing.setDueDate(dto.getDueDate());
        existing.setCompleted(dto.getCompleted());
        existing.setUpdatedAt(OffsetDateTime.now());
        Activity updated = activityRepo.save(existing);
        return toDto(updated);
    }

    public void delete(Long id) {
        activityRepo.deleteById(id);
    }

    // --- Manual Mapping ---
    private ActivityDto toDto(Activity a) {
        ActivityDto dto = new ActivityDto();
        dto.setId(a.getId());
        dto.setContactId(a.getContact() != null ? a.getContact().getId() : null);
        dto.setUserId(a.getUser() != null ? a.getUser().getId() : null);
        dto.setType(a.getType());
        dto.setSubject(a.getSubject());
        dto.setDescription(a.getDescription());
        dto.setActivityDate(a.getActivityDate());
        dto.setDueDate(a.getDueDate());
        dto.setCompleted(a.getCompleted());
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }

    private Activity toEntity(ActivityDto dto) {
        Activity a = new Activity();
        a.setType(dto.getType());
        a.setSubject(dto.getSubject());
        a.setDescription(dto.getDescription());
        a.setActivityDate(dto.getActivityDate() != null ? dto.getActivityDate() : OffsetDateTime.now());
        a.setDueDate(dto.getDueDate());
        a.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : false);
        if (dto.getContactId() != null) {
            Contact c = contactRepo.findById(dto.getContactId())
                    .orElseThrow(() -> new RuntimeException("Contact not found"));
            a.setContact(c);
        }
        if (dto.getUserId() != null) {
            User u = userRepo.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            a.setUser(u);
        }
        return a;
    }
}
