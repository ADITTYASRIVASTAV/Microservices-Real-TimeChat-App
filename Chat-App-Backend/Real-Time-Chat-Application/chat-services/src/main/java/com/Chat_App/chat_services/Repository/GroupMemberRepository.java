package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.GroupMember;
import com.Chat_App.chat_services.Enum.GroupRole;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroupId(Long groupId);
    List<GroupMember> findByUserEmail(String email);
    Optional<GroupMember> findByGroupIdAndUserEmail(Long groupId, String userEmail);
    Boolean existsByGroupIdAndUserEmail(Long groupId, String userEmail);

    @Transactional
    void deleteByGroupIdAndUserEmail(Long groupId, String userEmail);
    List<GroupMember> findByGroupIdAndRole(Long groupId, GroupRole role);
    Long countByGroupId(Long groupId);
}
