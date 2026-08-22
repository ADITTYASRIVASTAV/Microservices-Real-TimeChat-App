package com.Chat_App.chat_services.Controller;

import com.Chat_App.chat_services.DTO.ChatRoomResponse;
import com.Chat_App.chat_services.DTO.MessageResponse;
import com.Chat_App.chat_services.DTO.SendMessageRequest;
import com.Chat_App.chat_services.Enum.MessageStatusEnum;
import com.Chat_App.chat_services.Service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController
{

    private final ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<MessageResponse> sendMessage(@RequestBody @Valid SendMessageRequest request,
                                                       @RequestHeader("X-User-Email") String email) {
        MessageResponse response = chatService.sendMessage(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/history/{roomId}")
    public ResponseEntity<List<MessageResponse>> getChatHistory(@PathVariable String roomId,
                                                                @RequestHeader("X-User-Email") String email) {
        List<MessageResponse> history = chatService.getChatHistory(roomId, email);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/history/{roomId}/page")
    public ResponseEntity<Page<MessageResponse>> getChatHistoryPaginated(
            @PathVariable String roomId,
            @RequestHeader("X-User-Email") String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        Page<MessageResponse> pageResult = chatService.getChatHistoryPaginated(roomId, email, pageable);
        return ResponseEntity.ok(pageResult);
    }

    @PutMapping("/read/{roomId}")
    public ResponseEntity<Void> markRoomAsRead(@PathVariable String roomId,
                                               @RequestHeader("X-User-Email") String email) {
        chatService.markRoomAsRead(roomId, email);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read/message/{id}")
    public ResponseEntity<Void> markMessageAsRead(@PathVariable Long id,
                                                  @RequestHeader("X-User-Email") String email) {
        chatService.markMessageAsRead(id, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status/{messageId}")
    public ResponseEntity<MessageStatusEnum> getMessageStatus(@PathVariable Long messageId) {
        MessageStatusEnum status = chatService.getMessageStatus(messageId);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(@RequestHeader("X-User-Email") String email) {
        Long count = chatService.getUnreadCount(email);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoomResponse>> getMyChatRooms(@RequestHeader("X-User-Email") String email) {
        List<ChatRoomResponse> rooms = chatService.getMyChatRooms(email);
        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/clear/{roomId}")
    public ResponseEntity<Void> clearChatHistory(@PathVariable String roomId,
                                                @RequestHeader("X-User-Email") String email) {
        chatService.clearChatHistory(roomId, email);
        return ResponseEntity.ok().build();
    }
}
