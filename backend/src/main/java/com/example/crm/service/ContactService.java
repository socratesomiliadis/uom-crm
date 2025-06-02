package com.example.crm.service;

import com.example.crm.dto.ContactDto;
import com.example.crm.model.Company;
import com.example.crm.model.Contact;
import com.example.crm.repository.CompanyRepository;
import com.example.crm.repository.ContactRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContactService {
    private final ContactRepository contactRepo;
    private final CompanyRepository companyRepo;

    public ContactService(ContactRepository contactRepo, CompanyRepository companyRepo) {
        this.contactRepo = contactRepo;
        this.companyRepo = companyRepo;
    }

    public List<ContactDto> getAll() {
        return contactRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ContactDto> getByCompany(Long companyId) {
        return contactRepo.findByCompanyId(companyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ContactDto getById(Long id) {
        Contact c = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        return toDto(c);
    }

    public ContactDto create(ContactDto dto) {
        Contact c = toEntity(dto);
        c.setCreatedAt(OffsetDateTime.now());
        c.setUpdatedAt(OffsetDateTime.now());
        Contact saved = contactRepo.save(c);
        return toDto(saved);
    }

    public ContactDto update(Long id, ContactDto dto) {
        Contact existing = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setJobTitle(dto.getJobTitle());
        if (dto.getCompanyId() != null) {
            Company comp = companyRepo.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            existing.setCompany(comp);
        }
        existing.setUpdatedAt(OffsetDateTime.now());
        Contact updated = contactRepo.save(existing);
        return toDto(updated);
    }

    public void delete(Long id) {
        contactRepo.deleteById(id);
    }

    // --- Manual Mapping ---
    private ContactDto toDto(Contact c) {
        ContactDto dto = new ContactDto();
        dto.setId(c.getId());
        dto.setCompanyId(c.getCompany() != null ? c.getCompany().getId() : null);
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setEmail(c.getEmail());
        dto.setPhone(c.getPhone());
        dto.setJobTitle(c.getJobTitle());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private Contact toEntity(ContactDto dto) {
        Contact c = new Contact();
        c.setFirstName(dto.getFirstName());
        c.setLastName(dto.getLastName());
        c.setEmail(dto.getEmail());
        c.setPhone(dto.getPhone());
        c.setJobTitle(dto.getJobTitle());
        if (dto.getCompanyId() != null) {
            Company comp = companyRepo.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            c.setCompany(comp);
        }
        return c;
    }
}
