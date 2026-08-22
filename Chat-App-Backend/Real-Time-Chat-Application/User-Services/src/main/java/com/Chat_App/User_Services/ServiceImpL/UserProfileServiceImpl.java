package com.Chat_App.User_Services.ServiceImpL;

import com.Chat_App.User_Services.DTO.CreateProfileRequest;
import com.Chat_App.User_Services.DTO.UpdateProfileRequest;
import com.Chat_App.User_Services.DTO.UserProfileResponse;
import com.Chat_App.User_Services.Entity.UserPresence;
import com.Chat_App.User_Services.Entity.UserProfile;
import com.Chat_App.User_Services.Enum.UserStatus;
import com.Chat_App.User_Services.Exception.ProfileAlreadyExistsException;
import com.Chat_App.User_Services.Exception.UserNotFoundException;
import com.Chat_App.User_Services.Repository.UserPresenceRepository;
import com.Chat_App.User_Services.Repository.UserProfileRepository;
import com.Chat_App.User_Services.Service.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserPresenceRepository userPresenceRepository;

    @Override
    public UserProfileResponse createProfile(CreateProfileRequest request, String email) {
        if (userProfileRepository.existsByEmail(email)) {
            throw new ProfileAlreadyExistsException("Profile already exists for email: " + email);
        }
        UserProfile profile = UserProfile.builder()
                .email(email)
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .bio(request.getBio())
                .profilePicture(request.getProfilePicture())
                .status(UserStatus.ONLINE)
                .build();
        profile = userProfileRepository.save(profile);

        UserPresence presence = UserPresence.builder()
                .userEmail(email)
                .status(UserStatus.ONLINE)
                .build();
        userPresenceRepository.save(presence);

        log.info("Profile created for: {}", email);
        return mapToResponse(profile);
    }

    private String formatDefaultName(String email) {
        if (email == null) return "User";
        String local = email.contains("@") ? email.substring(0, email.indexOf("@")) : email;
        String clean = local.replaceAll("\\d+", "").replaceAll("[._-]", " ").trim();
        if (clean.equalsIgnoreCase("srivastavanurag") || clean.equalsIgnoreCase("anuragsrivastava")) {
            return "Anurag Srivastava";
        }
        if (clean.equalsIgnoreCase("rajshrivastav") || clean.equalsIgnoreCase("shrivastavraj")) {
            return "Raj Shrivastav";
        }
        String[] parts = clean.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                if (sb.length() > 0) sb.append(" ");
                sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1).toLowerCase());
            }
        }
        return sb.length() > 0 ? sb.toString() : local;
    }

    @Override
    public UserProfileResponse getMyProfile(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    String defaultName = formatDefaultName(email);
                    UserProfile newProfile = UserProfile.builder()
                            .email(email)
                            .name(defaultName)
                            .status(UserStatus.ONLINE)
                            .build();
                    newProfile = userProfileRepository.save(newProfile);

                    if (!userPresenceRepository.existsByUserEmail(email)) {
                        UserPresence presence = UserPresence.builder()
                                .userEmail(email)
                                .status(UserStatus.ONLINE)
                                .build();
                        userPresenceRepository.save(presence);
                    }
                    log.info("Auto-created default profile for first-time user: {}", email);
                    return newProfile;
                });
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse getProfileById(Long id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse getProfileByEmail(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseGet(() -> {
                    String defaultName = formatDefaultName(email);
                    UserProfile newProfile = UserProfile.builder()
                            .email(email)
                            .name(defaultName)
                            .status(UserStatus.ONLINE)
                            .build();
                    newProfile = userProfileRepository.save(newProfile);

                    if (!userPresenceRepository.existsByUserEmail(email)) {
                        UserPresence presence = UserPresence.builder()
                                .userEmail(email)
                                .status(UserStatus.ONLINE)
                                .build();
                        userPresenceRepository.save(presence);
                    }
                    log.info("Auto-created profile on lookup for email: {}", email);
                    return newProfile;
                });
        return mapToResponse(profile);
    }

    @Override
    public UserProfileResponse updateProfile(UpdateProfileRequest request, String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        if (request.getName() != null) profile.setName(request.getName());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getProfilePicture() != null) profile.setProfilePicture(request.getProfilePicture());
        profile = userProfileRepository.save(profile);
        log.info("Profile updated for: {}", email);
        return mapToResponse(profile);
    }

    @Override
    public void deleteProfile(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        userProfileRepository.delete(profile);
        userPresenceRepository.findByUserEmail(email).ifPresent(userPresenceRepository::delete);
        log.info("Profile deleted for: {}", email);
    }

    @Override
    public List<UserProfileResponse> getOnlineUsers() {
        List<UserProfile> onlineProfiles = userProfileRepository.findByStatus(UserStatus.ONLINE);
        return onlineProfiles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public List<UserProfileResponse> searchUsers(String query) {
        List<UserProfile> profiles = userProfileRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
        return profiles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserProfileResponse mapToResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .email(profile.getEmail())
                .name(profile.getName())
                .phoneNumber(profile.getPhoneNumber())
                .bio(profile.getBio())
                .profilePicture(profile.getProfilePicture())
                .status(profile.getStatus())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}