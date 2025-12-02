// components/RouteMap.js
import React, { useEffect, useRef } from 'react';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { calculateRealRoute } from '../services/osrmService';

const RouteMap = ({ routeCoordinates, orders }) => {
  const mapRef = useRef(null);
  const [routeGeometry, setRouteGeometry] = React.useState([]);
  
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 1) {
      calculateRouteGeometry();
    }
  }, [routeCoordinates]);
  
  const calculateRouteGeometry = async () => {
    try {
      const route = await calculateRealRoute(routeCoordinates);
      if (route && route.geometry) {
        // Convertir GeoJSON LineString a coordenadas
        const coords = route.geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0]
        }));
        setRouteGeometry(coords);
        
        // Ajustar mapa para ver toda la ruta
        if (mapRef.current && coords.length > 0) {
          mapRef.current.fitToCoordinates(coords, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true
          });
        }
      }
    } catch (error) {
      console.error('Error calculando geometría:', error);
    }
  };
  
  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: routeCoordinates[0]?.latitude || -12.0464,
        longitude: routeCoordinates[0]?.longitude || -77.0428,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      }}
    >
      {/* Línea de ruta */}
      {routeGeometry.length > 0 && (
        <Polyline
          coordinates={routeGeometry}
          strokeWidth={4}
          strokeColor="#3B82F6"
        />
      )}
      
      {/* Marcadores */}
      {routeCoordinates.map((point, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: point.latitude,
            longitude: point.longitude
          }}
          title={index === 0 ? 'TÚ' : `Pedido ${index}`}
          description={point.description || ''}
          pinColor={index === 0 ? '#10B981' : '#EF4444'}
        />
      ))}
    </MapView>
  );
};