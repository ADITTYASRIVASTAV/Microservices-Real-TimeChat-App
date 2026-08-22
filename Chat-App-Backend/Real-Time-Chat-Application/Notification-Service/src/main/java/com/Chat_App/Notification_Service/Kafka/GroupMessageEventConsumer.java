package com.Chat_App.Notification_Service.Kafka;

import com.Chat_App.Notification_Service.DTO.GroupMessageEventDto;
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

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GroupMessageEventConsumer {

    private final NotificationService notificationService;
    private final UnreadCountService unreadCountService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "group-message-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeGroupMessageEvent(ConsumerRecord<String, byte[]> record) {
        try {
            GroupMessageEventDto event = objectMapper.readValue(record.value(), GroupMessageEventDto.class);
            log.info("Group message event received for group: {}", event.getGroupId());

            List<String> membersToNotify = event.getMemberEmails().stream()
                    .filter(email -> !email.equals(event.getSenderEmail()))
                    .toList();

            for (String memberEmail : membersToNotify) {
                Notification notification = Notification.builder()
                        .userEmail(memberEmail)
                        .senderEmail(event.getSenderEmail())
                        .title("New message in " + event.getGroupName())
                        .message(event.getSenderEmail() + ": " + truncateContent(event.getContent()))
                        .notificationType(NotificationType.GROUP_MESSAGE)
                        .groupId(event.getGroupId())
                        .messageId(event.getMessageId())
                        .isRead(false)
                        .build();

                NotificationResponse response = notificationService.save(notification);
                UnreadCountResponse countResponse = unreadCountService.incrementCount(memberEmail);

                messagingTemplate.convertAndSendToUser(memberEmail, "/queue/notifications", response);
                messagingTemplate.convertAndSendToUser(memberEmail, "/queue/unread-count", countResponse);
            }

            messagingTemplate.convertAndSend("/topic/group/" + event.getGroupId(), event);
            log.info("Group notifications sent to {} members", membersToNotify.size());
        } catch (Exception e) {
            log.error("Error processing GroupMessageEvent", e);
        }
    }

    private String truncateContent(String content) {
        if (content != null && content.length() > 100) {
            return content.substring(0, 100) + "...";
        }
        return content != null ? content : "";
    }
}