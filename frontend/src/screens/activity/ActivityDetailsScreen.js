import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { format } from 'date-fns';
import { COLORS, ACTIVITY_TYPES, JOIN_STATUS } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { activityAPI, joinRequestAPI, groupAPI } from '../../services/api';

const ActivityDetailsScreen = ({ route, navigation }) => {
  const { activityId } = route.params;
  const { user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [joinRequest, setJoinRequest] = useState(null);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchActivityDetails();
  }, [activityId]);

  const fetchActivityDetails = async () => {
    setLoading(true);
    try {
      const activityResponse = await activityAPI.getActivityById(activityId);
      setActivity(activityResponse.data);

      // Check if user has a join request
      const joinRequestsResponse = await joinRequestAPI.getUserJoinRequests(user.id);
      const userRequest = joinRequestsResponse.data.find(
        req => req.activityId === activityId
      );
      setJoinRequest(userRequest);

      // If user is accepted, fetch group and members
      if (userRequest?.status === JOIN_STATUS.ACCEPTED) {
        const groupResponse = await groupAPI.getGroupByActivity(activityId);
        setGroup(groupResponse.data);
        
        const membersResponse = await groupAPI.getGroupMembers(groupResponse.data.id);
        setMembers(membersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching activity details:', error);
      Alert.alert('Error', 'Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async () => {
    setActionLoading(true);
    try {
      await joinRequestAPI.sendJoinRequest(activityId);
      Alert.alert('Success', 'Join request sent!');
      fetchActivityDetails();
    } catch (error) {
      Alert.alert('Error', 'Failed to send join request');
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewRequests = () => {
    navigation.navigate('JoinRequests', { activityId });
  };

  const handleOpenChat = () => {
    if (group) {
      navigation.navigate('GroupChat', { groupId: group.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!activity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Activity not found</Text>
      </View>
    );
  }

  const activityType = ACTIVITY_TYPES.find(a => a.id === activity.activityType);
  const isOwner = activity.ownerId === user.id;
  const isMember = joinRequest?.status === JOIN_STATUS.ACCEPTED;
  const hasPendingRequest = joinRequest?.status === JOIN_STATUS.PENDING;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.badge, { backgroundColor: activityType?.color }]}>
          <Text style={styles.badgeText}>{activityType?.label}</Text>
        </View>

        <Text style={styles.title}>{activity.title}</Text>

        {/* Owner Info */}
        <View style={styles.ownerSection}>
          <Image
            source={{ uri: activity.owner?.profileImageUrl || 'https://via.placeholder.com/60' }}
            style={styles.ownerAvatar}
          />
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerLabel}>Organized by</Text>
            <Text style={styles.ownerName}>{activity.owner?.name}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {format(new Date(activity.eventTime), 'MMM dd, yyyy • h:mm a')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Members</Text>
            <Text style={styles.detailValue}>
              {activity.currentMembers || 0} / {activity.maxMembers}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>
              {activity.distance ? `${activity.distance.toFixed(1)} km away` : 'Nearby'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>

        {/* Members */}
        {isMember && members.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Members</Text>
            {members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Image
                  source={{ uri: member.profileImageUrl || 'https://via.placeholder.com/40' }}
                  style={styles.memberAvatar}
                />
                <Text style={styles.memberName}>{member.name}</Text>
                {member.id === activity.ownerId && (
                  <View style={styles.ownerBadge}>
                    <Text style={styles.ownerBadgeText}>Owner</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isOwner ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleViewRequests}
              >
                <Text style={styles.primaryButtonText}>View Join Requests</Text>
              </TouchableOpacity>
              {group && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleOpenChat}
                >
                  <Text style={styles.secondaryButtonText}>Open Group Chat</Text>
                </TouchableOpacity>
              )}
            </>
          ) : isMember ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOpenChat}
            >
              <Text style={styles.primaryButtonText}>Open Group Chat</Text>
            </TouchableOpacity>
          ) : hasPendingRequest ? (
            <View style={styles.pendingButton}>
              <Text style={styles.pendingButtonText}>Request Pending</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, actionLoading && styles.disabledButton]}
              onPress={handleJoinRequest}
              disabled={actionLoading}
            >
              <Text style={styles.primaryButtonText}>
                {actionLoading ? 'Sending...' : 'Request to Join'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    color: COLORS.surface,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 24,
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 18,
    color: COLORS.text,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  ownerBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ownerBadgeText: {
    fontSize: 12,
    color: COLORS.surface,
  },
  actions: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  pendingButton: {
    backgroundColor: COLORS.warning,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pendingButtonText: {
    color: COLORS.surface,
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
});

export default ActivityDetailsScreen;
