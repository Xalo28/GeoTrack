import React from 'react';
import { Modal, Animated, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

export const ModalRequest = ({
  visible,
  modalScale,
  modalOpacity,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View style={[
          styles.modalContent,
          {
            transform: [{ scale: modalScale }],
            opacity: modalOpacity
          }
        ]}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.modalIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="edit" size={40} color="#FFFFFF" />
          </LinearGradient>
          
          <Text style={styles.modalTitle}>Solicitar Cambios</Text>
          
          <Text style={styles.modalSubtitle}>
            Se enviará una solicitud formal al administrador para modificar tu información personal. ¿Deseas continuar?
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
              onPress={onConfirm}
            >
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonPrimaryText}>CONFIRMAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
export default ModalRequest;