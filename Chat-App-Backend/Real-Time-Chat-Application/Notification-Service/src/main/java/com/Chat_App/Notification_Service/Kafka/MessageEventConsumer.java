package com.Chat_App.Notification_Service.Kafka;

import com.Chat_App.Notification_Service.DTO.MessageEventDto;
import com.Chat_App.Notification_Service.DTO.NotificationResponse;
import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;
import com.Chat_App.Notification_Service.Entity.Notification;
import com.Chat_App.Notification_Service.Enum.NotificationType;
import com.Chat_App.Notification_Service.Service.NotificationService;
import com.Chat_App.Notification_Service.Service.UnreadCountService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageEventConsumer {

    private final NotificationService notificationService;
    private final UnreadCountService unreadCountService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "message-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeMessageEvent(ConsumerRecord<String, byte[]> record) {
        try {
            MessageEventDto event = objectMapper.readValue(record.value(), MessageEventDto.class);

            log.info("Message event received for: {}", event.getReceiverEmail());

            Notification notification = Notification.builder()
                    .userEmail(event.getReceiverEmail())
                    .senderEmail(event.getSenderEmail())
                    .title("New Message from " + extractLocalPart(event.getSenderEmail()))
                    .message("You have a new message")
                    .notificationType(NotificationType.NEW_MESSAGE)
                    .roomId(event.getRoomId())
                    .messageId(event.getMessageId())
                    .isRead(false)
                    .build();

            NotificationResponse response = notificationService.save(notification);
            UnreadCountResponse countResponse = unreadCountService.incrementCount(event.getReceiverEmail());

            messagingTemplate.convertAndSendToUser(event.getReceiverEmail(), "/queue/notifications", response);
            messagingTemplate.convertAndSendToUser(event.getReceiverEmail(), "/queue/unread-count", countResponse);

            log.info("Notification pushed to user: {}", event.getReceiverEmail());
        } catch (Exception e) {
            log.error("Error deserializing MessageEvent", e);
        }
    }

    private String extractLocalPart(String email) {
        if (email != null && email.contains("@")) {
            return email.substring(0, email.indexOf('@'));
        }
        return email;
    }
}