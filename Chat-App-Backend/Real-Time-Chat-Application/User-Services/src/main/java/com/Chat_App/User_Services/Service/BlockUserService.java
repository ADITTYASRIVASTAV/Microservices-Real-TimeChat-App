package com.Chat_App.User_Services.Service;

import java.util.List;

public interface BlockUserService {
    void blockUser(String blockerEmail, String blockedEmail);
    void unblockUser(String blockerEmail, String blockedEmail);
    boolean isBlocked(String blockerEmail, String blockedEmail);
    List<String> getBlockedUserEmails(String blockerEmail);
}
