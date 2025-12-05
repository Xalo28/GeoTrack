// Algoritmos para cálculo de rutas optimizadas

// Función para calcular distancia entre dos puntos (fórmula Haversine)
export const calculateHaversineDistance = (coord1, coord2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Algoritmo del vecino más cercano
export const calculateNearestNeighbor = (locations, distanceCalculator) => {
  if (locations.length <= 1) return locations;

  const visited = new Set();
  const result = [];
  
  // Empezar desde la ubicación actual (índice 0)
  let current = locations[0];
  visited.add(0);
  result.push(current);

  while (visited.size < locations.length) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let i = 0; i < locations.length; i++) {
      if (!visited.has(i)) {
        const distance = distanceCalculator(
          { latitude: current.latitude, longitude: current.longitude },
          { latitude: locations[i].latitude, longitude: locations[i].longitude }
        );
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
    }

    if (nearestIndex !== -1) {
      current = locations[nearestIndex];
      visited.add(nearestIndex);
      result.push(current);
    }
  }

  return result;
};

// Calcular distancia total de la ruta
export const calculateTotalDistance = (sequence, distanceCalculator) => {
  let totalDistance = 0;
  
  for (let i = 0; i < sequence.length - 1; i++) {
    const distance = distanceCalculator(
      { latitude: sequence[i].latitude, longitude: sequence[i].longitude },
      { latitude: sequence[i + 1].latitude, longitude: sequence[i + 1].longitude }
    );
    totalDistance += distance;
  }
  
  return totalDistance;
};

// Preparar coordenadas para cálculo de ruta
export const prepareRouteCoordinates = (currentLocation, pendingOrders) => {
  const origin = {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  };

  return [
    { 
      ...origin, 
      isCurrentLocation: true,
      orderId: 'current',
      cliente: '📍 TU UBICACIÓN',
      direccion: 'Punto de partida'
    },
    ...pendingOrders.map((order, index) => ({
      latitude: order.coordinate.latitude,
      longitude: order.coordinate.longitude,
      orderId: order.id,
      cliente: order.cliente,
      direccion: order.informacionContacto?.direccion,
      distrito: order.distrito,
      orderIndex: index + 1
    }))
  ];
};

// Calcular tiempo estimado de ruta
export const calculateEstimatedTime = (totalDistanceKm, stopCount) => {
  const travelTimeHours = totalDistanceKm / 30; // 30 km/h promedio
  const stopTimeMinutes = stopCount * 5; // 5 minutos por parada
  return (travelTimeHours * 60) + stopTimeMinutes;
};