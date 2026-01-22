package com.circlo.user.controller;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.auth.dto.UserDTO;
import com.circlo.user.dto.UpdateProfileRequest;
import com.circlo.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final JwtTokenUtil jwtTokenUtil;

  @GetMapping("/me")
  public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    UserDTO user = userService.getUserProfile(userId);
    return ResponseEntity.ok(user);
  }

  @GetMapping("/{userId}")
  public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) {
    UserDTO user = userService.getUserProfile(userId);
    return ResponseEntity.ok(user);
  }

  @PutMapping("/me")
  public ResponseEntity<UserDTO> updateProfile(
      @RequestHeader("Authorization") String authHeader,
      @RequestBody UpdateProfileRequest request) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    UserDTO user = userService.updateProfile(userId, request);
    return ResponseEntity.ok(user);
  }

}
