import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { activityAPI } from '../../services/api';
import ActivityCard from '../../components/ActivityCard';

const MyActivitiesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('created'); // 'created' or 'joined'
  const [createdActivities, setCreatedActivities] = useState([]);
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const [createdResponse, joinedResponse] = await Promise.all([
        activityAPI.getUserActivities(user.id),
        activityAPI.getJoinedActivities(user.id),
      ]);
      setCreatedActivities(createdResponse.data);
      setJoinedActivities(joinedResponse.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedActivities = activeTab === 'created' 
    ? createdActivities 
    : joinedActivities;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Activities</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'created' && styles.activeTab]}
          onPress={() => setActiveTab('created')}
        >
          <Text
            style={[styles.tabText, activeTab === 'created' && styles.activeTabText]}
          >
            Created
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
          onPress={() => setActiveTab('joined')}
        >
          <Text
            style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}
          >
            Joined
          </Text>
        </TouchableOpacity>
      </View>

      {/* Activities List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <ScrollView 
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {displayedActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'created' 
                  ? 'No activities created yet' 
                  : 'No activities joined yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'created' 
                  ? 'Create your first activity!' 
                  : 'Join activities nearby'}
              </Text>
            </View>
          ) : (
            displayedActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onPress={() => navigation.navigate('ActivityDetails', { activityId: activity.id })}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 28,
    color: COLORS.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  loader: {
    marginTop: 40,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 24,
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

export default MyActivitiesScreen;
