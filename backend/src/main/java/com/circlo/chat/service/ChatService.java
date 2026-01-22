package com.circlo.chat.service;

import com.circlo.activity.entity.Activity;
import com.circlo.activity.repository.ActivityRepository;
import com.circlo.auth.entity.User;
import com.circlo.auth.repository.UserRepository;
import com.circlo.chat.dto.ChatGroupDTO;
import com.circlo.chat.dto.ChatMessageDTO;
import com.circlo.chat.dto.SendMessageRequest;
import com.circlo.chat.entity.ChatGroup;
import com.circlo.chat.entity.ChatMessage;
import com.circlo.chat.entity.MessageType;
import com.circlo.chat.repository.ChatGroupRepository;
import com.circlo.chat.repository.ChatMessageRepository;
import com.circlo.joinrequest.entity.JoinRequestStatus;
import com.circlo.joinrequest.repository.JoinRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

  private final ChatGroupRepository chatGroupRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final ActivityRepository activityRepository;
  private final UserRepository userRepository;
  private final JoinRequestRepository joinRequestRepository;
  private final SimpMessagingTemplate messagingTemplate;

  @Transactional
  public ChatGroup createGroupForActivity(Long activityId) {
    log.info("Creating chat group for activity: {}", activityId);

    if (chatGroupRepository.existsByActivityId(activityId)) {
      throw new RuntimeException("Chat group already exists for this activity");
    }

    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    ChatGroup group = ChatGroup.builder()
        .name(activity.getTitle() + " Chat")
        .activity(activity)
        .isActive(true)
        .build();

    group = chatGroupRepository.save(group);
    log.info("Chat group created: {}", group.getId());

    return group;
  }

  @Transactional
  public ChatMessageDTO sendMessage(Long groupId, Long userId, SendMessageRequest request) {
    log.info("User {} sending message to group {}", userId, groupId);

    ChatGroup group = chatGroupRepository.findById(groupId)
        .orElseThrow(() -> new RuntimeException("Chat group not found"));

    User sender = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Verify user is a member or owner
    if (!isUserMemberOfGroup(userId, group.getActivity().getId())) {
      throw new RuntimeException("You are not a member of this chat");
    }

    ChatMessage message = ChatMessage.builder()
        .group(group)
        .sender(sender)
        .content(request.getContent())
        .type(request.getType() != null ? MessageType.valueOf(request.getType()) : MessageType.TEXT)
        .build();

    message = chatMessageRepository.save(message);
    log.info("Message sent: {}", message.getId());

    ChatMessageDTO messageDTO = convertToDTO(message);

    // Broadcast to all subscribers
    messagingTemplate.convertAndSend("/topic/chat/" + groupId, messageDTO);

    return messageDTO;
  }

  public List<ChatMessageDTO> getGroupMessages(Long groupId, Long userId, Integer limit) {
    ChatGroup group = chatGroupRepository.findById(groupId)
        .orElseThrow(() -> new RuntimeException("Chat group not found"));

    // Verify user is a member
    if (!isUserMemberOfGroup(userId, group.getActivity().getId())) {
      throw new RuntimeException("You are not a member of this chat");
    }

    List<ChatMessage> messages;
    if (limit != null && limit > 0) {
      messages = chatMessageRepository.findRecentMessagesByGroupId(groupId, PageRequest.of(0, limit));
      // Reverse to get chronological order
      messages = messages.stream()
          .sorted((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
          .collect(Collectors.toList());
    } else {
      messages = chatMessageRepository.findAllMessagesByGroupId(groupId);
    }

    return messages.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public ChatGroupDTO getGroupByActivityId(Long activityId) {
    ChatGroup group = chatGroupRepository.findByActivityId(activityId)
        .orElseGet(() -> createGroupForActivity(activityId));
    return convertGroupToDTO(group);
  }

  @Transactional
  public void deleteGroupByActivityId(Long activityId) {
    log.info("Deleting chat group for activity: {}", activityId);

    chatGroupRepository.findByActivityId(activityId).ifPresent(group -> {
      // Delete all messages in the group first
      chatMessageRepository.deleteByGroupId(group.getId());
      log.info("Deleted messages for chat group: {}", group.getId());

      // Delete the group
      chatGroupRepository.delete(group);
      log.info("Deleted chat group: {}", group.getId());
    });
  }

  private boolean isUserMemberOfGroup(Long userId, Long activityId) {
    // Check if user is the owner
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    if (activity.isOwner(userId)) {
      return true;
    }

    // Check if user is an accepted member
    return joinRequestRepository.existsByActivityIdAndUserIdAndStatus(
        activityId, userId, JoinRequestStatus.ACCEPTED);
  }

  private ChatMessageDTO convertToDTO(ChatMessage message) {
    DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    String timestampStr = message.getCreatedAt().format(formatter);

    return ChatMessageDTO.builder()
        .id(message.getId())
        .groupId(message.getGroup().getId())
        .senderId(message.getSender().getId())
        .senderName(message.getSender().getName())
        .userId(message.getSender().getId()) // Alias for webapp
        .userName(message.getSender().getName()) // Alias for webapp
        .content(message.getContent())
        .type(message.getType().name())
        .timestamp(timestampStr)
        .sentAt(timestampStr) // Alias for webapp
        .build();
  }

  private ChatGroupDTO convertGroupToDTO(ChatGroup group) {
    return ChatGroupDTO.builder()
        .id(group.getId())
        .name(group.getName())
        .activityId(group.getActivity().getId())
        .activityTitle(group.getActivity().getTitle())
        .isActive(group.getIsActive())
        .build();
  }

}
