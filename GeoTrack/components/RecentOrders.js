import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

  if (orders.length === 0) {
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
      <ScrollView style={styles.ordersList}>
        {orders.map((order, index) => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.orderItem}
            onPress={() => handleViewDetails(order)}
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
      </ScrollView>

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
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  noOrders: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#6c757d',
  },
  ordersList: {
    maxHeight: 200,
  },
  orderItem: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendingBadge: {
    backgroundColor: '#fff3cd',
  },
  deliveredBadge: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 10,
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