package com.Chat_App.User_Services.Controller;

import com.Chat_App.User_Services.DTO.BulkPresenceRequest;
import com.Chat_App.User_Services.DTO.BulkPresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceUpdateRequest;
import com.Chat_App.User_Services.Service.UserPresenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users/presence")
@RequiredArgsConstructor
@Slf4j
public class UserPresenceController
{
    private final UserPresenceService userPresenceService;

    @PostMapping("/online")
    public ResponseEntity<PresenceResponse> markOnline(
            @RequestHeader(value = "X-User-Email", required = false) String email)
    {
        if (email == null) return ResponseEntity.badRequest().build();
        log.info("User online: {}", email);
        PresenceResponse response = userPresenceService.markOnline(email);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/offline")
    public ResponseEntity<PresenceResponse> markOffline(
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email == null) return ResponseEntity.badRequest().build();
        log.info("User offline: {}", email);
        PresenceResponse response = userPresenceService.markOffline(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/status")
    public ResponseEntity<PresenceResponse> updateStatus(
            @RequestBody @Valid PresenceUpdateRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email == null) return ResponseEntity.badRequest().build();
        PresenceResponse response = userPresenceService.updateStatus(request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{email}")
    public ResponseEntity<PresenceResponse> getPresence(@PathVariable String email) {
        PresenceResponse response = userPresenceService.getPresence(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/online-users")
    public ResponseEntity<List<PresenceResponse>> getAllOnlineUsers() {
        List<PresenceResponse> onlineUsers = userPresenceService.getAllOnlineUsers();
        return ResponseEntity.ok(onlineUsers);
    }

    @PostMapping("/bulk")
    public ResponseEntity<BulkPresenceResponse> getBulkPresence(
            @RequestBody @Valid BulkPresenceRequest request)
    {
        BulkPresenceResponse response = userPresenceService.getBulkPresence(request);
        return ResponseEntity.ok(response);
    }
}
