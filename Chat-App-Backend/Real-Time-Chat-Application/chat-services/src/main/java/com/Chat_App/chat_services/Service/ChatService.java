package com.Chat_App.chat_services.Service;

import com.Chat_App.chat_services.DTO.ChatRoomResponse;
import com.Chat_App.chat_services.DTO.MessageResponse;
import com.Chat_App.chat_services.DTO.SendMessageRequest;
import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService
{
    MessageResponse sendMessage(SendMessageRequest request, String senderEmail);
    List<MessageResponse> getChatHistory(String roomId, String email);
    Page<MessageResponse> getChatHistoryPaginated(String roomId, String email, Pageable pageable);
    void markRoomAsRead(String roomId, String email);
    void markMessageAsRead(Long messageId, String email);
    MessageStatusEnum getMessageStatus(Long messageId);
    Long getUnreadCount(String email);
    List<ChatRoomResponse> getMyChatRooms(String email);
    String generateRoomId(String email1, String email2);
    void clearChatHistory(String roomId, String userEmail);
}
