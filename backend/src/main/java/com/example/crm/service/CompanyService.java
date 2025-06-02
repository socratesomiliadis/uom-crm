package com.example.crm.service;

import com.example.crm.dto.CompanyDto;
import com.example.crm.model.Company;
import com.example.crm.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanyService {
    private final CompanyRepository companyRepo;

    public CompanyService(CompanyRepository companyRepo) {
        this.companyRepo = companyRepo;
    }

    public List<CompanyDto> getAll() {
        return companyRepo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CompanyDto getById(Long id) {
        Company c = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return toDto(c);
    }

    public CompanyDto create(CompanyDto dto) {
        Company c = toEntity(dto);
        c.setCreatedAt(OffsetDateTime.now());
        c.setUpdatedAt(OffsetDateTime.now());
        Company saved = companyRepo.save(c);
        return toDto(saved);
    }

    public CompanyDto update(Long id, CompanyDto dto) {
        Company existing = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        existing.setName(dto.getName());
        existing.setIndustry(dto.getIndustry());
        existing.setWebsite(dto.getWebsite());
        existing.setAddressLine1(dto.getAddressLine1());
        existing.setAddressLine2(dto.getAddressLine2());
        existing.setCity(dto.getCity());
        existing.setState(dto.getState());
        existing.setPostalCode(dto.getPostalCode());
        existing.setCountry(dto.getCountry());
        existing.setUpdatedAt(OffsetDateTime.now());
        Company updated = companyRepo.save(existing);
        return toDto(updated);
    }

    public void delete(Long id) {
        companyRepo.deleteById(id);
    }

    // --- Manual Mapping ---
    private CompanyDto toDto(Company c) {
        CompanyDto dto = new CompanyDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setIndustry(c.getIndustry());
        dto.setWebsite(c.getWebsite());
        dto.setAddressLine1(c.getAddressLine1());
        dto.setAddressLine2(c.getAddressLine2());
        dto.setCity(c.getCity());
        dto.setState(c.getState());
        dto.setPostalCode(c.getPostalCode());
        dto.setCountry(c.getCountry());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private Company toEntity(CompanyDto dto) {
        return Company.builder()
                .name(dto.getName())
                .industry(dto.getIndustry())
                .website(dto.getWebsite())
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .build();
    }
}
