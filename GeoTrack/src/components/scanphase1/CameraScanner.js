import React from 'react';
import { View, Text } from 'react-native';
import { CameraView } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { scanStyles } from './styles';

const CameraScanner = ({ onBarcodeScanned, scanned }) => {
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={{ flex: 1 }}
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
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
      >
        <View style={cameraStyles.overlay}>
          <View style={scanStyles.scanFrame}>
            <View style={[scanStyles.corner, scanStyles.cornerTopLeft]} />
            <View style={[scanStyles.corner, scanStyles.cornerTopRight]} />
            <View style={[scanStyles.corner, scanStyles.cornerBottomLeft]} />
            <View style={[scanStyles.corner, scanStyles.cornerBottomRight]} />

            <View style={cameraStyles.scanLineContainer}>
              <View style={scanStyles.scanLine} />
            </View>
          </View>

          <View style={cameraStyles.instructions}>
            <MaterialIcons name="center-focus-strong" size={40} color="#5CE1E6" />
            <Text style={cameraStyles.title}>ENFOCA EL CÓDIGO</Text>
            <Text style={cameraStyles.description}>
              Apunta la cámara al código QR con estructura JSON
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const cameraStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  instructions: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
};

export default CameraScanner;