import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ActionButton = ({ 
  onPress, 
  icon, 
  text, 
  colors, 
  style = {},
  activeOpacity = 0.8 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.actionButton, style]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      <LinearGradient
        colors={colors}
        style={styles.buttonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <MaterialIcons name={icon} size={24} color="#FFFFFF" />
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
};

export default ActionButton;