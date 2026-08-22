package com.Chat_App.Notification_Service.Service;

import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;

public interface UnreadCountService
{
    UnreadCountResponse incrementCount(String userEmail);
    UnreadCountResponse decrementCount(String userEmail);
    UnreadCountResponse resetCount(String userEmail);
    UnreadCountResponse getCount(String userEmail);
}
