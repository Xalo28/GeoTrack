import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useOrders } from '../context/OrdersContext';
import OrderDetailsModal from './OrderDetailsModal';

const RecentOrders = ({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { markAsDelivered } = useOrders();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleMarkDelivered = () => {
    if (selectedOrder) {
      markAsDelivered(selectedOrder.id);
    }
    handleCloseModal();
  };

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>PEDIDOS RECIENTES</Text>
        <View style={styles.noOrders}>
          <Text style={styles.noOrdersText}>No hay pedidos recientes</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PEDIDOS RECIENTES</Text>
      
      {/* CAMBIO: Usamos View en lugar de ScrollView y mapeamos los items */}
      <View style={styles.listContainer}>
        {orders.map((order, index) => (
          <TouchableOpacity 
            key={order.id || index}
            style={styles.orderItem}
            onPress={() => handleViewDetails(order)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Pedido #{index + 1}</Text>
              <View style={[
                styles.statusBadge,
                order.estado === 'Entregado' ? styles.deliveredBadge : styles.pendingBadge
              ]}>
                <Text style={styles.statusText}>{order.estado}</Text>
              </View>
            </View>
            <Text style={styles.orderClient}>{order.cliente}</Text>
            <Text style={styles.orderCode}>Código: {order.numeroPedido}</Text>
            <Text style={styles.orderAddress}>{order.informacionContacto.direccion}</Text>
            <Text style={styles.viewDetailsText}>Ver más detalles →</Text>
          </TouchableOpacity>
        ))}
      </View>

      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onMarkDelivered={handleMarkDelivered}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20, // Espacio final
  },
  listContainer: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 15,
    marginTop: 10,
  },
  noOrders: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#6c757d',
  },
  orderItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  deliveredBadge: {
    backgroundColor: '#d4edda',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  orderClient: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    marginTop: 5,
  },
  orderCode: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  orderAddress: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
});

export default RecentOrders;