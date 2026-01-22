import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../config/constants';

const FilterChip = ({ label, icon, selected, onPress, color }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: color || COLORS.primary, borderColor: color || COLORS.primary },
      ]}
      onPress={onPress}
    >
      {icon && (
        <Icon 
          name={icon} 
          size={16} 
          color={selected ? COLORS.surface : COLORS.textLight}
          style={styles.icon}
        />
      )}
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectedLabel: {
    color: COLORS.surface,
  },
});

export default FilterChip;
