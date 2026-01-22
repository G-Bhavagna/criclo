package com.circlo.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

  private Long userId;
  private String title;
  private String message;
  private String type;
  private Long referenceId;
  private LocalDateTime createdAt;

}
