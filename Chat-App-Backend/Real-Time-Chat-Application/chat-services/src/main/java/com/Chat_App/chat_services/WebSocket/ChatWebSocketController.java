package com.Chat_App.chat_services.WebSocket;

import com.Chat_App.chat_services.DTO.MessageResponse;
import com.Chat_App.chat_services.DTO.ReadReceiptMessage;
import com.Chat_App.chat_services.DTO.SendMessageRequest;
import com.Chat_App.chat_services.DTO.WebSocketMessage;
import com.Chat_App.chat_services.Service.ChatService;
import com.Chat_App.chat_services.Service.ReadReceiptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ChatWebSocketController
{
    private final ChatService chatService;
    private final ReadReceiptService readReceiptService;
    private final SimpMessagingTemplate messagingTemplate;

//     Receive a 1‑to‑1 message from a client, save it,
//     * publish to Kafka, and broadcast to the room

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload WebSocketMessage message,
                            SimpMessageHeaderAccessor accessor) {
        String senderEmail = (String) accessor.getSessionAttributes().get("email");

        // Convert WebSocketMessage to SendMessageRequest (service expects this DTO)
        SendMessageRequest request = new SendMessageRequest();
        request.setReceiverEmail(message.getReceiverEmail());
        request.setContent(message.getContent());
        request.setMessageType(message.getMessageType());
        request.setEncrypted(message.getEncrypted() != null ? message.getEncrypted() : true);
        MessageResponse response = chatService.sendMessage(request, senderEmail);

        messagingTemplate.convertAndSend("/topic/room/" + response.getRoomId(), response);
        log.info("WebSocket message sent from {} to room {}", senderEmail, response.getRoomId());
    }

//     * Mark a single message as READ, then notify the original sender
//     * via their personal queue so the read receipt (blue tick) updates

    @MessageMapping("/chat.read")
    public void markMessageRead(@Payload ReadReceiptMessage receipt,
                                SimpMessageHeaderAccessor accessor)
    {
        String readerEmail = (String) accessor.getSessionAttributes().get("email");

        readReceiptService.markAsRead(receipt.getMessageId(), readerEmail);
        receipt.setReaderEmail(readerEmail);
        receipt.setTimestamp(LocalDateTime.now());
        messagingTemplate.convertAndSendToUser(
                receipt.getSenderEmail(),
                "/queue/message-status",
                receipt
        );
        log.info("Read receipt sent for message {}: reader={}, sender={}",
                receipt.getMessageId(), readerEmail, receipt.getSenderEmail());
    }

    @MessageMapping("/chat.opened")
    public void chatWindowOpened(@Payload WebSocketMessage message,
                                 SimpMessageHeaderAccessor accessor) {
        String readerEmail = (String) accessor.getSessionAttributes().get("email");

        // Mark the whole room as read (this internally publishes Kafka events)
        readReceiptService.markRoomAsRead(message.getRoomId(), readerEmail);
        log.info("Chat window opened by {} for room {}", readerEmail, message.getRoomId());
    }

}
