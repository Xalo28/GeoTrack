import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  calculateHaversineDistance, 
  calculateNearestNeighbor, 
  calculateTotalDistance,
  prepareRouteCoordinates,
  calculateEstimatedTime
} from '../../utils/routeCalculator';
import * as Location from 'expo-location';

const RouteOptimizer = ({ 
  displayOrders, 
  onRouteCalculated, 
  onActiveTabChange 
}) => {
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const calculateOptimalRoute = async () => {
    try {
      setIsCalculatingRoute(true);
      
      // Filtrar solo pedidos pendientes CON coordenadas
      const pendingOrders = displayOrders.filter(order => 
        order.estado !== 'Entregado' && order.coordinate
      );

      // Verificar si hay pedidos sin coordenadas
      const ordersWithoutCoords = displayOrders.filter(order => 
        order.estado !== 'Entregado' && !order.coordinate
      );

      if (ordersWithoutCoords.length > 0) {
        Alert.alert(
          '⚠️ Algunos pedidos sin ubicación',
          `${ordersWithoutCoords.length} pedidos no tienen coordenadas GPS. \n\nSerán excluidos de la ruta optimizada.`,
          [{ text: 'ENTENDIDO' }]
        );
      }

      if (pendingOrders.length === 0) {
        Alert.alert(
          '❌ No hay pedidos rutables',
          ordersWithoutCoords.length > 0 
            ? 'Todos los pedidos pendientes carecen de coordenadas GPS.'
            : 'Todos los pedidos ya están entregados.'
        );
        setIsCalculatingRoute(false);
        return;
      }

      // Obtener ubicación actual del usuario
      const currentLocation = await Location.getCurrentPositionAsync({});
      
      // Preparar coordenadas
      const locations = prepareRouteCoordinates(currentLocation, pendingOrders);

      // Calcular secuencia óptima
      const sequence = calculateNearestNeighbor(locations, calculateHaversineDistance);
      
      // Preparar coordenadas para mostrar en el mapa
      const routeCoords = sequence.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));

      // Calcular distancia total estimada
      const totalDistanceKm = calculateTotalDistance(sequence, calculateHaversineDistance);

      // Estimar tiempo
      const totalTimeMinutes = calculateEstimatedTime(totalDistanceKm, pendingOrders.length);

      const optimizedRoute = {
        sequence,
        totalDistance: totalDistanceKm,
        estimatedTime: totalTimeMinutes,
        stopCount: pendingOrders.length,
        ordersWithCoords: pendingOrders.length,
        ordersWithoutCoords: ordersWithoutCoords.length,
        routeCoordinates: routeCoords
      };

      onRouteCalculated(optimizedRoute);
      onActiveTabChange('map');
      
      Alert.alert(
        '✅ Ruta Optimizada Calculada',
        `📏 Distancia total: ${totalDistanceKm.toFixed(2)} km\n` +
        `⏱️ Tiempo estimado: ${Math.round(totalTimeMinutes)} minutos\n` +
        `📍 Paradas programadas: ${pendingOrders.length}\n` +
        (ordersWithoutCoords.length > 0 ? `\n⚠️ ${ordersWithoutCoords.length} pedidos excluidos (sin GPS)` : ''),
        [{ text: 'VER RUTA EN EL MAPA' }]
      );

    } catch (error) {
      console.error('Error calculando ruta:', error);
      Alert.alert('❌ Error', 'No se pudo calcular la ruta optimizada. Verifica tu conexión a internet.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const handleEnrutar = () => {
    // Contar pedidos con y sin coordenadas
    const pendingWithCoords = displayOrders.filter(order => 
      order.estado !== 'Entregado' && order.coordinate
    ).length;
    
    const pendingWithoutCoords = displayOrders.filter(order => 
      order.estado !== 'Entregado' && !order.coordinate
    ).length;

    let message = '¿Deseas calcular la ruta más óptima para entregar los pedidos pendientes?';
    
    if (pendingWithoutCoords > 0) {
      message += `\n\n⚠️ Nota: ${pendingWithoutCoords} pedido(s) no tienen coordenadas y serán excluidos.`;
    }

    Alert.alert(
      '🚚 Optimizar Ruta de Entrega',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Calcular Ruta', 
          onPress: calculateOptimalRoute 
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.enrutarButton}
      onPress={handleEnrutar}
      activeOpacity={0.8}
      disabled={isCalculatingRoute}
    >
      <LinearGradient
        colors={['#5CE1E6', '#00adb5']}
        style={styles.enrutarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {isCalculatingRoute ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.enrutarText}>CALCULANDO...</Text>
          </>
        ) : (
          <>
            <MaterialIcons name="route" size={24} color="#FFFFFF" />
            <Text style={styles.enrutarText}>OPTIMIZAR RUTA</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  enrutarButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enrutarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
  },
  enrutarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
};

export default RouteOptimizer;