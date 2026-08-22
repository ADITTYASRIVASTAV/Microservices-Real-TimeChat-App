package com.Chat_App.User_Services.DTO;

import com.Chat_App.User_Services.Enum.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PresenceResponse
{
    private String userEmail;
    private UserStatus status;
    private LocalDateTime lastSeen;
    private LocalDateTime updatedAt;
}
