package com.Chat_App.chat_services.DTO;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupResponse
{
    private Long id;
    private String name;
    private String description;
    private String createdBy;
    private String groupPicture;
    private List<GroupMemberResponse> members;
    private Integer memberCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
