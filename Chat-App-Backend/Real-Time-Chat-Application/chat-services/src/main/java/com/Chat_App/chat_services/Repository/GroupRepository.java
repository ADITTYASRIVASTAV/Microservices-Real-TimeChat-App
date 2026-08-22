package com.Chat_App.chat_services.Repository;

import com.Chat_App.chat_services.Entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long>
{

    List<Group> findByNameContainingIgnoreCase(String name);
    List<Group> findByCreatedBy(String email);
}
