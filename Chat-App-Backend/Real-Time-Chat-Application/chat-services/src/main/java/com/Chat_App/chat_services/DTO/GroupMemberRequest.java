package com.Chat_App.chat_services.DTO;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberRequest
{
    @NotEmpty(message = "At least one member email is required")
    private List<String> memberEmails;
}
