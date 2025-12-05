import * as Location from 'expo-location';

// 1. Fórmula Haversine
export const calculateHaversineDistance = (coord1, coord2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 2. Algoritmo del Vecino Más Cercano
export const calculateNearestNeighbor = (locations) => {
  if (locations.length <= 1) return locations;

  const visited = new Set();
  const result = [];
  
  // Empezar desde la ubicación actual (índice 0, que es el driver)
  let current = locations[0];
  visited.add(0);
  result.push(current);

  while (visited.size < locations.length) {
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let i = 0; i < locations.length; i++) {
      if (!visited.has(i)) {
        const distance = calculateHaversineDistance(
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

// 3. Calcular distancia total
export const calculateTotalDistance = (sequence) => {
  let totalDistance = 0;
  for (let i = 0; i < sequence.length - 1; i++) {
    totalDistance += calculateHaversineDistance(
      { latitude: sequence[i].latitude, longitude: sequence[i].longitude },
      { latitude: sequence[i + 1].latitude, longitude: sequence[i + 1].longitude }
    );
  }
  return totalDistance;
};

// 4. Preparar coordenadas
export const prepareRouteCoordinates = (currentLocation, pendingOrders) => {
  const origin = {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    id: 'driver_start',
    cliente: '📍 TU UBICACIÓN',
    isDriver: true
  };

  const destinations = pendingOrders.map((order, index) => ({
    latitude: order.coordinate.latitude,
    longitude: order.coordinate.longitude,
    id: order.id,
    cliente: order.cliente,
    direccion: order.informacionContacto?.direccion,
    distrito: order.distrito,
    originalOrder: order // Mantenemos referencia al pedido original
  }));

  return [origin, ...destinations];
};