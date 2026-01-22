import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, JOIN_STATUS } from '../../config/constants';
import { joinRequestAPI } from '../../services/api';

const JoinRequestsScreen = ({ route, navigation }) => {
  const { activityId } = route.params;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, [activityId]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await joinRequestAPI.getPendingRequests(activityId);
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching join requests:', error);
      Alert.alert('Error', 'Failed to load join requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      await joinRequestAPI.acceptRequest(requestId);
      Alert.alert('Success', 'Request accepted!');
      fetchPendingRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept request');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    try {
      await joinRequestAPI.rejectRequest(requestId);
      Alert.alert('Success', 'Request rejected');
      fetchPendingRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject request');
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <Image
        source={{ uri: item.user?.profileImageUrl || 'https://via.placeholder.com/60' }}
        style={styles.avatar}
      />
      <View style={styles.requestInfo}>
        <Text style={styles.userName}>{item.user?.name}</Text>
        {item.user?.bio && (
          <Text style={styles.userBio} numberOfLines={2}>
            {item.user.bio}
          </Text>
        )}
        <Text style={styles.requestTime}>
          Requested {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.acceptButton, actionLoading === item.id && styles.disabledButton]}
          onPress={() => handleAccept(item.id)}
          disabled={actionLoading === item.id}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rejectButton, actionLoading === item.id && styles.disabledButton]}
          onPress={() => handleReject(item.id)}
          disabled={actionLoading === item.id}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Requests</Text>
      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending requests</Text>
          <Text style={styles.emptySubtext}>
            New join requests will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 24,
  },
  requestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  requestInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  actions: {
    gap: 8,
  },
  acceptButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  acceptButtonText: {
    fontSize: 14,
    color: COLORS.surface,
  },
  rejectButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.error,
    minWidth: 80,
  },
  rejectButtonText: {
    fontSize: 14,
    color: COLORS.error,
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default JoinRequestsScreen;
