package com.example.crm.controller;

import com.example.crm.dto.OpportunityDto;
import com.example.crm.model.enums.OpportunityStage;
import com.example.crm.service.OpportunityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {
    private final OpportunityService oppService;

    public OpportunityController(OpportunityService oppService) {
        this.oppService = oppService;
    }

    @GetMapping
    public ResponseEntity<List<OpportunityDto>> getAll() {
        return ResponseEntity.ok(oppService.getAll());
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<OpportunityDto>> getByContact(@PathVariable Long contactId) {
        return ResponseEntity.ok(oppService.getByContact(contactId));
    }

    @GetMapping("/stage/{stage}")
    public ResponseEntity<List<OpportunityDto>> getByStage(@PathVariable OpportunityStage stage) {
        return ResponseEntity.ok(oppService.getByStage(stage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OpportunityDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(oppService.getById(id));
    }

    @PostMapping
    public ResponseEntity<OpportunityDto> create(@Valid @RequestBody OpportunityDto dto) {
        return ResponseEntity.ok(oppService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OpportunityDto> update(@PathVariable Long id, @Valid @RequestBody OpportunityDto dto) {
        return ResponseEntity.ok(oppService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        oppService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
