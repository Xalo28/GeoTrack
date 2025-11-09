import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';


// Componentes 
import ScanHeader from '../components/ScanHeader';
import ScannerArea from '../components/ScannerArea';
import ScanControls from '../components/ScanControls';

const ScanPhase1Screen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
  };

  const handleBarcodeScanned = ({ type, data }) => {
    console.log('Código escaneado:', { type, data });
    
    // DETENER el escaneo inmediatamente
    setIsScanning(false);
    setScanResult(data);
    
    // Navegar directamente sin Alert
    navigation.navigate('ScanPhase2', { scannedData: data });
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