package com.Chat_App.API_Gateway.Config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig
{
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder)
    {
        return builder.routes()
                .route("auth-service-api", route -> route
                        .path("/api/auth/**")
                        .uri("lb://auth-service"))

                .route("auth-service-oauth2-authorize", route -> route
                        .path("/oauth2/**")
                        .uri("lb://auth-service"))

                .route("auth-service-oauth2-login", route -> route
                        .path("/login/oauth2/**")
                        .uri("lb://auth-service"))

                .route("user-service", route -> route
                        .path("/api/users/**")
                        .uri("lb://user-service"))

                .route("chat-service-chat", route -> route
                        .path("/api/chat/**")
                        .uri("lb://chat-service"))

                .route("chat-service-groups", route -> route
                        .path("/api/groups/**")
                        .uri("lb://chat-service"))

                .route("chat-service-keys", route -> route
                        .path("/api/keys/**")
                        .uri("lb://chat-service"))

                .route("notification-service", route -> route
                        .path("/api/notifications/**")
                        .uri("lb://notification-service"))

                .route("chat-websocket", route -> route
                        .path("/ws/**")
                        .uri("lb://chat-service"))

                .build();
    }
}