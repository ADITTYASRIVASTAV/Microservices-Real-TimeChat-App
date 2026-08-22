package com.Chat_App.chat_services.Entity;

import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "message_status")
public class MessageStatus
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false)
    private Long messageId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MessageStatusEnum status = MessageStatusEnum.SENT;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime timestamp;
}
