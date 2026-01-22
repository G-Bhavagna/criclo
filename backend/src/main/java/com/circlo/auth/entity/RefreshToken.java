package com.circlo.auth.entity;

import com.circlo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens", indexes = {
    @Index(name = "idx_token", columnList = "token"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken extends BaseEntity {

  @Column(nullable = false, unique = true, length = 512)
  private String token;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(nullable = false)
  private LocalDateTime expiryDate;

  @Column(nullable = false)
  @Builder.Default
  private Boolean revoked = false;

  public boolean isExpired() {
    return LocalDateTime.now().isAfter(expiryDate);
  }

}
