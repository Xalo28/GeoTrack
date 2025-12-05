// src/components/menu/MenuItem.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuItem = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  isFirst = false, 
  isLast = false, 
  iconColor = '#5CE1E6',
  showChevron = true
}) => {
  const getBackgroundColor = (color) => {
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }
    return 'rgba(92, 225, 230, 0.1)';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.menuItem,
        isFirst && styles.menuItemFirst,
        isLast && styles.menuItemLast
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={[styles.iconContainer, { backgroundColor: getBackgroundColor(iconColor) }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && (
        <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
      )}
    </TouchableOpacity>
  );
};

const styles = {
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
};

export default MenuItem;