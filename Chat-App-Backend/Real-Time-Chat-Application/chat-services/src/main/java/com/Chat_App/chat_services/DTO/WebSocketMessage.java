package com.Chat_App.chat_services.DTO;

import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import com.Chat_App.chat_services.Enum.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebSocketMessage
{
    private String type;
    private String roomId;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private Long messageId;
    private MessageStatusEnum status;
    private Boolean encrypted;
    private LocalDateTime timestamp;
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    @Builder.Default
    private Long groupId = null;
}
