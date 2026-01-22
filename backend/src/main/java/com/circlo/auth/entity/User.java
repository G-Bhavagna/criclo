package com.circlo.auth.entity;

import com.circlo.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String name;

  @Column(length = 500)
  private String bio;

  @Column(name = "profile_image_url")
  private String profileImageUrl;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "interest")
  private Set<String> interests = new HashSet<>();

  @Column(columnDefinition = "POINT")
  private Point location;

  @Column(name = "is_online")
  @Builder.Default
  private Boolean isOnline = false;

  @Column(name = "last_seen")
  private java.time.LocalDateTime lastSeen;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  @Builder.Default
  private UserRole role = UserRole.USER;

  @Column(nullable = false)
  @Builder.Default
  private Boolean enabled = true;

  @Column(nullable = false)
  @Builder.Default
  private Boolean accountNonLocked = true;

}
