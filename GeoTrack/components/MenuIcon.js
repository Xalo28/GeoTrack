import React from 'react';
import { View, StyleSheet } from 'react-native';

const MenuIcon = () => {
  return (
    <View style={styles.menuIcon}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    width: 28,
    height: 24,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#5CE1E6',
    borderRadius: 2,
  },
});

export default MenuIcon;