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
import { useCameraPermissions } from 'expo-camera';
import { Platform } from 'react-native';

// Importar componentes
import Header from '../components/scanphase1/Header';
import InstructionCard from '../components/scanphase1/InstructionCard';
import CameraScanner from '../components/scanphase1/CameraScanner';
import ScanAreaPlaceholder from '../components/scanphase1/ScanAreaPlaceholder';
import ScanButton from '../components/scanphase1/ScanButton';
import StatusIndicators from '../components/scanphase1/StatusIndicators';
import PermissionView from '../components/scanphase1/PermissionView';
import { commonStyles, scanStyles } from '../components/scanphase1/styles';

const { width } = Dimensions.get('window');

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
      const parsedData = JSON.parse(data);

      if (typeof parsedData !== 'object' || parsedData === null) {
        return false;
      }

      const requiredKeys = ['NOMBRE', 'CEL', 'DIR', 'DISTRITO', 'PROD'];

      for (const key of requiredKeys) {
        if (!parsedData.hasOwnProperty(key)) {
          return false;
        }

        if (!parsedData[key] || parsedData[key].trim() === '') {
          return false;
        }
      }

      if (typeof parsedData.PROD !== 'string' && !Array.isArray(parsedData.PROD)) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setIsScanning(false);

      console.log('Código escaneado:', { type, data });

      if (isValidQRStructure(data)) {
        setErrorMessage(null);

        const parsedData = JSON.parse(data);

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
        setErrorMessage('QR inválido. Debe contener: NOMBRE, CEL, DIR, DISTRITO, PROD');

        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 400, animated: true });
        }, 100);

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
    setScanned(false);
    setErrorMessage(null);
    setIsScanning(false);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Si no hay permisos, mostrar vista de permisos
  if (hasPermission === null || hasPermission === false) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <PermissionView
          hasPermission={hasPermission}
          onRequestPermission={requestPermission}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={commonStyles.backgroundGradient}
      />

      <Header
        onBackPress={() => navigation.goBack()}
        title="ESCANEO FASE-1"
        userName="JUANITO LOPEZ"
      />

      <ScrollView
        ref={scrollViewRef}
        style={commonStyles.scrollView}
        contentContainerStyle={commonStyles.scrollContainer}
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

        <View style={commonStyles.content}>
          <InstructionCard />

          <View style={scanStyles.scanArea}>
            {isScanning ? (
              <CameraScanner
                onBarcodeScanned={handleBarcodeScanned}
                scanned={scanned}
              />
            ) : (
              <ScanAreaPlaceholder />
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

          <StatusIndicators
            isScanning={isScanning}
            scanned={scanned}
            hasPermission={hasPermission}
          />

          <ScanButton
            isScanning={isScanning}
            onPress={isScanning ? stopScanning : startScanning}
          />

          {scanned && !errorMessage && (
            <View style={styles.scanResult}>
              <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
              <Text style={styles.scanResultText}>¡Código escaneado exitosamente!</Text>
              <Text style={styles.scanResultSubtext}>Redirigiendo a la siguiente pantalla...</Text>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos específicos de la pantalla
const styles = {
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
};

export default ScanPhase1Screen;