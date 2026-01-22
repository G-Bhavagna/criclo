package com.circlo.joinrequest.repository;

import com.circlo.joinrequest.entity.JoinRequest;
import com.circlo.joinrequest.entity.JoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {

  List<JoinRequest> findByActivityIdAndStatus(Long activityId, JoinRequestStatus status);

  List<JoinRequest> findByUserIdAndStatus(Long userId, JoinRequestStatus status);

  List<JoinRequest> findByUserId(Long userId);

  Optional<JoinRequest> findByActivityIdAndUserId(Long activityId, Long userId);

  boolean existsByActivityIdAndUserIdAndStatus(Long activityId, Long userId, JoinRequestStatus status);

  List<JoinRequest> findByActivityIdAndStatusIn(Long activityId, List<JoinRequestStatus> statuses);

}
