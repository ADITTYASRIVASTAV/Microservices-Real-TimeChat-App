package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByRoomId(String roomId);
    Boolean existsByRoomId(String roomId);
    List<ChatRoom> findBySenderEmailOrReceiverEmail(String sender, String receiver);
}
