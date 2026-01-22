package com.circlo.event.consumer;

// import com.circlo.event.config.KafkaTopics;
// import com.circlo.event.dto.*;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.kafka.annotation.KafkaListener;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Component;

// import java.time.LocalDateTime;

// @Component
// @RequiredArgsConstructor
// @Slf4j
public class JoinRequestEventConsumer {

  // private final SimpMessagingTemplate messagingTemplate;

  // @KafkaListener(topics = KafkaTopics.JOIN_REQUESTED, groupId =
  // "circlo-consumer-group")
  public void handleJoinRequested(Object event) {
    // log.info("Consumed JoinRequestedEvent: {}", event.getJoinRequestId());

    // Notify activity owner
    // NotificationEvent notification = NotificationEvent.builder()
    // .userId(event.getOwnerId())
    // .title("New Join Request")
    // .message(event.getUserName() + " wants to join your activity: " +
    // event.getActivityTitle())
    // .type("JOIN_REQUESTED")
    // .referenceId(event.getJoinRequestId())
    // .createdAt(LocalDateTime.now())
    // .build();

    // messagingTemplate.convertAndSend("/user/" + event.getOwnerId() +
    // "/notifications", notification);

    // log.info("Owner notified for join request: {}", event.getJoinRequestId());
  }

  // @KafkaListener(topics = KafkaTopics.JOIN_ACCEPTED, groupId =
  // "circlo-consumer-group")
  public void handleJoinAccepted(Object event) {
    // log.info("Consumed JoinAcceptedEvent: {}", event.getJoinRequestId());

    // Notify user their request was accepted
    // NotificationEvent notification = NotificationEvent.builder()
    // .userId(event.getUserId())
    // .title("Join Request Accepted!")
    // .message("You've been accepted to join: " + event.getActivityTitle())
    // .type("JOIN_ACCEPTED")
    // .referenceId(event.getActivityId())
    // .createdAt(LocalDateTime.now())
    // .build();

    // messagingTemplate.convertAndSend("/user/" + event.getUserId() +
    // "/notifications", notification);

    // log.info("User notified for join acceptance: {}", event.getJoinRequestId());
  }

  // @KafkaListener(topics = KafkaTopics.JOIN_REJECTED, groupId =
  // "circlo-consumer-group")
  public void handleJoinRejected(Object event) {
    // log.info("Consumed JoinRejectedEvent: {}", event.getJoinRequestId());

    // Notify user their request was rejected
    // NotificationEvent notification = NotificationEvent.builder()
    // .userId(event.getUserId())
    // .title("Join Request Declined")
    // .message("Your request to join '" + event.getActivityTitle() + "' was
    // declined")
    // .type("JOIN_REJECTED")
    // .referenceId(event.getActivityId())
    // .createdAt(LocalDateTime.now())
    // .build();

    // messagingTemplate.convertAndSend("/user/" + event.getUserId() +
    // "/notifications", notification);

    // log.info("User notified for join rejection: {}", event.getJoinRequestId());
  }

}
