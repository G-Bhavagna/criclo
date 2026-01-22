package com.circlo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = { KafkaAutoConfiguration.class })
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class CircloApplication {

  public static void main(String[] args) {
    SpringApplication.run(CircloApplication.class, args);
  }

}
