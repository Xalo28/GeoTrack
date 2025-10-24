import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import OrderCard from './OrderCard';
import OrderDetailsModal from './OrderDetailsModal';

const RecentOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [orders, setOrders] = useState([
    { 
      id: 'PED-784512', 
      customer: 'María García', 
      status: 'Entregado', 
      time: '10:30 AM',
      phone: '+51 987 654 321',
      address: 'Av. Los Próceres 123, San Juan de Lurigancho',
      products: ['Laptop Dell XPS 13', 'Mouse Inalámbrico', 'Funda protectora'],
      total: 'S/ 4,299.00'
    },
    { 
      id: 'PED-784513', 
      customer: 'Carlos López', 
      status: 'En camino', 
      time: '11:15 AM',
      phone: '+51 987 654 322',
      address: 'Jr. Las Flores 456, San Juan de Lurigancho',
      products: ['Smartphone Samsung S23', 'Cargador rápido', 'Protector de pantalla'],
      total: 'S/ 2,899.00'
    },
    { 
      id: 'PED-784514', 
      customer: 'Ana Martínez', 
      status: 'Pendiente', 
      time: '12:00 PM',
      phone: '+51 987 654 323',
      address: 'Av. El Sol 789, San Juan de Lurigancho',
      products: ['Tablet iPad Air', 'Apple Pencil', 'Teclado bluetooth'],
      total: 'S/ 3,499.00'
    },
  ]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
    
    // Actualizar también el selectedOrder si es el mismo
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    
    Alert.alert('Éxito', `Pedido ${orderId} marcado como ${newStatus.toLowerCase()}`);
  };

  return (
    <View style={styles.historySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PEDIDOS RECIENTES</Text>
        <Text style={styles.seeAllText}>Ver todos</Text>
      </View>
      
      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onViewDetails={() => handleViewDetails(order)}
          />
        ))}
      </ScrollView>

      <OrderDetailsModal 
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historySection: {
    flex: 1,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  ordersList: {
    flex: 1,
  },
});

export default RecentOrders;