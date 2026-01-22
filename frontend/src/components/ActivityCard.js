import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, ACTIVITY_TYPES } from '../config/constants';
import { format } from 'date-fns';

const ActivityCard = ({ activity, onPress }) => {
  const activityType = ACTIVITY_TYPES.find(a => a.id === activity.activityType);
  const activityColor = activityType?.color || COLORS.primary;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.ownerInfo}>
          <Image
            source={{ uri: activity.owner?.profileImageUrl || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.ownerName}>{activity.owner?.name}</Text>
            <Text style={styles.time}>
              {format(new Date(activity.eventTime), 'MMM dd, h:mm a')}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: activityColor }]}>
          <Text style={styles.badgeText}>{activityType?.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{activity.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {activity.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.members}>
          <Text style={styles.membersText}>
            {activity.currentMembers || 0}/{activity.maxMembers} members
          </Text>
        </View>
        <View style={styles.distance}>
          <Text style={styles.distanceText}>
            {activity.distance ? `${activity.distance.toFixed(1)} km` : 'Nearby'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  ownerName: {
    fontSize: 14,
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.surface,
  },
  title: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  members: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  distance: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});

export default ActivityCard;
