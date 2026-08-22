package com.Chat_App.User_Services.Repository;

import com.Chat_App.User_Services.Entity.UserProfile;
import com.Chat_App.User_Services.Enum.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByEmail(String email);
    boolean existsByEmail(String email);
    List<UserProfile> findByStatus(UserStatus status);
    List<UserProfile> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}