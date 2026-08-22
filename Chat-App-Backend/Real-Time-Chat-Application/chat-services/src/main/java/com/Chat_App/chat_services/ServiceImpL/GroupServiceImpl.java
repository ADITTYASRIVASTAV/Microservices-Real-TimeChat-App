package com.Chat_App.chat_services.ServiceImpL;

import com.Chat_App.chat_services.DTO.*;
import com.Chat_App.chat_services.Entity.Group;
import com.Chat_App.chat_services.Entity.GroupMember;
import com.Chat_App.chat_services.Entity.Message;
import com.Chat_App.chat_services.Enum.GroupRole;
import com.Chat_App.chat_services.Enum.MessageType;
import com.Chat_App.chat_services.Exception.GroupNotFoundException;
import com.Chat_App.chat_services.Exception.UnauthorizedAccessException;
import com.Chat_App.chat_services.Kafka.GroupMessageEvent;
import com.Chat_App.chat_services.Kafka.MessageEventProducer;
import com.Chat_App.chat_services.Repository.GroupMemberRepository;
import com.Chat_App.chat_services.Repository.GroupRepository;
import com.Chat_App.chat_services.Repository.MessageRepository;
import com.Chat_App.chat_services.Service.GroupService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final MessageRepository messageRepository;
    private final MessageEventProducer messageEventProducer;

    @Override
    @Transactional
    public GroupResponse createGroup(GroupRequest request, String creatorEmail) {
        Group group = Group.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(creatorEmail)
                .groupPicture(request.getGroupPicture())
                .build();
        group = groupRepository.save(group);

        GroupMember creatorMember = GroupMember.builder()
                .groupId(group.getId())
                .userEmail(creatorEmail)
                .role(GroupRole.ADMIN)
                .build();
        groupMemberRepository.save(creatorMember);

        if (request.getMemberEmails() != null) {
            for (String memberEmail : request.getMemberEmails()) {
                if (!memberEmail.equals(creatorEmail) && !groupMemberRepository.existsByGroupIdAndUserEmail(group.getId(), memberEmail)) {
                    GroupMember member = GroupMember.builder()
                            .groupId(group.getId())
                            .userEmail(memberEmail)
                            .role(GroupRole.MEMBER)
                            .build();
                    groupMemberRepository.save(member);
                }
            }
        }

        List<GroupMember> allMembers = groupMemberRepository.findByGroupId(group.getId());
        return mapToGroupResponse(group, allMembers);
    }

    @Override
    public GroupResponse getGroupById(Long groupId, String email) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        if (!groupMemberRepository.existsByGroupIdAndUserEmail(groupId, email)) {
            throw new UnauthorizedAccessException("You are not a member of this group");
        }

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        return mapToGroupResponse(group, members);
    }

    @Override
    @Transactional
    public GroupResponse updateGroup(Long groupId, GroupRequest request, String email) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        GroupMember requester = groupMemberRepository.findByGroupIdAndUserEmail(groupId, email)
                .orElseThrow(() -> new UnauthorizedAccessException("You are not a member of this group"));
        if (requester.getRole() != GroupRole.ADMIN) {
            throw new UnauthorizedAccessException("Only group admin can update the group");
        }

        if (request.getName() != null) group.setName(request.getName());
        if (request.getDescription() != null) group.setDescription(request.getDescription());
        if (request.getGroupPicture() != null) group.setGroupPicture(request.getGroupPicture());
        groupRepository.save(group);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        return mapToGroupResponse(group, members);
    }

    @Override
    @Transactional
    public void deleteGroup(Long groupId, String email) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        GroupMember requester = groupMemberRepository.findByGroupIdAndUserEmail(groupId, email)
                .orElseThrow(() -> new UnauthorizedAccessException("You are not a member of this group"));
        if (requester.getRole() != GroupRole.ADMIN) {
            throw new UnauthorizedAccessException("Only group admin can delete the group");
        }

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        groupMemberRepository.deleteAll(members);
        groupRepository.delete(group);
        log.info("Group {} deleted by {}", groupId, email);
    }

    @Override
    @Transactional
    public GroupResponse addMembers(Long groupId, GroupMemberRequest request, String adminEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        GroupMember admin = groupMemberRepository.findByGroupIdAndUserEmail(groupId, adminEmail)
                .orElseThrow(() -> new UnauthorizedAccessException("You are not a member of this group"));
        if (admin.getRole() != GroupRole.ADMIN) {
            throw new UnauthorizedAccessException("Only group admin can add members");
        }

        for (String memberEmail : request.getMemberEmails()) {
            if (!groupMemberRepository.existsByGroupIdAndUserEmail(groupId, memberEmail)) {
                GroupMember newMember = GroupMember.builder()
                        .groupId(groupId)
                        .userEmail(memberEmail)
                        .role(GroupRole.MEMBER)
                        .build();
                groupMemberRepository.save(newMember);
            }
        }

        List<GroupMember> allMembers = groupMemberRepository.findByGroupId(groupId);
        return mapToGroupResponse(group, allMembers);
    }

    @Override
    @Transactional
    public GroupResponse removeMember(Long groupId, String memberEmail, String adminEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        GroupMember admin = groupMemberRepository.findByGroupIdAndUserEmail(groupId, adminEmail)
                .orElseThrow(() -> new UnauthorizedAccessException("You are not a member of this group"));
        if (admin.getRole() != GroupRole.ADMIN) {
            throw new UnauthorizedAccessException("Only group admin can remove members");
        }

        GroupMember toRemove = groupMemberRepository.findByGroupIdAndUserEmail(groupId, memberEmail)
                .orElseThrow(() -> new UnauthorizedAccessException("User is not a member of this group"));
        if (toRemove.getRole() == GroupRole.ADMIN) {
            throw new UnauthorizedAccessException("Cannot remove another admin");
        }

        groupMemberRepository.deleteByGroupIdAndUserEmail(groupId, memberEmail);

        List<GroupMember> allMembers = groupMemberRepository.findByGroupId(groupId);
        return mapToGroupResponse(group, allMembers);
    }

    @Override
    @Transactional
    public void leaveGroup(Long groupId, String email) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        GroupMember member = groupMemberRepository.findByGroupIdAndUserEmail(groupId, email)
                .orElseThrow(() -> new UnauthorizedAccessException("You are not a member of this group"));

        if (member.getRole() == GroupRole.ADMIN) {
            List<GroupMember> admins = groupMemberRepository.findByGroupIdAndRole(groupId, GroupRole.ADMIN);
            if (admins.size() == 1) {
                List<GroupMember> allMembers = groupMemberRepository.findByGroupId(groupId);
                groupMemberRepository.deleteAll(allMembers);
                groupRepository.delete(group);
                log.info("Last admin {} left, group {} deleted", email, groupId);
                return;
            }
        }

        groupMemberRepository.deleteByGroupIdAndUserEmail(groupId, email);
        log.info("User {} left group {}", email, groupId);
    }

    @Override
    public List<GroupResponse> getMyGroups(String email) {
        List<GroupMember> memberships = groupMemberRepository.findByUserEmail(email);
        List<GroupResponse> responses = new ArrayList<>();
        for (GroupMember membership : memberships) {
            Group group = groupRepository.findById(membership.getGroupId())
                    .orElse(null);
            if (group != null) {
                List<GroupMember> allMembers = groupMemberRepository.findByGroupId(group.getId());
                responses.add(mapToGroupResponse(group, allMembers));
            }
        }
        return responses;
    }

    @Override
    public List<GroupResponse> searchGroups(String name) {
        List<Group> groups = groupRepository.findByNameContainingIgnoreCase(name);
        return groups.stream().map(group -> {
            List<GroupMember> members = groupMemberRepository.findByGroupId(group.getId());
            return mapToGroupResponse(group, members);
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public GroupMessageResponse sendGroupMessage(Long groupId, GroupMessageRequest request, String senderEmail) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        if (!groupMemberRepository.existsByGroupIdAndUserEmail(groupId, senderEmail)) {
            throw new UnauthorizedAccessException("You are not a member of this group");
        }

        String roomId = "group_" + groupId;
        MessageType messageType = request.getMessageType() != null ? request.getMessageType() : MessageType.TEXT;
        Message message = Message.builder()
                .roomId(roomId)
                .senderEmail(senderEmail)
                .receiverEmail(null)
                .content(request.getContent())
                .messageType(messageType)
                .isRead(false)
                .encrypted(false)
                .sentAt(LocalDateTime.now())
                .build();
        message = messageRepository.save(message);

        List<GroupMember> members = groupMemberRepository.findByGroupId(groupId);
        List<String> memberEmails = members.stream()
                .map(GroupMember::getUserEmail)
                .filter(email -> !email.equals(senderEmail))
                .collect(Collectors.toList());

        GroupMessageEvent event = GroupMessageEvent.builder()
                .messageId(message.getId())
                .groupId(groupId)
                .groupName(group.getName())
                .senderEmail(senderEmail)
                .content(request.getContent())
                .messageType(message.getMessageType().name())
                .memberEmails(memberEmails)
                .sentAt(message.getSentAt())
                .build();
        messageEventProducer.publishGroupMessageEvent(event);

        return GroupMessageResponse.builder()
                .id(message.getId())
                .groupId(groupId)
                .groupName(group.getName())
                .senderEmail(senderEmail)
                .content(request.getContent())
                .messageType(message.getMessageType())
                .sentAt(message.getSentAt())
                .build();
    }

    @Override
    public List<GroupMessageResponse> getGroupMessages(Long groupId, String email) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group not found with id: " + groupId));

        if (!groupMemberRepository.existsByGroupIdAndUserEmail(groupId, email)) {
            throw new UnauthorizedAccessException("You are not a member of this group");
        }

        String roomId = "group_" + groupId;
        List<Message> messages = messageRepository.findByRoomIdOrderBySentAtAsc(roomId);

        return messages.stream()
                .map(msg -> GroupMessageResponse.builder()
                        .id(msg.getId())
                        .groupId(groupId)
                        .groupName(group.getName())
                        .senderEmail(msg.getSenderEmail())
                        .content(msg.getContent())
                        .messageType(msg.getMessageType())
                        .sentAt(msg.getSentAt())
                        .build())
                .collect(Collectors.toList());
    }

    private GroupResponse mapToGroupResponse(Group group, List<GroupMember> members) {
        List<GroupMemberResponse> memberResponses = members.stream()
                .map(member -> GroupMemberResponse.builder()
                        .userEmail(member.getUserEmail())
                        .role(member.getRole())
                        .joinedAt(member.getJoinedAt())
                        .build())
                .collect(Collectors.toList());

        return GroupResponse.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .createdBy(group.getCreatedBy())
                .groupPicture(group.getGroupPicture())
                .members(memberResponses)
                .memberCount(members.size())
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .build();
    }
}