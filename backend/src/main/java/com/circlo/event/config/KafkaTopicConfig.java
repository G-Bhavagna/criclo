package com.circlo.event.config;

// import org.apache.kafka.clients.admin.NewTopic;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.kafka.config.TopicBuilder;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.TopicBuilder;

// @Configuration
public class KafkaTopicConfig {

  // @Bean
  public void activityCreatedTopic() {
    // return TopicBuilder.name(KafkaTopics.ACTIVITY_CREATED)
    // .partitions(3)
    // .replicas(1)
    // .build();
  }

  // @Bean
  public void activityClosedTopic() {
    // return TopicBuilder.name(KafkaTopics.ACTIVITY_CLOSED)
    // .partitions(3)
    // .replicas(1)
    // .build();
  }

  // @Bean
  public void joinRequestedTopic() {
    // return TopicBuilder.name(KafkaTopics.JOIN_REQUESTED)
    // .partitions(3)
    // .replicas(1)
    // .build();
  }

  // @Bean
  public void joinAcceptedTopic() {
    // return TopicBuilder.name(KafkaTopics.JOIN_ACCEPTED)
    // .partitions(3)
    // .replicas(1)
    // .build();
  }

  // @Bean
  public void joinRejectedTopic() {
    // return TopicBuilder.name(KafkaTopics.JOIN_REJECTED)
    // .partitions(3)
    // .replicas(1)
    // .build();
  }

  @Bean
  public NewTopic notificationDispatchTopic() {
    return TopicBuilder.name(KafkaTopics.NOTIFICATION_DISPATCH)
        .partitions(3)
        .replicas(1)
        .build();
  }

}
