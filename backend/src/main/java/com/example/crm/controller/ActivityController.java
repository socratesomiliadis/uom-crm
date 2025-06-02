package com.example.crm.controller;

import com.example.crm.dto.ActivityDto;
import com.example.crm.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityDto>> getAll() {
        return ResponseEntity.ok(activityService.getAll());
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<ActivityDto>> getByContact(@PathVariable Long contactId) {
        return ResponseEntity.ok(activityService.getByContact(contactId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ActivityDto>> getPendingTasks() {
        return ResponseEntity.ok(activityService.getPendingTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ActivityDto> create(@Valid @RequestBody ActivityDto dto) {
        return ResponseEntity.ok(activityService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityDto> update(@PathVariable Long id, @Valid @RequestBody ActivityDto dto) {
        return ResponseEntity.ok(activityService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
