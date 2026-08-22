package com.Chat_App.API_Gateway.Filter;

import com.Chat_App.API_Gateway.Utils.Jwtutils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.PathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Component
@Slf4j
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private final Jwtutils jwtUtils;
    private final PathMatcher pathMatcher;

    @Value("${gateway.public-endpoints}")
    private String[] publicEndpoints;

    public AuthenticationFilter(Jwtutils jwtUtils, PathMatcher pathMatcher) {
        this.jwtUtils = jwtUtils;
        this.pathMatcher = pathMatcher;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        for (String pattern : publicEndpoints) {
            if (pathMatcher.match(pattern.trim(), path)) {
                return chain.filter(exchange);
            }
        }
        String token = extractToken(exchange);

        if (token == null) {
            return onError(exchange, "Authorization header or token query param missing");
        }

        if (!jwtUtils.validateToken(token)) {
            return onError(exchange, "Invalid or expired token");
        }
        String email = jwtUtils.extractEmail(token);
        ServerHttpRequest mutatedRequest = exchange.getRequest()
                .mutate()
                .header("X-User-Email", email)
                .build();
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(mutatedRequest)
                .build();
        return chain.filter(mutatedExchange);
    }

    private String extractToken(ServerWebExchange exchange) {
        // 1. Check Authorization header first (for REST API calls)
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        // 2. Check query parameter (for WebSocket connections)
        String tokenParam = exchange.getRequest().getQueryParams().getFirst("token");
        if (tokenParam != null && !tokenParam.isBlank()) {
            return tokenParam;
        }

        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        String body = """
                {
                    "status":401,
                    "error":"Unauthorized",
                    "message":"%s",
                    "timestamp":"%s"
                }
                """.formatted(message, LocalDateTime.now());
        return exchange.getResponse().writeWith(
                Mono.just(
                        exchange.getResponse()
                                .bufferFactory()
                                .wrap(body.getBytes(StandardCharsets.UTF_8))
                )
        );
    }

    @Override
    public int getOrder() {
        return -1;
    }
}