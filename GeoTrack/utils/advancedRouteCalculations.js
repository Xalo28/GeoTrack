// utils/advancedRouteCalculations.js
import { calculateDistanceMatrix, calculateRealRoute } from '../services/osrmService';

// Algoritmo mejorado usando matriz de distancias reales
export const calculateOptimizedRouteWithOSRM = async (startPoint, orders) => {
  console.log('🧮 Calculando ruta con OSRM...');
  
  try {
    // 1. Preparar todos los puntos (inicio + pedidos)
    const allPoints = [
      { ...startPoint, type: 'start' },
      ...orders.map((order, idx) => ({
        ...order.coordinate,
        type: 'order',
        orderId: order.id || idx,
        address: order.realAddress
      }))
    ];
    
    // 2. Obtener matriz de distancias REALES
    console.log('📊 Obteniendo matriz de distancias de OSRM...');
    const durationMatrix = await calculateDistanceMatrix(allPoints);
    
    if (!durationMatrix) {
      console.log('⚠️  Falló matriz OSRM, usando algoritmo simple');
      return calculateSimpleRoute(startPoint, orders);
    }
    
    // 3. Algoritmo de optimización mejorado
    const numPoints = allPoints.length;
    const visited = new Array(numPoints).fill(false);
    visited[0] = true; // Marcar punto de inicio como visitado
    
    const route = [0]; // Comenzar desde el punto 0 (inicio)
    let currentPoint = 0;
    
    // Algoritmo del vecino más cercano con tiempos reales
    for (let i = 1; i < numPoints; i++) {
      let closestIndex = -1;
      let closestTime = Infinity;
      
      // Buscar el punto no visitado más cercano
      for (let j = 1; j < numPoints; j++) {
        if (!visited[j] && durationMatrix[currentPoint][j] < closestTime) {
          closestTime = durationMatrix[currentPoint][j];
          closestIndex = j;
        }
      }
      
      if (closestIndex !== -1) {
        route.push(closestIndex);
        visited[closestIndex] = true;
        currentPoint = closestIndex;
      }
    }
    
    // 4. Reordenar pedidos según ruta óptima
    const optimizedOrders = [];
    for (let i = 1; i < route.length; i++) {
      const orderIndex = route[i] - 1; // -1 porque el índice 0 es el inicio
      if (orderIndex >= 0 && orderIndex < orders.length) {
        optimizedOrders.push({
          ...orders[orderIndex],
          orderInRoute: i,
          estimatedTime: Math.round(durationMatrix[route[i-1]][route[i]] / 60), // minutos
          legDuration: durationMatrix[route[i-1]][route[i]]
        });
      }
    }
    
    // 5. Obtener la ruta completa para el mapa
    const routeCoordinates = allPoints.map((point, idx) => ({
      latitude: point.latitude,
      longitude: point.longitude,
      isStart: idx === 0,
      orderIndex: idx === 0 ? null : idx - 1
    }));
    
    // 6. Calcular distancia total
    let totalDuration = 0;
    for (let i = 0; i < route.length - 1; i++) {
      totalDuration += durationMatrix[route[i]][route[i + 1]];
    }
    
    console.log('✅ Ruta optimizada con tiempos reales');
    console.log(`• Tiempo total estimado: ${Math.round(totalDuration / 60)} minutos`);
    
    return {
      success: true,
      optimizedOrders,
      routeIndices: route,
      totalDuration,
      durationMatrix,
      message: `Ruta optimizada: ${Math.round(totalDuration / 60)} min total`
    };
    
  } catch (error) {
    console.error('❌ Error en optimización avanzada:', error);
    // Fallback a algoritmo simple
    return calculateSimpleRoute(startPoint, orders);
  }
};

// Algoritmo simple (fallback)
const calculateSimpleRoute = (startPoint, orders) => {
  // Tu algoritmo actual aquí...
};