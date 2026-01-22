package com.circlo.joinrequest.service;

import com.circlo.activity.entity.Activity;
import com.circlo.activity.entity.ActivityStatus;
import com.circlo.activity.repository.ActivityRepository;
import com.circlo.auth.entity.User;
import com.circlo.auth.repository.UserRepository;
// import com.circlo.event.config.KafkaTopics;
// import com.circlo.event.dto.JoinAcceptedEvent;
// import com.circlo.event.dto.JoinRejectedEvent;
// import com.circlo.event.dto.JoinRequestedEvent;
import com.circlo.joinrequest.dto.CreateJoinRequestDTO;
import com.circlo.joinrequest.dto.JoinRequestDTO;
import com.circlo.joinrequest.dto.ReviewJoinRequestDTO;
import com.circlo.joinrequest.entity.JoinRequest;
import com.circlo.joinrequest.entity.JoinRequestStatus;
import com.circlo.joinrequest.repository.JoinRequestRepository;
import com.circlo.notification.entity.NotificationType;
import com.circlo.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
// import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JoinRequestService {

  private final JoinRequestRepository joinRequestRepository;
  private final ActivityRepository activityRepository;
  private final UserRepository userRepository;
  private final NotificationService notificationService;
  // private final KafkaTemplate<String, Object> kafkaTemplate;

  @Transactional
  public JoinRequestDTO createJoinRequest(Long userId, CreateJoinRequestDTO request) {
    log.info("Creating join request for activity {} by user {}", request.getActivityId(), userId);

    Activity activity = activityRepository.findById(request.getActivityId())
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Validation checks
    if (activity.getOwner().getId().equals(userId)) {
      throw new RuntimeException("You cannot join your own activity");
    }

    if (activity.getStatus() != ActivityStatus.OPEN) {
      throw new RuntimeException("Activity is not open for joining");
    }

    if (activity.isFull()) {
      throw new RuntimeException("Activity is full");
    }

    if (joinRequestRepository.existsByActivityIdAndUserIdAndStatus(
        request.getActivityId(), userId, JoinRequestStatus.PENDING)) {
      throw new RuntimeException("You already have a pending request for this activity");
    }

    if (joinRequestRepository.existsByActivityIdAndUserIdAndStatus(
        request.getActivityId(), userId, JoinRequestStatus.ACCEPTED)) {
      throw new RuntimeException("You are already a member of this activity");
    }

    JoinRequest joinRequest = JoinRequest.builder()
        .activity(activity)
        .user(user)
        .message(request.getMessage())
        .status(JoinRequestStatus.PENDING)
        .build();

    joinRequest = joinRequestRepository.save(joinRequest);
    log.info("Join request created: {}", joinRequest.getId());

    // Create notification for activity owner
    notificationService.createNotification(
        activity.getOwner().getId(),
        "New Join Request",
        user.getName() + " wants to join your activity: " + activity.getTitle(),
        NotificationType.JOIN_REQUESTED,
        joinRequest.getId());

    // Publish Kafka event
    publishJoinRequestedEvent(joinRequest);

    return convertToDTO(joinRequest);
  }

  @Transactional
  public JoinRequestDTO acceptJoinRequest(Long requestId, Long ownerId, ReviewJoinRequestDTO review) {
    log.info("Accepting join request {} by owner {}", requestId, ownerId);

    JoinRequest joinRequest = joinRequestRepository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Join request not found"));

    // Validate owner
    if (!joinRequest.getActivity().isOwner(ownerId)) {
      throw new RuntimeException("Only the activity owner can accept join requests");
    }

    if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
      throw new RuntimeException("Join request has already been reviewed");
    }

    Activity activity = joinRequest.getActivity();
    if (activity.isFull()) {
      throw new RuntimeException("Activity is full");
    }

    // Update join request
    joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
    joinRequest.setReviewedBy(ownerId);
    joinRequest.setReviewMessage(review != null ? review.getReviewMessage() : null);
    joinRequest = joinRequestRepository.save(joinRequest);

    // Update activity member count
    activity.setCurrentMembers(activity.getCurrentMembers() + 1);
    if (activity.isFull()) {
      activity.setStatus(ActivityStatus.FULL);
    }
    activityRepository.save(activity);

    log.info("Join request accepted: {}", requestId);

    // Create notification for the user who requested
    notificationService.createNotification(
        joinRequest.getUser().getId(),
        "Request Approved!",
        "Your request to join '" + activity.getTitle() + "' has been approved!",
        NotificationType.JOIN_ACCEPTED,
        joinRequest.getId());

    // Publish Kafka event
    publishJoinAcceptedEvent(joinRequest);

    return convertToDTO(joinRequest);
  }

  @Transactional
  public JoinRequestDTO rejectJoinRequest(Long requestId, Long ownerId, ReviewJoinRequestDTO review) {
    log.info("Rejecting join request {} by owner {}", requestId, ownerId);

    JoinRequest joinRequest = joinRequestRepository.findById(requestId)
        .orElseThrow(() -> new RuntimeException("Join request not found"));

    if (!joinRequest.getActivity().isOwner(ownerId)) {
      throw new RuntimeException("Only the activity owner can reject join requests");
    }

    if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
      throw new RuntimeException("Join request has already been reviewed");
    }

    joinRequest.setStatus(JoinRequestStatus.REJECTED);
    joinRequest.setReviewedBy(ownerId);
    joinRequest.setReviewMessage(review != null ? review.getReviewMessage() : null);
    joinRequest = joinRequestRepository.save(joinRequest);

    log.info("Join request rejected: {}", requestId);

    // Create notification for the user who requested
    notificationService.createNotification(
        joinRequest.getUser().getId(),
        "Request Rejected",
        "Your request to join '" + joinRequest.getActivity().getTitle() + "' was not approved.",
        NotificationType.JOIN_REJECTED,
        joinRequest.getId());

    // Publish Kafka event
    publishJoinRejectedEvent(joinRequest);

    return convertToDTO(joinRequest);
  }

  public List<JoinRequestDTO> getActivityJoinRequests(Long activityId, Long ownerId) {
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    if (!activity.isOwner(ownerId)) {
      throw new RuntimeException("Only the activity owner can view join requests");
    }

    List<JoinRequest> requests = joinRequestRepository.findByActivityIdAndStatus(
        activityId, JoinRequestStatus.PENDING);

    return requests.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public List<JoinRequestDTO> getMyJoinRequests(Long userId) {
    List<JoinRequest> requests = joinRequestRepository.findByUserId(userId);

    return requests.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  public List<JoinRequestDTO> getAcceptedMembers(Long activityId) {
    List<JoinRequest> requests = joinRequestRepository.findByActivityIdAndStatus(
        activityId, JoinRequestStatus.ACCEPTED);

    return requests.stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
  }

  private void publishJoinRequestedEvent(JoinRequest joinRequest) {
    // JoinRequestedEvent event = JoinRequestedEvent.builder()
    // .joinRequestId(joinRequest.getId())
    // .activityId(joinRequest.getActivity().getId())
    // .activityTitle(joinRequest.getActivity().getTitle())
    // .userId(joinRequest.getUser().getId())
    // .userName(joinRequest.getUser().getName())
    // .ownerId(joinRequest.getActivity().getOwner().getId())
    // .message(joinRequest.getMessage())
    // .requestedAt(joinRequest.getCreatedAt())
    // .build();

    // kafkaTemplate.send(KafkaTopics.JOIN_REQUESTED, event);
    // log.info("Published JoinRequestedEvent for request: {}",
    // joinRequest.getId());
  }

  private void publishJoinAcceptedEvent(JoinRequest joinRequest) {
    // JoinAcceptedEvent event = JoinAcceptedEvent.builder()
    // .joinRequestId(joinRequest.getId())
    // .activityId(joinRequest.getActivity().getId())
    // .activityTitle(joinRequest.getActivity().getTitle())
    // .userId(joinRequest.getUser().getId())
    // .userName(joinRequest.getUser().getName())
    // .ownerId(joinRequest.getActivity().getOwner().getId())
    // .reviewMessage(joinRequest.getReviewMessage())
    // .acceptedAt(LocalDateTime.now())
    // .build();

    // kafkaTemplate.send(KafkaTopics.JOIN_ACCEPTED, event);
    // log.info("Published JoinAcceptedEvent for request: {}", joinRequest.getId());
  }

  private void publishJoinRejectedEvent(JoinRequest joinRequest) {
    // JoinRejectedEvent event = JoinRejectedEvent.builder()
    // .joinRequestId(joinRequest.getId())
    // .activityId(joinRequest.getActivity().getId())
    // .activityTitle(joinRequest.getActivity().getTitle())
    // .userId(joinRequest.getUser().getId())
    // .userName(joinRequest.getUser().getName())
    // .ownerId(joinRequest.getActivity().getOwner().getId())
    // .reviewMessage(joinRequest.getReviewMessage())
    // .rejectedAt(LocalDateTime.now())
    // .build();

    // kafkaTemplate.send(KafkaTopics.JOIN_REJECTED, event);
    // log.info("Published JoinRejectedEvent for request: {}", joinRequest.getId());
  }

  private JoinRequestDTO convertToDTO(JoinRequest joinRequest) {
    return JoinRequestDTO.builder()
        .id(joinRequest.getId())
        .activityId(joinRequest.getActivity().getId())
        .activityTitle(joinRequest.getActivity().getTitle())
        .userId(joinRequest.getUser().getId())
        .userName(joinRequest.getUser().getName())
        .userEmail(joinRequest.getUser().getEmail())
        .status(joinRequest.getStatus().name())
        .message(joinRequest.getMessage())
        .reviewMessage(joinRequest.getReviewMessage())
        .createdAt(joinRequest.getCreatedAt())
        .build();
  }

}
