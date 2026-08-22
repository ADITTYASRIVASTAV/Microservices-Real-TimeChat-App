package com.Chat_App.chat_services.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KeyResponse
{
    private String userEmail;
    private String publicKey;
    private Integer keyVersion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
