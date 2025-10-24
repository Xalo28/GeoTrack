import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ScanButton = ({ navigation }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.mainButton}
        onPress={() => navigation.navigate('ScanPhase1')}
      >
        <Text style={styles.mainButtonText}>🚚 ESCANEAR NUEVO PEDIDO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 25,
  },
  mainButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#27ae60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanButton;