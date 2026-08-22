package com.Chat_App.User_Services.DTO;

import com.Chat_App.User_Services.Enum.UserStatus;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PresenceUpdateRequest {

    @NotNull(message = "Status is required")
    private UserStatus status;
}
