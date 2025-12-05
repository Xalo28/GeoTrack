import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl
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
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const scrollViewRef = useRef();

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

  const isValidQRStructure = (data) => {
    try {
      // Intenta parsear el JSON
      const parsedData = JSON.parse(data);

      // Verifica que sea un objeto
      if (typeof parsedData !== 'object' || parsedData === null) {
        return false;
      }

      // Define las claves requeridas
      const requiredKeys = ['NOMBRE', 'CEL', 'DIR', 'DISTRITO', 'PROD'];

      // Verifica que todas las claves requeridas existan
      for (const key of requiredKeys) {
        if (!parsedData.hasOwnProperty(key)) {
          return false;
        }

        // Verifica que los valores no estén vacíos
        if (!parsedData[key] || parsedData[key].trim() === '') {
          return false;
        }
      }

      // Verifica que PROD sea un string o array
      if (typeof parsedData.PROD !== 'string' && !Array.isArray(parsedData.PROD)) {
        return false;
      }

      return true;
    } catch (error) {
      // Si no es un JSON válido
      return false;
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setIsScanning(false);

      console.log('Código escaneado:', { type, data });

      // Validar la estructura del QR
      if (isValidQRStructure(data)) {
        setErrorMessage(null);

        // Parsear los datos para pasarlos correctamente
        const parsedData = JSON.parse(data);

        // Si PROD es string separado por comas, convertirlo a array
        const productos = typeof parsedData.PROD === 'string'
          ? parsedData.PROD.split(',').map(item => item.trim())
          : parsedData.PROD;

        navigation.navigate('ScanPhase2', {
          nombre: parsedData.NOMBRE,
          cel: parsedData.CEL,
          dir: parsedData.DIR,
          distrito: parsedData.DISTRITO,
          productos: productos,
          scanType: type,
          scanDate: new Date().toISOString(),
        });
      } else {
        // Mostrar error y permitir escanear de nuevo
        setErrorMessage('QR inválido. Debe contener: NOMBRE, CEL, DIR, DISTRITO, PROD');

        // Desplazar a la vista del error
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 400, animated: true });
        }, 100);

        // Resetear después de 3 segundos para permitir nuevo escaneo
        setTimeout(() => {
          setScanned(false);
          setErrorMessage(null);
        }, 3000);
      }
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
    setErrorMessage(null);

    // Desplazar hacia arriba cuando se inicia el escaneo
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setErrorMessage(null);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Resetear todos los estados
    setScanned(false);
    setErrorMessage(null);
    setIsScanning(false);

    // Simular un delay para el refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#5CE1E6"
              colors={['#5CE1E6']}
            />
          }
        >
          <View style={styles.permissionContainer}>
            <MaterialIcons name="camera-off" size={60} color="#FF4444" />
            <Text style={styles.permissionText}>Sin acceso a la cámara</Text>
            <Text style={styles.permissionSubtext}>
              Necesitas conceder permisos para usar la función de escaneo
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.permissionButtonGradient}
              >
                <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#5CE1E6"
            colors={['#5CE1E6']}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
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
              Asegúrate de que el código tenga la estructura JSON correcta
            </Text>
            <View style={styles.qrStructureInfo}>
              <Text style={styles.qrStructureText}>
                Estructura requerida: {"\n"}
                <Text style={styles.qrStructureKeys}>
                  {"{"}"NOMBRE": "...", "CEL": "...", "DIR": "...", "DISTRITO": "...", "PROD": "..."
                  {"}"}
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => {
                Alert.alert(
                  'Información del QR',
                  'El código QR debe tener exactamente esta estructura JSON:\n\n' +
                  '{\n' +
                  '  "NOMBRE": "Nombre del cliente",\n' +
                  '  "CEL": "Número de teléfono",\n' +
                  '  "DIR": "Dirección completa",\n' +
                  '  "DISTRITO": "Distrito de entrega",\n' +
                  '  "PROD": "Producto1,Producto2,Producto3"\n' +
                  '}',
                  [{ text: 'ENTENDIDO' }]
                );
              }}
            >
              <MaterialIcons name="info-outline" size={20} color="#5CE1E6" />
              <Text style={styles.infoButtonText}>Más información</Text>
            </TouchableOpacity>
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
                        Apunta la cámara al código QR con estructura JSON
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

          {errorMessage && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color="#FF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.tryAgainButton}
                onPress={() => {
                  setScanned(false);
                  setErrorMessage(null);
                  setIsScanning(true);
                }}
              >
                <Text style={styles.tryAgainText}>INTENTAR DE NUEVO</Text>
              </TouchableOpacity>
            </View>
          )}

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

          {scanned && !errorMessage && (
            <View style={styles.scanResult}>
              <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
              <Text style={styles.scanResultText}>¡Código escaneado exitosamente!</Text>
              <Text style={styles.scanResultSubtext}>Redirigiendo a la siguiente pantalla...</Text>
            </View>
          )}

          {/* Espacio adicional para mejor desplazamiento */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
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
    zIndex: 10,
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
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginBottom: 15,
  },
  qrStructureInfo: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
    width: '100%',
  },
  qrStructureText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 18,
  },
  qrStructureKeys: {
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(92, 225, 230, 0.15)',
    borderRadius: 8,
  },
  infoButtonText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 5,
    fontWeight: '500',
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
    paddingHorizontal: 10,
  },
  scanAreaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    marginBottom: 15,
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    marginVertical: 10,
  },
  tryAgainButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.6)',
  },
  tryAgainText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    alignItems: 'center',
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 203, 113, 0.4)',
    marginBottom: 20,
  },
  scanResultText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ECB71',
    marginTop: 10,
  },
  scanResultSubtext: {
    fontSize: 12,
    color: '#4ECB71',
    marginTop: 5,
    opacity: 0.8,
  },
  bottomSpacer: {
    height: 40,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    minHeight: height * 0.8,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  permissionButton: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  permissionButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
};

export default ScanPhase1Screen;