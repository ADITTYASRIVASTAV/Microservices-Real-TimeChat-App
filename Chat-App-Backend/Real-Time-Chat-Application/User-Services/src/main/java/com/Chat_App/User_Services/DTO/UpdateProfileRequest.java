package com.Chat_App.User_Services.DTO;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 50)
    private String name;
    private String phoneNumber;
    @Size(max = 500)
    private String bio;
    private String profilePicture;
}
