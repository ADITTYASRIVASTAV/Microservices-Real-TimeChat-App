package com.Chat_App.chat_services.DTO;

import com.Chat_App.chat_services.Enum.MessageType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupMessageRequest
{
    @NotBlank(message = "Content cannot be empty")
    private String content;

    @Builder.Default
    private MessageType messageType = MessageType.TEXT;
}
