package com.circlo.joinrequest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJoinRequestDTO {

  @NotNull(message = "Activity ID is required")
  private Long activityId;

  private String message;

}
