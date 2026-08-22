package com.Chat_App.User_Services.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50)
    private String name;
    private String phoneNumber;
    @Size(max = 500)
    private String bio;
    private String profilePicture;
}
