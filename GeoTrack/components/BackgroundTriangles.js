import React from 'react';
import { View, StyleSheet } from 'react-native';

const BackgroundTriangles = () => {
  return (
    <>
      <View style={styles.triangleTopLeft} />
      <View style={styles.triangleBottomRight} />
    </>
  );
};

const styles = StyleSheet.create({
  triangleTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 180,
    borderTopWidth: 380,
    borderRightColor: 'transparent',
    borderTopColor: '#5CE1E6',
  },
  triangleBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 180,
    borderBottomWidth: 280,
    borderLeftColor: 'transparent',
    borderBottomColor: '#5CE1E6',
  },
});

export default BackgroundTriangles;