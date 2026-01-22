package com.circlo.joinrequest.entity;

import com.circlo.activity.entity.Activity;
import com.circlo.auth.entity.User;
import com.circlo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "join_requests", indexes = {
    @Index(name = "idx_activity_status", columnList = "activity_id, status"),
    @Index(name = "idx_user_activity", columnList = "user_id, activity_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRequest extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "activity_id", nullable = false)
  private Activity activity;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private JoinRequestStatus status = JoinRequestStatus.PENDING;

  @Column(length = 500)
  private String message;

  @Column(name = "reviewed_by")
  private Long reviewedBy;

  @Column(name = "review_message", length = 500)
  private String reviewMessage;

}
