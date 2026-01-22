package com.circlo.joinrequest.controller;

import com.circlo.auth.config.JwtTokenUtil;
import com.circlo.joinrequest.dto.CreateJoinRequestDTO;
import com.circlo.joinrequest.dto.JoinRequestDTO;
import com.circlo.joinrequest.dto.ReviewJoinRequestDTO;
import com.circlo.joinrequest.service.JoinRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/join-requests")
@RequiredArgsConstructor
public class JoinRequestController {

  private final JoinRequestService joinRequestService;
  private final JwtTokenUtil jwtTokenUtil;

  @PostMapping
  public ResponseEntity<JoinRequestDTO> createJoinRequest(
      @RequestHeader("Authorization") String authHeader,
      @Valid @RequestBody CreateJoinRequestDTO request) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    JoinRequestDTO joinRequest = joinRequestService.createJoinRequest(userId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(joinRequest);
  }

  @PostMapping("/{requestId}/accept")
  public ResponseEntity<JoinRequestDTO> acceptJoinRequest(
      @PathVariable Long requestId,
      @RequestHeader("Authorization") String authHeader,
      @RequestBody(required = false) ReviewJoinRequestDTO review) {
    String token = authHeader.substring(7);
    Long ownerId = jwtTokenUtil.getUserIdFromToken(token);
    JoinRequestDTO joinRequest = joinRequestService.acceptJoinRequest(requestId, ownerId, review);
    return ResponseEntity.ok(joinRequest);
  }

  @PostMapping("/{requestId}/reject")
  public ResponseEntity<JoinRequestDTO> rejectJoinRequest(
      @PathVariable Long requestId,
      @RequestHeader("Authorization") String authHeader,
      @RequestBody(required = false) ReviewJoinRequestDTO review) {
    String token = authHeader.substring(7);
    Long ownerId = jwtTokenUtil.getUserIdFromToken(token);
    JoinRequestDTO joinRequest = joinRequestService.rejectJoinRequest(requestId, ownerId, review);
    return ResponseEntity.ok(joinRequest);
  }

  @GetMapping("/activity/{activityId}")
  public ResponseEntity<List<JoinRequestDTO>> getActivityJoinRequests(
      @PathVariable Long activityId,
      @RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long ownerId = jwtTokenUtil.getUserIdFromToken(token);
    List<JoinRequestDTO> requests = joinRequestService.getActivityJoinRequests(activityId, ownerId);
    return ResponseEntity.ok(requests);
  }

  @GetMapping("/my")
  public ResponseEntity<List<JoinRequestDTO>> getMyJoinRequests(
      @RequestHeader("Authorization") String authHeader) {
    String token = authHeader.substring(7);
    Long userId = jwtTokenUtil.getUserIdFromToken(token);
    List<JoinRequestDTO> requests = joinRequestService.getMyJoinRequests(userId);
    return ResponseEntity.ok(requests);
  }

  @GetMapping("/activity/{activityId}/members")
  public ResponseEntity<List<JoinRequestDTO>> getAcceptedMembers(@PathVariable Long activityId) {
    List<JoinRequestDTO> members = joinRequestService.getAcceptedMembers(activityId);
    return ResponseEntity.ok(members);
  }

}
