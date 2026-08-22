package com.Chat_App.chat_services.ServiceImpL;

import com.Chat_App.chat_services.DTO.ChatRoomResponse;
import com.Chat_App.chat_services.DTO.MessageResponse;
import com.Chat_App.chat_services.DTO.SendMessageRequest;
import com.Chat_App.chat_services.Entity.ChatRoom;
import com.Chat_App.chat_services.Entity.Message;
import com.Chat_App.chat_services.Entity.MessageStatus;
import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import com.Chat_App.chat_services.Enum.MessageType;
import com.Chat_App.chat_services.Kafka.MessageEvent;
import com.Chat_App.chat_services.Kafka.MessageEventProducer;
import com.Chat_App.chat_services.Repository.ChatRoomRepository;
import com.Chat_App.chat_services.Repository.MessageRepository;
import com.Chat_App.chat_services.Repository.MessageStatusRepository;
import com.Chat_App.chat_services.Service.ChatService;
import com.Chat_App.chat_services.Service.ReadReceiptService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MessageStatusRepository messageStatusRepository;
    private final MessageEventProducer messageEventProducer;
    private final ReadReceiptService readReceiptService;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, String senderEmail) {
        String roomId = generateRoomId(senderEmail, request.getReceiverEmail());

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .roomId(roomId)
                            .senderEmail(senderEmail)
                            .receiverEmail(request.getReceiverEmail())
                            .build();
                    return chatRoomRepository.save(newRoom);
                });

        Message message = Message.builder()
                .roomId(roomId)
                .senderEmail(senderEmail)
                .receiverEmail(request.getReceiverEmail())
                .content(request.getContent())
                .messageType(request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT)
                .isRead(false)
                .encrypted(request.getEncrypted() != null ? request.getEncrypted() : true)
                .sentAt(LocalDateTime.now())
                .build();
        message = messageRepository.save(message);

        MessageStatus status = MessageStatus.builder()
                .messageId(message.getId())
                .userEmail(request.getReceiverEmail())
                .status(MessageStatusEnum.SENT)
                .timestamp(LocalDateTime.now())
                .build();
        messageStatusRepository.save(status);

        MessageEvent event = MessageEvent.builder()
                .messageId(message.getId())
                .roomId(roomId)
                .senderEmail(senderEmail)
                .receiverEmail(request.getReceiverEmail())
                .content(request.getContent())
                .messageType(message.getMessageType().name())
                .sentAt(message.getSentAt())
                .build();
        messageEventProducer.publishMessageEvent(event);

        MessageResponse response = mapToMessageResponse(message, status.getStatus());
        try {
            messagingTemplate.convertAndSend("/topic/room/" + response.getRoomId(), response);
            String privacyRoomId = generateRoomId(response.getSenderEmail(), response.getReceiverEmail());
            if (privacyRoomId != null && !privacyRoomId.equals(response.getRoomId())) {
                messagingTemplate.convertAndSend("/topic/room/" + privacyRoomId, response);
            }
            log.info("WebSocket room broadcast sent to room {} and privacy room {}", response.getRoomId(), privacyRoomId);
        } catch (Exception e) {
            log.error("Failed to broadcast message to WebSocket room", e);
        }

        return response;
    }

    @Override
    public List<MessageResponse> getChatHistory(String roomId, String email) {
        List<Message> messages = messageRepository.findByRoomIdOrderBySentAtAsc(roomId);
        return messages.stream()
                .map(this::mapToMessageResponseWithStatus)
                .collect(Collectors.toList());
    }

    @Override
    public Page<MessageResponse> getChatHistoryPaginated(String roomId, String email, Pageable pageable) {
        Page<Message> page = messageRepository.findByRoomIdOrderBySentAtDesc(roomId, pageable);
        return page.map(this::mapToMessageResponseWithStatus);
    }

    @Override
    @Transactional
    public void markRoomAsRead(String roomId, String email) {
        readReceiptService.markRoomAsRead(roomId, email);
    }

    @Override
    @Transactional
    public void markMessageAsRead(Long messageId, String email) {
        readReceiptService.markAsRead(messageId, email);
    }

    @Override
    public MessageStatusEnum getMessageStatus(Long messageId) {
        return readReceiptService.getStatus(messageId);
    }

    @Override
    public Long getUnreadCount(String email) {
        List<ChatRoom> rooms = chatRoomRepository.findBySenderEmailOrReceiverEmail(email, email);
        long totalUnread = 0;
        for (ChatRoom room : rooms) {
            Long unreadInRoom = messageRepository.countByRoomIdAndIsReadFalseAndReceiverEmail(room.getRoomId(), email);
            if (unreadInRoom != null) {
                totalUnread += unreadInRoom;
            }
        }
        return totalUnread;
    }

    @Override
    public List<ChatRoomResponse> getMyChatRooms(String email) {
        List<ChatRoom> rooms = chatRoomRepository.findBySenderEmailOrReceiverEmail(email, email);
        List<ChatRoomResponse> responses = new ArrayList<>();
        for (ChatRoom room : rooms) {
            Page<Message> lastMsgPage = messageRepository.findByRoomIdOrderBySentAtDesc(room.getRoomId(), Pageable.ofSize(1));
            String lastMessage = null;
            LocalDateTime lastMessageAt = null;
            if (!lastMsgPage.isEmpty()) {
                Message last = lastMsgPage.getContent().get(0);
                lastMessage = last.getContent();
                lastMessageAt = last.getSentAt();
            }
            Long unread = messageRepository.countByRoomIdAndIsReadFalseAndReceiverEmail(room.getRoomId(), email);
            if (unread == null) unread = 0L;
            ChatRoomResponse response = ChatRoomResponse.builder()
                    .roomId(room.getRoomId())
                    .senderEmail(room.getSenderEmail())
                    .receiverEmail(room.getReceiverEmail())
                    .lastMessage(lastMessage)
                    .lastMessageAt(lastMessageAt)
                    .unreadCount(unread)
                    .createdAt(room.getCreatedAt())
                    .build();
            responses.add(response);
        }
        return responses;
    }

    @Override
    public String generateRoomId(String email1, String email2) {
        String key1 = extractPrivacyKey(email1);
        String key2 = extractPrivacyKey(email2);
        if (key1.compareTo(key2) <= 0) {
            return key1 + "_" + key2;
        } else {
            return key2 + "_" + key1;
        }
    }

    private String extractPrivacyKey(String email) {
        if (email == null) return "user000";
        String local = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        String namePart = local.replaceAll("\\d+", "").replaceAll("[._-]", "").toLowerCase();
        if (namePart.isEmpty()) namePart = "user";
        String digits = local.replaceAll("\\D+", "");
        String last3 = digits.length() >= 3 ? digits.substring(digits.length() - 3) : "000";
        return namePart + last3;
    }

    private MessageResponse mapToMessageResponseWithStatus(Message msg) {
        Optional<MessageStatus> statusOpt = messageStatusRepository.findByMessageIdAndUserEmail(msg.getId(), msg.getReceiverEmail());
        MessageStatusEnum status = statusOpt.map(MessageStatus::getStatus).orElse(MessageStatusEnum.SENT);
        return mapToMessageResponse(msg, status);
    }

    private MessageResponse mapToMessageResponse(Message msg, MessageStatusEnum status) {
        return MessageResponse.builder()
                .id(msg.getId())
                .roomId(msg.getRoomId())
                .senderEmail(msg.getSenderEmail())
                .receiverEmail(msg.getReceiverEmail())
                .content(msg.getContent())
                .messageType(msg.getMessageType())
                .status(status)
                .encrypted(msg.getEncrypted())
                .sentAt(msg.getSentAt())
                .build();
    }

    private String extractLocalPart(String email) {
        if (email == null) return "";
        int atIndex = email.indexOf('@');
        return (atIndex > 0) ? email.substring(0, atIndex) : email;
    }

    @Override
    @Transactional
    public void clearChatHistory(String roomId, String userEmail) {
        log.info("Clearing chat history for roomId: {} requested by user: {}", roomId, userEmail);
        List<Message> messages = messageRepository.findByRoomIdOrderBySentAtAsc(roomId);
        for (Message m : messages) {
            messageStatusRepository.findByMessageId(m.getId())
                    .forEach(messageStatusRepository::delete);
        }
        messageRepository.deleteByRoomId(roomId);

        try {
            MessageResponse clearSignal = MessageResponse.builder()
                    .roomId(roomId)
                    .content("CLEAR_CHAT")
                    .build();
            messagingTemplate.convertAndSend("/topic/room/" + roomId, clearSignal);
            log.info("Broadcasted CLEAR_CHAT WebSocket event to room: {}", roomId);
        } catch (Exception e) {
            log.error("Failed to broadcast CLEAR_CHAT event to room: {}", roomId, e);
        }
        log.info("Successfully deleted all messages for roomId: {}", roomId);
    }
}