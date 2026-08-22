package com.Chat_App.chat_services.Controller;

import com.Chat_App.chat_services.DTO.*;
import com.Chat_App.chat_services.Service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController
{
    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponse> createGroup(@RequestBody @Valid GroupRequest request,
                                                     @RequestHeader("X-User-Email") String email) {
        GroupResponse response = groupService.createGroup(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getGroupById(@PathVariable Long id,
                                                      @RequestHeader("X-User-Email") String email) {
        GroupResponse response = groupService.getGroupById(id, email);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> updateGroup(@PathVariable Long id,
                                                     @RequestBody GroupRequest request,
                                                     @RequestHeader("X-User-Email") String email) {
        GroupResponse response = groupService.updateGroup(id, request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id,
                                            @RequestHeader("X-User-Email") String email) {
        groupService.deleteGroup(id, email);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<GroupResponse> addMembers(@PathVariable Long id,
                                                    @RequestBody @Valid GroupMemberRequest request,
                                                    @RequestHeader("X-User-Email") String email) {
        GroupResponse response = groupService.addMembers(id, request, email);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/members/{email}")
    public ResponseEntity<GroupResponse> removeMember(@PathVariable Long id,
                                                      @PathVariable("email") String memberEmail,
                                                      @RequestHeader("X-User-Email") String adminEmail) {
        GroupResponse response = groupService.removeMember(id, memberEmail, adminEmail);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveGroup(@PathVariable Long id,
                                           @RequestHeader("X-User-Email") String email) {
        groupService.leaveGroup(id, email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-groups")
    public ResponseEntity<List<GroupResponse>> getMyGroups(@RequestHeader("X-User-Email") String email) {
        List<GroupResponse> groups = groupService.getMyGroups(email);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GroupResponse>> searchGroups(@RequestParam String name) {
        List<GroupResponse> groups = groupService.searchGroups(name);
        return ResponseEntity.ok(groups);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<GroupMessageResponse> sendGroupMessage(@PathVariable Long id,
                                                                 @RequestBody @Valid GroupMessageRequest request,
                                                                 @RequestHeader("X-User-Email") String email) {
        GroupMessageResponse response = groupService.sendGroupMessage(id, request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<GroupMessageResponse>> getGroupMessages(@PathVariable Long id,
                                                                       @RequestHeader("X-User-Email") String email) {
        List<GroupMessageResponse> messages = groupService.getGroupMessages(id, email);
        return ResponseEntity.ok(messages);
    }
}
