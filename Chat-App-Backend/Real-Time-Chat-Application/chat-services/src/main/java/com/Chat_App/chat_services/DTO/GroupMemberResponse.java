package com.Chat_App.chat_services.DTO;

import com.Chat_App.chat_services.Enum.GroupRole;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMemberResponse
{
    private String userEmail;
    private GroupRole role;
    private LocalDateTime joinedAt;
}
