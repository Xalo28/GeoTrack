import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Componentes 
import ScanHeader from '../components/ScanHeader';
import ScannerArea from '../components/ScannerArea';
import ScanControls from '../components/ScanControls';

const ScanPhase1Screen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      navigation.navigate('ScanPhase2');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScanHeader 
        navigation={navigation}
        phaseTitle="ESCANEO FASE-1"
        instruction="Escanea el Código del Pedido para registrar"
      />
      
      <ScannerArea isScanning={isScanning} />
      
      <ScanControls 
        isScanning={isScanning}
        onStartScanning={startScanning}
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