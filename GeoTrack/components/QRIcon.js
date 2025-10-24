import React from 'react';
import { View, StyleSheet } from 'react-native';

const QRIcon = () => {
  return (
    <View style={styles.qrIcon}>
      <View style={styles.qrCorner1} />
      <View style={styles.qrCorner2} />
      <View style={styles.qrCorner3} />
      <View style={styles.qrCorner4} />
      <View style={styles.qrCenter} />
    </View>
  );
};

const styles = StyleSheet.create({
  qrIcon: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCorner1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 15,
    height: 15,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 15,
    height: 15,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner4: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCenter: {
    width: 18,
    height: 18,
    backgroundColor: '#5CE1E6',
    borderRadius: 3,
  },
});

export default QRIcon;