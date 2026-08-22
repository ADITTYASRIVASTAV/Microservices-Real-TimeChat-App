package com.Chat_App.User_Services.Controller;

import com.Chat_App.User_Services.DTO.CreateProfileRequest;
import com.Chat_App.User_Services.DTO.UpdateProfileRequest;
import com.Chat_App.User_Services.DTO.UserProfileResponse;
import com.Chat_App.User_Services.Service.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@Validated
public class UserProfileController
{
    private final UserProfileService userProfileService;

    @PostMapping("/profile")
    public ResponseEntity<UserProfileResponse> createProfile(
            @RequestBody @Valid CreateProfileRequest request,
            @RequestHeader("X-User-Email") String email) {
        log.info("Creating profile for: {}", email);
        UserProfileResponse response = userProfileService.createProfile(request, email);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @RequestHeader("X-User-Email") String email) {
        UserProfileResponse response = userProfileService.getMyProfile(email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserProfileResponse>> searchUsers(@RequestParam String query) {
        log.info("Searching users with query: {}", query);
        List<UserProfileResponse> users = userProfileService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserProfileResponse>> getOnlineUsers() {
        List<UserProfileResponse> onlineUsers = userProfileService.getOnlineUsers();
        return ResponseEntity.ok(onlineUsers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getProfileById(@PathVariable Long id) {
        UserProfileResponse response = userProfileService.getProfileById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserProfileResponse> getProfileByEmail(@PathVariable String email) {
        UserProfileResponse response = userProfileService.getProfileByEmail(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody @Valid UpdateProfileRequest request,
            @RequestHeader("X-User-Email") String email) {
        UserProfileResponse response = userProfileService.updateProfile(request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/profile")
    public ResponseEntity<Void> deleteProfile(
            @RequestHeader("X-User-Email") String email) {
        userProfileService.deleteProfile(email);
        return ResponseEntity.noContent().build();
    }
}