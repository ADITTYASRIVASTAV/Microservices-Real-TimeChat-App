package com.Chat_App.chat_services.Service;

import com.Chat_App.chat_services.DTO.*;

import java.util.List;

public interface GroupService {

    GroupResponse createGroup(GroupRequest request, String creatorEmail);
    GroupResponse getGroupById(Long groupId, String email);
    GroupResponse updateGroup(Long groupId, GroupRequest request, String email);
    void deleteGroup(Long groupId, String email);
    GroupResponse addMembers(Long groupId, GroupMemberRequest request, String adminEmail);
    GroupResponse removeMember(Long groupId, String memberEmail, String adminEmail);
    void leaveGroup(Long groupId, String email);
    List<GroupResponse> getMyGroups(String email);
    List<GroupResponse> searchGroups(String name);
    GroupMessageResponse sendGroupMessage(Long groupId, GroupMessageRequest request, String senderEmail);
    List<GroupMessageResponse> getGroupMessages(Long groupId, String email);
}
