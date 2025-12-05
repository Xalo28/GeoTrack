import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Dimensions, 
  Animated 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PasswordInput } from './PasswordInput';

const { width } = Dimensions.get('window');

export const ChangePasswordModal = ({ 
  visible, 
  onClose, 
  passwordData, 
  setPasswordData, 
  passwordErrors, 
  onSave 
}) => {
  const [modalScale] = React.useState(new Animated.Value(0.5));
  const [modalOpacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      animateModalIn();
    }
  }, [visible]);

  const animateModalIn = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0.5,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={animateModalOut}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View style={[
          styles.modalContent,
          {
            transform: [{ scale: modalScale }],
            opacity: modalOpacity
          }
        ]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={animateModalOut}>
              <MaterialIcons name="close" size={24} color="#a0a0c0" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <PasswordInput
              label="Contraseña Actual"
              value={passwordData.currentPassword}
              onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
              error={passwordErrors.currentPassword}
              placeholder="Ingresa tu contraseña actual"
            />
            
            <PasswordInput
              label="Nueva Contraseña"
              value={passwordData.newPassword}
              onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
              error={passwordErrors.newPassword}
              placeholder="Mínimo 8 caracteres"
            />
            
            <PasswordInput
              label="Confirmar Nueva Contraseña"
              value={passwordData.confirmPassword}
              onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
              error={passwordErrors.confirmPassword}
              placeholder="Repite la nueva contraseña"
            />
            
            <View style={styles.passwordRules}>
              <Text style={styles.rulesTitle}>Requisitos de contraseña:</Text>
              <Text style={styles.ruleItem}>• Mínimo 8 caracteres</Text>
              <Text style={styles.ruleItem}>• Al menos una letra mayúscula</Text>
              <Text style={styles.ruleItem}>• Al menos un número</Text>
              <Text style={styles.ruleItem}>• Al menos un carácter especial</Text>
            </View>
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={animateModalOut}
            >
              <Text style={styles.modalButtonSecondaryText}>CANCELAR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={onSave}
            >
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonPrimaryText}>CAMBIAR</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
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
  modalScroll: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  passwordRules: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  ruleItem: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 5,
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
export default ChangePasswordModal;