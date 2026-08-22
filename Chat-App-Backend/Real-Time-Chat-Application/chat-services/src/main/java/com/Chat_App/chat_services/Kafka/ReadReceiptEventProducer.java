package com.Chat_App.chat_services.Kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReadReceiptEventProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.read-receipt}")
    private String readReceiptTopic;

    public void publishReadReceiptEvent(ReadReceiptEvent event) {
        CompletableFuture.runAsync(() -> {
            try {
                byte[] payload = objectMapper.writeValueAsBytes(event);
                CompletableFuture<SendResult<String, byte[]>> future =
                        kafkaTemplate.send(readReceiptTopic, event.getSenderEmail(), payload);
                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Read receipt event sent successfully to topic {} for sender: {}",
                                readReceiptTopic, event.getSenderEmail());
                    } else {
                        log.error("Failed to send read receipt event to topic {} for sender: {}",
                                readReceiptTopic, event.getSenderEmail(), ex);
                    }
                });
            } catch (Exception e) {
                log.error("Error serializing ReadReceiptEvent", e);
            }
        });
    }
}