package com.Chat_App.User_Services.ServiceImpL;

import com.Chat_App.User_Services.DTO.BulkPresenceRequest;
import com.Chat_App.User_Services.DTO.BulkPresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceResponse;
import com.Chat_App.User_Services.DTO.PresenceUpdateRequest;
import com.Chat_App.User_Services.Entity.UserPresence;
import com.Chat_App.User_Services.Enum.UserStatus;
import com.Chat_App.User_Services.Exception.UserNotFoundException;
import com.Chat_App.User_Services.Kafka.PresenceEvent;
import com.Chat_App.User_Services.Kafka.PresenceEventProducer;
import com.Chat_App.User_Services.Repository.UserPresenceRepository;
import com.Chat_App.User_Services.Repository.UserProfileRepository;
import com.Chat_App.User_Services.Service.UserPresenceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserPresenceServiceImpl implements UserPresenceService {

    private final UserPresenceRepository userPresenceRepository;
    private final UserProfileRepository userProfileRepository;
    private final PresenceEventProducer presenceEventProducer;

    @Override
    @Transactional
    public PresenceResponse markOnline(String email) {
        UserPresence presence = userPresenceRepository.findByUserEmail(email)
                .orElseGet(() -> UserPresence.builder().userEmail(email).status(UserStatus.ONLINE).build());
        presence.setStatus(UserStatus.ONLINE);
        presence.setLastSeen(null);
        presence = userPresenceRepository.save(presence);

        userProfileRepository.findByEmail(email).ifPresent(profile -> {
            profile.setStatus(UserStatus.ONLINE);
            userProfileRepository.save(profile);
        });

        PresenceEvent event = PresenceEvent.builder()
                .userEmail(email)
                .status(UserStatus.ONLINE.name())
                .lastSeen(null)
                .updatedAt(presence.getUpdatedAt() != null ? presence.getUpdatedAt() : LocalDateTime.now())
                .build();
        presenceEventProducer.publishPresenceEvent(event);

        log.info("User online: {}", email);
        return mapToResponse(presence);
    }

    @Override
    @Transactional
    public PresenceResponse markOffline(String email) {
        UserPresence presence = userPresenceRepository.findByUserEmail(email)
                .orElseGet(() -> UserPresence.builder().userEmail(email).build());
        presence.setStatus(UserStatus.OFFLINE);
        LocalDateTime now = LocalDateTime.now();
        presence.setLastSeen(now);
        presence = userPresenceRepository.save(presence);

        userProfileRepository.findByEmail(email).ifPresent(profile -> {
            profile.setStatus(UserStatus.OFFLINE);
            userProfileRepository.save(profile);
        });

        PresenceEvent event = PresenceEvent.builder()
                .userEmail(email)
                .status(UserStatus.OFFLINE.name())
                .lastSeen(now)
                .updatedAt(now)
                .build();
        presenceEventProducer.publishPresenceEvent(event);

        log.info("User offline: {}, lastSeen: {}", email, now);
        return mapToResponse(presence);
    }

    @Override
    @Transactional
    public PresenceResponse updateStatus(PresenceUpdateRequest request, String email) {
        UserPresence presence = userPresenceRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Presence not found for: " + email));
        presence.setStatus(request.getStatus());
        if (request.getStatus() == UserStatus.OFFLINE) {
            presence.setLastSeen(LocalDateTime.now());
        }
        presence = userPresenceRepository.save(presence);

        PresenceEvent event = PresenceEvent.builder()
                .userEmail(email)
                .status(request.getStatus().name())
                .lastSeen(presence.getLastSeen())
                .updatedAt(presence.getUpdatedAt() != null ? presence.getUpdatedAt() : LocalDateTime.now())
                .build();
        presenceEventProducer.publishPresenceEvent(event);

        return mapToResponse(presence);
    }

    @Override
    public PresenceResponse getPresence(String email) {
        UserPresence presence = userPresenceRepository.findByUserEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Presence not found for: " + email));
        return mapToResponse(presence);
    }

    @Override
    public List<PresenceResponse> getAllOnlineUsers() {
        List<UserPresence> onlinePresences = userPresenceRepository.findByStatus(UserStatus.ONLINE);
        return onlinePresences.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BulkPresenceResponse getBulkPresence(BulkPresenceRequest request) {
        List<UserPresence> presences = userPresenceRepository.findByUserEmailIn(request.getEmails());
        Map<String, PresenceResponse> presenceMap = presences.stream()
                .collect(Collectors.toMap(UserPresence::getUserEmail, this::mapToResponse, (p1, p2) -> p1));
        return BulkPresenceResponse.builder().presenceMap(presenceMap).build();
    }

    private PresenceResponse mapToResponse(UserPresence presence) {
        return PresenceResponse.builder()
                .userEmail(presence.getUserEmail())
                .status(presence.getStatus())
                .lastSeen(presence.getLastSeen())
                .updatedAt(presence.getUpdatedAt())
                .build();
    }
}