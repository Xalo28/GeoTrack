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
        address: order.realAddress,
        originalIndex: idx // Guardar el índice original
      }))
    ];
    
    // 2. Obtener matriz de distancias REALES
    console.log('📊 Obteniendo matriz de distancias de OSRM...');
    const durationMatrix = await calculateDistanceMatrix(allPoints);
    
    if (!durationMatrix || durationMatrix.length !== allPoints.length) {
      console.log('⚠️  Falló matriz OSRM, usando algoritmo simple');
      return calculateSimpleRoute(startPoint, orders);
    }
    
    console.log(`✅ Matriz recibida: ${durationMatrix.length}x${durationMatrix[0]?.length}`);
    
    // 3. Algoritmo de optimización mejorado (Vecino más cercano)
    const numPoints = allPoints.length;
    const visited = new Array(numPoints).fill(false);
    visited[0] = true; // Marcar punto de inicio como visitado
    
    const routeIndices = [0]; // Comenzar desde el punto 0 (inicio)
    let currentPoint = 0;
    let totalDuration = 0;
    
    // Encontrar el orden óptimo
    for (let i = 1; i < numPoints; i++) {
      let closestIndex = -1;
      let closestTime = Infinity;
      
      // Buscar el punto no visitado más cercano AL PUNTO ACTUAL
      for (let j = 1; j < numPoints; j++) {
        if (!visited[j] && durationMatrix[currentPoint][j] < closestTime) {
          closestTime = durationMatrix[currentPoint][j];
          closestIndex = j;
        }
      }
      
      if (closestIndex !== -1) {
        routeIndices.push(closestIndex);
        totalDuration += closestTime;
        visited[closestIndex] = true;
        currentPoint = closestIndex;
      }
    }
    
    console.log(`📈 Índices optimizados: ${routeIndices.join(' → ')}`);
    
    // 4. Reconstruir pedidos en el ORDEN CORRECTO usando los índices originales
    const optimizedOrders = [];
    for (let i = 1; i < routeIndices.length; i++) {
      const routeIndex = routeIndices[i]; // Índice en allPoints
      const originalIndex = allPoints[routeIndex].originalIndex; // Índice original en orders
      
      if (originalIndex >= 0 && originalIndex < orders.length) {
        const originalOrder = orders[originalIndex];
        
        // Calcular tiempo desde el punto anterior
        const prevIndex = routeIndices[i-1];
        const legDuration = durationMatrix[prevIndex][routeIndex];
        
        optimizedOrders.push({
          ...originalOrder,
          orderInRoute: i, // Posición en la ruta optimizada
          estimatedTime: Math.round(legDuration / 60), // minutos
          legDuration: legDuration,
          distanceFromPrevious: null, // Se calculará después si es necesario
          _optimizedIndex: routeIndex // Para debugging
        });
      }
    }
    
    // 5. Calcular distancias lineales para mostrar
    for (let i = 0; i < optimizedOrders.length; i++) {
      const currentOrder = optimizedOrders[i];
      
      if (i === 0) {
        // Distancia desde el punto de inicio
        const dist = calculateDistance(
          startPoint.latitude, startPoint.longitude,
          currentOrder.coordinate.latitude, currentOrder.coordinate.longitude
        );
        currentOrder.distanceFromDriver = Math.round(dist);
      } else {
        // Distancia desde el pedido anterior
        const prevOrder = optimizedOrders[i-1];
        const dist = calculateDistance(
          prevOrder.coordinate.latitude, prevOrder.coordinate.longitude,
          currentOrder.coordinate.latitude, currentOrder.coordinate.longitude
        );
        currentOrder.distanceFromPrevious = Math.round(dist);
      }
    }
    
    // 6. Crear coordenadas para el mapa (en orden óptimo)
    const routeCoordinates = [
      {
        latitude: startPoint.latitude,
        longitude: startPoint.longitude,
        isStart: true,
        title: '📍 TÚ',
        description: 'Punto de inicio'
      }
    ];
    
    optimizedOrders.forEach((order, idx) => {
      routeCoordinates.push({
        latitude: order.coordinate.latitude,
        longitude: order.coordinate.longitude,
        isStart: false,
        orderIndex: idx,
        title: `📦 Pedido ${idx + 1}`,
        description: order.realAddress?.substring(0, 40) || 'Dirección no disponible',
        orderData: order
      });
    });
    
    // 7. Obtener ruta detallada para el mapa (opcional)
    let detailedRoute = [];
    try {
      const pointsForRouting = [
        startPoint,
        ...optimizedOrders.map(o => o.coordinate)
      ];
      detailedRoute = await getRoutePolyline(pointsForRouting);
    } catch (e) {
      console.log('⚠️  No se pudo obtener ruta detallada, usando puntos');
    }
    
    console.log('✅ RUTA OPTIMIZADA FINALIZADA');
    console.log(`• Total pedidos: ${optimizedOrders.length}`);
    console.log(`• Tiempo total estimado: ${Math.round(totalDuration / 60)} minutos`);
    console.log(`• Orden de entrega:`);
    optimizedOrders.forEach((order, idx) => {
      console.log(`  ${idx + 1}. ${order.realAddress?.substring(0, 40) || 'Sin dirección'} (${order.estimatedTime} min)`);
    });
    
    return {
      success: true,
      optimizedOrders,
      routeCoordinates,
      detailedRoute,
      routeIndices: routeIndices.slice(1).map(idx => idx - 1), // Solo índices de pedidos
      totalDuration,
      totalDistance: null, // OSRM no da distancia en matrix
      durationMatrix,
      message: `Ruta optimizada: ${optimizedOrders.length} pedidos en ${Math.round(totalDuration / 60)} min`
    };
    
  } catch (error) {
    console.error('❌ Error en optimización avanzada:', error);
    // Fallback a algoritmo simple
    return calculateSimpleRoute(startPoint, orders);
  }
};

