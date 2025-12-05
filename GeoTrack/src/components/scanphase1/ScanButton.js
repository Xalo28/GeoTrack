import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const ScanButton = ({ isScanning, onPress }) => {
  return (
    <TouchableOpacity
      style={buttonStyles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isScanning ? ['#FF4444', '#CC0000'] : ['#5CE1E6', '#00adb5']}
        style={buttonStyles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <MaterialIcons
          name={isScanning ? "stop-circle" : "qr-code-scanner"}
          size={24}
          color="#FFFFFF"
        />
        <Text style={buttonStyles.text}>
          {isScanning ? 'DETENER ESCANEO' : 'INICIAR ESCANEO'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const buttonStyles = {
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
};

export default ScanButton;