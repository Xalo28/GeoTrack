import React, { useCallback } from 'react';
import { calculateRoute } from '../utils/routeCalculations';

export const useRouteOptimizer = () => {
  const optimizeRoute = useCallback(async (
    location,
    ordersWithStableCoords,
    onOptimizationComplete,
    setIsCalculatingRoute,
    onMapTabPress
  ) => {
    if (!location || ordersWithStableCoords.length === 0) {
      return { success: false, error: 'No hay datos suficientes' };
    }

    setIsCalculatingRoute(true);
    
    try {
      console.log('Iniciando optimización de ruta...');
      
      const result = await calculateRoute(location, ordersWithStableCoords);
      
      if (result.success) {
        console.log('Optimización exitosa:', result.optimizedRoute.length, 'pedidos');
        
        // Llamar al callback con los resultados
        if (onOptimizationComplete) {
          await onOptimizationComplete(result.optimizedRoute, result.routeCoordinates);
        }
        
        // Cambiar a mapa si se proporciona la función
        if (onMapTabPress && result.routeCoordinates.length > 0) {
          onMapTabPress(result.routeCoordinates);
        }
        
        return { success: true, optimizedRoute: result.optimizedRoute };
      } else {
        console.error('Error en optimización:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error en optimizeRoute:', error);
      return { success: false, error: error.message };
    } finally {
      setIsCalculatingRoute(false);
    }
  }, []);

  return { optimizeRoute };
};