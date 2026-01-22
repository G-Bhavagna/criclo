import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../config/constants';

const EmptyState = ({ 
  icon = 'inbox', 
  title = 'Nothing here yet', 
  message = 'Check back later', 
  actionText,
  onActionPress,
  illustration 
}) => {
  return (
    <View style={styles.container}>
      {illustration ? (
        <Image source={illustration} style={styles.illustration} />
      ) : (
        <View style={styles.iconContainer}>
          <Icon name={icon} size={80} color={COLORS.border} />
        </View>
      )}
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {actionText && onActionPress && (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  actionButtonText: {
    fontSize: 16,
    color: COLORS.surface,
  },
});

export default EmptyState;
