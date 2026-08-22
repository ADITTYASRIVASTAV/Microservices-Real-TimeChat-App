package com.Chat_App.chat_services.Service;

import com.Chat_App.chat_services.Enum.MessageStatusEnum;

public interface ReadReceiptService
{
    void markAsRead(Long messageId, String readerEmail);
    void markRoomAsRead(String roomId, String readerEmail);
    void markAsDelivered(Long messageId, String receiverEmail);
    MessageStatusEnum getStatus(Long messageId);
}
