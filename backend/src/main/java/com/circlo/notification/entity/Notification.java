package com.circlo.notification.entity;

import com.circlo.common.entity.BaseEntity;
import com.circlo.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String message;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private NotificationType type;

  private Long referenceId;

  @Column(nullable = false)
  private Boolean isRead = false;

}
