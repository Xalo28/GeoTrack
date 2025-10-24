import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Linking,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OrderDetailsModal = ({ visible, order, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregado': return '#27ae60';
      case 'En camino': return '#3498db';
      case 'Pendiente': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  const handleMarkAsDelivered = () => {
    if (order.status === 'Entregado') {
      Alert.alert('Información', 'Este pedido ya ha sido entregado.');
      return;
    }

    Alert.alert(
      'Confirmar Entrega',
      `¿Estás seguro de que deseas marcar el pedido ${order.id} como entregado?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sí, Entregado',
          onPress: () => {
            if (onUpdateStatus) {
              onUpdateStatus(order.id, 'Entregado');
            }
            // NO cerrar el modal inmediatamente, dejar que se actualice
          }
        }
      ]
    );
  };

  const getButtonText = () => {
    switch(order.status) {
      case 'Entregado': return '✅ Entregado';
      case 'En camino': return 'Marcar como Entregado';
      case 'Pendiente': return 'Marcar como Entregado';
      default: return 'Marcar como Entregado';
    }
  };

  const isButtonDisabled = order.status === 'Entregado';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Pedido</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información General</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Número de Pedido:</Text>
                <Text style={styles.infoValue}>{order.id}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{order.customer}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado:</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hora:</Text>
                <Text style={styles.infoValue}>{order.time}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Contacto</Text>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={20} color="#3498db" />
                <Text style={styles.contactText}>{order.phone}</Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCall(order.phone)}
                >
                  <Text style={styles.actionButtonText}>Llamar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={20} color="#e74c3c" />
                <Text style={styles.contactText} numberOfLines={2}>{order.address}</Text>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleOpenMaps(order.address)}
                >
                  <Text style={styles.actionButtonText}>Mapa</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {order.products.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  <Text style={styles.productText}>• {product}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>{order.total}</Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.primaryButton,
                isButtonDisabled && styles.primaryButtonDisabled
              ]}
              onPress={handleMarkAsDelivered}
              disabled={isButtonDisabled}
            >
              <Text style={styles.primaryButtonText}>{getButtonText()}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  contactText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginLeft: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productItem: {
    paddingVertical: 4,
  },
  productText: {
    fontSize: 14,
    color: '#000',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButton: {
    flex: 2,
    padding: 15,
    backgroundColor: '#27ae60',
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsModal;