package com.Chat_App.User_Services.DTO;


import com.Chat_App.User_Services.Enum.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private String bio;
    private String profilePicture;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
