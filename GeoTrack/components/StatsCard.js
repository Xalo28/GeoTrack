import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOrders } from '../context/OrdersContext';

const StatsCard = () => {
  const { orders } = useOrders();

  // Calcular estadísticas en tiempo real
  const totalPedidos = orders.length;
  const entregados = orders.filter(order => order.estado === 'Entregado').length;
  const pendientes = orders.filter(order => order.estado === 'Pendiente').length;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{totalPedidos}</Text>
        <Text style={styles.statLabel}>Pedidos</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{entregados}</Text>
        <Text style={styles.statLabel}>Entregados</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{pendientes}</Text>
        <Text style={styles.statLabel}>Pendientes</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
});

export default StatsCard;