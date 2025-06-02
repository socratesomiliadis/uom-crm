package com.example.crm.repository;

import com.example.crm.model.Opportunity;
import com.example.crm.model.enums.OpportunityStage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByContactId(Long contactId);
    List<Opportunity> findByStage(OpportunityStage stage);
}
