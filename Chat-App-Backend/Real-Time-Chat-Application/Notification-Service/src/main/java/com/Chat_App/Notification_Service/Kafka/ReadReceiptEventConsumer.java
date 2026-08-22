package com.Chat_App.Notification_Service.Kafka;

import com.Chat_App.Notification_Service.DTO.ReadReceiptEventDto;
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
public class ReadReceiptEventConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "read-receipt-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void consumeReadReceiptEvent(ConsumerRecord<String, byte[]> record) {
        try {
            ReadReceiptEventDto event = objectMapper.readValue(record.value(), ReadReceiptEventDto.class);
            log.info("Read receipt event received: messageId={} status={}", event.getMessageId(), event.getStatus());

            messagingTemplate.convertAndSendToUser(event.getSenderEmail(), "/queue/message-status", event);
            log.info("Read receipt pushed to sender: {}", event.getSenderEmail());
        } catch (Exception e) {
            log.error("Error processing ReadReceiptEvent", e);
        }
    }
}