import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

const ScanPhase1Screen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await requestPermission();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setIsScanning(false);
      
      console.log('Código escaneado:', { type, data });
      
      navigation.navigate('ScanPhase2', { 
        scannedData: data,
        scanType: type,
        scanDate: new Date().toISOString()
      });
    }
  };

  const startScanning = () => {
    if (hasPermission === false) {
      Alert.alert(
        'Permiso denegado',
        'Necesitas permitir el acceso a la cámara para escanear códigos.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsScanning(true);
    setScanned(false);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera" size={60} color="#5CE1E6" />
          <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-off" size={60} color="#FF4444" />
          <Text style={styles.permissionText}>Sin acceso a la cámara</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ESCANEO FASE-1</Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.instructionCard}>
          <MaterialIcons name="qr-code-scanner" size={50} color="#5CE1E6" />
          <Text style={styles.instructionTitle}>
            Escanea el Código del Pedido para registrar
          </Text>
          <Text style={styles.instructionSubtitle}>
            Asegúrate de que el código esté bien iluminado y enfocado
          </Text>
        </View>

        <View style={styles.scanArea}>
          {isScanning ? (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'qr',
                    'ean13',
                    'ean8',
                    'upc_e',
                    'code39',
                    'code128',
                    'itf14'
                  ],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              >
                <View style={styles.scanOverlay}>
                  <View style={styles.scanFrame}>
                    <View style={[styles.corner, styles.cornerTopLeft]} />
                    <View style={[styles.corner, styles.cornerTopRight]} />
                    <View style={[styles.corner, styles.cornerBottomLeft]} />
                    <View style={[styles.corner, styles.cornerBottomRight]} />
                    
                    <View style={styles.scanLineContainer}>
                      <View style={styles.scanLine} />
                    </View>
                  </View>
                  
                  <View style={styles.scanInstructions}>
                    <MaterialIcons name="center-focus-strong" size={40} color="#5CE1E6" />
                    <Text style={styles.scanTitle}>ENFOCA EL CÓDIGO</Text>
                    <Text style={styles.scanDescription}>
                      Apunta la cámara al código QR o de barras
                    </Text>
                  </View>
                </View>
              </CameraView>
            </View>
          ) : (
            <LinearGradient
              colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
              style={styles.scanAreaPlaceholder}
            >
              <View style={styles.placeholderContent}>
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.cornerTopLeft]} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                  
                  <View style={styles.scanInstructions}>
                    <MaterialIcons name="qr-code-2" size={60} color="#5CE1E6" />
                    <Text style={styles.scanTitle}>LISTO PARA ESCANEAR</Text>
                    <Text style={styles.scanDescription}>
                      Presiona "INICIAR ESCANEO" para activar la cámara
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
        </View>

        <View style={styles.indicatorsContainer}>
          <View style={styles.indicator}>
            <View style={[styles.indicatorDot, { 
              backgroundColor: isScanning ? '#5CE1E6' : '#a0a0c0' 
            }]} />
            <Text style={styles.indicatorText}>Cámara activa</Text>
          </View>
          <View style={styles.indicator}>
            <View style={[styles.indicatorDot, { 
              backgroundColor: scanned ? '#4ECB71' : '#a0a0c0' 
            }]} />
            <Text style={styles.indicatorText}>Escaneo completado</Text>
          </View>
          <View style={styles.indicator}>
            <View style={[styles.indicatorDot, { 
              backgroundColor: hasPermission ? '#4ECB71' : '#FF4444' 
            }]} />
            <Text style={styles.indicatorText}>Permiso de cámara</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.scanButton}
          onPress={isScanning ? stopScanning : startScanning}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isScanning ? ['#FF4444', '#CC0000'] : ['#5CE1E6', '#00adb5']}
            style={styles.scanButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons 
              name={isScanning ? "stop-circle" : "qr-code-scanner"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.scanButtonText}>
              {isScanning ? 'DETENER ESCANEO' : 'INICIAR ESCANEO'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {scanned && (
          <View style={styles.scanResult}>
            <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
            <Text style={styles.scanResultText}>¡Código escaneado exitosamente!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  instructionCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  instructionSubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  scanArea: {
    height: width * 0.8,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#5CE1E6',
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  scanLine: {
    height: 2,
    backgroundColor: '#5CE1E6',
    width: '100%',
  },
  scanInstructions: {
    alignItems: 'center',
    marginTop: 30,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 5,
  },
  scanDescription: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  scanAreaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
  },
  indicatorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  indicatorText: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  scanButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  scanResult: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 203, 113, 0.4)',
  },
  scanResultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ECB71',
    marginLeft: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  permissionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#5CE1E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default ScanPhase1Screen;