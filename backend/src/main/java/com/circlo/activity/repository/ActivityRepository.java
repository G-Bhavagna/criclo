package com.circlo.activity.repository;

import com.circlo.activity.entity.Activity;
import com.circlo.activity.entity.ActivityStatus;
import com.circlo.activity.entity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

  List<Activity> findByOwnerIdAndStatus(Long ownerId, ActivityStatus status);

  List<Activity> findByStatusOrderByScheduledDateAsc(ActivityStatus status);

  @Query("SELECT a FROM Activity a WHERE a.status = :status AND a.scheduledDate < :currentTime")
  List<Activity> findExpiredActivities(
      @Param("status") ActivityStatus status,
      @Param("currentTime") LocalDateTime currentTime);

  @Query(value = "SELECT a.* FROM activities a " +
      "WHERE a.status = 'OPEN' " +
      "AND ST_Distance_Sphere(a.location, ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'), 4326)) <= :radiusMeters "
      +
      "ORDER BY ST_Distance_Sphere(a.location, ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'), 4326))", nativeQuery = true)
  List<Activity> findNearbyActivities(
      @Param("latitude") double latitude,
      @Param("longitude") double longitude,
      @Param("radiusMeters") double radiusMeters);

  @Query(value = "SELECT a.* FROM activities a " +
      "WHERE a.status = 'OPEN' " +
      "AND a.type = :type " +
      "AND ST_Distance_Sphere(a.location, ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'), 4326)) <= :radiusMeters "
      +
      "ORDER BY ST_Distance_Sphere(a.location, ST_GeomFromText(CONCAT('POINT(', :latitude, ' ', :longitude, ')'), 4326))", nativeQuery = true)
  List<Activity> findNearbyActivitiesByType(
      @Param("latitude") double latitude,
      @Param("longitude") double longitude,
      @Param("radiusMeters") double radiusMeters,
      @Param("type") String type);

}
