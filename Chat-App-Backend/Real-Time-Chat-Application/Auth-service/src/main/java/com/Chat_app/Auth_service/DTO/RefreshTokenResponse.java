package com.Chat_app.Auth_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenResponse
{
    private String accessToken;
    private String refreshToken;
    private String email;
    private String message;
    @Builder.Default
    private String tokenType = "Bearer";
}
