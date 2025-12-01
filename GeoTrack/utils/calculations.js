// Función propia para calcular distancia (fórmula Haversine)
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