package com.Chat_App.User_Services.ServiceImpL;

import com.Chat_App.User_Services.Entity.BlockedUser;
import com.Chat_App.User_Services.Reposetry.BlockedUserRepository;
import com.Chat_App.User_Services.Service.BlockUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockUserServiceImpl implements BlockUserService {

    private final BlockedUserRepository blockedUserRepository;

    @Override
    @Transactional
    public void blockUser(String blockerEmail, String blockedEmail) {
        if (blockerEmail.equalsIgnoreCase(blockedEmail)) {
            throw new IllegalArgumentException("You cannot block yourself");
        }
        if (!blockedUserRepository.existsByBlockerEmailAndBlockedEmail(blockerEmail, blockedEmail)) {
            BlockedUser blockedUser = BlockedUser.builder()
                    .blockerEmail(blockerEmail)
                    .blockedEmail(blockedEmail)
                    .build();
            blockedUserRepository.save(blockedUser);
            log.info("User {} blocked user {}", blockerEmail, blockedEmail);
        }
    }

    @Override
    @Transactional
    public void unblockUser(String blockerEmail, String blockedEmail) {
        blockedUserRepository.deleteByBlockerEmailAndBlockedEmail(blockerEmail, blockedEmail);
        log.info("User {} unblocked user {}", blockerEmail, blockedEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isBlocked(String blockerEmail, String blockedEmail) {
        return blockedUserRepository.existsByBlockerEmailAndBlockedEmail(blockerEmail, blockedEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getBlockedUserEmails(String blockerEmail) {
        return blockedUserRepository.findByBlockerEmail(blockerEmail)
                .stream()
                .map(BlockedUser::getBlockedEmail)
                .collect(Collectors.toList());
    }
}
