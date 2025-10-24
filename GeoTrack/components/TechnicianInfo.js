import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TechnicianInfo = () => {
  return (
    <View style={styles.technicianContainer}>
      <Text style={styles.technicianName}>👤 </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  technicianContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  technicianName: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
});

export default TechnicianInfo;