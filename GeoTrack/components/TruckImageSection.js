import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TruckImageSection = () => {
  return (
    <View style={styles.imageSection}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4529/4529118.png' }}
        style={styles.truckImage}
        resizeMode="contain"
      />
      <Text style={styles.imageText}>Listo para escanear</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  truckImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  imageText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
});

export default TruckImageSection;