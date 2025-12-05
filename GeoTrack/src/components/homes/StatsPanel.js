import React from 'react';
import { View, Text, Animated } from 'react-native'; // Animated de react-native
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const StatCard = ({ icon, value, label, circleStyle }) => (
  <View style={styles.statCard}>
    <View style={[styles.statCircle, circleStyle]}>
      <MaterialIcons name={icon} size={24} color={circleStyle.color} />
    </View>
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabelCard}>{label}</Text>
  </View>
);

const StatsPanel = ({ totalOrders, deliveredOrders, pendingOrders, completionRate, fadeAnim, slideAnim }) => {
  return (
    <Animated.View 
      style={[
        styles.statsPanel,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.statsGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.statsTitle}>RESUMEN DEL DÍA</Text>
        
        <View style={styles.statsGrid}>
          <StatCard 
            icon="list-alt"
            value={totalOrders}
            label="Total Pedidos"
            circleStyle={styles.totalCircle}
          />
          
          <StatCard 
            icon="check-circle"
            value={deliveredOrders}
            label="Entregados"
            circleStyle={styles.deliveredCircle}
          />
          
          <StatCard 
            icon="pending"
            value={pendingOrders}
            label="Pendientes"
            circleStyle={styles.pendingCircle}
          />
          
          <StatCard 
            icon="trending-up"
            value={`${completionRate}%`}
            label="Progreso"
            circleStyle={styles.progressCircle}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = {
  statsPanel: {
    marginBottom: 25,
  },
  statsGradient: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalCircle: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    color: '#5CE1E6',
  },
  deliveredCircle: {
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    color: '#4ECB71',
  },
  pendingCircle: {
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    color: '#FFA726',
  },
  progressCircle: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    color: '#9C27B0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabelCard: {
    fontSize: 12,
    color: '#a0a0c0',
    marginTop: 4,
  },
};

export default StatsPanel;