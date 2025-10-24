import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SuccessIcon = ({ size = 120, checkmarkSize = 60, backgroundColor = '#27ae60', borderColor = '#219a52' }) => {
  return (
    <View style={[
      styles.successIcon, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: backgroundColor,
        borderColor: borderColor
      }
    ]}>
      <Text style={[styles.checkmark, { fontSize: checkmarkSize }]}>✓</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  successIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 30,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SuccessIcon;