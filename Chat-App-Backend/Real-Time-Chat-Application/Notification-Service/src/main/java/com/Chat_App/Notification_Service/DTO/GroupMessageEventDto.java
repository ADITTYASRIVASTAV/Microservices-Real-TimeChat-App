package com.Chat_App.Notification_Service.DTO;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessageEventDto
{
    private Long messageId;
    private Long groupId;
    private String groupName;
    private String senderEmail;
    private String content;
    private String messageType;
    private List<String> memberEmails;
    private LocalDateTime sentAt;
}
