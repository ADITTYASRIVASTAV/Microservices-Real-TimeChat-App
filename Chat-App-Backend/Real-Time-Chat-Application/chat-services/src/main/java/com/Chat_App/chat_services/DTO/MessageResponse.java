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
public class MessageResponse
{
    private Long id;
    private String roomId;
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private MessageType messageType;
    private MessageStatusEnum status;
    private Boolean encrypted;
    private LocalDateTime sentAt;
}
