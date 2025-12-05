// src/components/menu/MenuSection.js
import React from 'react';
import { View, Text } from 'react-native';

const MenuSection = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.sectionDivider} />
      </View>
      <View style={styles.menuItemsContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = {
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
};

export default MenuSection;