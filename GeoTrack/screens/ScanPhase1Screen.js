import React, { useState, useEffect } from 'react';
import { 
  View, 
  SafeAreaView,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import ScanPhase1ScreenStyles from '../styles/ScanPhase1ScreenStyles'; // Importa los estilos

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
      
      // Navegar directamente a la fase 2
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
      <SafeAreaView style={ScanPhase1ScreenStyles.container}>
        <View style={ScanPhase1ScreenStyles.permissionContainer}>
          <MaterialIcons name="camera" size={60} color="#5CE1E6" />
          <Text style={ScanPhase1ScreenStyles.permissionText}>Solicitando permiso de cámara...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={ScanPhase1ScreenStyles.container}>
        <View style={ScanPhase1ScreenStyles.permissionContainer}>
          <MaterialIcons name="camera-off" size={60} color="#FF4444" />
          <Text style={ScanPhase1ScreenStyles.permissionText}>Sin acceso a la cámara</Text>
          <TouchableOpacity 
            style={ScanPhase1ScreenStyles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={ScanPhase1ScreenStyles.permissionButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ScanPhase1ScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={ScanPhase1ScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
      <View style={ScanPhase1ScreenStyles.customHeader}>
        <TouchableOpacity 
          style={ScanPhase1ScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={ScanPhase1ScreenStyles.headerCenter}>
          <Text style={ScanPhase1ScreenStyles.headerTitle}>ESCANEO FASE-1</Text>
          <Text style={ScanPhase1ScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={ScanPhase1ScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={ScanPhase1ScreenStyles.profileCircle}
          >
            <Text style={ScanPhase1ScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={ScanPhase1ScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={ScanPhase1ScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      {/* Contenido principal */}
      <View style={ScanPhase1ScreenStyles.content}>
        {/* Instrucción principal */}
        <View style={ScanPhase1ScreenStyles.instructionCard}>
          <MaterialIcons name="qr-code-scanner" size={50} color="#5CE1E6" />
          <Text style={ScanPhase1ScreenStyles.instructionTitle}>
            Escanea el Código del Pedido para registrar
          </Text>
          <Text style={ScanPhase1ScreenStyles.instructionSubtitle}>
            Asegúrate de que el código esté bien iluminado y enfocado
          </Text>
        </View>

        {/* Área de cámara/escaneo */}
        <View style={ScanPhase1ScreenStyles.scanArea}>
          {isScanning ? (
            <View style={ScanPhase1ScreenStyles.cameraContainer}>
              <CameraView
                style={ScanPhase1ScreenStyles.camera}
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
                {/* Marco de escaneo superpuesto */}
                <View style={ScanPhase1ScreenStyles.scanOverlay}>
                  <View style={ScanPhase1ScreenStyles.scanFrame}>
                    {/* Esquinas del marco */}
                    <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerTopLeft]} />
                    <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerTopRight]} />
                    <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerBottomLeft]} />
                    <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerBottomRight]} />
                    
                    {/* Línea de escaneo animada */}
                    <View style={ScanPhase1ScreenStyles.scanLineContainer}>
                      <View style={ScanPhase1ScreenStyles.scanLine} />
                    </View>
                  </View>
                  
                  <View style={ScanPhase1ScreenStyles.scanInstructions}>
                    <MaterialIcons name="center-focus-strong" size={40} color="#5CE1E6" />
                    <Text style={ScanPhase1ScreenStyles.scanTitle}>ENFOCA EL CÓDIGO</Text>
                    <Text style={ScanPhase1ScreenStyles.scanDescription}>
                      Apunta la cámara al código QR o de barras
                    </Text>
                  </View>
                </View>
              </CameraView>
            </View>
          ) : (
            <LinearGradient
              colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
              style={ScanPhase1ScreenStyles.scanAreaPlaceholder}
            >
              <View style={ScanPhase1ScreenStyles.placeholderContent}>
                <View style={ScanPhase1ScreenStyles.scanFrame}>
                  <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerTopLeft]} />
                  <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerTopRight]} />
                  <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerBottomLeft]} />
                  <View style={[ScanPhase1ScreenStyles.corner, ScanPhase1ScreenStyles.cornerBottomRight]} />
                  
                  <View style={ScanPhase1ScreenStyles.scanInstructions}>
                    <MaterialIcons name="qr-code-2" size={60} color="#5CE1E6" />
                    <Text style={ScanPhase1ScreenStyles.scanTitle}>LISTO PARA ESCANEAR</Text>
                    <Text style={ScanPhase1ScreenStyles.scanDescription}>
                      Presiona "INICIAR ESCANEO" para activar la cámara
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
        </View>

        {/* Indicadores */}
        <View style={ScanPhase1ScreenStyles.indicatorsContainer}>
          <View style={ScanPhase1ScreenStyles.indicator}>
            <View style={[ScanPhase1ScreenStyles.indicatorDot, { 
              backgroundColor: isScanning ? '#5CE1E6' : '#a0a0c0' 
            }]} />
            <Text style={ScanPhase1ScreenStyles.indicatorText}>Cámara activa</Text>
          </View>
          <View style={ScanPhase1ScreenStyles.indicator}>
            <View style={[ScanPhase1ScreenStyles.indicatorDot, { 
              backgroundColor: scanned ? '#4ECB71' : '#a0a0c0' 
            }]} />
            <Text style={ScanPhase1ScreenStyles.indicatorText}>Escaneo completado</Text>
          </View>
          <View style={ScanPhase1ScreenStyles.indicator}>
            <View style={[ScanPhase1ScreenStyles.indicatorDot, { 
              backgroundColor: hasPermission ? '#4ECB71' : '#FF4444' 
            }]} />
            <Text style={ScanPhase1ScreenStyles.indicatorText}>Permiso de cámara</Text>
          </View>
        </View>

        {/* Botón de inicio/detención de escaneo */}
        <TouchableOpacity 
          style={ScanPhase1ScreenStyles.scanButton}
          onPress={isScanning ? stopScanning : startScanning}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isScanning ? ['#FF4444', '#CC0000'] : ['#5CE1E6', '#00adb5']}
            style={ScanPhase1ScreenStyles.scanButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons 
              name={isScanning ? "stop-circle" : "qr-code-scanner"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={ScanPhase1ScreenStyles.scanButtonText}>
              {isScanning ? 'DETENER ESCANEO' : 'INICIAR ESCANEO'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Información de escaneo */}
        {scanned && (
          <View style={ScanPhase1ScreenStyles.scanResult}>
            <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
            <Text style={ScanPhase1ScreenStyles.scanResultText}>¡Código escaneado exitosamente!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ScanPhase1Screen;