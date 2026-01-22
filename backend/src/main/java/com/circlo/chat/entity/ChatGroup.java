package com.circlo.chat.entity;

import com.circlo.activity.entity.Activity;
import com.circlo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_groups", indexes = {
    @Index(name = "idx_activity_id", columnList = "activity_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatGroup extends BaseEntity {

  @Column(nullable = false, length = 100)
  private String name;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "activity_id", nullable = false, unique = true)
  private Activity activity;

  @Column(name = "is_active")
  @Builder.Default
  private Boolean isActive = true;

}
