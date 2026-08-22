package com.Chat_App.chat_services.WebSocket;

import com.Chat_App.chat_services.Utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor
{
    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = null;
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            } else {
                String tokenParam = accessor.getFirstNativeHeader("token");
                if (tokenParam != null && !tokenParam.isBlank()) {
                    token = tokenParam;
                }
            }

            String email = null;
            if (token != null && jwtUtil.validateToken(token)) {
                email = jwtUtil.extractEmail(token);
            } else {
                String userHeader = accessor.getFirstNativeHeader("X-User-Email");
                if (userHeader != null && !userHeader.isBlank()) {
                    email = userHeader;
                }
            }

            if (email == null) {
                log.error("WebSocket connection rejected: missing or invalid authentication token/header");
                throw new MessageDeliveryException("Authentication failed");
            }

            final String userEmail = email;
            accessor.setUser(() -> userEmail);
            accessor.getSessionAttributes().put("email", userEmail);
            log.info("WebSocket authenticated for user: {}", userEmail);
        }

        return message;
    }
}
