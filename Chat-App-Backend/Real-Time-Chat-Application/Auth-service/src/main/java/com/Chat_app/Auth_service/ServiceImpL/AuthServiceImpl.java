package com.Chat_app.Auth_service.ServiceImpL;

import com.Chat_app.Auth_service.DTO.*;
import com.Chat_app.Auth_service.Entity.PasswordResetToken;
import com.Chat_app.Auth_service.Entity.RefreshToken;
import com.Chat_app.Auth_service.Entity.User;
import com.Chat_app.Auth_service.Enum.AuthProvider;
import com.Chat_app.Auth_service.Enum.OtpType;
import com.Chat_app.Auth_service.Enum.Role;
import com.Chat_app.Auth_service.Exception.EmailAlreadyExistsException;
import com.Chat_app.Auth_service.Exception.InvalidCredentialsException;
import com.Chat_app.Auth_service.Exception.InvalidResetTokenException;
import com.Chat_app.Auth_service.Reposetry.PasswordResetTokenRepository;
import com.Chat_app.Auth_service.Reposetry.RefreshTokenRepository;
import com.Chat_app.Auth_service.Reposetry.UserRepository;
import com.Chat_app.Auth_service.Security.JwtUtils;
import com.Chat_app.Auth_service.Service.AuthService;
import com.Chat_app.Auth_service.Service.EmailService;
import com.Chat_app.Auth_service.Service.OtpService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            @Lazy AuthenticationManager authenticationManager,
            OtpService otpService,
            EmailService emailService,
            RefreshTokenRepository refreshTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.emailService = emailService;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered");
        }
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .provider(AuthProvider.LOCAL)
                .isEmailVerified(false)
                .isActive(false)
                .build();
        userRepository.save(user);
        log.info("User registered with email: {}", user.getEmail());
        String otp = otpService.generateAndSaveOtp(user.getEmail(), OtpType.EMAIL_VERIFICATION);
        emailService.sendOtpEmail(user.getEmail(), otp, OtpType.EMAIL_VERIFICATION.name());
        return AuthResponse.builder()
                .message("Registration successful. OTP sent to email. Please verify.")
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .provider(user.getProvider())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if (!user.getIsEmailVerified()) {
            throw new InvalidCredentialsException("Please verify your email first");
        }
        if (!user.getIsActive()) {
            throw new InvalidCredentialsException("Account is inactive");
        }
        return createTokenResponse(user, "Login successful");
    }

    @Override
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp(), OtpType.EMAIL_VERIFICATION)) {
            throw new InvalidCredentialsException("OTP verification failed");
        }
        user.setIsEmailVerified(true);
        user.setIsActive(true);
        userRepository.save(user);
        log.info("Email verified for: {}", user.getEmail());
        return createTokenResponse(user, "Email verified successfully");
    }

    @Override
    public StatusResponse resendOtp(ResendOtpRequest request) {
        OtpType otpType = OtpType.valueOf(request.getOtpType());
        otpService.resendOtp(request.getEmail(), otpType);
        return StatusResponse.builder()
                .success(true)
                .message("OTP resent successfully")
                .build();
    }

    @Override
    @Transactional
    public StatusResponse forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            passwordResetTokenRepository.deleteByEmail(user.getEmail());
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .email(user.getEmail())
                    .token(token)
                    .expiryTime(LocalDateTime.now().plusMinutes(15))
                    .isUsed(false)
                    .build();
            passwordResetTokenRepository.save(resetToken);
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
        log.info("Password reset requested for: {}", request.getEmail());
        return StatusResponse.builder()
                .success(true)
                .message("If the email exists, a reset link has been sent")
                .build();
    }

    @Override
    @Transactional
    public StatusResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return StatusResponse.builder()
                    .success(false)
                    .message("Passwords do not match")
                    .build();
        }
        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenAndIsUsedFalse(request.getToken())
                .orElseThrow(() -> new InvalidResetTokenException("Invalid or expired reset token"));
        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            resetToken.setIsUsed(true);
            passwordResetTokenRepository.save(resetToken);
            throw new InvalidResetTokenException("Reset token has expired");
        }
        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        refreshTokenRepository.findAllByEmailAndRevokedFalse(user.getEmail())
                .forEach(rt -> rt.setRevoked(true));
        resetToken.setIsUsed(true);
        passwordResetTokenRepository.save(resetToken);
        log.info("Password reset successful for: {}", user.getEmail());
        return StatusResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .build();
    }

    @Override
    public Boolean validateResetToken(String token) {
        return passwordResetTokenRepository.findByTokenAndIsUsedFalse(token)
                .map(t -> !t.getExpiryTime().isBefore(LocalDateTime.now()))
                .orElse(false);
    }

    @Override
    public AuthResponse googleLogin(OAuth2UserInfo userInfo) {
        return userRepository.findByEmail(userInfo.getEmail())
                .map(existingUser -> {
                    existingUser.setProfilePicture(userInfo.getProfilePicture());
                    userRepository.save(existingUser);
                    return createTokenResponse(existingUser, "Google login successful");
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(userInfo.getEmail())
                            .name(userInfo.getName())
                            .googleId(userInfo.getGoogleId())
                            .profilePicture(userInfo.getProfilePicture())
                            .provider(AuthProvider.GOOGLE)
                            .role(Role.USER)
                            .isEmailVerified(true)
                            .isActive(true)
                            .password(null)
                            .phoneNumber(null)
                            .build();
                    userRepository.save(newUser);
                    return createTokenResponse(newUser, "Google login successful");
                });
    }

    @Override
    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid refresh token"));
        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new InvalidCredentialsException("Refresh token expired");
        }
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        String newAccessToken = jwtUtils.generateAccessToken(refreshToken.getEmail());
        String newRefreshToken = jwtUtils.generateRefreshToken(refreshToken.getEmail());
        RefreshToken newRefreshTokenEntity = RefreshToken.builder()
                .email(refreshToken.getEmail())
                .token(newRefreshToken)
                .expiryDate(LocalDateTime.now().plusSeconds(jwtUtils.getRefreshTokenExpiration() / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(newRefreshTokenEntity);
        return RefreshTokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(refreshToken.getEmail())
                .message("Token refreshed successfully")
                .build();
    }

    private AuthResponse createTokenResponse(User user, String message) {
        String accessToken = jwtUtils.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .email(user.getEmail())
                .token(refreshToken)
                .expiryDate(LocalDateTime.now().plusSeconds(jwtUtils.getRefreshTokenExpiration() / 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshTokenEntity);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .message(message)
                .build();
    }
}