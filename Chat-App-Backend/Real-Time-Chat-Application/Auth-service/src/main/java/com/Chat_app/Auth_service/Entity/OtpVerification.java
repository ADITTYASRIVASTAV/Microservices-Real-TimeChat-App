package com.Chat_app.Auth_service.Entity;

import com.Chat_app.Auth_service.Enum.OtpType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "otp_verification")
public class OtpVerification
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false, length = 6)
    private String otp;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType otpType;

    @Builder.Default
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

}
