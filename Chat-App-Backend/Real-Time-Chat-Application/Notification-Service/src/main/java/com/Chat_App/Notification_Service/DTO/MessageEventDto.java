package com.Chat_App.Notification_Service.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageEventDto
{
    private Long messageId;
    private String roomId;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private String messageType;
    private LocalDateTime sentAt;
}
