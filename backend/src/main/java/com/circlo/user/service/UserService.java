package com.circlo.user.service;

import com.circlo.auth.dto.UserDTO;
import com.circlo.auth.entity.User;
import com.circlo.auth.repository.UserRepository;
import com.circlo.user.dto.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

  private final UserRepository userRepository;

  public UserDTO getUserProfile(Long userId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    return convertToDTO(user);
  }

  @Transactional
  public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (request.getName() != null) {
      user.setName(request.getName());
    }
    if (request.getBio() != null) {
      user.setBio(request.getBio());
    }
    if (request.getInterests() != null) {
      user.setInterests(request.getInterests());
    }
    if (request.getProfileImageUrl() != null) {
      user.setProfileImageUrl(request.getProfileImageUrl());
    }

    user = userRepository.save(user);
    log.info("Profile updated for user: {}", userId);

    return convertToDTO(user);
  }

  private UserDTO convertToDTO(User user) {
    return UserDTO.builder()
        .id(user.getId())
        .email(user.getEmail())
        .name(user.getName())
        .bio(user.getBio())
        .profileImageUrl(user.getProfileImageUrl())
        .interests(user.getInterests())
        .isOnline(user.getIsOnline())
        .role(user.getRole().name())
        .build();
  }

}
