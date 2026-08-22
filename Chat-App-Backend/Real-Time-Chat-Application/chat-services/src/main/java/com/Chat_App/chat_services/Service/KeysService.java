package com.Chat_App.chat_services.Service;

import com.Chat_App.chat_services.DTO.KeyRequest;
import com.Chat_App.chat_services.DTO.KeyResponse;

import java.util.List;

public interface KeysService
{
    KeyResponse uploadKey(KeyRequest request, String email);
    KeyResponse getKey(String email);
    List<KeyResponse> getBulkKeys(List<String> emails);
    KeyResponse updateKey(KeyRequest request, String email);
    Boolean keyExists(String email);
}
