package com.Chat_app.Auth_service.ServiceImpL;

import com.Chat_app.Auth_service.Entity.OtpVerification;
import com.Chat_app.Auth_service.Enum.OtpType;
import com.Chat_app.Auth_service.Exception.OtpExpiredException;
import com.Chat_app.Auth_service.Exception.OtpInvalidException;
import com.Chat_app.Auth_service.Reposetry.OtpVerificationRepository;
import com.Chat_app.Auth_service.Service.EmailService;
import com.Chat_app.Auth_service.Service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public String generateAndSaveOtp(String email, OtpType otpType) {
        otpVerificationRepository.deleteByEmailAndOtpType(email, otpType);
        String otp = String.format("%06d", RANDOM.nextInt(1_000_000));
        OtpVerification otpEntity = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .otpType(otpType)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .isUsed(false)
                .build();
        otpVerificationRepository.save(otpEntity);
        log.info("OTP generated for email: {} with type: {}", email, otpType);
        return otp;
    }

    @Override
    @Transactional
    public boolean verifyOtp(String email, String otp, OtpType otpType) {
        OtpVerification otpEntity = otpVerificationRepository
                .findByEmailAndOtpAndOtpTypeAndIsUsedFalse(email, otp, otpType)
                .orElseThrow(() -> new OtpInvalidException("Invalid OTP"));

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpEntity.setIsUsed(true);
            otpVerificationRepository.save(otpEntity);
            throw new OtpExpiredException("OTP has expired");
        }

        otpEntity.setIsUsed(true);
        otpVerificationRepository.save(otpEntity);

        log.info("OTP verified successfully for email: {} with type: {}", email, otpType);
        return true;
    }

    @Override
    @Transactional
    public void resendOtp(String email, OtpType otpType) {
        String newOtp = generateAndSaveOtp(email, otpType);
        emailService.sendOtpEmail(email, newOtp, otpType.name());
        log.info("OTP resent to email: {} with type: {}", email, otpType);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasActiveOtp(String email, OtpType otpType) {
        return otpVerificationRepository
                .findTopByEmailAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(email, otpType)
                .map(otp -> !otp.getExpiryTime().isBefore(LocalDateTime.now()))
                .orElse(false);
    }
}