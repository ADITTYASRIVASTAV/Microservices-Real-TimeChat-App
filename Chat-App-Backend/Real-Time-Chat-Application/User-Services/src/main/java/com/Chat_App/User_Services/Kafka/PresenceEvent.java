package com.Chat_App.User_Services.Kafka;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresenceEvent
{
    private String userEmail;
    private String status;
    private LocalDateTime lastSeen;
    private LocalDateTime updatedAt;
}
