import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderCard = ({ order, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Entregado': return '#27ae60';
      case 'En camino': return '#3498db';
      case 'Pendiente': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>
      <Text style={styles.customerName}>{order.customer}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTime}>🕒 {order.time}</Text>
        <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
          <Text style={styles.detailsButtonText}>Ver detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00ffff',
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
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTime: {
    fontSize: 12,
    color: '#666666',
  },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#00ffff',
    fontWeight: '500',
  },
});

export default OrderCard;