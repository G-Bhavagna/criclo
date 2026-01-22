import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, ACTIVITY_TYPES } from '../../config/constants';

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  
  // Mock user data - will come from API
  const user = {
    id: userId,
    name: 'Sarah Johnson',
    profileImageUrl: 'https://via.placeholder.com/150',
    bio: 'Love exploring new cafes and outdoor activities! Always up for a morning run or coffee chat.',
    interests: ['shopping', 'cafe', 'fitness', 'walking'],
    activitiesCount: 12,
    rating: 4.8,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: user.profileImageUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.name}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.activitiesCount}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFB800" />
              <Text style={styles.statValue}> {user.rating}</Text>
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Interests */}
      {user.interests && user.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interestId) => {
              const interest = ACTIVITY_TYPES.find(a => a.id === interestId);
              return interest ? (
                <View
                  key={interestId}
                  style={[styles.interestChip, { backgroundColor: interest.color }]}
                >
                  <Icon name={interest.icon} size={16} color={COLORS.surface} style={{ marginRight: 6 }} />
                  <Text style={styles.interestText}>{interest.label}</Text>
                </View>
              ) : null;
            })}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.reportButton}>
          <Icon name="flag" size={20} color={COLORS.error} />
          <Text style={styles.reportText}>Report User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 24,
    color: COLORS.text,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    color: COLORS.surface,
  },
  actions: {
    padding: 24,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  reportText: {
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 8,
  },
});

export default UserProfileScreen;
