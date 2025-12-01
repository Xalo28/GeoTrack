import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import ScanHeader from '../components/ScanHeader';
import ScannerArea from '../components/ScannerArea';
import ScanControls from '../components/ScanControls';

import { parseQR } from '../utils/parseQR';

const ScanPhase1Screen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  const handleBarcodeScanned = ({ type, data }) => {
console.log("========== QR RAW DATA =========");
console.log(data);
console.log("================================");
    const parsed = parseQR(data);

    if (!parsed) {
      Alert.alert(
        "QR inválido",
        "El QR debe contener: NOMBRE, CEL, DIR y PROD"
      );
      setIsScanning(false);
      return;
    }

    navigation.navigate('ScanPhase2', { scannedData: parsed });
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScanHeader 
        navigation={navigation}
        phaseTitle="ESCANEO FASE-1"
        instruction="Escanea el Código del Pedido para registrar"
      />
      
      <ScannerArea 
        isScanning={isScanning}
        onBarcodeScanned={handleBarcodeScanned}
      />
      
      <ScanControls 
        isScanning={isScanning}
        onStartScanning={isScanning ? stopScanning : startScanning}
        buttonText={isScanning ? 'DETENER ESCANEO' : 'INICIAR ESCANEO'}
        scanningText="ESCANEANDO..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default ScanPhase1Screen;
