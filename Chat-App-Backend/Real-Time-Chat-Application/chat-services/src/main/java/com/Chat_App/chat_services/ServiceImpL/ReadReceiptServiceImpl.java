package com.Chat_App.chat_services.ServiceImpL;

import com.Chat_App.chat_services.Entity.Message;
import com.Chat_App.chat_services.Entity.MessageStatus;
import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import com.Chat_App.chat_services.Exception.MessageNotFoundException;
import com.Chat_App.chat_services.Kafka.ReadReceiptEvent;
import com.Chat_App.chat_services.Kafka.ReadReceiptEventProducer;
import com.Chat_App.chat_services.Repository.MessageRepository;
import com.Chat_App.chat_services.Repository.MessageStatusRepository;
import com.Chat_App.chat_services.Service.ReadReceiptService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReadReceiptServiceImpl implements ReadReceiptService
{
    private final MessageStatusRepository messageStatusRepository;
    private final MessageRepository messageRepository;
    private final ReadReceiptEventProducer readReceiptEventProducer;


    @Override
    @Transactional
    public void markAsRead(Long messageId, String readerEmail) {
        MessageStatus status = messageStatusRepository.findByMessageIdAndUserEmail(messageId, readerEmail)
                .orElseThrow(() -> new MessageNotFoundException("Message status not found for message " + messageId));

        if (status.getStatus() != MessageStatusEnum.READ) {
            status.setStatus(MessageStatusEnum.READ);
            messageStatusRepository.save(status);

            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new MessageNotFoundException("Message not found: " + messageId));
            message.setIsRead(true);
            messageRepository.save(message);

            ReadReceiptEvent event = ReadReceiptEvent.builder()
                    .messageId(messageId)
                    .roomId(message.getRoomId())
                    .readerEmail(readerEmail)
                    .senderEmail(message.getSenderEmail())
                    .status(MessageStatusEnum.READ.name())
                    .timestamp(LocalDateTime.now())
                    .build();
            readReceiptEventProducer.publishReadReceiptEvent(event);
            log.info("Message {} marked as READ by {}", messageId, readerEmail);
        }
    }

    @Override
    @Transactional
    public void markRoomAsRead(String roomId, String readerEmail) {
        List<Message> unreadMessages = messageRepository.findByRoomIdAndIsReadFalseAndReceiverEmail(roomId, readerEmail);
        for (Message message : unreadMessages) {
            markAsRead(message.getId(), readerEmail);  // reuses single message logic + Kafka
        }
        log.info("Room {} marked as READ for {}", roomId, readerEmail);
    }

    @Override
    @Transactional
    public void markAsDelivered(Long messageId, String receiverEmail) {
        MessageStatus status = messageStatusRepository.findByMessageIdAndUserEmail(messageId, receiverEmail)
                .orElseThrow(() -> new MessageNotFoundException("Message status not found for message " + messageId));

        if (status.getStatus() == MessageStatusEnum.SENT) {
            status.setStatus(MessageStatusEnum.DELIVERED);
            messageStatusRepository.save(status);
            log.info("Message {} marked as DELIVERED for {}", messageId, receiverEmail);
        }
    }

    @Override
    public MessageStatusEnum getStatus(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException("Message not found: " + messageId));
        String receiverEmail = message.getReceiverEmail();
        MessageStatus status = messageStatusRepository.findByMessageIdAndUserEmail(messageId, receiverEmail)
                .orElseThrow(() -> new MessageNotFoundException("Message status not found for message " + messageId));
        return status.getStatus();
    }
}
