package com.Chat_App.User_Services.Controller;

import com.Chat_App.User_Services.Service.BlockUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/block")
@RequiredArgsConstructor
@Slf4j
public class BlockUserController {

    private final BlockUserService blockUserService;

    @PostMapping("/{targetEmail}")
    public ResponseEntity<Map<String, String>> blockUser(
            @PathVariable("targetEmail") String targetEmail,
            @RequestHeader("X-User-Email") String currentUserEmail) {
        log.info("Request to block user {} by {}", targetEmail, currentUserEmail);
        blockUserService.blockUser(currentUserEmail, targetEmail);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User blocked successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{targetEmail}")
    public ResponseEntity<Map<String, String>> unblockUser(
            @PathVariable("targetEmail") String targetEmail,
            @RequestHeader("X-User-Email") String currentUserEmail) {
        log.info("Request to unblock user {} by {}", targetEmail, currentUserEmail);
        blockUserService.unblockUser(currentUserEmail, targetEmail);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User unblocked successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{targetEmail}")
    public ResponseEntity<Map<String, Boolean>> isBlockedStatus(
            @PathVariable("targetEmail") String targetEmail,
            @RequestHeader("X-User-Email") String currentUserEmail) {
        boolean blocked = blockUserService.isBlocked(currentUserEmail, targetEmail);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isBlocked", blocked);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> getBlockedList(
            @RequestHeader("X-User-Email") String currentUserEmail) {
        List<String> blockedList = blockUserService.getBlockedUserEmails(currentUserEmail);
        return ResponseEntity.ok(blockedList);
    }
}
