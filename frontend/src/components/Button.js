import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../config/constants';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, text
  size = 'medium', // small, medium, large
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  style,
}) => {
  const getButtonStyle = () => {
    const styles = [buttonStyles.base];
    
    // Variant styles
    if (variant === 'primary') styles.push(buttonStyles.primary);
    else if (variant === 'secondary') styles.push(buttonStyles.secondary);
    else if (variant === 'outline') styles.push(buttonStyles.outline);
    else if (variant === 'text') styles.push(buttonStyles.text);
    
    // Size styles
    if (size === 'small') styles.push(buttonStyles.small);
    else if (size === 'large') styles.push(buttonStyles.large);
    
    // Disabled style
    if (disabled || loading) styles.push(buttonStyles.disabled);
    
    return [...styles, style];
  };

  const getTextStyle = () => {
    const styles = [buttonStyles.baseText];
    
    if (variant === 'primary' || variant === 'secondary') {
      styles.push(buttonStyles.primaryText);
    } else {
      styles.push(buttonStyles.outlineText);
    }
    
    if (size === 'small') styles.push(buttonStyles.smallText);
    else if (size === 'large') styles.push(buttonStyles.largeText);
    
    return styles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {icon && iconPosition === 'left' && (
        <Icon
          name={icon}
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color={variant === 'primary' || variant === 'secondary' ? COLORS.surface : COLORS.primary}
          style={buttonStyles.iconLeft}
        />
      )}
      <Text style={getTextStyle()}>{loading ? 'Loading...' : title}</Text>
      {icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color={variant === 'primary' || variant === 'secondary' ? COLORS.surface : COLORS.primary}
          style={buttonStyles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },
  baseText: {
  },
  primaryText: {
    color: COLORS.surface,
    fontSize: 16,
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
