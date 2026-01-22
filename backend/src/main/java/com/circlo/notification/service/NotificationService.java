package com.circlo.notification.service;

import com.circlo.auth.entity.User;
import com.circlo.auth.repository.UserRepository;
import com.circlo.notification.dto.NotificationDTO;
import com.circlo.notification.entity.Notification;
import com.circlo.notification.entity.NotificationType;
import com.circlo.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

  private final NotificationRepository notificationRepository;
  private final UserRepository userRepository;

  @Transactional
  public Notification createNotification(Long userId, String title, String message,
      NotificationType type, Long referenceId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    Notification notification = Notification.builder()
        .user(user)
        .title(title)
        .message(message)
        .type(type)
        .referenceId(referenceId)
        .isRead(false)
        .build();

    Notification saved = notificationRepository.save(notification);
    log.info("Created notification {} for user {}", saved.getId(), userId);

    return saved;
  }

  public Page<NotificationDTO> getUserNotifications(Long userId, int page, int size) {
    Page<Notification> notifications = notificationRepository
        .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));

    return notifications.map(this::convertToDTO);
  }

  public List<NotificationDTO> getUnreadNotifications(Long userId) {
    List<Notification> unreadNotifications = notificationRepository
        .findByUserIdAndIsReadFalse(userId);

    return unreadNotifications.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public Long getUnreadCount(Long userId) {
    return notificationRepository.countByUserIdAndIsReadFalse(userId);
  }

  @Transactional
  public void markAsRead(Long notificationId, Long userId) {
    Notification notification = notificationRepository.findById(notificationId)
        .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

    if (!notification.getUser().getId().equals(userId)) {
      throw new IllegalArgumentException("Not authorized to mark this notification as read");
    }

    notification.setIsRead(true);
    notificationRepository.save(notification);
    log.info("Marked notification {} as read", notificationId);
  }

  @Transactional
  public void markAllAsRead(Long userId) {
    List<Notification> unreadNotifications = notificationRepository
        .findByUserIdAndIsReadFalse(userId);

    unreadNotifications.forEach(n -> n.setIsRead(true));
    notificationRepository.saveAll(unreadNotifications);
    log.info("Marked all notifications as read for user {}", userId);
  }

  private NotificationDTO convertToDTO(Notification notification) {
    return NotificationDTO.builder()
        .id(notification.getId())
        .title(notification.getTitle())
        .message(notification.getMessage())
        .type(notification.getType())
        .referenceId(notification.getReferenceId())
        .isRead(notification.getIsRead())
        .createdAt(notification.getCreatedAt())
        .build();
  }

}
