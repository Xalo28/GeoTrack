import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ScanControls = ({ 
  isScanning, 
  onStartScanning, 
  buttonText = 'INICIAR ESCANEO',
  scanningText = 'ESCANEANDO...',
  disabled = false,
  buttonStyle = {},
  textStyle = {}
}) => {
  return (
    <View style={styles.controls}>
      <TouchableOpacity 
        style={[
          styles.scanButton,
          (isScanning || disabled) && styles.scanButtonDisabled,
          buttonStyle
        ]}
        onPress={onStartScanning}
        disabled={isScanning || disabled}
      >
        <Text style={[styles.scanButtonText, textStyle]}>
          {isScanning ? scanningText : buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    padding: 25,
    backgroundColor: '#f8f9fa',
  },
  scanButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanControls;