package com.Chat_App.User_Services.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BulkPresenceRequest
{

    @NotEmpty(message = "Email list is required")
    private List<String> emails;
}
