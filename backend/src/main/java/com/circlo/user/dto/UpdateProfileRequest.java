package com.circlo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

  private String name;
  private String bio;
  private String profileImageUrl;
  private Set<String> interests;

}
