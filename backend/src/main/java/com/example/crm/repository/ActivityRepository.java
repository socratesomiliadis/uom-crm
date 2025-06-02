package com.example.crm.repository;

import com.example.crm.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByContactId(Long contactId);
    List<Activity> findByDueDateBeforeAndCompletedFalse(OffsetDateTime now);
}
