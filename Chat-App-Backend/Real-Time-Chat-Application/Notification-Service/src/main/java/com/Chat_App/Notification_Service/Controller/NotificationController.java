package com.Chat_App.Notification_Service.Controller;

import com.Chat_App.Notification_Service.DTO.NotificationResponse;
import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;
import com.Chat_App.Notification_Service.Service.NotificationService;
import com.Chat_App.Notification_Service.Service.UnreadCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController
{

    private final NotificationService notificationService;
    private final UnreadCountService unreadCountService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotifications(
            @RequestHeader("X-User-Email") String email) {
        log.info("Get notifications for: {}", email);
        return ResponseEntity.ok(notificationService.getAllNotifications(email));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email) {
        log.info("Mark notification {} as read for: {}", id, email);
        return ResponseEntity.ok(notificationService.markAsRead(id, email));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("X-User-Email") String email) {
        log.info("Mark all notifications as read for: {}", email);
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(
            @RequestHeader("X-User-Email") String email) {
        log.info("Get unread count for: {}", email);
        return ResponseEntity.ok(unreadCountService.getCount(email));
    }
}
