package com.Chat_app.Auth_service.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class OtpInvalidException extends RuntimeException
{
    public OtpInvalidException(String message)
    {
        super(message);
    }
}
