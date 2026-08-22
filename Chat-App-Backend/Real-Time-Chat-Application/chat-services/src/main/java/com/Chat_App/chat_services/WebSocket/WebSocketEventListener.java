package com.Chat_App.chat_services.WebSocket;

import com.Chat_App.chat_services.FeignClient.UserServiceFeignClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener
{
    private final UserServiceFeignClient userServiceFeignClient;
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String email = (String) headers.getSessionAttributes().get("email");
        if (email != null) {
            userServiceFeignClient.markUserOnline(email);
            log.info("User connected to WebSocket: {}", email);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String email = (String) headers.getSessionAttributes().get("email");
        if (email != null) {
            userServiceFeignClient.markUserOffline(email);
            log.info("User disconnected from WebSocket: {}", email);
        }
    }
}
