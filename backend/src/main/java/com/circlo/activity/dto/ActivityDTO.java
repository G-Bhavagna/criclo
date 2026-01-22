package com.circlo.activity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {

  private Long id;
  private String title;
  private String description;
  private String type;
  private Long ownerId;
  private String ownerName;
  private Integer currentMembers;
  private Integer maxMembers;
  private Double latitude;
  private Double longitude;
  private Double distance; // in kilometers
  private LocalDateTime scheduledDate;
  private String status;
  private LocalDateTime createdAt;

}
