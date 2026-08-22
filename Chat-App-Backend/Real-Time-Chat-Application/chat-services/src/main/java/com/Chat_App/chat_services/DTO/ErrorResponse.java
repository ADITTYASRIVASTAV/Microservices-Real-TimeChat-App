package com.Chat_App.chat_services.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse
{
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
}
