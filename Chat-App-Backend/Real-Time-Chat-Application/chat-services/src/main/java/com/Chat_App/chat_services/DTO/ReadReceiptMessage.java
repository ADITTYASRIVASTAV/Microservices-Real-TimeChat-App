package com.Chat_App.chat_services.DTO;

import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReadReceiptMessage
{
    private Long messageId;
    private String roomId;
    private String readerEmail;
    private String senderEmail;
    private MessageStatusEnum status;
    private LocalDateTime timestamp;
}
