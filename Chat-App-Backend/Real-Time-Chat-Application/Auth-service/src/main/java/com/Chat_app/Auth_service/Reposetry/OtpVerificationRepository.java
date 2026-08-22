package com.Chat_app.Auth_service.Reposetry;

import com.Chat_app.Auth_service.Entity.OtpVerification;
import com.Chat_app.Auth_service.Enum.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findByEmailAndOtpAndOtpTypeAndIsUsedFalse(
            String email,
            String otp,
            OtpType otpType
    );

    Optional<OtpVerification> findTopByEmailAndOtpTypeAndIsUsedFalseOrderByCreatedAtDesc(
            String email,
            OtpType otpType
    );

    void deleteByEmailAndOtpType(
            String email,
            OtpType otpType
    );

    Boolean existsByEmailAndOtpTypeAndIsUsedFalse(
            String email,
            OtpType otpType
    );
}