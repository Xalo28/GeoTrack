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
      {/* Total */}
      <View style={styles.statColumn}>
        <Text style={styles.statLabel}>Total</Text>
        <View style={[styles.circle, styles.totalCircle]}>
          <Text style={styles.statNumber}>{totalPedidos}</Text>
        </View>
      </View>

      {/* Pendientes */}
      <View style={styles.statColumn}>
        <Text style={styles.statLabel}>Pendiente</Text>
        <View style={[styles.circle, styles.pendingCircle]}>
          <Text style={styles.statNumber}>{pendientes}</Text>
        </View>
      </View>

      {/* Entregados */}
      <View style={styles.statColumn}>
        <Text style={styles.statLabel}>Entregado</Text>
        <View style={[styles.circle, styles.deliveredCircle]}>
          <Text style={styles.statNumber}>{entregados}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  statColumn: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  totalCircle: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
  },
  pendingCircle: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  deliveredCircle: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default StatsCard;