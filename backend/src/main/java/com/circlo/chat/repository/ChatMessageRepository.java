package com.circlo.chat.repository;

import com.circlo.chat.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

  @Query("SELECT m FROM ChatMessage m WHERE m.group.id = :groupId ORDER BY m.createdAt DESC")
  List<ChatMessage> findRecentMessagesByGroupId(Long groupId, Pageable pageable);

  @Query("SELECT m FROM ChatMessage m WHERE m.group.id = :groupId ORDER BY m.createdAt ASC")
  List<ChatMessage> findAllMessagesByGroupId(Long groupId);

  void deleteByGroupId(Long groupId);

}
