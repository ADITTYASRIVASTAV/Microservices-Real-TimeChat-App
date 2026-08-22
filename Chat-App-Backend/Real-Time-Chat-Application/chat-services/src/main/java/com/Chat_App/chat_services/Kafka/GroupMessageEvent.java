package com.Chat_App.chat_services.Kafka;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessageEvent {

    private Long messageId;
    private Long groupId;
    private String groupName;
    private String senderEmail;
    private String content;
    private String messageType;
    private List<String> memberEmails;
    private LocalDateTime sentAt;
}