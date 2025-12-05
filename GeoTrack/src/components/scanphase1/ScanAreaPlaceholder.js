import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { scanStyles } from './styles';

const ScanAreaPlaceholder = () => {
  return (
    <LinearGradient
      colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
      style={{ flex: 1 }}
    >
      <View style={placeholderStyles.content}>
        <View style={scanStyles.scanFrame}>
          <View style={[scanStyles.corner, scanStyles.cornerTopLeft]} />
          <View style={[scanStyles.corner, scanStyles.cornerTopRight]} />
          <View style={[scanStyles.corner, scanStyles.cornerBottomLeft]} />
          <View style={[scanStyles.corner, scanStyles.cornerBottomRight]} />

          <View style={placeholderStyles.instructions}>
            <MaterialIcons name="qr-code-2" size={60} color="#5CE1E6" />
            <Text style={placeholderStyles.title}>LISTO PARA ESCANEAR</Text>
            <Text style={placeholderStyles.description}>
              Presiona "INICIAR ESCANEO" para activar la cámara
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const placeholderStyles = {
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    alignItems: 'center',
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

export default ScanAreaPlaceholder;