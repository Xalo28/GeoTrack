import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import RouteOptimizer from '../services/RouteOptimizer';

export const useRouteOptimization = () => {
  const [optimizedSequence, setOptimizedSequence] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showOptimizedRoute, setShowOptimizedRoute] = useState(false);

  const optimizeRoute = useCallback(async (orders, startLocation) => {
    if (!orders || orders.length === 0) {
      Alert.alert('Sin pedidos', 'No hay pedidos para optimizar');
      return null;
    }

    setIsCalculating(true);

    try {
      const sequence = await RouteOptimizer.optimizeRouteNearestNeighbor(orders, startLocation);

      if (sequence.length === 0) {
        Alert.alert('Error', 'No se pudieron obtener coordenadas para los pedidos');
        return null;
      }

      setOptimizedSequence(sequence);

      const waypoints = [
        startLocation,
        ...sequence.map(order => ({
          latitude: order.latitude,
          longitude: order.longitude
        }))
      ];

      const polylinePoints = await RouteOptimizer.getRoutePolyline(waypoints);

      if (polylinePoints) {
        setRouteCoordinates(polylinePoints);
        setShowOptimizedRoute(true);

        Alert.alert(
          '✅ Ruta Optimizada',
          `Se ha calculado la ruta más eficiente para ${sequence.length} pedidos.\n\nTiempo estimado: ${Math.round(sequence.length * 25)} minutos`,
          [{ text: 'VER EN MAPA' }]
        );

        return { sequence, polylinePoints, waypoints };
      } else {
        setRouteCoordinates(waypoints);
        setShowOptimizedRoute(true);
        
        Alert.alert(
          '⚠️ Ruta Calculada',
          `Secuencia optimizada para ${sequence.length} pedidos.\nUsando cálculos de distancia directa.`
        );

        return { sequence, waypoints, isSimpleMode: true };
      }

    } catch (error) {
      console.error('Error en optimización:', error);
      Alert.alert('Error', 'No se pudo calcular la ruta optimizada');
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const clearOptimizedRoute = useCallback(() => {
    setOptimizedSequence([]);
    setRouteCoordinates([]);
    setShowOptimizedRoute(false);
  }, []);

  const startRouteNavigation = useCallback((firstOrder) => {
    if (firstOrder) {
      Alert.alert(
        'Iniciar Navegación',
        `¿Iniciar navegación hacia ${firstOrder.cliente}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Iniciar', 
            onPress: () => firstOrder
          }
        ]
      );
    }
  }, []);

  return {
    optimizedSequence,
    routeCoordinates,
    isCalculating,
    showOptimizedRoute,
    optimizeRoute,
    clearOptimizedRoute,
    startRouteNavigation,
    hasOptimizedRoute: optimizedSequence.length > 0,
    totalOptimizedOrders: optimizedSequence.length,
  };
};