package com.Chat_App.User_Services.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ProfileAlreadyExistsException extends RuntimeException
{
    public ProfileAlreadyExistsException(String message)
    {
        super(message);
    }
}
