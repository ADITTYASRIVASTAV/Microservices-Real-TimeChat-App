package com.Chat_App.Notification_Service.Kafka;

import com.Chat_App.Notification_Service.DTO.PresenceEventDto;
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
public class PresenceEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "presence-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumePresenceEvent(ConsumerRecord<String, byte[]> record) {
        try {
            PresenceEventDto event = objectMapper.readValue(record.value(), PresenceEventDto.class);
            log.info("Presence event received: user={} status={}", event.getUserEmail(), event.getStatus());

            messagingTemplate.convertAndSend("/topic/presence", event);
            log.info("Presence broadcast sent for user: {}", event.getUserEmail());
        } catch (Exception e) {
            log.error("Error processing PresenceEvent", e);
        }
    }
}