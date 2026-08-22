package com.Chat_App.User_Services.Service;

import com.Chat_App.User_Services.DTO.*;

import java.util.List;

public interface UserProfileService
{

    UserProfileResponse createProfile(CreateProfileRequest request, String email);
    UserProfileResponse getMyProfile(String email);
    UserProfileResponse getProfileById(Long id);
    UserProfileResponse getProfileByEmail(String email);
    UserProfileResponse updateProfile(UpdateProfileRequest request, String email);
    void deleteProfile(String email);
    List<UserProfileResponse> getOnlineUsers();
    List<UserProfileResponse> searchUsers(String query);

}
