package com.circlo.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatGroupDTO {
  private Long id;
  private String name;
  private Long activityId;
  private String activityTitle;
  private Boolean isActive;
}
