package com.Chat_App.chat_services.Kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageEvent
{
    private Long messageId;
    private String roomId;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private String messageType;
    private LocalDateTime sentAt;
}
