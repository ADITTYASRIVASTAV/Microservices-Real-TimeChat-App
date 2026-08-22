package com.Chat_App.chat_services.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponse
{
    private String roomId;
    private String senderEmail;
    private String receiverEmail;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Long unreadCount;
    private LocalDateTime createdAt;
}
