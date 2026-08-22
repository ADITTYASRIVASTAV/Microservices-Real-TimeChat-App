package com.Chat_App.Notification_Service.ServiceImpL;

import com.Chat_App.Notification_Service.Repository.UnreadCountRepository;
import com.Chat_App.Notification_Service.DTO.UnreadCountResponse;
import com.Chat_App.Notification_Service.Entity.UnreadCount;
import com.Chat_App.Notification_Service.Service.UnreadCountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UnreadCountServiceImpl implements UnreadCountService
{
    private final UnreadCountRepository unreadCountRepository;

    @Override
    public UnreadCountResponse incrementCount(String userEmail) {
        UnreadCount unreadCount = getOrCreate(userEmail);
        unreadCount.setCount(unreadCount.getCount() + 1);
        unreadCountRepository.save(unreadCount);
        log.info("Unread count incremented for: {} → {}", userEmail, unreadCount.getCount());
        return new UnreadCountResponse(userEmail, unreadCount.getCount());
    }

    @Override
    public UnreadCountResponse decrementCount(String userEmail) {
        UnreadCount unreadCount = getOrCreate(userEmail);
        long newCount = Math.max(0, unreadCount.getCount() - 1);
        unreadCount.setCount(newCount);
        unreadCountRepository.save(unreadCount);
        log.info("Unread count decremented for: {} → {}", userEmail, newCount);
        return new UnreadCountResponse(userEmail, newCount);
    }

    @Override
    public UnreadCountResponse resetCount(String userEmail) {
        UnreadCount unreadCount = getOrCreate(userEmail);
        unreadCount.setCount(0L);
        unreadCountRepository.save(unreadCount);
        log.info("Unread count reset for: {}", userEmail);
        return new UnreadCountResponse(userEmail, 0L);
    }

    @Override
    public UnreadCountResponse getCount(String userEmail) {
        return unreadCountRepository.findByUserEmail(userEmail)
                .map(uc -> new UnreadCountResponse(uc.getUserEmail(), uc.getCount()))
                .orElse(new UnreadCountResponse(userEmail, 0L));
    }

    private UnreadCount getOrCreate(String userEmail) {
        return unreadCountRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    UnreadCount newCount = UnreadCount.builder()
                            .userEmail(userEmail)
                            .count(0L)
                            .build();
                    return unreadCountRepository.save(newCount);
                });
    }
}
