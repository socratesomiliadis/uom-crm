package com.example.crm.repository;

import com.example.crm.model.User;
import com.example.crm.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    
    Optional<UserSession> findBySessionIdAndIsActiveTrue(String sessionId);
    
    List<UserSession> findByUserAndIsActiveTrue(User user);
    
    @Modifying
    @Query("UPDATE UserSession us SET us.isActive = false WHERE us.user = :user")
    void deactivateAllByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE UserSession us SET us.isActive = false WHERE us.sessionId = :sessionId")
    void deactivateBySessionId(@Param("sessionId") String sessionId);
    
    @Modifying
    @Query("UPDATE UserSession us SET us.lastAccessedAt = :accessTime WHERE us.sessionId = :sessionId")
    void updateLastAccessedTime(@Param("sessionId") String sessionId, @Param("accessTime") OffsetDateTime accessTime);
    
    @Modifying
    @Query("DELETE FROM UserSession us WHERE us.expiredAt < :now OR us.isActive = false")
    void deleteExpiredAndInactiveSessions(@Param("now") OffsetDateTime now);
    
    @Query("SELECT COUNT(us) FROM UserSession us WHERE us.user = :user AND us.isActive = true")
    long countActiveSessionsByUser(@Param("user") User user);
} 