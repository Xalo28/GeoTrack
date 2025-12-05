import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ToggleItem = ({ icon, title, subtitle, value, onValueChange }) => {
  const getNotificationColor = (type) => {
    return '#5CE1E6'; // Color por defecto
  };

  return (
    <View style={styles.toggleItem}>
      <View style={styles.toggleInfo}>
        <View style={[styles.toggleIcon, { backgroundColor: `${getNotificationColor('delivery')}20` }]}>
          <MaterialIcons name={icon} size={20} color={getNotificationColor('delivery')} />
        </View>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleTitle}>{title}</Text>
          {subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <TouchableOpacity 
        style={[styles.toggleSwitch, value && styles.toggleActive]}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#5CE1E6',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
};

export default ToggleItem;