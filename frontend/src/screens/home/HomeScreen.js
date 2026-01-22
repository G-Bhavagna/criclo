import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, ACTIVITY_TYPES } from '../../config/constants';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { activityAPI, userAPI } from '../../services/api';
import ActivityCard from '../../components/ActivityCard';

const HomeScreen = ({ navigation }) => {
  const { location, region, hasPermission } = useLocation();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'

  useEffect(() => {
    if (location) {
      fetchNearbyActivities();
      updateUserLocation();
    }
  }, [location]);

  const updateUserLocation = async () => {
    if (location) {
      try {
        await userAPI.updateLocation(location.latitude, location.longitude);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
  };

  const fetchNearbyActivities = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const response = await activityAPI.getNearbyActivities(
        location.latitude,
        location.longitude,
        2
      );
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = selectedFilter === 'all'
    ? activities
    : activities.filter(activity => activity.activityType === selectedFilter);

  const getMarkerColor = (activityType) => {
    const activity = ACTIVITY_TYPES.find(a => a.id === activityType);
    return activity ? activity.color : COLORS.primary;
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Location permission is required to use this app
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <Text style={styles.subtitle}>Find activities nearby</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateActivity')}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === 'all' && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {ACTIVITY_TYPES.map((activity) => (
          <TouchableOpacity
            key={activity.id}
            style={[
              styles.filterChip,
              selectedFilter === activity.id && {
                backgroundColor: activity.color,
                borderColor: activity.color,
              },
            ]}
            onPress={() => setSelectedFilter(activity.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === activity.id && styles.filterTextActive,
              ]}
            >
              {activity.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'map' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('map')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'map' && styles.toggleTextActive,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'list' && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode('list')}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      {viewMode === 'map' && region && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          {filteredActivities.map((activity) => (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.latitude,
                longitude: activity.longitude,
              }}
              pinColor={getMarkerColor(activity.activityType)}
              onPress={() => navigation.navigate('ActivityDetails', { activityId: activity.id })}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.marker,
                    { backgroundColor: getMarkerColor(activity.activityType) },
                  ]}
                >
                  <Text style={styles.markerText}>
                    {ACTIVITY_TYPES.find(a => a.id === activity.activityType)?.label[0]}
                  </Text>
                </View>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
          ) : filteredActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No activities found nearby</Text>
              <Text style={styles.emptySubtext}>Be the first to create one!</Text>
            </View>
          ) : (
            filteredActivities.map((activity) => (
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: COLORS.surface,
  },
  greeting: {
    fontSize: 24,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 28,
    color: COLORS.surface,
  },
  filterContainer: {
    backgroundColor: COLORS.surface,
    paddingBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.surface,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    margin: 16,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  toggleTextActive: {
    color: COLORS.surface,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  markerText: {
    fontSize: 16,
    color: COLORS.surface,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 40,
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

export default HomeScreen;
