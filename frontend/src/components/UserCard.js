import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../config/constants';

const UserCard = ({ user, onPress, showBio = true, rightAction }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        {showBio && user.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
        )}
        {user.distance && (
          <Text style={styles.distance}>{user.distance.toFixed(1)} km away</Text>
        )}
      </View>
      {rightAction || (
        <Icon name="chevron-right" size={24} color={COLORS.textLight} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: COLORS.primary,
  },
});

export default UserCard;
