import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScannerArea = ({ isScanning }) => {
  return (
    <View style={styles.scannerArea}>
      <View style={styles.scannerBox}>
        <Text style={styles.scanText}>ENFOCA EL CODIGO</Text>
        {isScanning && (
          <View style={styles.scanningOverlay}>
            <Text style={styles.scanningText}>ESCANEANDO...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  scannerBox: {
    width: 280,
    height: 280,
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  scanText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  scanningText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ScannerArea;