package com.Chat_App.chat_services.DTO;

import com.Chat_App.chat_services.Enum.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessageResponse
{
    private Long id;
    private Long groupId;
    private String groupName;
    private String senderEmail;
    private String content;
    private MessageType messageType;
    private LocalDateTime sentAt;
}
