import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const ScannerArea = ({ isScanning, onBarcodeScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (isScanning) {
      setHasScanned(false);
    }
  }, [isScanning]);

  const handleBarcodeScanned = ({ type, data }) => {
    if (isScanning && !hasScanned) {
      setHasScanned(true);
      onBarcodeScanned({ type, data });
    }
  };

  if (!permission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Solicitando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Se necesita acceso a la cámara para escanear códigos</Text>
        <Text style={styles.permissionButton} onPress={requestPermission}>
          Permitir Cámara
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.scannerArea}>
      <View style={styles.scannerBox}>
        {isScanning ? (
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'pdf417', 'ean13', 'ean8', 'upc_a', 'upc_e'],
              }}
              onBarcodeScanned={handleBarcodeScanned}
            />
            
            {/* OVERLAY CON POSICIÓN ABSOLUTA */}
            <View style={styles.scannerOverlay}>
              <Text style={styles.scanText}>ENFOCA EL CÓDIGO</Text>
              <View style={styles.scanFrame} />
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <Text style={styles.scanningText}>ESCANEANDO...</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.scanText}>ENFOCA EL CÓDIGO</Text>
            <Text style={styles.instructionText}>
              Presiona "INICIAR ESCANEO" para comenzar
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

const styles = StyleSheet.create({
  scannerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scannerBox: {
    width: scannerSize,
    height: scannerSize,
    borderWidth: 4,
    borderColor: '#000000',
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative', // IMPORTANTE para el overlay
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: scannerSize * 0.6,
    height: scannerSize * 0.6,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 20,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 20,
  },
  scanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // Cambié a blanco para mejor contraste
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instructionText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Fondo semitransparente
  },
  scanningText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6c757d',
  },
  permissionButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
    padding: 10,
  },
});

export default ScannerArea;