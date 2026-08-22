package com.Chat_App.Notification_Service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnreadCountResponse
{
    private String userEmail;
    private Long count;
}
