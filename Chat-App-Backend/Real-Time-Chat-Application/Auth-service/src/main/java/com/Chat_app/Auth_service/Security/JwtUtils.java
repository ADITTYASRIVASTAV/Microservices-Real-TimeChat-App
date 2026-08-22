package com.Chat_app.Auth_service.Security;

import com.Chat_app.Auth_service.Config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtils
{
    private final JwtConfig jwtConfig;
    public String generateAccessToken(String email)
    {
        return buildToken(email, jwtConfig.getAccessTokenExpiration());
    }
    public String generateRefreshToken(String email)
    {
        return buildToken(email, jwtConfig.getRefreshTokenExpiration());
    }
    public long getRefreshTokenExpiration()
    {
        return jwtConfig.getRefreshTokenExpiration();
    }
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    public String extractEmail(String token)
    {
        return parseClaims(token).getSubject();
    }
    public Date extractExpiration(String token)
    {
        return parseClaims(token).getExpiration();
    }
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private String buildToken(String email, long expiration) {
        Date now = new Date();
        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getJwtSecret().getBytes());
    }
}
