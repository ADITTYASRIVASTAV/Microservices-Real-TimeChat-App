package com.Chat_app.Auth_service.DTO;

import com.Chat_app.Auth_service.Enum.AuthProvider;
import com.Chat_app.Auth_service.Enum.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse
{
    private String accessToken;
    private String refreshToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long userId;
    private String name;
    private String email;
    private Role role;
    private AuthProvider provider;
    private String message;
}
