package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.UserKeys;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserKeysRepository extends JpaRepository<UserKeys, Long> {

    Optional<UserKeys> findByUserEmail(String email);
    Boolean existsByUserEmail(String email);
    List<UserKeys> findByUserEmailIn(List<String> emails);
}
