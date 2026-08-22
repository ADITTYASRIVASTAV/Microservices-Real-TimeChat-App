package com.Chat_app.Auth_service.Reposetry;

import com.Chat_app.Auth_service.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken , Long>
{
    Optional<PasswordResetToken> findByTokenAndIsUsedFalse(String token);
    Optional<PasswordResetToken> findByEmailAndIsUsedFalse(String email);
    void deleteByEmail(String email);
    Boolean existsByTokenAndIsUsedFalse(String token);
}
