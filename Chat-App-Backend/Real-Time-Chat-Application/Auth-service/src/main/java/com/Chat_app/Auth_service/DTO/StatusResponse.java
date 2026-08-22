package com.Chat_app.Auth_service.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatusResponse
{
    private boolean success;
    private String message;
}
