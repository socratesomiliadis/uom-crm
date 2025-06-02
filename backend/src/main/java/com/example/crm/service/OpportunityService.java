package com.example.crm.service;

import com.example.crm.dto.OpportunityDto;
import com.example.crm.model.Contact;
import com.example.crm.model.Opportunity;
import com.example.crm.model.enums.OpportunityStage;
import com.example.crm.repository.ContactRepository;
import com.example.crm.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OpportunityService {
    private final OpportunityRepository oppRepo;
    private final ContactRepository contactRepo;

    public OpportunityService(OpportunityRepository oppRepo, ContactRepository contactRepo) {
        this.oppRepo = oppRepo;
        this.contactRepo = contactRepo;
    }

    public List<OpportunityDto> getAll() {
        return oppRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OpportunityDto> getByContact(Long contactId) {
        return oppRepo.findByContactId(contactId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OpportunityDto> getByStage(OpportunityStage stage) {
        return oppRepo.findByStage(stage).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public OpportunityDto getById(Long id) {
        Opportunity o = oppRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        return toDto(o);
    }

    public OpportunityDto create(OpportunityDto dto) {
        Opportunity o = toEntity(dto);
        o.setCreatedAt(OffsetDateTime.now());
        o.setUpdatedAt(OffsetDateTime.now());
        Opportunity saved = oppRepo.save(o);
        return toDto(saved);
    }

    public OpportunityDto update(Long id, OpportunityDto dto) {
        Opportunity existing = oppRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        existing.setTitle(dto.getTitle());
        existing.setAmount(dto.getAmount());
        existing.setStage(dto.getStage());
        existing.setCloseDate(dto.getCloseDate());
        existing.setUpdatedAt(OffsetDateTime.now());
        Opportunity updated = oppRepo.save(existing);
        return toDto(updated);
    }

    public void delete(Long id) {
        oppRepo.deleteById(id);
    }

    // --- Manual Mapping ---
    private OpportunityDto toDto(Opportunity o) {
        OpportunityDto dto = new OpportunityDto();
        dto.setId(o.getId());
        dto.setContactId(o.getContact().getId());
        dto.setTitle(o.getTitle());
        dto.setAmount(o.getAmount());
        dto.setStage(o.getStage());
        dto.setCloseDate(o.getCloseDate());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setUpdatedAt(o.getUpdatedAt());
        return dto;
    }

    private Opportunity toEntity(OpportunityDto dto) {
        Opportunity o = new Opportunity();
        o.setTitle(dto.getTitle());
        o.setAmount(dto.getAmount());
        o.setStage(dto.getStage() != null ? dto.getStage() : OpportunityStage.NEW);
        o.setCloseDate(dto.getCloseDate());
        Contact c = contactRepo.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        o.setContact(c);
        return o;
    }
}
