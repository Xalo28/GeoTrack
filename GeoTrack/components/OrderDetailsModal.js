import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Linking,
  ScrollView 
} from 'react-native';
import { useOrders } from '../context/OrdersContext';

const OrderDetailsModal = ({ visible, order, onClose, onMarkDelivered }) => {
  const { markAsDelivered } = useOrders();

  if (!order) return null;

  const handleCall = () => {
    const phoneNumber = order.informacionContacto.telefono.replace(/\D/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(order.informacionContacto.direccion);
    Linking.openURL(`https://maps.google.com/?q=${address}`);
  };

  const handleMarkDelivered = () => {
    markAsDelivered(order.id);
    onMarkDelivered?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Pedido</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {/* Información General */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información General</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Informe de Pedido:</Text>
                <Text style={styles.infoValue}>{order.numeroPedido}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{order.cliente}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado:</Text>
                <View style={[
                  styles.statusBadge,
                  order.estado === 'Entregado' ? styles.deliveredBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusText}>{order.estado}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha:</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                </Text>
              </View>
            </View>

            {/* Información de Contacto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Contacto</Text>
              
              <View style={styles.contactButtons}>
                <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                  <Text style={styles.contactButtonText}>📞 {order.informacionContacto.telefono}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.contactButton} onPress={handleOpenMaps}>
                  <Text style={styles.contactButtonText}>📍 {order.informacionContacto.direccion}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Productos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {order.productos.map((producto, index) => (
                <View key={index} style={styles.productItem}>
                  <Text style={styles.productText}>• {producto}</Text>
                </View>
              ))}
            </View>

            {/* Separador */}
            <View style={styles.separator} />

            {/* Información Adicional */}
            <View style={styles.section}>
              <Text style={styles.additionalInfo}>
                <Text style={styles.bold}>Ciudad: </Text>
                <Text>Lima</Text>
              </Text>
              <Text style={styles.additionalInfo}>
                <Text style={styles.bold}>Distrito: </Text>
                <Text>San Juan de Lurigancho</Text>
              </Text>
              <Text style={styles.additionalInfo}>
                <Text style={styles.bold}>Referencia: </Text>
                <Text>Frente al parque principal</Text>
              </Text>
            </View>
          </ScrollView>

          {/* Botones de Acción */}
          <View style={styles.actionButtons}>
            {order.estado !== 'Entregado' && (
              <TouchableOpacity 
                style={styles.deliverButton}
                onPress={handleMarkDelivered}
              >
                <Text style={styles.deliverButtonText}>Marcar como Entregado</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.closeActionButton}
              onPress={onClose}
            >
              <Text style={styles.closeActionButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
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
    color: '#000000',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  deliveredBadge: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  contactButtons: {
    gap: 10,
  },
  contactButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  productItem: {
    marginBottom: 5,
  },
  productText: {
    fontSize: 14,
    color: '#000000',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  additionalInfo: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  actionButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  deliverButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deliverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeActionButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsModal;