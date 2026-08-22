package com.Chat_App.Notification_Service.ServiceImpL;

import com.Chat_App.Notification_Service.DTO.NotificationResponse;
import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;
import com.Chat_App.Notification_Service.Entity.Notification;
import com.Chat_App.Notification_Service.Exception.NotificationNotFoundException;
import com.Chat_App.Notification_Service.Repository.NotificationRepository;
import com.Chat_App.Notification_Service.Service.NotificationService;
import com.Chat_App.Notification_Service.Service.UnreadCountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService
{
    private final NotificationRepository notificationRepository;
    private final UnreadCountService unreadCountService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public NotificationResponse save(Notification notification) {
        Notification saved = notificationRepository.save(notification);
        log.info("Notification saved for user: {}", saved.getUserEmail());
        return mapToResponse(saved);
    }

    @Override
    public List<NotificationResponse> getAllNotifications(String userEmail) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository.findByIdAndUserEmail(notificationId, userEmail)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with id: " + notificationId));
        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);
        UnreadCountResponse countResponse = unreadCountService.decrementCount(userEmail);
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/unread-count", countResponse);
        log.info("Notification {} marked as read", notificationId);
        return mapToResponse(updated);
    }

    @Override
    public void markAllAsRead(String userEmail) {
        notificationRepository.markAllAsReadByUserEmail(userEmail);
        UnreadCountResponse countResponse = unreadCountService.resetCount(userEmail);
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/unread-count", countResponse);
        log.info("All notifications marked as read for: {}", userEmail);
    }

    @Override
    public Long getUnreadCount(String userEmail) {
        return notificationRepository.countByUserEmailAndIsReadFalse(userEmail);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userEmail(notification.getUserEmail())
                .senderEmail(notification.getSenderEmail())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType())
                .isRead(notification.getIsRead())
                .roomId(notification.getRoomId())
                .messageId(notification.getMessageId())
                .groupId(notification.getGroupId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
