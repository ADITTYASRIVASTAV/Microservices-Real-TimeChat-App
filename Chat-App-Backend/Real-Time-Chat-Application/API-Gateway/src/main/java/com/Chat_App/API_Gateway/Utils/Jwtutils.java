package com.Chat_App.API_Gateway.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class Jwtutils
{
    @Value("${jwt.jwtSecret}")
    private String secretKey;

    public boolean validateToken(String token)
    {
        try{
            Claims claims = getclaims(token);

            return !isTokenExpired(claims);
        }
        catch (JwtException | IllegalArgumentException e)
        {
            return false;
        }
    }

    public String  extractEmail(String token)
    {
      Claims claims = getclaims(token);
      return claims.getSubject();
    }

    public boolean isTokenExpired(String token)
    {
        Claims claims = getclaims(token);
        return isTokenExpired(claims);
    }

    private boolean isTokenExpired(Claims claims)
    {
        Date expiration = claims.getExpiration();
        return expiration.before(new Date());
    }
    private Claims getclaims(String token)
    {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

   }
