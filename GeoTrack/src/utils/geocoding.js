import * as Location from 'expo-location';

// Mapa de coordenadas aproximadas por distrito
export const DISTRICT_COORDINATES = {
  'SAN JUAN DE LURIGANCHO': { latitude: -11.9804, longitude: -76.9995 },
  'SANTIAGO DE SURCO': { latitude: -12.1507, longitude: -76.9963 },
  'MIRAFLORES': { latitude: -12.1224, longitude: -77.0302 },
  'SAN ISIDRO': { latitude: -12.0981, longitude: -77.0478 },
  'LA MOLINA': { latitude: -12.0783, longitude: -76.9416 },
  'SURCO': { latitude: -12.1507, longitude: -76.9963 },
  'CHORRILLOS': { latitude: -12.1841, longitude: -77.0155 },
  'VILLA EL SALVADOR': { latitude: -12.2101, longitude: -76.9495 },
  'SAN MIGUEL': { latitude: -12.0833, longitude: -77.0833 },
  'MAGDALENA': { latitude: -12.0908, longitude: -77.0708 },
  'PUEBLO LIBRE': { latitude: -12.0783, longitude: -77.0625 },
  'JESÚS MARÍA': { latitude: -12.0750, longitude: -77.0528 },
  'LINCE': { latitude: -12.0883, longitude: -77.0333 },
  'LA VICTORIA': { latitude: -12.0739, longitude: -77.0167 },
  'BREÑA': { latitude: -12.0569, longitude: -77.0528 },
  'LIMA': { latitude: -12.0464, longitude: -77.0428 },
  'RIMAC': { latitude: -12.0300, longitude: -77.0250 },
  'SANTA ANITA': { latitude: -12.0472, longitude: -76.9667 },
  'ATE': { latitude: -12.0083, longitude: -76.9250 },
  'SANTA ROSA': { latitude: -11.9167, longitude: -77.1167 },
  'EL AGUSTINO': { latitude: -12.0489, longitude: -77.0000 },
  'SAN JUAN DE MIRAFLORES': { latitude: -12.1581, longitude: -76.9653 },
  'VILLA MARÍA DEL TRIUNFO': { latitude: -12.1597, longitude: -76.9400 },
  'PACHACAMAC': { latitude: -12.2333, longitude: -76.8667 },
  'PUNTA HERMOSA': { latitude: -12.3333, longitude: -76.8167 },
  'PUNTA NEGRA': { latitude: -12.3667, longitude: -76.8000 },
  'SAN BARTOLO': { latitude: -12.3833, longitude: -76.7833 },
  'SANTA MARÍA DEL MAR': { latitude: -12.4333, longitude: -76.8000 },
  'PUCUSANA': { latitude: -12.4667, longitude: -76.8000 }
};

// Función para obtener coordenadas aproximadas por distrito
export const getApproximateCoordinates = (district) => {
  // Si el distrito está en nuestro mapa, usar sus coordenadas
  if (DISTRICT_COORDINATES[district]) {
    const baseCoords = DISTRICT_COORDINATES[district];
    
    // Agregar un pequeño offset aleatorio dentro del distrito (~500m)
    const latOffset = (Math.random() * 0.01 - 0.005); // +/- 0.005 grados (~550m)
    const lngOffset = (Math.random() * 0.01 - 0.005); // +/- 0.005 grados (~550m)

    return {
      latitude: baseCoords.latitude + latOffset,
      longitude: baseCoords.longitude + lngOffset,
    };
  } else {
    // Coordenadas por defecto de Lima centro con offset
    const baseCoords = { latitude: -12.0464, longitude: -77.0428 };
    const latOffset = (Math.random() * 0.02 - 0.01);
    const lngOffset = (Math.random() * 0.02 - 0.01);

    return {
      latitude: baseCoords.latitude + latOffset,
      longitude: baseCoords.longitude + lngOffset,
    };
  }
};

// Función para geocodificar la dirección
export const geocodeAddress = async (address, district) => {
  try {
    console.log('Intentando geocodificar:', `${address}, ${district}, Lima, Perú`);
    
    // Intentar con la API de geocodificación de Expo
    const geocoded = await Location.geocodeAsync(`${address}, ${district}, Lima, Perú`);
    
    if (geocoded && geocoded.length > 0) {
      console.log('Geocodificación exitosa:', geocoded[0]);
      return {
        latitude: geocoded[0].latitude,
        longitude: geocoded[0].longitude,
      };
    } else {
      console.log('No se encontraron resultados, usando coordenadas aproximadas');
      return getApproximateCoordinates(district);
    }
  } catch (error) {
    console.log('Error en geocodificación, usando coordenadas aproximadas:', error);
    return getApproximateCoordinates(district);
  }
};