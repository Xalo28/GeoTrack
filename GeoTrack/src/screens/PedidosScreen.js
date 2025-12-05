import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useOrders } from '../context/OrdersContext';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_API_KEY = 'AIzaSyCaD2fXca4-pOhRtBN9-3OaCrJLvU27Vbw';

const PedidosScreen = ({ navigation, route }) => {
  const { districtFilter = 'TODOS', districtOrders = [] } = route.params || {};
  const { orders, markAsDelivered } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState('inicio');
  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [mapType, setMapType] = useState('standard');

  // Estados para la ruta optimizada
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [optimizedOrderSequence, setOptimizedOrderSequence] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const mapAnim = useRef(new Animated.Value(0)).current;

  const filteredOrders = districtOrders.length > 0 
    ? districtOrders 
    : orders.filter(order => 
        districtFilter === 'TODOS' ? true : order.distrito === districtFilter
      );

  const displayOrders = filteredOrders.filter(order => {
    const statusMatch = selectedStatus === 'all' ? true : 
                       selectedStatus === 'pending' ? order.estado !== 'Entregado' :
                       order.estado === 'Entregado';
    
    const searchMatch = !searchQuery || 
                       order.cliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.distrito?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.informacionContacto?.direccion?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        Alert.alert("Permiso denegado", "Necesitamos tu ubicación para mostrar el mapa.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  // Función para calcular distancia entre dos puntos (fórmula Haversine)
  const calculateHaversineDistance = (coord1, coord2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Algoritmo del vecino más cercano
  const calculateNearestNeighbor = (locations) => {
    if (locations.length <= 1) return locations;

    const visited = new Set();
    const result = [];
    
    // Empezar desde la ubicación actual (índice 0)
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

  // Calcular distancia total de la ruta
  const calculateTotalDistance = (sequence) => {
    let totalDistance = 0;
    
    for (let i = 0; i < sequence.length - 1; i++) {
      const distance = calculateHaversineDistance(
        { latitude: sequence[i].latitude, longitude: sequence[i].longitude },
        { latitude: sequence[i + 1].latitude, longitude: sequence[i + 1].longitude }
      );
      totalDistance += distance;
    }
    
    return totalDistance;
  };

  // Función principal para calcular ruta optimizada
  const calculateOptimalRoute = async () => {
    try {
      setIsCalculatingRoute(true);
      
      // Filtrar solo pedidos pendientes CON coordenadas
      const pendingOrders = displayOrders.filter(order => 
        order.estado !== 'Entregado' && order.coordinate
      );

      // Verificar si hay pedidos sin coordenadas
      const ordersWithoutCoords = displayOrders.filter(order => 
        order.estado !== 'Entregado' && !order.coordinate
      );

      if (ordersWithoutCoords.length > 0) {
        Alert.alert(
          '⚠️ Algunos pedidos sin ubicación',
          `${ordersWithoutCoords.length} pedidos no tienen coordenadas GPS. \n\nSerán excluidos de la ruta optimizada.`,
          [{ text: 'ENTENDIDO' }]
        );
      }

      if (pendingOrders.length === 0) {
        Alert.alert(
          '❌ No hay pedidos rutables',
          ordersWithoutCoords.length > 0 
            ? 'Todos los pedidos pendientes carecen de coordenadas GPS.'
            : 'Todos los pedidos ya están entregados.'
        );
        setIsCalculatingRoute(false);
        return;
      }

      // Obtener ubicación actual del usuario
      const currentLocation = await Location.getCurrentPositionAsync({});
      const origin = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Crear matriz de coordenadas (incluyendo ubicación actual)
      const locations = [
        { 
          ...origin, 
          isCurrentLocation: true,
          orderId: 'current',
          cliente: '📍 TU UBICACIÓN',
          direccion: 'Punto de partida'
        },
        ...pendingOrders.map((order, index) => ({
          latitude: order.coordinate.latitude,
          longitude: order.coordinate.longitude,
          orderId: order.id,
          cliente: order.cliente,
          direccion: order.informacionContacto?.direccion,
          distrito: order.distrito,
          orderIndex: index + 1
        }))
      ];

      console.log('Calculando ruta con', pendingOrders.length, 'pedidos con coordenadas');
      console.log('Coordenadas de pedidos:', pendingOrders.map(o => ({
        cliente: o.cliente,
        coords: o.coordinate
      })));

      // Calcular secuencia óptima
      const sequence = calculateNearestNeighbor(locations);
      
      // Preparar coordenadas para mostrar en el mapa
      const routeCoords = sequence.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
      }));

      setOptimizedOrderSequence(sequence);
      setRouteCoordinates(routeCoords);

      // Calcular distancia total estimada
      const totalDistanceKm = calculateTotalDistance(sequence);
      setTotalDistance(totalDistanceKm);

      // Estimar tiempo (asumiendo 30 km/h en promedio + 5 minutos por parada)
      const travelTimeHours = totalDistanceKm / 30;
      const stopTimeMinutes = pendingOrders.length * 5;
      const totalTimeMinutes = (travelTimeHours * 60) + stopTimeMinutes;
      setEstimatedTime(totalTimeMinutes);

      setOptimizedRoute({
        sequence,
        totalDistance: totalDistanceKm,
        estimatedTime: totalTimeMinutes,
        stopCount: pendingOrders.length,
        ordersWithCoords: pendingOrders.length,
        ordersWithoutCoords: ordersWithoutCoords.length
      });

      // Cambiar a vista de mapa automáticamente
      setActiveTab('map');
      
      Alert.alert(
        '✅ Ruta Optimizada Calculada',
        `📏 Distancia total: ${totalDistanceKm.toFixed(2)} km\n` +
        `⏱️ Tiempo estimado: ${Math.round(totalTimeMinutes)} minutos\n` +
        `📍 Paradas programadas: ${pendingOrders.length}\n` +
        (ordersWithoutCoords.length > 0 ? `\n⚠️ ${ordersWithoutCoords.length} pedidos excluidos (sin GPS)` : ''),
        [{ text: 'VER RUTA EN EL MAPA' }]
      );

    } catch (error) {
      console.error('Error calculando ruta:', error);
      Alert.alert('❌ Error', 'No se pudo calcular la ruta optimizada. Verifica tu conexión a internet.');
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Función para abrir ruta en Google Maps
  const openRouteInGoogleMaps = () => {
    if (!optimizedRoute || optimizedRoute.sequence.length < 2) {
      Alert.alert('Error', 'Primero calcula una ruta optimizada.');
      return;
    }

    const sequence = optimizedRoute.sequence;
    
    // Construir URL de Google Maps con waypoints optimizados
    let url = 'https://www.google.com/maps/dir/?api=1&';
    
    // Origen
    url += `origin=${sequence[0].latitude},${sequence[0].longitude}&`;
    
    // Destino (última ubicación)
    const last = sequence[sequence.length - 1];
    url += `destination=${last.latitude},${last.longitude}&`;
    
    // Waypoints (todos menos el primero y último)
    if (sequence.length > 2) {
      const waypoints = sequence.slice(1, -1);
      url += `waypoints=${waypoints.map(wp => `${wp.latitude},${wp.longitude}`).join('|')}&`;
    }
    
    // Optimizar waypoints
    url += 'dir_action=navigate&travelmode=driving';
    
    Linking.openURL(url).catch(err => {
      Alert.alert('Error', 'No se pudo abrir Google Maps. Asegúrate de tener la app instalada.');
    });
  };

  // Función para abrir un pedido específico en Google Maps
  const handleNavigateToOrder = (order) => {
    if (order.coordinate) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${order.coordinate.latitude},${order.coordinate.longitude}&travelmode=driving&dir_action=navigate`;
      Linking.openURL(url);
    } else {
      Alert.alert(
        '📍 Pedido sin coordenadas',
        `El pedido de ${order.cliente} no tiene coordenadas GPS.\n\nDirección: ${order.informacionContacto?.direccion || 'No disponible'}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir en Maps', 
            onPress: () => {
              if (order.informacionContacto?.direccion) {
                const address = encodeURIComponent(`${order.informacionContacto.direccion}, ${order.distrito}, Lima`);
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${address}`);
              }
            }
          }
        ]
      );
    }
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleEnrutar = () => {
    // Contar pedidos con y sin coordenadas
    const pendingWithCoords = displayOrders.filter(order => 
      order.estado !== 'Entregado' && order.coordinate
    ).length;
    
    const pendingWithoutCoords = displayOrders.filter(order => 
      order.estado !== 'Entregado' && !order.coordinate
    ).length;

    let message = '¿Deseas calcular la ruta más óptima para entregar los pedidos pendientes?';
    
    if (pendingWithoutCoords > 0) {
      message += `\n\n⚠️ Nota: ${pendingWithoutCoords} pedido(s) no tienen coordenadas y serán excluidos.`;
    }

    Alert.alert(
      '🚚 Optimizar Ruta de Entrega',
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Calcular Ruta', 
          onPress: calculateOptimalRoute 
        }
      ]
    );
  };

  const handleMarkDelivered = () => {
    if (selectedOrder) {
      markAsDelivered(selectedOrder.id);
      handleCloseModal();
      // Limpiar ruta si se marca como entregado
      if (optimizedRoute) {
        setOptimizedRoute(null);
        setRouteCoordinates([]);
      }
    }
  };

  const handleCall = () => {
    if (selectedOrder?.informacionContacto?.telefono) {
      const phoneNumber = selectedOrder.informacionContacto.telefono.replace(/\D/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleOpenMaps = () => {
    if (selectedOrder?.informacionContacto?.direccion) {
      const address = encodeURIComponent(`${selectedOrder.informacionContacto.direccion}, ${selectedOrder.distrito}, Lima`);
      Linking.openURL(`https://maps.google.com/?q=${address}`);
    }
  };

  const handleScanPress = () => {
    setActiveBottomTab('escanear');
    navigation.navigate('ScanPhase1');
  };

  const handleAddPress = () => {
    setActiveBottomTab('agregar');
    navigation.navigate('ManualOrder');
  };

  const handleHomePress = () => {
    setActiveBottomTab('inicio');
    navigation.navigate('Home');
  };

  const handleClearRoute = () => {
    Alert.alert(
      'Limpiar Ruta',
      '¿Estás seguro de que deseas eliminar la ruta optimizada actual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          onPress: () => {
            setOptimizedRoute(null);
            setRouteCoordinates([]);
            setOptimizedOrderSequence([]);
          }
        }
      ]
    );
  };

  const pendingCount = filteredOrders.filter(o => o.estado !== 'Entregado').length;
  const deliveredCount = filteredOrders.filter(o => o.estado === 'Entregado').length;
  const completionRate = filteredOrders.length > 0 
    ? Math.round((deliveredCount / filteredOrders.length) * 100) 
    : 0;

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const renderOrderCard = (order, index) => (
    <Animated.View 
      key={order.id || index}
      style={[
        styles.orderCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => handleOrderPress(order)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.orderNumberContainer}>
              <Text style={styles.orderNumber}>#{index + 1}</Text>
              {!order.coordinate && (
                <View style={styles.gpsWarning}>
                  <MaterialIcons name="gps-off" size={10} color="#FFA726" />
                </View>
              )}
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                order.estado === 'Entregado' ? styles.statusDelivered : styles.statusPending
              ]}>
                <Text style={styles.statusText}>
                  {order.estado === 'Entregado' ? 'ENTREGADO' : 'PENDIENTE'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.clientInfo}>
            <View style={styles.clientIcon}>
              <MaterialIcons name="person" size={20} color="#5CE1E6" />
            </View>
            <View style={styles.clientDetails}>
              <Text style={styles.clientName}>{order.cliente || 'Cliente no disponible'}</Text>
              <Text style={styles.orderId}>ID: {order.numeroPedido || `ORD-${index + 1000}`}</Text>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <MaterialIcons name="location-on" size={18} color="#FFA726" style={styles.addressIcon} />
            <Text style={styles.addressText}>
              {order.informacionContacto?.direccion || 'Dirección no disponible'}
            </Text>
          </View>

          <View style={styles.districtContainer}>
            <View style={styles.districtTag}>
              <Text style={styles.districtText}>{order.distrito || 'SIN DISTRITO'}</Text>
            </View>
            
            <View style={styles.timeContainer}>
              <MaterialIcons name="access-time" size={14} color="#a0a0c0" />
              <Text style={styles.timeText}>
                {order.coordinate ? '15-30 min' : 'SIN GPS'}
              </Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => handleOrderPress(order)}
            >
              <Text style={styles.detailsButtonText}>VER DETALLES</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#5CE1E6" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navigateButton,
                !order.coordinate && styles.navigateButtonDisabled
              ]}
              onPress={() => handleNavigateToOrder(order)}
              disabled={!order.coordinate}
            >
              <MaterialIcons name="directions" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderListView = () => (
    <Animated.View 
      style={[
        styles.contentContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.statsQuickView}>
          <View style={styles.statQuickItem}>
            <Text style={styles.statQuickNumber}>{filteredOrders.length}</Text>
            <Text style={styles.statQuickLabel}>TOTAL</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statQuickItem}>
            <Text style={[styles.statQuickNumber, { color: '#FFA726' }]}>{pendingCount}</Text>
            <Text style={styles.statQuickLabel}>PENDIENTES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statQuickItem}>
            <Text style={[styles.statQuickNumber, { color: '#4ECB71' }]}>{deliveredCount}</Text>
            <Text style={styles.statQuickLabel}>ENTREGADOS</Text>
          </View>
        </View>

        <View style={styles.ordersList}>
          {displayOrders.length > 0 ? (
            displayOrders.map((order, index) => renderOrderCard(order, index))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="assignment" size={60} color="rgba(255, 255, 255, 0.2)" />
              <Text style={styles.emptyTitle}>No hay pedidos</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'No se encontraron resultados' : 
                 selectedStatus !== 'all' ? `No hay pedidos ${selectedStatus === 'pending' ? 'pendientes' : 'entregados'}` :
                 'No hay pedidos en este filtro'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );

  const renderMapView = () => {
    if (!location || !mapRegion) {
      return (
        <View style={styles.mapLoadingContainer}>
          <ActivityIndicator size="large" color="#5CE1E6" />
          <Text style={styles.mapLoadingText}>Cargando mapa...</Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType={mapType}
        >
          {/* Mostrar ruta optimizada si existe */}
          {routeCoordinates.length > 1 && (
            <MapViewDirections
              origin={routeCoordinates[0]}
              destination={routeCoordinates[routeCoordinates.length - 1]}
              waypoints={routeCoordinates.length > 2 ? routeCoordinates.slice(1, -1) : []}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="#5CE1E6"
              optimizeWaypoints={true}
              onReady={result => {
                // Actualizar con datos más precisos de Google
                setTotalDistance(result.distance);
                setEstimatedTime(result.duration);
              }}
              onError={(errorMessage) => {
                console.log('Error de Google Directions:', errorMessage);
              }}
            />
          )}

          {/* Marcadores de la ruta optimizada */}
          {optimizedOrderSequence.map((location, index) => (
            <Marker
              key={`route-${index}-${location.orderId}`}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.isCurrentLocation ? '📍 TU UBICACIÓN' : `📦 ${location.cliente}`}
              description={location.isCurrentLocation ? 'Punto de partida' : `${location.distrito}\n${location.direccion}`}
              onPress={() => {
                if (!location.isCurrentLocation) {
                  const order = displayOrders.find(o => o.id === location.orderId);
                  if (order) handleOrderPress(order);
                }
              }}
            >
              <View style={[
                styles.routeMarker,
                index === 0 && styles.currentLocationMarker,
                index === optimizedOrderSequence.length - 1 && styles.lastStopMarker
              ]}>
                <Text style={styles.markerNumber}>
                  {index === 0 ? '📍' : index}
                </Text>
              </View>
            </Marker>
          ))}

          {/* Marcadores de pedidos regulares (si no hay ruta optimizada) */}
          {!optimizedRoute && displayOrders.map((order, index) => {
            if (!order.coordinate) return null; // No mostrar pedidos sin coordenadas
            
            return (
              <Marker
                key={order.id || index}
                coordinate={{
                  latitude: order.coordinate.latitude,
                  longitude: order.coordinate.longitude,
                }}
                title={order.cliente}
                description={order.distrito}
                pinColor={order.estado === 'Entregado' ? '#4ECB71' : '#FFA726'}
                onPress={() => handleOrderPress(order)}
              >
                <Callout tooltip onPress={() => handleOrderPress(order)}>
                  <View style={styles.mapCallout}>
                    <Text style={styles.mapCalloutTitle}>{order.cliente}</Text>
                    <Text style={styles.mapCalloutAddress}>
                      {order.informacionContacto?.direccion}
                    </Text>
                    <Text style={styles.mapCalloutDistrict}>{order.distrito}</Text>
                    <TouchableOpacity 
                      style={styles.mapCalloutButton}
                      onPress={() => handleNavigateToOrder(order)}
                    >
                      <Text style={styles.mapCalloutButtonText}>NAVEGAR</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {/* Información de la ruta optimizada */}
        {optimizedRoute && (
          <View style={styles.routeInfoContainer}>
            <View style={styles.routeInfoCard}>
              <View style={styles.routeInfoHeader}>
                <Text style={styles.routeInfoTitle}>🗺️ RUTA OPTIMIZADA</Text>
                <TouchableOpacity onPress={handleClearRoute} style={styles.clearRouteButton}>
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.routeStats}>
                <View style={styles.routeStatItem}>
                  <MaterialIcons name="directions" size={16} color="#5CE1E6" />
                  <Text style={styles.routeStatText}>
                    {totalDistance.toFixed(2)} km
                  </Text>
                </View>
                <View style={styles.routeStatDivider} />
                <View style={styles.routeStatItem}>
                  <MaterialIcons name="access-time" size={16} color="#5CE1E6" />
                  <Text style={styles.routeStatText}>
                    {Math.round(estimatedTime)} min
                  </Text>
                </View>
                <View style={styles.routeStatDivider} />
                <View style={styles.routeStatItem}>
                  <MaterialIcons name="location-pin" size={16} color="#5CE1E6" />
                  <Text style={styles.routeStatText}>
                    {optimizedRoute.stopCount} paradas
                  </Text>
                </View>
              </View>

              {optimizedRoute.ordersWithoutCoords > 0 && (
                <View style={styles.warningContainer}>
                  <MaterialIcons name="warning" size={14} color="#FFA726" />
                  <Text style={styles.warningText}>
                    {optimizedRoute.ordersWithoutCoords} pedido(s) excluido(s) - Sin GPS
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.openInMapsButton}
                onPress={openRouteInGoogleMaps}
              >
                <LinearGradient
                  colors={['#4ECB71', '#2E7D32']}
                  style={styles.openInMapsGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <MaterialIcons name="open-in-new" size={16} color="#FFFFFF" />
                  <Text style={styles.openInMapsText}>ABRIR EN GOOGLE MAPS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <MaterialIcons 
              name={mapType === 'standard' ? 'satellite' : 'map'} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              setMapRegion({
                ...mapRegion,
                latitudeDelta: Math.max(mapRegion.latitudeDelta * 0.5, 0.001),
                longitudeDelta: Math.max(mapRegion.longitudeDelta * 0.5, 0.001),
              });
            }}
          >
            <MaterialIcons name="zoom-in" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              setMapRegion({
                ...mapRegion,
                latitudeDelta: Math.min(mapRegion.latitudeDelta * 2, 0.5),
                longitudeDelta: Math.min(mapRegion.longitudeDelta * 2, 0.5),
              });
            }}
          >
            <MaterialIcons name="zoom-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapControlButton}
            onPress={() => {
              Location.getCurrentPositionAsync({}).then(loc => {
                setMapRegion({
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                });
              });
            }}
          >
            <MaterialIcons name="my-location" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBottomBar = () => (
    <View style={styles.bottomBar}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.95)', 'rgba(26, 26, 46, 0.98)']}
        style={styles.bottomBarGradient}
      >
        <View style={styles.bottomBarContent}>
          <TouchableOpacity 
            style={styles.bottomBarButton} 
            onPress={handleScanPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={styles.scanButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>ESCANEAR</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.bottomBarButton} 
            onPress={handleAddPress}
            activeOpacity={0.8}
          >
            <View style={[
              styles.addButton,
              activeBottomTab === 'agregar' && styles.activeBottomButton
            ]}>
              <MaterialIcons 
                name="add-circle" 
                size={24} 
                color={activeBottomTab === 'agregar' ? '#5CE1E6' : '#a0a0c0'} 
              />
              <Text style={[
                styles.bottomBarButtonText,
                activeBottomTab === 'agregar' && styles.activeBottomBarText
              ]}>AGREGAR</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.bottomBarButton} 
            onPress={handleHomePress}
            activeOpacity={0.8}
          >
            <View style={[
              styles.homeButton,
              activeBottomTab === 'inicio' && styles.activeBottomButton
            ]}>
              <MaterialIcons 
                name="dashboard" 
                size={24} 
                color={activeBottomTab === 'inicio' ? '#5CE1E6' : '#a0a0c0'} 
              />
              <Text style={[
                styles.bottomBarButtonText,
                activeBottomTab === 'inicio' && styles.activeBottomBarText
              ]}>INICIO</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const OrderDetailsModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Pedido</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Información General</Text>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Número de Pedido:</Text>
                    <Text style={styles.modalInfoValue}>{selectedOrder.numeroPedido}</Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Cliente:</Text>
                    <Text style={styles.modalInfoValue}>{selectedOrder.cliente}</Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Estado:</Text>
                    <View style={[
                      styles.modalStatusBadge,
                      selectedOrder.estado === 'Entregado' ? styles.modalDeliveredBadge : styles.modalPendingBadge
                    ]}>
                      <Text style={styles.modalStatusText}>{selectedOrder.estado}</Text>
                    </View>
                  </View>
                  {selectedOrder.coordinate && (
                    <View style={styles.modalInfoRow}>
                      <Text style={styles.modalInfoLabel}>Coordenadas GPS:</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedOrder.coordinate.latitude.toFixed(6)}, {selectedOrder.coordinate.longitude.toFixed(6)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Información de Contacto</Text>
                  
                  <TouchableOpacity style={styles.modalContactButton} onPress={handleCall}>
                    <MaterialIcons name="phone" size={20} color="#5CE1E6" />
                    <Text style={styles.modalContactButtonText}>{selectedOrder.informacionContacto?.telefono || 'No disponible'}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalContactButton} onPress={handleOpenMaps}>
                    <MaterialIcons name="location-on" size={20} color="#5CE1E6" />
                    <Text style={styles.modalContactButtonText}>{selectedOrder.informacionContacto?.direccion || 'No disponible'}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Productos</Text>
                  {selectedOrder.productos?.map((producto, index) => (
                    <View key={index} style={styles.modalProductItem}>
                      <Text style={styles.modalProductText}>• {producto}</Text>
                    </View>
                  )) || <Text style={styles.noProductsText}>No hay productos especificados</Text>}
                </View>

                <View style={styles.modalSeparator} />

                <View style={styles.modalSection}>
                  <Text style={styles.modalAdditionalInfo}>
                    <Text style={styles.modalBold}>Ciudad: </Text>
                    <Text>Lima</Text>
                  </Text>
                  <Text style={styles.modalAdditionalInfo}>
                    <Text style={styles.modalBold}>Distrito: </Text>
                    <Text>{selectedOrder.distrito || 'No especificado'}</Text>
                  </Text>
                  {!selectedOrder.coordinate && (
                    <View style={styles.gpsWarningCard}>
                      <MaterialIcons name="gps-off" size={16} color="#FFA726" />
                      <Text style={styles.gpsWarningText}>
                        Este pedido no tiene coordenadas GPS y no aparecerá en rutas optimizadas
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalActionButtons}>
            {selectedOrder?.estado !== 'Entregado' && (
              <TouchableOpacity 
                style={styles.modalDeliverButton}
                onPress={handleMarkDelivered}
              >
                <Text style={styles.modalDeliverButtonText}>Marcar como Entregado</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.topBackgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>PEDIDOS</Text>
          <Text style={styles.headerSubtitle}>{districtFilter}</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'list' && styles.activeTabButton]}
            onPress={() => setActiveTab('list')}
          >
            <MaterialIcons 
              name="list-alt" 
              size={20} 
              color={activeTab === 'list' ? '#FFFFFF' : '#a0a0c0'} 
            />
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
              LISTA
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'map' && styles.activeTabButton]}
            onPress={() => setActiveTab('map')}
          >
            <MaterialIcons 
              name="map" 
              size={20} 
              color={activeTab === 'map' ? '#FFFFFF' : '#a0a0c0'} 
            />
            <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
              MAPA
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusFilters}>
          <TouchableOpacity 
            style={[
              styles.statusFilterButton,
              selectedStatus === 'all' && styles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[
              styles.statusFilterText,
              selectedStatus === 'all' && styles.activeStatusFilterText
            ]}>
              TODOS ({filteredOrders.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusFilterButton,
              selectedStatus === 'pending' && styles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('pending')}
          >
            <Text style={[
              styles.statusFilterText,
              selectedStatus === 'pending' && styles.activeStatusFilterText
            ]}>
              PENDIENTES ({pendingCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.statusFilterButton,
              selectedStatus === 'delivered' && styles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('delivered')}
          >
            <Text style={[
              styles.statusFilterText,
              selectedStatus === 'delivered' && styles.activeStatusFilterText
            ]}>
              ENTREGADOS ({deliveredCount})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#5CE1E6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pedido..."
            placeholderTextColor="#a0a0c0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#a0a0c0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.mainContent}>
        {activeTab === 'list' ? renderListView() : renderMapView()}
      </View>

      {activeTab === 'list' && displayOrders.length > 0 && (
        <TouchableOpacity 
          style={styles.enrutarButton}
          onPress={handleEnrutar}
          activeOpacity={0.8}
          disabled={isCalculatingRoute}
        >
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.enrutarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isCalculatingRoute ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.enrutarText}>CALCULANDO...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="route" size={24} color="#FFFFFF" />
                <Text style={styles.enrutarText}>
                  {optimizedRoute ? 'RUTA CALCULADA' : 'OPTIMIZAR RUTA'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}

      {renderBottomBar()}
      {OrderDetailsModal()}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  topBackgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tabButtonFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tabButtonLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0,
  },
  activeTabButton: {
    backgroundColor: '#5CE1E6',
    borderColor: '#5CE1E6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a0a0c0',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  statusFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 8,
  },
  statusFilterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  activeStatusFilter: {
    backgroundColor: '#5CE1E6',
  },
  statusFilterText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#a0a0c0',
  },
  activeStatusFilterText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    padding: 0,
  },
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statsQuickView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
  },
  statQuickItem: {
    alignItems: 'center',
    flex: 1,
  },
  statQuickNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statQuickLabel: {
    fontSize: 10,
    color: '#a0a0c0',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ordersList: {
    gap: 12,
  },
  orderCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
  },
  cardGradient: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
  },
  gpsWarning: {
    marginLeft: 5,
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    padding: 2,
    borderRadius: 4,
  },
  statusContainer: {},
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 167, 38, 0.4)',
  },
  statusDelivered: {
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(78, 203, 113, 0.4)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clientIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 11,
    color: '#a0a0c0',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  addressIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 16,
  },
  districtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  districtTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  districtText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5CE1E6',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#a0a0c0',
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
    marginRight: 4,
  },
  navigateButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5CE1E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateButtonDisabled: {
    backgroundColor: '#666',
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  mapLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 15,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 10,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapCallout: {
    width: 200,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  mapCalloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  mapCalloutAddress: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  mapCalloutDistrict: {
    fontSize: 11,
    color: '#5CE1E6',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapCalloutButton: {
    backgroundColor: '#5CE1E6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  mapCalloutButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  routeInfoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  routeInfoCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 2,
    borderColor: '#5CE1E6',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearRouteButton: {
    padding: 5,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  routeStatText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  routeStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 167, 38, 0.3)',
  },
  warningText: {
    fontSize: 11,
    color: '#FFA726',
    marginLeft: 6,
    fontWeight: '500',
  },
  openInMapsButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  openInMapsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  openInMapsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  routeMarker: {
    backgroundColor: '#5CE1E6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  currentLocationMarker: {
    backgroundColor: '#4ECB71',
  },
  lastStopMarker: {
    backgroundColor: '#FFA726',
  },
  markerNumber: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  enrutarButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  enrutarGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
  },
  enrutarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  bottomBarGradient: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addButton: {
    alignItems: 'center',
  },
  homeButton: {
    alignItems: 'center',
  },
  activeBottomButton: {
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  bottomBarButtonText: {
    fontSize: 12,
    color: '#a0a0c0',
    marginTop: 5,
  },
  activeBottomBarText: {
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
  },
  modalScrollContent: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalPendingBadge: {
    backgroundColor: '#fff3cd',
  },
  modalDeliveredBadge: {
    backgroundColor: '#d4edda',
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  modalContactButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 10,
    flex: 1,
  },
  modalProductItem: {
    marginBottom: 5,
  },
  modalProductText: {
    fontSize: 14,
    color: '#000000',
  },
  noProductsText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  modalAdditionalInfo: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
  },
  modalBold: {
    fontWeight: 'bold',
  },
  gpsWarningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  gpsWarningText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  modalActionButtons: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  modalDeliverButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalDeliverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default PedidosScreen;