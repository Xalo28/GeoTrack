import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Reutilizando componentes existentes
import ScanHeader from '../components/ScanHeader';
import ScanControls from '../components/ScanControls';

const ScanPhase2Screen = ({ navigation, route }) => {
  
  // Recibir objeto YA PARSEADO desde Fase 1
  const scannedData = route?.params?.scannedData;
  console.log("=== RECIBIDO EN FASE 2 === ", scannedData);

  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simular progreso de escaneo hasta el 100%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300); 

    return () => clearInterval(progressInterval);
  }, []);

  const handleContinue = () => {

    console.log("=== ENVIADO A SUCCESS === ", scannedData);

    if (isComplete) {
      navigation.navigate('Success', { scannedData });
    }
  };

  const ProgressArea = () => (
    <View style={styles.scanContainer}>
      <Text style={styles.scanningTitle}>ESCANEANDO</Text>
      
      <View style={styles.processingContainer}>
        <Text style={styles.processingText}>
          {isComplete ? '¡ESCANEO COMPLETADO!' : 'Procesando pedido...'}
        </Text>
        
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {isComplete && (
        <Text style={styles.readyText}>
          Listo para continuar
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScanHeader 
        navigation={navigation}
        phaseTitle="ESCANEO FASE - 2"
        instruction="Procesando pedido, por favor espere..."
      />

      <ProgressArea />
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !isComplete && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isComplete}
        >
          <Text style={styles.continueButtonText}>
            {isComplete ? 'CONTINUAR' : 'PROCESANDO...'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  scanningTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
  },
  processingContainer: {
    backgroundColor: '#f8f9fa',
    padding: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000000',
    minWidth: 250,
    alignItems: 'center',
    marginBottom: 20,
  },
  processingText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressBar: {
    width: 200,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 5,
  },
  progressText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  readyText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  controls: {
    padding: 25,
    backgroundColor: '#f8f9fa',
  },
  continueButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanPhase2Screen;
