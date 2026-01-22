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
public class JoinRequestedEvent {

  private Long joinRequestId;
  private Long activityId;
  private String activityTitle;
  private Long userId;
  private String userName;
  private Long ownerId;
  private String message;
  private LocalDateTime requestedAt;

}
