package com.Chat_app.Auth_service.Service;

public interface EmailService
{
    void sendOtpEmail(String email, String otp, String otpType);
    void sendPasswordResetEmail(String email, String resetLink);
}
