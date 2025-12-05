import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const OfflineModal = ({ 
  modalScale, 
  modalOpacity, 
  offlineEnabled, 
  onToggleOffline, 
  onClose 
}) => {
  return (
    <View style={[
      styles.modalContent,
      {
        transform: [{ scale: modalScale }],
        opacity: modalOpacity
      }
    ]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Modo Offline</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.offlineModalContent}>
        <MaterialIcons 
          name={offlineEnabled ? "wifi-off" : "wifi"} 
          size={50} 
          color="#5CE1E6" 
          style={styles.offlineIcon}
        />
        
        <Text style={styles.offlineTitle}>
          {offlineEnabled ? 'Modo Offline Activado' : 'Activar Modo Offline'}
        </Text>
        
        <Text style={styles.offlineDescription}>
          {offlineEnabled 
            ? 'La aplicación funciona sin conexión a internet. Algunas funciones pueden estar limitadas.' 
            : 'Al activar el modo offline, los datos se almacenarán localmente para su uso sin internet.'}
        </Text>
        
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonSecondaryText}>CANCELAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={onToggleOffline}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={styles.modalButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.modalButtonPrimaryText}>
                {offlineEnabled ? 'DESACTIVAR' : 'ACTIVAR'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = {
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  offlineModalContent: {
    padding: 20,
    alignItems: 'center',
  },
  offlineIcon: {
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  offlineDescription: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  modalButtonPrimary: {
    backgroundColor: 'transparent',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    color: '#5CE1E6',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export default OfflineModal;