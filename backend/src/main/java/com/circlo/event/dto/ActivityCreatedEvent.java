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
public class ActivityCreatedEvent {

  private Long activityId;
  private String title;
  private String type;
  private Long ownerId;
  private String ownerName;
  private LocalDateTime scheduledDate;
  private LocalDateTime createdAt;

}