// Función auxiliar para calcular distancia (la misma que tienes en routeCalculations.js)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Obtener polyline de la ruta para el mapa
const getRoutePolyline = async (points) => {
  try {
    if (points.length < 2) return [];
    
    const coordsString = points
      .map(p => `${p.longitude},${p.latitude}`)
      .join(';');
    
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes[0]) {
      // Convertir GeoJSON a coordenadas para React Native Maps
      return data.routes[0].geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error obteniendo ruta detallada:', error);
    return [];
  }
};

// Algoritmo simple (fallback)
const calculateSimpleRoute = (startPoint, orders) => {
  console.log('⚠️  Usando algoritmo simple de optimización');
  
  // Ordenar pedidos por distancia al punto de inicio
  const ordersWithDistance = orders.map((order, idx) => {
    const dist = calculateDistance(
      startPoint.latitude, startPoint.longitude,
      order.coordinate.latitude, order.coordinate.longitude
    );
    return {
      ...order,
      distanceFromDriver: dist,
      originalIndex: idx
    };
  });
  
  // Ordenar por distancia (más cercano primero)
  const sortedOrders = [...ordersWithDistance].sort((a, b) => 
    a.distanceFromDriver - b.distanceFromDriver
  );
  
  // Asignar orden en ruta
  const optimizedOrders = sortedOrders.map((order, idx) => ({
    ...order,
    orderInRoute: idx + 1,
    estimatedTime: Math.round(order.distanceFromDriver / 400 * 60), // Estimación aproximada
    distanceFromPrevious: idx === 0 ? null : 
      calculateDistance(
        sortedOrders[idx-1].coordinate.latitude, sortedOrders[idx-1].coordinate.longitude,
        order.coordinate.latitude, order.coordinate.longitude
      )
  }));
  
  // Calcular ruta total
  let totalDistance = optimizedOrders[0]?.distanceFromDriver || 0;
  for (let i = 1; i < optimizedOrders.length; i++) {
    totalDistance += optimizedOrders[i].distanceFromPrevious || 0;
  }
  
  const totalDuration = totalDistance / 400 * 60; // Estimación: 400m/min ≈ 24km/h
  
  // Coordenadas para el mapa
  const routeCoordinates = [
    {
      latitude: startPoint.latitude,
      longitude: startPoint.longitude,
      isStart: true,
      title: '📍 TÚ'
    },
    ...optimizedOrders.map((order, idx) => ({
      latitude: order.coordinate.latitude,
      longitude: order.coordinate.longitude,
      isStart: false,
      orderIndex: idx,
      title: `📦 Pedido ${idx + 1}`,
      description: order.realAddress?.substring(0, 40) || 'Dirección'
    }))
  ];
  
  return {
    success: true,
    optimizedOrders,
    routeCoordinates,
    totalDuration,
    totalDistance,
    message: `Ruta simple: ${optimizedOrders.length} pedidos en ${Math.round(totalDuration / 60)} min`
  };
};