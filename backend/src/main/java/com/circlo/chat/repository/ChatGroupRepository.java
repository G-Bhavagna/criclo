package com.circlo.chat.repository;

import com.circlo.chat.entity.ChatGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatGroupRepository extends JpaRepository<ChatGroup, Long> {

  Optional<ChatGroup> findByActivityId(Long activityId);

  boolean existsByActivityId(Long activityId);

}
