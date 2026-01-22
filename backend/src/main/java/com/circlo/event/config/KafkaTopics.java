package com.circlo.event.config;

public class KafkaTopics {

  public static final String ACTIVITY_CREATED = "activity.created";
  public static final String ACTIVITY_CLOSED = "activity.closed";
  public static final String JOIN_REQUESTED = "join.requested";
  public static final String JOIN_ACCEPTED = "join.accepted";
  public static final String JOIN_REJECTED = "join.rejected";
  public static final String NOTIFICATION_DISPATCH = "notification.dispatch";

  private KafkaTopics() {
    // Utility class
  }

}
