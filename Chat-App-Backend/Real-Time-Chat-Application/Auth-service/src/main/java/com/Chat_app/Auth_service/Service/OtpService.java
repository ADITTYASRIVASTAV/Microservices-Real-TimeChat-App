package com.Chat_app.Auth_service.Service;

import com.Chat_app.Auth_service.Enum.OtpType;

public interface OtpService {
    String generateAndSaveOtp(String email, OtpType otpType);
    boolean verifyOtp(String email, String otp, OtpType otpType);
    void resendOtp(String email, OtpType otpType);
    boolean hasActiveOtp(String email, OtpType otpType);
}