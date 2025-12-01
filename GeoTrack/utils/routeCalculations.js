// utils/routeCalculations.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distancia en metros
};

// Función para calcular distancia entre dos puntos con objetos
export const getDistance = (point1, point2) => {
  if (!point1 || !point2 || !point1.latitude || !point2.latitude) return Infinity;
  return calculateDistance(
    point1.latitude, point1.longitude,
    point2.latitude, point2.longitude
  );
};

// Función para calcular distancia total de una ruta
export const getPreciseDistance = (points) => {
  if (!points || points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += getDistance(points[i], points[i + 1]);
  }
  return totalDistance;
};

// Función principal para calcular ruta optimizada
export const calculateRoute = async (location, orders) => {
  if (!location || !location.coords || !orders || orders.length === 0) {
    return { 
      success: false, 
      error: 'Datos insuficientes: Ubicación o pedidos faltantes' 
    };
  }

  try {
    // Filtrar pedidos con coordenadas válidas
    const validOrders = orders.filter(order => 
      order && 
      order.coordinate && 
      typeof order.coordinate.latitude === 'number' && 
      typeof order.coordinate.longitude === 'number' &&
      !isNaN(order.coordinate.latitude) &&
      !isNaN(order.coordinate.longitude)
    );
    
    if (validOrders.length === 0) {
      return { 
        success: false, 
        error: 'No hay pedidos con coordenadas válidas' 
      };
    }

    // Punto de inicio (ubicación del chofer)
    const startPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    // Algoritmo simple del vecino más cercano
    const unvisitedOrders = [...validOrders];
    const optimizedRoute = [];
    let currentPoint = startPoint;
    let previousDistance = 0;
    
    while (unvisitedOrders.length > 0) {
      // Encontrar el pedido más cercano al punto actual
      let closestIndex = 0;
      let closestDistance = getDistance(currentPoint, unvisitedOrders[0].coordinate);
      
      for (let i = 1; i < unvisitedOrders.length; i++) {
        const distance = getDistance(currentPoint, unvisitedOrders[i].coordinate);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
      
      // Mover el pedido más cercano a la ruta optimizada
      const closestOrder = unvisitedOrders[closestIndex];
      
      // Calcular distancia desde el punto anterior (chofer o pedido anterior)
      let distanceFromPrevious;
      if (optimizedRoute.length === 0) {
        // Primer pedido: distancia desde el chofer
        distanceFromPrevious = closestDistance;
      } else {
        // Pedidos subsiguientes: distancia desde el pedido anterior
        distanceFromPrevious = getDistance(
          optimizedRoute[optimizedRoute.length - 1].coordinate,
          closestOrder.coordinate
        );
      }
      
      optimizedRoute.push({
        ...closestOrder,
        orderInRoute: optimizedRoute.length + 1,
        distanceFromPrevious: distanceFromPrevious // ¡AQUÍ ESTÁ LA CLAVE!
      });
      
      // Actualizar punto actual
      currentPoint = closestOrder.coordinate;
      
      // Remover de la lista de no visitados
      unvisitedOrders.splice(closestIndex, 1);
    }
    
    // Generar coordenadas para la ruta
    const routeCoordinates = [
      startPoint,
      ...optimizedRoute.map(order => order.coordinate)
    ];
    
    // Calcular distancia total
    const totalDistance = getPreciseDistance(routeCoordinates);
    
    console.log(`Ruta calculada: ${optimizedRoute.length} pedidos, ${(totalDistance/1000).toFixed(2)} km`);
    console.log('Distancias calculadas para cada pedido:');
    optimizedRoute.forEach((order, index) => {
      console.log(`  Pedido ${index + 1}: ${order.distanceFromPrevious?.toFixed(0) || 0}m`);
    });
    
    return {
      success: true,
      optimizedRoute,
      routeCoordinates,
      totalDistance
    };
    
  } catch (error) {
    console.error('Error en calculateRoute:', error);
    return { 
      success: false, 
      error: `Error al calcular ruta: ${error.message}` 
    };
  }
};