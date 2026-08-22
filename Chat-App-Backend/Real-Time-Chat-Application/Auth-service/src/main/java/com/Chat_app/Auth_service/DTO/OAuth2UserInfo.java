package com.Chat_app.Auth_service.DTO;

import com.Chat_app.Auth_service.Enum.AuthProvider;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OAuth2UserInfo {
    private String googleId;
    private String email;
    private String name;
    private String profilePicture;
    private AuthProvider provider;
}
