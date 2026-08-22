package com.Chat_App.Notification_Service.Repository;

import com.Chat_App.Notification_Service.Entity.UnreadCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnreadCountRepository extends JpaRepository<UnreadCount, Long>
{
    Optional<UnreadCount> findByUserEmail(String userEmail);
    Boolean existsByUserEmail(String userEmail);
}
