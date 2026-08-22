package com.Chat_app.Auth_service.Config;

import com.Chat_app.Auth_service.DTO.AuthResponse;
import com.Chat_app.Auth_service.DTO.OAuth2UserInfo;
import com.Chat_app.Auth_service.Enum.AuthProvider;
import com.Chat_app.Auth_service.Service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2SuccessHandler(@Lazy AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");
        String profilePicture = oAuth2User.getAttribute("picture");

        OAuth2UserInfo userInfo = OAuth2UserInfo.builder()
                .email(email)
                .name(name)
                .googleId(googleId)
                .profilePicture(profilePicture)
                .provider(AuthProvider.GOOGLE)
                .build();

        AuthResponse authResponse = authService.googleLogin(userInfo);

        String redirectUrl = frontendUrl + "/oauth2/callback"
                + "?accessToken=" + authResponse.getAccessToken()
                + "&refreshToken=" + authResponse.getRefreshToken()
                + "&email=" + email
                + "&name=" + name;

        log.info("OAuth2 success: email={}", email);
        response.sendRedirect(redirectUrl);
    }
}