package com.circlo.chat.scheduler;

import com.circlo.activity.entity.Activity;
import com.circlo.activity.entity.ActivityStatus;
import com.circlo.activity.repository.ActivityRepository;
import com.circlo.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChatCleanupScheduler {

  private final ActivityRepository activityRepository;
  private final ChatService chatService;

  // Run every hour
  @Scheduled(cron = "0 0 * * * *")
  public void cleanupExpiredActivityChats() {
    log.info("Starting cleanup of expired activity chats");

    try {
      // Find all open activities that have passed their scheduled date
      List<Activity> expiredActivities = activityRepository.findExpiredActivities(
          ActivityStatus.OPEN, LocalDateTime.now());

      log.info("Found {} expired activities to process", expiredActivities.size());

      for (Activity activity : expiredActivities) {
        try {
          // Close the activity
          activity.setStatus(ActivityStatus.CLOSED);
          activity.setClosedAt(LocalDateTime.now());
          activityRepository.save(activity);

          // Delete the chat group
          chatService.deleteGroupByActivityId(activity.getId());
          log.info("Cleaned up chat for expired activity: {}", activity.getId());
        } catch (Exception e) {
          log.error("Error cleaning up activity {}: {}", activity.getId(), e.getMessage());
        }
      }

      log.info("Completed cleanup of expired activity chats");
    } catch (Exception e) {
      log.error("Error during chat cleanup: {}", e.getMessage(), e);
    }
  }
}
