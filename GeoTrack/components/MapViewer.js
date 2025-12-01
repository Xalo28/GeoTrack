import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/PedidosStyles';
import { getPreciseDistance } from '../utils/routeCalculations'; 

const MapViewer = ({ 
  location, 
  mapRegion, 
  optimizedRoute, 
  ordersWithStableCoords, 
  routeCoordinates, 
  onOrderPress, 
  onCenterMap,
  mapRef 
}) => {
  if (!location || !mapRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5CE1E6" />
        <Text style={{marginTop: 10, color: '#666'}}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  const ordersToShow = optimizedRoute.length > 0 ? optimizedRoute : ordersWithStableCoords;

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
      >
        <DriverMarker location={location} />
        
        {ordersToShow.map((order, index) => (
          <OrderMarker 
            key={`${order.id}-${index}-${order.orderInRoute || 'unoptimized'}`}
            order={order}
            onPress={() => onOrderPress(order)}
          />
        ))}

        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[10, 10]}
          />
        )}
      </MapView>

      {optimizedRoute.length > 0 && (
        <RouteInfoPanel routeCoordinates={routeCoordinates} optimizedRoute={optimizedRoute} />
      )}

      <CenterButton onPress={onCenterMap} />
    </View>
  );
};

const DriverMarker = ({ location }) => (
  <Marker
    coordinate={{
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }}
    title="Tu ubicación"
    description="Chofer"
  >
    <View style={styles.driverMarker}>
      <Ionicons name="navigate" size={24} color="#007AFF" />
    </View>
  </Marker>
);

const OrderMarker = ({ order, onPress }) => {
  if (!order.coordinate || !order.coordinate.latitude || !order.coordinate.longitude) {
    return null;
  }

  // Normalizar el estado para comparación
  const normalizedEstado = order.estado?.toString().toLowerCase().trim();
  
  // Determinar color según estado
  let markerColor = '#5CE1E6'; // Azul/turquesa por defecto (pendiente)
  let iconName = 'location';
  let iconColor = '#FFF';
  
  if (normalizedEstado === 'entregado') {
    markerColor = '#27ae60'; // VERDE
    iconName = 'checkmark-circle';
  } else if (normalizedEstado === 'en camino' || normalizedEstado === 'encamino') {
    markerColor = '#f39c12'; // NARANJA/AMARILLO
    iconName = 'car-outline';
  }

  // También puedes mostrar un borde diferente para los entregados
  const markerStyle = [
    styles.orderMarker, 
    { backgroundColor: markerColor },
    normalizedEstado === 'entregado' && styles.deliveredMarker
  ];

  return (
    <Marker
      coordinate={order.coordinate}
      title={`${order.orderInRoute ? `#${order.orderInRoute} - ` : ''}${order.cliente}`}
      description={`Estado: ${order.estado || 'Pendiente'}`}
      onCalloutPress={onPress}
    >
      <View style={markerStyle}>
        {order.orderInRoute ? (
          <View style={styles.markerContent}>
            <Text style={styles.markerNumberText}>{order.orderInRoute}</Text>
            {normalizedEstado === 'entregado' && (
              <View style={styles.checkIconContainer}>
                <Ionicons name="checkmark" size={10} color="#FFF" />
              </View>
            )}
          </View>
        ) : (
          <Ionicons name={iconName} size={18} color={iconColor} />
        )}
      </View>
    </Marker>
  );
};

const RouteInfoPanel = ({ routeCoordinates, optimizedRoute }) => {
  const totalDistance = getPreciseDistance(routeCoordinates); 
  const fuelSaved = ((totalDistance / 1000) * 0.15).toFixed(1);

  return (
    <View style={styles.routeInfoPanel}>
      <View style={styles.routeInfoHeader}>
        <Ionicons name="analytics-outline" size={24} color="#007AFF" />
        <Text style={styles.routeInfoTitle}>Ruta Optimizada</Text>
      </View>
      
      <View style={styles.routeInfoStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{optimizedRoute.length}</Text>
          <Text style={styles.statLabel}>Pedidos</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{(totalDistance/1000).toFixed(1)}</Text>
          <Text style={styles.statLabel}>km</Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, {color: '#27ae60'}]}>{fuelSaved}</Text>
          <Text style={styles.statLabel}>L ahorro</Text>
        </View>
      </View>
      
      <Text style={styles.stableRouteNote}>✅ La ruta es estable y reproducible</Text>
    </View>
  );
};

const CenterButton = ({ onPress }) => (
  <TouchableOpacity style={styles.centerButton} onPress={onPress}>
    <Ionicons name="locate" size={24} color="#007AFF" />
  </TouchableOpacity>
);

export default MapViewer;