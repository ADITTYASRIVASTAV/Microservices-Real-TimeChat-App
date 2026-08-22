package com.Chat_App.Notification_Service.DTO;

import com.Chat_App.Notification_Service.Enum.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse
{
    private Long id;
    private String userEmail;
    private String senderEmail;
    private String title;
    private String message;
    private NotificationType notificationType;
    private Boolean isRead;
    private String roomId;
    private Long messageId;
    private Long groupId;
    private LocalDateTime createdAt;
}
