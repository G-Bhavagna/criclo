package com.circlo.activity.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityRequest {

  @NotBlank(message = "Title is required")
  @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
  private String title;

  @NotBlank(message = "Description is required")
  @Size(max = 500, message = "Description must not exceed 500 characters")
  private String description;

  @NotNull(message = "Activity type is required")
  private String type;

  @NotNull(message = "Latitude is required")
  @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
  @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
  private Double latitude;

  @NotNull(message = "Longitude is required")
  @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
  @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
  private Double longitude;

  @NotNull(message = "Scheduled date is required")
  @Future(message = "Scheduled date must be in the future")
  private LocalDateTime scheduledDate;

  @NotNull(message = "Max members is required")
  @Min(value = 2, message = "Max members must be at least 2")
  @Max(value = 20, message = "Max members must not exceed 20")
  private Integer maxMembers;

}
