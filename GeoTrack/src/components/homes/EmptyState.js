import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EmptyState = ({ activeFilter, onAddPress }) => {
  const getEmptyText = () => {
    if (activeFilter === 'all') {
      return {
        title: 'No hay rutas',
        subtitle: 'Comienza agregando nuevos pedidos'
      };
    } else if (activeFilter === 'pending') {
      return {
        title: 'No hay rutas pendientes',
        subtitle: 'No hay rutas pendientes'
      };
    } else {
      return {
        title: 'No hay rutas entregadas',
        subtitle: 'No hay rutas entregadas'
      };
    }
  };

  const text = getEmptyText();

  return (
    <View style={styles.emptyState}>
      <MaterialIcons name="map" size={80} color="rgba(255, 255, 255, 0.3)" />
      <Text style={styles.emptyTitle}>{text.title}</Text>
      <Text style={styles.emptySubtitle}>{text.subtitle}</Text>
      <TouchableOpacity 
        style={styles.addRouteButton}
        onPress={onAddPress}
      >
        <MaterialIcons name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addRouteText}>CREAR NUEVA RUTA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  addRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5CE1E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addRouteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
};

export default EmptyState;