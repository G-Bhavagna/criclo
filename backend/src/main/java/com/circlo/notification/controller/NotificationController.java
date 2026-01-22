package com.circlo.notification.controller;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.notification.dto.NotificationDTO;
import com.circlo.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

  private final NotificationService notificationService;
  private final JwtTokenUtil jwtTokenUtil;

  @GetMapping
  public ResponseEntity<Page<NotificationDTO>> getUserNotifications(
      @RequestHeader("Authorization") String token,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {

    String email = jwtTokenUtil.extractUsername(token.substring(7));
    Long userId = jwtTokenUtil.extractUserId(token.substring(7));

    Page<NotificationDTO> notifications = notificationService.getUserNotifications(userId, page, size);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/unread")
  public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
      @RequestHeader("Authorization") String token) {

    Long userId = jwtTokenUtil.extractUserId(token.substring(7));
    List<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId);
    return ResponseEntity.ok(notifications);
  }

  @GetMapping("/unread/count")
  public ResponseEntity<Long> getUnreadCount(
      @RequestHeader("Authorization") String token) {

    Long userId = jwtTokenUtil.extractUserId(token.substring(7));
    Long count = notificationService.getUnreadCount(userId);
    return ResponseEntity.ok(count);
  }

  @PutMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(
      @PathVariable Long id,
      @RequestHeader("Authorization") String token) {

    Long userId = jwtTokenUtil.extractUserId(token.substring(7));
    notificationService.markAsRead(id, userId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead(
      @RequestHeader("Authorization") String token) {

    Long userId = jwtTokenUtil.extractUserId(token.substring(7));
    notificationService.markAllAsRead(userId);
    return ResponseEntity.ok().build();
  }

}
