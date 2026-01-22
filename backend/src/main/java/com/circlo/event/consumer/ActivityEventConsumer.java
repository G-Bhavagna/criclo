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
public class ActivityEventConsumer {

  // private final SimpMessagingTemplate messagingTemplate;

  // @KafkaListener(topics = KafkaTopics.ACTIVITY_CREATED, groupId =
  // "circlo-consumer-group")
  public void handleActivityCreated(Object event) {
    // log.info("Consumed ActivityCreatedEvent: {}", event.getActivityId());

    // Create notification for nearby users (simplified - in production, query
    // nearby users)
    // NotificationEvent notification = NotificationEvent.builder()
    // .userId(null) // Broadcast to all nearby users
    // .title("New Activity Created")
    // .message(event.getOwnerName() + " created: " + event.getTitle())
    // .type("ACTIVITY_CREATED")
    // .referenceId(event.getActivityId())
    // .createdAt(LocalDateTime.now())
    // .build();

    // Broadcast notification via WebSocket
    // messagingTemplate.convertAndSend("/topic/notifications", notification);

    // log.info("Notification sent for activity: {}", event.getActivityId());
  }

  // @KafkaListener(topics = KafkaTopics.ACTIVITY_CLOSED, groupId =
  // "circlo-consumer-group")
  public void handleActivityClosed(Object event) {
    // log.info("Consumed ActivityClosedEvent: {}", event.getActivityId());

    // NotificationEvent notification = NotificationEvent.builder()
    // .userId(event.getOwnerId())
    // .title("Activity Closed")
    // .message("Your activity '" + event.getTitle() + "' has been closed")
    // .type("ACTIVITY_CLOSED")
    // .referenceId(event.getActivityId())
    // .createdAt(LocalDateTime.now())
    // .build();

    // messagingTemplate.convertAndSend("/user/" + event.getOwnerId() +
    // "/notifications", notification);

    // log.info("Notification sent for closed activity: {}", event.getActivityId());
  }

}
