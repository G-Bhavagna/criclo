package com.circlo.notification.dto;

import com.circlo.notification.entity.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

  private Long id;
  private String title;
  private String message;
  private NotificationType type;
  private Long referenceId;
  private Boolean isRead;
  private LocalDateTime createdAt;

}
