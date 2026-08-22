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
public class ReadReceiptEvent
{
    private Long messageId;
    private String roomId;
    private String readerEmail;
    private String senderEmail;
    private String status;
    private LocalDateTime timestamp;
}
