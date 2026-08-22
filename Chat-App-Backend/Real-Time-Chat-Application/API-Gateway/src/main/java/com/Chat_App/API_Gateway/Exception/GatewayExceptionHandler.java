package com.Chat_App.API_Gateway.Exception;

import org.springframework.boot.webflux.error.ErrorWebExceptionHandler;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Component
@Order(-2)
public class GatewayExceptionHandler implements ErrorWebExceptionHandler, Ordered {

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

        if (ex instanceof ResponseStatusException responseStatusException) {
            return writeErrorResponse(
                    exchange,
                    responseStatusException.getStatusCode().value(),
                    responseStatusException.getReason()
            );
        }

        return writeErrorResponse(
                exchange,
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                ex.getMessage()
        );
    }

    private Mono<Void> writeErrorResponse(ServerWebExchange exchange,
                                          int status,
                                          String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.valueOf(status));
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String error = HttpStatus.valueOf(status).getReasonPhrase();
        if (message == null || message.isBlank()) {
            message = "An unexpected error occurred";
        }

        String body = """
                {
                    "status": %d,
                    "error": "%s",
                    "message": "%s",
                    "timestamp": "%s"
                }
                """.formatted(status, error, message, LocalDateTime.now());

        return response.writeWith(
                Mono.just(response.bufferFactory()
                        .wrap(body.getBytes(StandardCharsets.UTF_8)))
        );
    }

    @Override
    public int getOrder() {
        return -2;
    }
}