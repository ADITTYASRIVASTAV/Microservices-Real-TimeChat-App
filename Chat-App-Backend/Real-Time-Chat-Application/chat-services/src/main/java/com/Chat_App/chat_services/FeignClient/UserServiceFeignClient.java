package com.Chat_App.chat_services.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", path = "/api/users/presence")
public interface UserServiceFeignClient
{
    @PostMapping("/online")
    void markUserOnline(@RequestHeader("X-User-Email") String email);

    @PostMapping("/offline")
    void markUserOffline(@RequestHeader("X-User-Email") String email);
}
