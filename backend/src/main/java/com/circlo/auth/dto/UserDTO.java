package com.circlo.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

  private Long id;
  private String email;
  private String name;
  private String bio;
  private String profileImageUrl;
  private Set<String> interests;
  private Boolean isOnline;
  private String role;

}
