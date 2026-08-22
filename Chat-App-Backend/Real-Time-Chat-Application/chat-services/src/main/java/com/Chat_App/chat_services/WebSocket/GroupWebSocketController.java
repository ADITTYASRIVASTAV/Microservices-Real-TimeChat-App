package com.Chat_App.chat_services.WebSocket;

import com.Chat_App.chat_services.DTO.GroupMessageRequest;
import com.Chat_App.chat_services.DTO.GroupMessageResponse;
import com.Chat_App.chat_services.DTO.WebSocketMessage;
import com.Chat_App.chat_services.Enum.MessageType;
import com.Chat_App.chat_services.Service.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
@RequiredArgsConstructor
public class GroupWebSocketController
{
    private final GroupService groupService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/group.send")
    public void sendGroupMessage(@Payload WebSocketMessage message,
                                 SimpMessageHeaderAccessor accessor) {
        String senderEmail = (String) accessor.getSessionAttributes().get("email");

        // Convert to GroupMessageRequest (client must send groupId in message)
        GroupMessageRequest request = new GroupMessageRequest();
        request.setContent(message.getContent());
        request.setMessageType(message.getMessageType() != null ? message.getMessageType() : MessageType.TEXT);

        // The groupId can be passed in the message (e.g., as a custom field)
        // For simplicity, we'll expect a field "groupId" in the WebSocketMessage; add it if not present.
        Long groupId = message.getGroupId();
        if (groupId == null) {
            throw new IllegalArgumentException("Group ID is required for group messages");
        }

        GroupMessageResponse response = groupService.sendGroupMessage(groupId, request, senderEmail);

        // Broadcast to the group topic so all members receive it
        messagingTemplate.convertAndSend("/topic/group/" + groupId, response);
        log.info("Group message sent to group {} by {}", groupId, senderEmail);
    }

}
