package com.Chat_app.Auth_service.Controller;

import com.Chat_app.Auth_service.DTO.*;
import com.Chat_app.Auth_service.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/api/auth/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        log.info("OTP verification for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/api/auth/resend-otp")
    public ResponseEntity<StatusResponse> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        log.info("Resend OTP request for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.resendOtp(request));
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<StatusResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Forgot password request for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<StatusResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Reset password request with token");
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @GetMapping("/api/auth/validate-reset-token")
    public ResponseEntity<Boolean> validateResetToken(@RequestParam String token) {
        return ResponseEntity.ok(authService.validateResetToken(token));
    }

    @PostMapping("/api/auth/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request");
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}