package com.Chat_app.Auth_service.Service;

import com.Chat_app.Auth_service.DTO.*;
import com.Chat_app.Auth_service.Exception.InvalidCredentialsException;

public interface AuthService
{
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse verifyOtp(VerifyOtpRequest request);
    StatusResponse resendOtp(ResendOtpRequest request);
    StatusResponse forgotPassword(ForgotPasswordRequest request);
    StatusResponse resetPassword(ResetPasswordRequest request);
    Boolean validateResetToken(String token);
    AuthResponse googleLogin(OAuth2UserInfo userInfo);
    RefreshTokenResponse refreshToken(RefreshTokenRequest request);
}
