package com.Chat_App.User_Services.Reposetry;

import com.Chat_App.User_Services.Entity.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {
    boolean existsByBlockerEmailAndBlockedEmail(String blockerEmail, String blockedEmail);
    Optional<BlockedUser> findByBlockerEmailAndBlockedEmail(String blockerEmail, String blockedEmail);
    List<BlockedUser> findByBlockerEmail(String blockerEmail);
    void deleteByBlockerEmailAndBlockedEmail(String blockerEmail, String blockedEmail);
}
