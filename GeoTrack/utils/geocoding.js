// Función para generar coordenadas según el distrito
export const generateStableCoordinate = (address, distrito = '', seed = 0) => {
  if (!address) return { latitude: -12.0464, longitude: -77.0428 }; // Lima centro
  
  // Usar un hash simple de la dirección para coordenadas consistentes
  let hash = seed;
  const fullString = address + distrito;
  for (let i = 0; i < fullString.length; i++) {
    hash = ((hash << 5) - hash) + fullString.charCodeAt(i);
    hash = hash & hash; // Convertir a 32-bit integer
  }
  
  // Coordenadas base POR DISTRITO
  const districtCenters = {
    'SAN MIGUEL': { latitude: -12.0833, longitude: -77.0925 },
    'MIRAFLORES': { latitude: -12.1165, longitude: -77.0429 },
    'SAN ISIDRO': { latitude: -12.0994, longitude: -77.0406 },
    // ... todos los demás distritos
  };
  
  // Obtener centro del distrito o usar Lima centro por defecto
  const districtUpper = distrito.toUpperCase();
  const center = districtCenters[districtUpper] || { latitude: -12.0464, longitude: -77.0428 };
  
  // Rango más pequeño para variación dentro del distrito (~3km radio)
  const latOffset = ((hash % 1000) / 33333) - 0.015; // -0.015 a 0.015
  const lngOffset = ((Math.abs(hash) % 1000) / 33333) - 0.015; // -0.015 a 0.015
  
  return {
    latitude: center.latitude + latOffset,
    longitude: center.longitude + lngOffset,
  };
};