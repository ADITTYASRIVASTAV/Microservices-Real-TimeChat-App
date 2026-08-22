package com.Chat_App.User_Services.DTO;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BulkPresenceResponse
{
    private Map<String, PresenceResponse> presenceMap;
}
