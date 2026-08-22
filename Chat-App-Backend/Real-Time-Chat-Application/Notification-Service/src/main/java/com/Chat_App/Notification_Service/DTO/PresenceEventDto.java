package com.Chat_App.Notification_Service.DTO;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresenceEventDto
{
    private String userEmail;
    private String status;
    private LocalDateTime lastSeen;
    private LocalDateTime updatedAt;
}
