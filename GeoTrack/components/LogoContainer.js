import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogoContainer = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoText}>LOGO SAVA</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5CE1E6',
    borderStyle: 'dashed',
  },
  logoText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LogoContainer;