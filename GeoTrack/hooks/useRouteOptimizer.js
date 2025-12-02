// hooks/useRouteOptimizer.js 
import { useCallback } from 'react';
import { calculateOptimizedRouteWithOSRM } from '../utils/advancedRouteCalculations';
import { geocodeAllAddresses } from '../utils/geocoding';
export const useRouteOptimizer = () => {
  const optimizeRoute = useCallback(async (
    location,
    rawOrders,
    onOptimizationComplete,
    setIsCalculatingRoute,
    onMapTabPress
  ) => {
    console.log('🚀 OPTIMIZANDO RUTA CON OSRM...');
    
    if (!location?.coords || !rawOrders || rawOrders.length === 0) {
      return { 
        success: false, 
        error: '📍 Necesitas ubicación y pedidos' 
      };
    }
    
    setIsCalculatingRoute(true);
    
    try {
      // 1. Geocodificar (ya lo tienes)
      const geocodedOrders = await geocodeAllAddresses(rawOrders);
      
      // 2. Punto de inicio
      const startPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        type: 'driver'
      };
      
      // 3. Calcular ruta con algoritmo avanzado
      const result = await calculateOptimizedRouteWithOSRM(startPoint, geocodedOrders);
      
      if (result.success) {
        // 4. Obtener geometría de la ruta para el mapa
        const routeCoords = await getRouteGeometry(
          startPoint,
          result.optimizedOrders.map(o => o.coordinate)
        );
        
        // 5. Callback
        if (onOptimizationComplete) {
          await onOptimizationComplete(result.optimizedOrders, routeCoords);
        }
        
        return {
          success: true,
          optimizedRoute: result.optimizedOrders,
          routeCoordinates: routeCoords,
          totalDuration: result.totalDuration
        };
      }
      
      return result;
      
    } catch (error) {
      console.error('💥 Error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  return { optimizeRoute };
};

// Obtener geometría de la ruta
const getRouteGeometry = async (startPoint, points) => {
  try {
    const allCoords = [
      [startPoint.longitude, startPoint.latitude],
      ...points.map(p => [p.longitude, p.latitude])
    ];
    
    const coordsString = allCoords
      .map(coord => coord.join(','))
      .join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      // Convertir GeoJSON a coordenadas para el mapa
      return data.routes[0].geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error obteniendo geometría:', error);
    return [];
  }
};