package com.example.crm.repository;

import com.example.crm.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByCompanyId(Long companyId);
}
