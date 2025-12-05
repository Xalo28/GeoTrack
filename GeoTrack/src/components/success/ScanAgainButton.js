import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ScanAgainButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.scanAgainContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name="refresh" size={18} color="#5CE1E6" />
      <Text style={styles.scanAgainText}>¿Necesitas escanear más códigos? </Text>
      <Text style={styles.scanAgainLink}>Comenzar nuevo escaneo</Text>
    </TouchableOpacity>
  );
};

const styles = {
  scanAgainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  scanAgainText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 8,
  },
  scanAgainLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
    textDecorationLine: 'underline',
  },
};

export default ScanAgainButton;