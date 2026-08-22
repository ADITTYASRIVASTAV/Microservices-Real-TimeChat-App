package com.Chat_app.Auth_service.Reposetry;

import com.Chat_app.Auth_service.Entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenAndRevokedFalse(String token);

    void deleteByEmail(String email);

    List<RefreshToken> findAllByEmailAndRevokedFalse(String email);
}