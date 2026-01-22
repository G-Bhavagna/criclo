import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../config/constants';

const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

const ActivityCardSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.ownerInfo}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <View style={{ marginLeft: 12 }}>
            <SkeletonLoader width={100} height={16} style={{ marginBottom: 4 }} />
            <SkeletonLoader width={80} height={12} />
          </View>
        </View>
        <SkeletonLoader width={60} height={24} borderRadius={12} />
      </View>

      <SkeletonLoader width="100%" height={20} style={{ marginBottom: 8 }} />
      <SkeletonLoader width="90%" height={16} style={{ marginBottom: 4 }} />
      <SkeletonLoader width="70%" height={16} style={{ marginBottom: 12 }} />

      <View style={styles.footer}>
        <SkeletonLoader width={80} height={16} />
        <SkeletonLoader width={60} height={16} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.border,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export { SkeletonLoader, ActivityCardSkeleton };
