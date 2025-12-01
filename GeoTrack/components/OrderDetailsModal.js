import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Linking,ScrollView } from 'react-native';
import { useOrders } from '../context/OrdersContext';

const OrderDetailsModal = ({ visible, order, onClose, onMarkDelivered }) => {
  const { markAsDelivered, formatDateForDisplay } = useOrders();

  if (!order) return null;

  // Función segura para formatear fecha
  const formatDate = (dateString) => {
    try {
      if (!dateString) return { dateStr: 'N/A', timeStr: '' };
      
      // Si formatDateForDisplay existe en el contexto, úsalo
      if (formatDateForDisplay) {
        const formatted = formatDateForDisplay(dateString);
        return { 
          dateStr: formatted.dateString, 
          timeStr: formatted.timeString 
        };
      }
      
      // Si no, hazlo manualmente
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { dateStr: 'Fecha inválida', timeStr: '' };
      
      return {
        dateStr: date.toLocaleDateString(),
        timeStr: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return { dateStr: 'N/A', timeStr: '' };
    }
  };

  const { dateStr, timeStr } = formatDate(order.date);

  const handleCall = () => {
    const phoneNumber = order.informacionContacto?.telefono?.replace(/\D/g, '') || '';
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert('Error', 'Número de teléfono no disponible');
    }
  };

  const handleOpenMaps = () => {
    const address = order.informacionContacto?.direccion || order.direccion || '';
    if (address) {
      Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
    } else {
      Alert.alert('Error', 'Dirección no disponible');
    }
  };

  const handleMarkDelivered = () => {
    if (order.id) {
      markAsDelivered(order.id);
      onMarkDelivered?.();
      onClose();
    }
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
                <Text style={styles.infoLabel}>Código del Pedido:</Text>
                <Text style={styles.infoValue}>{order.numeroPedido || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cliente:</Text>
                <Text style={styles.infoValue}>{order.cliente || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estado:</Text>
                <View style={[
                  styles.statusBadge,
                  order.estado === 'Entregado' ? styles.deliveredBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusText}>{order.estado || 'Pendiente'}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha:</Text>
                <Text style={styles.infoValue}>
                  {dateStr} {timeStr}
                </Text>
              </View>
            </View>

            {/* Información de Contacto */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Contacto</Text>
              
              <View style={styles.contactButtons}>
                <TouchableOpacity 
                  style={styles.contactButton} 
                  onPress={handleCall}
                  disabled={!order.informacionContacto?.telefono}
                >
                  <Text style={[
                    styles.contactButtonText,
                    !order.informacionContacto?.telefono && styles.disabledText
                  ]}>
                    📞 {order.informacionContacto?.telefono || 'No disponible'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.contactButton} 
                  onPress={handleOpenMaps}
                  disabled={!order.informacionContacto?.direccion}
                >
                  <Text style={[
                    styles.contactButtonText,
                    !order.informacionContacto?.direccion && styles.disabledText
                  ]}>
                    📍 {order.informacionContacto?.direccion || 'Dirección no disponible'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Productos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos</Text>
              {order.productos && order.productos.length > 0 ? (
                order.productos.map((producto, index) => (
                  <View key={index} style={styles.productItem}>
                    <Text style={styles.productText}>• {producto}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noProductsText}>No hay productos especificados</Text>
              )}
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
                <Text>{order.distrito || 'San Juan de Lurigancho'}</Text>
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
  disabledText: {
    color: '#6c757d',
    opacity: 0.6,
  },
  productItem: {
    marginBottom: 5,
  },
  productText: {
    fontSize: 14,
    color: '#000000',
  },
  noProductsText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
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