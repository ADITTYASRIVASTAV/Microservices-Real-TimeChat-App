package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.MessageStatus;
import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageStatusRepository extends JpaRepository<MessageStatus, Long> {

    Optional<MessageStatus> findByMessageIdAndUserEmail(Long messageId, String userEmail);
    List<MessageStatus> findByMessageId(Long messageId);
    List<MessageStatus> findByUserEmailAndStatus(String userEmail, MessageStatusEnum status);
}
