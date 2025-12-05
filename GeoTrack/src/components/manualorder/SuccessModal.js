import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export const SuccessModal = ({
  visible,
  onClose,
  modalScale,
  modalOpacity,
  isEditMode,
  savedOrder,
  onCreateAnother,
  onGoToOrders
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }], opacity: modalOpacity }]}>
          <LinearGradient colors={['#4ECB71', '#2e7d32']} style={styles.successIcon}>
            <MaterialIcons name="check" size={40} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.modalTitle}>
            {isEditMode ? 'Pedido Actualizado!' : 'Pedido Guardado!'}
          </Text>
          <Text style={styles.modalSubtitle}>
            {isEditMode ? 'Los cambios se han guardado correctamente.' : 'El pedido ha sido registrado exitosamente.'}
          </Text>
          
          {savedOrder && (
            <View style={styles.orderInfo}>
              <View style={styles.orderInfoRow}>
                <MaterialIcons name="receipt" size={16} color="#5CE1E6" />
                <Text style={styles.orderInfoLabel}>Pedido:</Text>
                <Text style={styles.orderInfoValue}>{savedOrder.numeroPedido}</Text>
              </View>
              <View style={styles.orderInfoRow}>
                <MaterialIcons name="person" size={16} color="#5CE1E6" />
                <Text style={styles.orderInfoLabel}>Cliente:</Text>
                <Text style={styles.orderInfoValue}>{savedOrder.cliente}</Text>
              </View>
              <View style={styles.orderInfoRow}>
                <MaterialIcons name="inventory" size={16} color="#5CE1E6" />
                <Text style={styles.orderInfoLabel}>Productos:</Text>
                <Text style={styles.orderInfoValue} numberOfLines={1}>
                  {Array.isArray(savedOrder.productos) ? savedOrder.productos.join(', ') : savedOrder.productos}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonSecondary]} 
              onPress={onCreateAnother}
            >
              <Text style={styles.modalButtonSecondaryText}>
                {isEditMode ? 'VOLVER' : 'CREAR OTRO'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]} 
              onPress={onGoToOrders}
            >
              <LinearGradient 
                colors={['#5CE1E6', '#00adb5']} 
                style={styles.modalButtonGradient}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.modalButtonPrimaryText}>VER PEDIDOS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  modalContent: { 
    backgroundColor: '#1a1a2e', 
    borderRadius: 20, 
    padding: 25, 
    width: '90%', 
    maxWidth: 400, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(92, 225, 230, 0.3)',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10 
  },
  successIcon: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  modalSubtitle: { 
    fontSize: 16, 
    color: '#a0a0c0', 
    textAlign: 'center', 
    marginBottom: 25, 
    lineHeight: 22 
  },
  orderInfo: { 
    width: '100%', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 25 
  },
  orderInfoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  orderInfoLabel: { 
    fontSize: 12, 
    color: '#a0a0c0', 
    marginLeft: 8, 
    marginRight: 5, 
    width: 80 
  },
  orderInfoValue: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    fontWeight: '600', 
    flex: 1 
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    gap: 10 
  },
  modalButton: { 
    flex: 1, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  modalButtonSecondary: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderWidth: 1, 
    borderColor: 'rgba(92, 225, 230, 0.4)' 
  },
  modalButtonPrimary: { 
    backgroundColor: 'transparent' 
  },
  modalButtonGradient: { 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  modalButtonSecondaryText: { 
    color: '#5CE1E6', 
    fontWeight: 'bold', 
    fontSize: 14, 
    textAlign: 'center', 
    paddingVertical: 14 
  },
  modalButtonPrimaryText: { 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
});
export default SuccessModal;