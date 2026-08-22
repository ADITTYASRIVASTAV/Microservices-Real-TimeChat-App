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
public class MessageEventProducer
{

    private final KafkaTemplate<String, byte[]> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${kafka.topics.message}")
    private String messageTopic;

    @Value("${kafka.topics.group-message}")
    private String groupMessageTopic;

    public void publishMessageEvent(MessageEvent event) {
        CompletableFuture.runAsync(() -> {
            try {
                byte[] payload = objectMapper.writeValueAsBytes(event);
                CompletableFuture<SendResult<String, byte[]>> future =
                        kafkaTemplate.send(messageTopic, event.getReceiverEmail(), payload);
                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Message event sent successfully to topic {} for receiver: {}",
                                messageTopic, event.getReceiverEmail());
                    } else {
                        log.error("Failed to send message event to topic {} for receiver: {}",
                                messageTopic, event.getReceiverEmail(), ex);
                    }
                });
            } catch (Exception e) {
                log.error("Error serializing MessageEvent", e);
            }
        });
    }

    public void publishGroupMessageEvent(GroupMessageEvent event) {
        CompletableFuture.runAsync(() -> {
            try {
                byte[] payload = objectMapper.writeValueAsBytes(event);
                CompletableFuture<SendResult<String, byte[]>> future =
                        kafkaTemplate.send(groupMessageTopic, event.getGroupId().toString(), payload);
                future.whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Group message event sent successfully to topic {} for group: {}",
                                groupMessageTopic, event.getGroupId());
                    } else {
                        log.error("Failed to send group message event to topic {} for group: {}",
                                groupMessageTopic, event.getGroupId(), ex);
                    }
                });
            } catch (Exception e) {
                log.error("Error serializing GroupMessageEvent", e);
            }
        });
    }
}