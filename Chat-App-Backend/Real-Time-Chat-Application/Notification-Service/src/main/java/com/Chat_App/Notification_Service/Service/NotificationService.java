package com.Chat_App.Notification_Service.Service;

import com.Chat_App.Notification_Service.DTO.NotificationResponse;
import com.Chat_App.Notification_Service.Entity.Notification;

import java.util.List;

public interface NotificationService
{
    NotificationResponse save(Notification notification);
    List<NotificationResponse> getAllNotifications(String userEmail);
    NotificationResponse markAsRead(Long notificationId, String userEmail);
    void markAllAsRead(String userEmail);
    Long getUnreadCount(String userEmail);
}
