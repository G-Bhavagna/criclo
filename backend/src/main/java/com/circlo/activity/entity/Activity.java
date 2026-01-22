package com.circlo.activity.entity;

import com.circlo.auth.entity.User;
import com.circlo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities", indexes = {
    @Index(name = "idx_activity_type", columnList = "type"),
    @Index(name = "idx_activity_status", columnList = "status"),
    @Index(name = "idx_activity_location", columnList = "location"),
    @Index(name = "idx_activity_date", columnList = "scheduled_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity extends BaseEntity {

  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false, length = 500)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ActivityType type;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "owner_id", nullable = false)
  private User owner;

  @Column(name = "current_members", nullable = false)
  @Builder.Default
  private Integer currentMembers = 1;

  @Column(name = "max_members", nullable = false)
  private Integer maxMembers;

  @Column(columnDefinition = "POINT", nullable = false)
  private Point location;

  @Column(name = "scheduled_date", nullable = false)
  private LocalDateTime scheduledDate;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private ActivityStatus status = ActivityStatus.OPEN;

  @Column(name = "closed_at")
  private LocalDateTime closedAt;

  public boolean isFull() {
    return currentMembers >= maxMembers;
  }

  public boolean isOwner(Long userId) {
    return owner.getId().equals(userId);
  }

}
