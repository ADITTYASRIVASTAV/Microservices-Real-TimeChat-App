package com.Chat_App.chat_services.ServiceImpL;

import com.Chat_App.chat_services.DTO.KeyRequest;
import com.Chat_App.chat_services.DTO.KeyResponse;
import com.Chat_App.chat_services.Entity.UserKeys;
import com.Chat_App.chat_services.Exception.KeyNotFoundException;
import com.Chat_App.chat_services.Repository.UserKeysRepository;
import com.Chat_App.chat_services.Service.KeysService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class KeysServiceImpl implements KeysService {

    private final UserKeysRepository userKeysRepository;

    @Override
    @Transactional
    public KeyResponse uploadKey(KeyRequest request, String email) {
        if (userKeysRepository.existsByUserEmail(email)) {
            throw new IllegalArgumentException("Key already exists for user: " + email + ". Use update instead.");
        }
        UserKeys userKeys = UserKeys.builder()
                .userEmail(email)
                .publicKey(request.getPublicKey())
                .keyVersion(1)
                .build();
        userKeysRepository.save(userKeys);
        log.info("Public key uploaded for user: {}", email);
        return mapToKeyResponse(userKeys);
    }

    @Override
    public KeyResponse getKey(String email) {
        UserKeys userKeys = userKeysRepository.findByUserEmail(email)
                .orElseThrow(() -> new KeyNotFoundException("No key found for user: " + email));
        return mapToKeyResponse(userKeys);
    }

    @Override
    public List<KeyResponse> getBulkKeys(List<String> emails) {
        List<UserKeys> keys = userKeysRepository.findByUserEmailIn(emails);
        return keys.stream().map(this::mapToKeyResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KeyResponse updateKey(KeyRequest request, String email) {
        UserKeys userKeys = userKeysRepository.findByUserEmail(email)
                .orElseThrow(() -> new KeyNotFoundException("No key found for user: " + email));
        userKeys.setPublicKey(request.getPublicKey());
        userKeys.setKeyVersion(userKeys.getKeyVersion() + 1);
        userKeysRepository.save(userKeys);
        log.info("Public key updated for user: {}", email);
        return mapToKeyResponse(userKeys);
    }

    @Override
    public Boolean keyExists(String email) {
        return userKeysRepository.existsByUserEmail(email);
    }

    private KeyResponse mapToKeyResponse(UserKeys userKeys) {
        return KeyResponse.builder()
                .userEmail(userKeys.getUserEmail())
                .publicKey(userKeys.getPublicKey())
                .keyVersion(userKeys.getKeyVersion())
                .createdAt(userKeys.getCreatedAt())
                .updatedAt(userKeys.getUpdatedAt())
                .build();
    }
}