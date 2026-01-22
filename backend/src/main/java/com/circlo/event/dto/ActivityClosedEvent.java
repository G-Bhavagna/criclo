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
public class ActivityClosedEvent {

  private Long activityId;
  private String title;
  private Long ownerId;
  private String status;
  private LocalDateTime closedAt;

}
