package com.Chat_App.User_Services.Repository;

import com.Chat_App.User_Services.Entity.UserPresence;
import com.Chat_App.User_Services.Enum.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPresenceRepository extends JpaRepository<UserPresence, Long> {
    Optional<UserPresence> findByUserEmail(String email);
    boolean existsByUserEmail(String email);
    List<UserPresence> findByStatus(UserStatus status);
    List<UserPresence> findByUserEmailIn(List<String> emails);
}
