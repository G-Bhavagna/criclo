package com.circlo.activity.controller;

import com.circlo.activity.dto.ActivityDTO;
import com.circlo.activity.dto.CreateActivityRequest;
import com.circlo.activity.service.ActivityService;
import com.circlo.auth.config.JwtTokenUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

  private final ActivityService activityService;
  private final JwtTokenUtil jwtTokenUtil;

  @PostMapping
  public ResponseEntity<ActivityDTO> createActivity(
      @RequestHeader("Authorization") String authHeader,
      @Valid @RequestBody CreateActivityRequest request) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    ActivityDTO activity = activityService.createActivity(userId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(activity);
  }

  @GetMapping("/nearby")
  public ResponseEntity<List<ActivityDTO>> getNearbyActivities(
      @RequestParam Double latitude,
      @RequestParam Double longitude,
      @RequestParam(required = false) String type) {
    List<ActivityDTO> activities = activityService.getNearbyActivities(latitude, longitude, type);
    return ResponseEntity.ok(activities);
  }

  @GetMapping("/{activityId}")
  public ResponseEntity<ActivityDTO> getActivityById(@PathVariable Long activityId) {
    ActivityDTO activity = activityService.getActivityById(activityId);
    return ResponseEntity.ok(activity);
  }

  @GetMapping("/my")
  public ResponseEntity<List<ActivityDTO>> getMyActivities(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    List<ActivityDTO> activities = activityService.getMyActivities(userId);
    return ResponseEntity.ok(activities);
  }

  @PostMapping("/{activityId}/close")
  public ResponseEntity<String> closeActivity(
      @PathVariable Long activityId,
      @RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    activityService.closeActivity(activityId, userId);
    return ResponseEntity.ok("Activity closed successfully");
  }

  @PostMapping("/{activityId}/cancel")
  public ResponseEntity<String> cancelActivity(
      @PathVariable Long activityId,
      @RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    activityService.cancelActivity(activityId, userId);
    return ResponseEntity.ok("Activity cancelled successfully");
  }

}
