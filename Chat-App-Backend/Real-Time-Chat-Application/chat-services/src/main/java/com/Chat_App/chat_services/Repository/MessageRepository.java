package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByRoomIdOrderBySentAtAsc(String roomId);
    Page<Message> findByRoomIdOrderBySentAtDesc(String roomId, Pageable pageable);
    List<Message> findByRoomIdAndIsReadFalseAndReceiverEmail(String roomId, String email);
    Long countByRoomIdAndIsReadFalseAndReceiverEmail(String roomId, String email);
    List<Message> findBySenderEmailOrReceiverEmail(String sender, String receiver);

    @Modifying
    @Query("DELETE FROM Message m WHERE m.roomId = :roomId")
    void deleteByRoomId(@Param("roomId") String roomId);
}
