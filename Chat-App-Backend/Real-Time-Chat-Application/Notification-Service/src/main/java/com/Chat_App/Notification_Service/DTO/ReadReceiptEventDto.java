package com.Chat_App.Notification_Service.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadReceiptEventDto
{
    private Long messageId;
    private String roomId;
    private String readerEmail;
    private String senderEmail;
    private String status;
    private LocalDateTime timestamp;
}
