package com.Chat_App.Notification_Service.Repository;

import com.Chat_App.Notification_Service.Entity.Notification;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>
{
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailAndIsReadFalse(String userEmail);

    Long countByUserEmailAndIsReadFalse(String userEmail);

    Optional<Notification> findByIdAndUserEmail(Long id, String userEmail);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userEmail = :userEmail AND n.isRead = false")
    void markAllAsReadByUserEmail(@Param("userEmail") String userEmail);
}
