package com.circlo.activity.service;

import com.circlo.activity.dto.ActivityDTO;
import com.circlo.activity.dto.CreateActivityRequest;
import com.circlo.activity.entity.Activity;
import com.circlo.activity.entity.ActivityStatus;
import com.circlo.activity.entity.ActivityType;
import com.circlo.activity.repository.ActivityRepository;
import com.circlo.auth.entity.User;
import com.circlo.auth.repository.UserRepository;
import com.circlo.chat.service.ChatService;
// import com.circlo.event.config.KafkaTopics;
// import com.circlo.event.dto.ActivityClosedEvent;
// import com.circlo.event.dto.ActivityCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.beans.factory.annotation.Value;
// import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

  private final ActivityRepository activityRepository;
  private final UserRepository userRepository;
  private final ChatService chatService;
  // private final KafkaTemplate<String, Object> kafkaTemplate;
  private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

  @Value("${app.location.radius-km}")
  private Double radiusKm;

  @Transactional
  public ActivityDTO createActivity(Long userId, CreateActivityRequest request) {
    log.info("Creating activity for user: {}", userId);

    User owner = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Point location = geometryFactory.createPoint(
        new Coordinate(request.getLongitude(), request.getLatitude()));

    Activity activity = Activity.builder()
        .title(request.getTitle())
        .description(request.getDescription())
        .type(ActivityType.valueOf(request.getType().toUpperCase()))
        .owner(owner)
        .currentMembers(1)
        .maxMembers(request.getMaxMembers())
        .location(location)
        .scheduledDate(request.getScheduledDate())
        .status(ActivityStatus.OPEN)
        .build();

    activity = activityRepository.save(activity);
    log.info("Activity created: {}", activity.getId());

    // Create chat group for the activity
    try {
      chatService.createGroupForActivity(activity.getId());
      log.info("Chat group created for activity: {}", activity.getId());
    } catch (Exception e) {
      log.error("Error creating chat group for activity {}: {}", activity.getId(), e.getMessage());
    }

    // Publish Kafka event
    // publishActivityCreatedEvent(activity);

    return convertToDTO(activity, null);
  }

  public List<ActivityDTO> getNearbyActivities(Double latitude, Double longitude, String type) {
    log.info("Fetching nearby activities for location: {}, {}", latitude, longitude);

    double radiusMeters = radiusKm * 1000;

    List<Activity> activities;
    if (type != null && !type.isEmpty()) {
      activities = activityRepository.findNearbyActivitiesByType(
          latitude, longitude, radiusMeters, type.toUpperCase());
    } else {
      activities = activityRepository.findNearbyActivities(
          latitude, longitude, radiusMeters);
    }

    Point userLocation = geometryFactory.createPoint(new Coordinate(longitude, latitude));

    return activities.stream()
        .map(activity -> {
          double distance = calculateDistance(userLocation, activity.getLocation());
          return convertToDTO(activity, distance);
        })
        .collect(Collectors.toList());
  }

  public ActivityDTO getActivityById(Long activityId) {
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    return convertToDTO(activity, null);
  }

  public List<ActivityDTO> getMyActivities(Long userId) {
    List<Activity> activities = activityRepository.findByOwnerIdAndStatus(
        userId, ActivityStatus.OPEN);

    return activities.stream()
        .map(activity -> convertToDTO(activity, null))
        .collect(Collectors.toList());
  }

  @Transactional
  public void closeActivity(Long activityId, Long userId) {
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    if (!activity.isOwner(userId)) {
      throw new RuntimeException("Only the activity owner can close it");
    }

    activity.setStatus(ActivityStatus.CLOSED);
    activity.setClosedAt(LocalDateTime.now());
    activityRepository.save(activity);

    log.info("Activity closed: {}", activityId);

    // Delete chat group when activity is closed
    try {
      chatService.deleteGroupByActivityId(activityId);
      log.info("Chat group deleted for closed activity: {}", activityId);
    } catch (Exception e) {
      log.error("Error deleting chat group for activity {}: {}", activityId, e.getMessage());
    }

    // Publish Kafka event
    publishActivityClosedEvent(activity);
  }

  @Transactional
  public void cancelActivity(Long activityId, Long userId) {
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new RuntimeException("Activity not found"));

    if (!activity.isOwner(userId)) {
      throw new RuntimeException("Only the activity owner can cancel it");
    }

    activity.setStatus(ActivityStatus.CANCELLED);
    activity.setClosedAt(LocalDateTime.now());
    activityRepository.save(activity);

    log.info("Activity cancelled: {}", activityId);

    // Delete chat group when activity is cancelled
    try {
      chatService.deleteGroupByActivityId(activityId);
      log.info("Chat group deleted for cancelled activity: {}", activityId);
    } catch (Exception e) {
      log.error("Error deleting chat group for activity {}: {}", activityId, e.getMessage());
    }
  }

  private void publishActivityCreatedEvent(Activity activity) {
    // ActivityCreatedEvent event = ActivityCreatedEvent.builder()
    // .activityId(activity.getId())
    // .title(activity.getTitle())
    // .type(activity.getType().name())
    // .ownerId(activity.getOwner().getId())
    // .ownerName(activity.getOwner().getName())
    // .scheduledDate(activity.getScheduledDate())
    // .createdAt(activity.getCreatedAt())
    // .build();

    // kafkaTemplate.send(KafkaTopics.ACTIVITY_CREATED, event);
    // log.info("Published ActivityCreatedEvent for activity: {}",
    // activity.getId());
  }

  private void publishActivityClosedEvent(Activity activity) {
    // ActivityClosedEvent event = ActivityClosedEvent.builder()
    // .activityId(activity.getId())
    // .title(activity.getTitle())
    // .ownerId(activity.getOwner().getId())
    // .status(activity.getStatus().name())
    // .closedAt(activity.getClosedAt())
    // .build();

    // kafkaTemplate.send(KafkaTopics.ACTIVITY_CLOSED, event);
    // log.info("Published ActivityClosedEvent for activity: {}", activity.getId());
  }

  private double calculateDistance(Point p1, Point p2) {
    // Haversine formula to calculate distance in kilometers
    double lat1 = Math.toRadians(p1.getY());
    double lon1 = Math.toRadians(p1.getX());
    double lat2 = Math.toRadians(p2.getY());
    double lon2 = Math.toRadians(p2.getX());

    double dLat = lat2 - lat1;
    double dLon = lon2 - lon1;

    double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

    double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    double earthRadiusKm = 6371.0;
    return earthRadiusKm * c;
  }

  private ActivityDTO convertToDTO(Activity activity, Double distance) {
    return ActivityDTO.builder()
        .id(activity.getId())
        .title(activity.getTitle())
        .description(activity.getDescription())
        .type(activity.getType().name())
        .ownerId(activity.getOwner().getId())
        .ownerName(activity.getOwner().getName())
        .currentMembers(activity.getCurrentMembers())
        .maxMembers(activity.getMaxMembers())
        .latitude(activity.getLocation().getY())
        .longitude(activity.getLocation().getX())
        .distance(distance)
        .scheduledDate(activity.getScheduledDate())
        .status(activity.getStatus().name())
        .createdAt(activity.getCreatedAt())
        .build();
  }

}
