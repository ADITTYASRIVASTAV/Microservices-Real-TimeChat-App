package com.Chat_App.User_Services.Service;


import com.Chat_App.User_Services.DTO.BulkPresenceRequest;
import com.Chat_App.User_Services.DTO.BulkPresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceUpdateRequest;

import java.util.List;

public interface UserPresenceService
{
    PresenceResponse markOnline(String email);
    PresenceResponse markOffline(String email);
    PresenceResponse updateStatus(PresenceUpdateRequest request, String email);
    PresenceResponse getPresence(String email);
    List<PresenceResponse> getAllOnlineUsers();
    BulkPresenceResponse getBulkPresence(BulkPresenceRequest request);
}
