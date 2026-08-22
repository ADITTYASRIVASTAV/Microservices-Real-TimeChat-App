package com.Chat_app.Auth_service.Reposetry;

import com.Chat_app.Auth_service.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User , Long>
{
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
}
