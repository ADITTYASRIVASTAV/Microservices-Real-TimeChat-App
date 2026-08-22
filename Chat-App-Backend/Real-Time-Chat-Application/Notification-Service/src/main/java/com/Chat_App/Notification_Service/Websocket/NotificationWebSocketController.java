package com.Chat_App.Notification_Service.Websocket;

import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;
import com.Chat_App.Notification_Service.Service.UnreadCountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@Slf4j
@RequiredArgsConstructor
public class NotificationWebSocketController {

    private final UnreadCountService unreadCountService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/notification.getUnread")
    public void getUnreadCount(SimpMessageHeaderAccessor headerAccessor) {
        Map<String, Object> sessionAttributes = headerAccessor.getSessionAttributes();
        if (sessionAttributes == null) {
            log.warn("Session attributes are null");
            return;
        }

        String userEmail = (String) sessionAttributes.get("userEmail");
        if (userEmail == null) {
            log.warn("User email not found in WebSocket session attributes");
            return;
        }

        UnreadCountResponse response = unreadCountService.getCount(userEmail);
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/unread-count", response);
        log.info("Unread count sent to user: {}", userEmail);
    }
}