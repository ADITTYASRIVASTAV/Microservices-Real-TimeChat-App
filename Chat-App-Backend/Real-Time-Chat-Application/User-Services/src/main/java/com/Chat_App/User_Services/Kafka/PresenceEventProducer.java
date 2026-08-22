package com.Chat_App.User_Services.Kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PresenceEventProducer
{
    private final KafkaTemplate<String, PresenceEvent> kafkaTemplate;

    @Value("${kafka.topics.presence}")
    private String topic;

    public void publishPresenceEvent(PresenceEvent event) {
        try {
            log.info("Publishing presence event for user: {}", event.getUserEmail());
            kafkaTemplate.send(topic, event.getUserEmail(), event)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish presence event for: {}", event.getUserEmail(), ex);
                        } else {
                            log.info("Presence event published successfully for: {}", event.getUserEmail());
                        }
                    });
        } catch (Exception e) {
            log.error("Error sending presence event to Kafka for user: {}", event.getUserEmail(), e);
        }
    }
}
