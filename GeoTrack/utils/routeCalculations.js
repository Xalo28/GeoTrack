// utils/routeCalculations.js - VERSIÓN CORREGIDA
import axios from 'axios';

// ==================== FUNCIONES BÁSICAS ====================
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

// ==================== API OSRM (RUTAS REALES) ====================
const OSRM_BASE_URL = 'https://router.project-osrm.org';

// Obtener matriz de tiempos entre múltiples puntos
export const getOSRMMatrix = async (coordinates) => {
  try {
    const coordsString = coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');
    
    const url = `${OSRM_BASE_URL}/table/v1/driving/${coordsString}?annotations=duration`;
    
    console.log('🌐 Solicitando matriz OSRM:', coordsString);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'DeliveryApp/1.0'
      }
    });
    
    if (response.data.code === 'Ok' && response.data.durations) {
      console.log('✅ Matriz OSRM recibida:', response.data.durations.length + 'x' + response.data.durations[0]?.length);
      return response.data.durations; // Matriz de tiempos en segundos
    }
    
    console.warn('⚠️ OSRM no devolvió matriz válida');
    return null;
  } catch (error) {
    console.error('❌ Error OSRM Matrix:', error.message);
    return null;
  }
};

// Obtener ruta detallada entre puntos
export const getOSRMRoute = async (coordinates) => {
  try {
    const coordsString = coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');
    
    const url = `${OSRM_BASE_URL}/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
    
    const response = await axios.get(url, {
      timeout: 10000
    });
    
    if (response.data.code === 'Ok' && response.data.routes.length > 0) {
      return {
        distance: response.data.routes[0].distance,
        duration: response.data.routes[0].duration,
        geometry: response.data.routes[0].geometry
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error OSRM Route:', error);
    return null;
  }
};

// ==================== ALGORITMO DE OPTIMIZACIÓN ====================
export const calculateRoute = async (location, orders) => {
  console.log('🚀 CALCULANDO RUTA MEJORADA');
  console.log('📍 Ubicación chofer:', location?.coords?.latitude, location?.coords?.longitude);
  console.log('📦 Pedidos para optimizar:', orders?.length);
  
  // Validación básica
  if (!location?.coords || !orders || orders.length === 0) {
    console.error('❌ Datos insuficientes');
    return { success: false, error: 'Datos insuficientes' };
  }
  
  // Verificar que los pedidos tengan coordenadas
  const validOrders = orders.filter(order => 
    order?.coordinate?.latitude && 
    order?.coordinate?.longitude &&
    !isNaN(order.coordinate.latitude) &&
    !isNaN(order.coordinate.longitude)
  );
  
  console.log(`✅ ${validOrders.length} pedidos con coordenadas válidas`);
  
  if (validOrders.length === 0) {
    return { success: false, error: 'No hay coordenadas válidas' };
  }
  
  try {
    // 1. Preparar todos los puntos (chofer + pedidos)
    const allPoints = [
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        type: 'driver',
        label: '📍 TÚ'
      },
      ...validOrders.map((order, idx) => ({
        latitude: order.coordinate.latitude,
        longitude: order.coordinate.longitude,
        type: 'order',
        orderData: order,
        index: idx
      }))
    ];
    
    console.log(`📍 Total puntos a enrutar: ${allPoints.length}`);
    
    // 2. Obtener matriz de tiempos REALES de OSRM
    const durations = await getOSRMMatrix(allPoints);
    
    let optimizedIndices;
    
    if (durations && durations.length === allPoints.length) {
      // 3. Usar algoritmo del vecino más cercano CON TIEMPOS REALES
      console.log('🧮 Usando tiempos reales de OSRM para optimización');
      optimizedIndices = optimizeWithMatrix(durations);
    } else {
      // 4. Fallback: usar distancias en línea recta
      console.log('⚠️ Usando fallback (distancias rectas)');
      optimizedIndices = optimizeWithStraightDistances(allPoints);
    }
    
    // 5. Reconstruir ruta optimizada en el orden correcto
    const optimizedRoute = [];
    let totalDistance = 0;
    
    for (let i = 1; i < optimizedIndices.length; i++) { // Empezar desde 1 (omitir chofer)
      const idx = optimizedIndices[i];
      if (idx > 0 && idx <= validOrders.length) { // idx 0 es el chofer
        const order = validOrders[idx - 1];
        
        // Calcular distancia desde el anterior
        let distanceFromPrevious = 0;
        if (i > 1) {
          const prevIdx = optimizedIndices[i - 1];
          distanceFromPrevious = calculateDistance(
            allPoints[prevIdx].latitude, allPoints[prevIdx].longitude,
            allPoints[idx].latitude, allPoints[idx].longitude
          );
          totalDistance += distanceFromPrevious;
        }
        
        optimizedRoute.push({
          ...order,
          orderInRoute: optimizedRoute.length + 1,
          distanceFromPrevious: Math.round(distanceFromPrevious),
          distanceFromDriver: Math.round(calculateDistance(
            allPoints[0].latitude, allPoints[0].longitude,
            allPoints[idx].latitude, allPoints[idx].longitude
          ))
        });
      }
    }
    
    // 6. Crear coordenadas para el mapa
    const routeCoordinates = optimizedIndices.map(idx => ({
      latitude: allPoints[idx].latitude,
      longitude: allPoints[idx].longitude,
      title: idx === 0 ? '📍 TÚ' : `Pedido ${optimizedRoute[idx-1]?.orderInRoute}`,
      description: idx === 0 ? 'Tu ubicación' : 
                   optimizedRoute[idx-1]?.realAddress?.substring(0, 40) || 'Pedido'
    }));
    
    console.log('🎯 RUTA OPTIMIZADA:');
    console.log(`• 📦 Pedidos: ${optimizedRoute.length}`);
    console.log(`• 📏 Distancia total: ${(totalDistance/1000).toFixed(2)} km`);
    
    optimizedRoute.forEach((order, idx) => {
      console.log(`  ${idx + 1}. ${order.realAddress?.substring(0, 40) || 'Sin dirección'}`);
    });
    
    return {
      success: true,
      optimizedRoute,
      routeCoordinates,
      totalDistance: Math.round(totalDistance),
      message: `Ruta optimizada con ${optimizedRoute.length} pedidos`
    };
    
  } catch (error) {
    console.error('❌ Error en calculateRoute:', error);
    return { 
      success: false, 
      error: `Error: ${error.message}` 
    };
  }
};

// ==================== ALGORITMOS DE OPTIMIZACIÓN ====================

// Optimizar usando matriz de tiempos reales
const optimizeWithMatrix = (durations) => {
  const n = durations.length;
  const visited = new Array(n).fill(false);
  visited[0] = true; // Empezar desde el chofer (índice 0)
  
  const route = [0]; // Ruta comenzando desde chofer
  let current = 0;
  
  // Algoritmo del vecino más cercano
  for (let i = 1; i < n; i++) {
    let closestIdx = -1;
    let minTime = Infinity;
    
    for (let j = 1; j < n; j++) {
      if (!visited[j] && durations[current][j] < minTime) {
        minTime = durations[current][j];
        closestIdx = j;
      }
    }
    
    if (closestIdx !== -1) {
      route.push(closestIdx);
      visited[closestIdx] = true;
      current = closestIdx;
    }
  }
  
  console.log(`📈 Ruta optimizada con matriz: ${route.join(' → ')}`);
  return route;
};

// Optimizar usando distancias en línea recta (fallback)
const optimizeWithStraightDistances = (points) => {
  const n = points.length;
  const visited = new Array(n).fill(false);
  visited[0] = true;
  
  const route = [0];
  let current = 0;
  
  for (let i = 1; i < n; i++) {
    let closestIdx = -1;
    let minDist = Infinity;
    
    for (let j = 1; j < n; j++) {
      if (!visited[j]) {
        const dist = calculateDistance(
          points[current].latitude, points[current].longitude,
          points[j].latitude, points[j].longitude
        );
        
        if (dist < minDist) {
          minDist = dist;
          closestIdx = j;
        }
      }
    }
    
    if (closestIdx !== -1) {
      route.push(closestIdx);
      visited[closestIdx] = true;
      current = closestIdx;
    }
  }
  
  console.log(`📈 Ruta optimizada (fallback): ${route.join(' → ')}`);
  return route;
};

// Función para debug
export const debugRoute = (optimizedRoute) => {
  if (!optimizedRoute) return;
  
  console.log('🔍 DEBUG RUTA:');
  optimizedRoute.forEach((order, idx) => {
    console.log(`${idx + 1}. ${order.realAddress || 'Sin dirección'}`);
    console.log(`   📍 ${order.coordinate?.latitude}, ${order.coordinate?.longitude}`);
    console.log(`   📏 ${order.distanceFromPrevious}m desde anterior`);
    console.log('---');
  });
};