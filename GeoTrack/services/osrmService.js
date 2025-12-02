// services/osrmService.js
import axios from 'axios';

export const calculateRealRoute = async (coordinates) => {
  try {
    // OSRM es GRATUITO y de código abierto
    const coordsString = coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');
    
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
    
    const response = await axios.get(url);
    
    if (response.data.code === 'Ok' && response.data.routes.length > 0) {
      return {
        distance: response.data.routes[0].distance, // en metros
        duration: response.data.routes[0].duration, // en segundos
        geometry: response.data.routes[0].geometry,
        waypoints: response.data.waypoints
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error OSRM:', error);
    return null;
  }
};

// Calcular matriz de distancias reales
export const calculateDistanceMatrix = async (coordinates) => {
  try {
    const coordsString = coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');
    
    const url = `https://router.project-osrm.org/table/v1/driving/${coordsString}`;
    
    const response = await axios.get(url);
    
    if (response.data.code === 'Ok') {
      return response.data.durations; // matriz de tiempos en segundos
    }
    
    return null;
  } catch (error) {
    console.error('Error OSRM Matrix:', error);
    return null;
  }
};