import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import BottomBar from '../components/BottomBar';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderList from '../components/OrderList';
import MapViewer from '../components/MapViewer';
import { useOrders } from '../context/OrdersContext';
import { generateStableCoordinate } from '../utils/geocoding';
import { useRouteOptimizer } from '../components/RouteOptimizer';
import styles from '../styles/PedidosStyles';

const { width, height } = Dimensions.get('window');

const PedidosScreen = ({ navigation, route }) => {
  const { districtFilter = 'TODOS' } = route.params || {};
  const { 
    orders, 
    deleteOrder, 
    markAsDelivered,
    savedOptimizedRoute,
    savedRouteCoordinates,
    saveOptimizedRoute,
    clearOptimizedRoute,
    hasSavedRoute
  } = useOrders();
  const mapRef = useRef(null);

  // Estados principales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Pedidos');
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [hasRestoredRoute, setHasRestoredRoute] = useState(false);
  
  // NUEVO: Estado para controlar primera carga
  const [hasLoadedRouteBefore, setHasLoadedRouteBefore] = useState(false);
  const [isCheckingFirstLoad, setIsCheckingFirstLoad] = useState(true);

  // Verificar si es la primera vez que se carga una ruta
  useEffect(() => {
    checkIfFirstLoad();
  }, []);

  const checkIfFirstLoad = async () => {
    try {
      const hasLoaded = await AsyncStorage.getItem('hasLoadedRouteBefore');
      console.log('¿Ha cargado ruta antes?:', hasLoaded);
      setHasLoadedRouteBefore(hasLoaded === 'true');
    } catch (error) {
      console.error('Error verificando primera carga:', error);
    } finally {
      setIsCheckingFirstLoad(false);
    }
  };

  // CARGAR RUTA OPTIMIZADA GUARDADA AL INICIAR
  useEffect(() => {
    const loadSavedRoute = async () => {
      if (savedOptimizedRoute.length > 0 && !hasRestoredRoute && !isCheckingFirstLoad) {
        console.log('Cargando ruta optimizada guardada:', savedOptimizedRoute.length, 'pedidos');
        
        setOptimizedRoute(savedOptimizedRoute);
        
        if (savedRouteCoordinates.length > 0) {
          setRouteCoordinates(savedRouteCoordinates);
        }
        
        setHasRestoredRoute(true);
        
        // Determinar qué mensaje mostrar basado en si es primera carga o no
        const message = hasLoadedRouteBefore 
          ? `✅ Ruta Restaurada\nSe cargó la ruta optimizada guardada con ${savedOptimizedRoute.length} pedidos`
          : `🚀 Ruta Cargada\nSe ha cargado la ruta optimizada con ${savedOptimizedRoute.length} pedidos`;
        
        // Solo mostrar alerta si NO es la primera vez
        if (hasLoadedRouteBefore) {
          setTimeout(() => {
            Alert.alert(
              hasLoadedRouteBefore ? '✅ Ruta Restaurada' : '🚀 Ruta Cargada',
              message,
              [{ text: 'OK' }]
            );
          }, 500);
        }
        
        // Marcar que ya ha cargado una ruta antes (si es la primera vez)
        if (!hasLoadedRouteBefore) {
          await AsyncStorage.setItem('hasLoadedRouteBefore', 'true');
          setHasLoadedRouteBefore(true);
        }
      }
    };
    
    loadSavedRoute();
  }, [savedOptimizedRoute, savedRouteCoordinates, hasRestoredRoute, hasLoadedRouteBefore, isCheckingFirstLoad]);

  // Función para convertir un pedido a formato serializable
  const makeOrderSerializable = useCallback((order) => {
    if (!order) return null;
    
    return {
      ...order,
      date: typeof order.date === 'string' ? order.date : 
            order.date instanceof Date ? order.date.toISOString() : 
            new Date().toISOString(),
      coordinate: order.coordinate ? {
        latitude: Number(order.coordinate.latitude),
        longitude: Number(order.coordinate.longitude)
      } : null
    };
  }, []);

  // DATOS PROCESADOS
  const filteredOrders = useMemo(() => 
    orders.filter(order => 
      districtFilter === 'TODOS' ? true : order.distrito === districtFilter
    ), [orders, districtFilter]
  );

  const ordersWithStableCoords = useMemo(() => {
    if (filteredOrders.length === 0) return [];
    
    return filteredOrders.map(order => {
      const direccion = order.informacionContacto?.direccion || order.direccion || '';
      const telefono = order.informacionContacto?.telefono || order.telefono || '';
      const cliente = order.cliente || '';
      
      const serializableOrder = {
        ...order,
        informacionContacto: {
          direccion: direccion,
          telefono: telefono,
          ...order.informacionContacto
        },
        coordinate: order.coordinate?.latitude && order.coordinate?.longitude 
          ? {
              latitude: Number(order.coordinate.latitude),
              longitude: Number(order.coordinate.longitude)
            }
          : generateStableCoordinate(
              (direccion || cliente || '') + order.id,
              order.distrito || ''
            ),
        date: typeof order.date === 'string' ? order.date : 
              order.date instanceof Date ? order.date.toISOString() : 
              new Date().toISOString()
      };
      
      return serializableOrder;
    });
  }, [filteredOrders]);

  // Función para actualizar un pedido en la ruta optimizada
  const updateOrderInRoute = useCallback((orderId, updates) => {
    setOptimizedRoute(prevRoute => {
      const updatedRoute = prevRoute.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      );
      
      // Guardar automáticamente la ruta actualizada
      if (updatedRoute.length > 0) {
        saveOptimizedRoute(updatedRoute, routeCoordinates);
      }
      
      return updatedRoute;
    });
  }, [saveOptimizedRoute, routeCoordinates]);

  // Obtener ubicación
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        setIsLoadingLocation(true);
        
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            "Permiso denegado", 
            "Necesitamos tu ubicación para mostrar el mapa. Puedes activarlo en Configuración."
          );
          if (isMounted) setIsLoadingLocation(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeout: 5000
        });
        
        if (isMounted) {
          setLocation(currentLocation);
          setMapRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          });
          setIsLoadingLocation(false);
        }
      } catch (error) {
        console.error("Error obteniendo ubicación:", error);
        if (isMounted) {
          Alert.alert("Error", "No se pudo obtener la ubicación. Usando ubicación por defecto.");
          setMapRegion({
            latitude: -12.046374,
            longitude: -77.042793,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setIsLoadingLocation(false);
        }
      }
    })();

    return () => { isMounted = false; };
  }, []);

  // Hook de optimización
  const { optimizeRoute } = useRouteOptimizer();

  // Handler para cambiar a mapa después de optimizar
  const handleMapTabPress = useCallback((coordsArray) => {
    setActiveTab('Mapa');
    if (mapRef.current && coordsArray && coordsArray.length > 0) {
      setTimeout(() => {
        mapRef.current.fitToCoordinates(coordsArray, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 100);
    }
  }, []);

  // Función de optimización CORREGIDA - VERSIÓN QUE SÍ GUARDA
  const handleOptimizeRoute = useCallback(async () => {
    if (!location || ordersWithStableCoords.length === 0) {
      Alert.alert('Error', 'No hay pedidos con coordenadas estables para optimizar');
      return;
    }

    setIsCalculatingRoute(true);
    
    try {
      // Función callback que se ejecutará cuando la optimización termine
      const onOptimizationComplete = async (optimizedRouteResult, routeCoords) => {
        console.log('Optimización completada, resultados:', {
          pedidos: optimizedRouteResult.length,
          coordenadas: routeCoords.length
        });
        
        // 1. Actualizar estados locales
        setOptimizedRoute(optimizedRouteResult);
        setRouteCoordinates(routeCoords);
        
        // 2. Guardar la ruta optimizada en AsyncStorage
        if (optimizedRouteResult.length > 0) {
          console.log('Guardando ruta en AsyncStorage...');
          const saveSuccess = await saveOptimizedRoute(optimizedRouteResult, routeCoords);
          
          if (saveSuccess) {
            // Determinar mensaje según si es primera optimización o no
            const isFirstOptimization = !hasLoadedRouteBefore;
            const alertTitle = isFirstOptimization ? '🚀 Ruta Optimizada' : '✅ Ruta Optimizada y Guardada';
            const alertMessage = isFirstOptimization 
              ? `Se optimizaron ${optimizedRouteResult.length} pedidos. La ruta se guardará para futuras sesiones.`
              : `Se optimizaron ${optimizedRouteResult.length} pedidos y se guardó la ruta para futuras sesiones.`;
            
            Alert.alert(alertTitle, alertMessage);
            
            // Marcar que ya ha optimizado una ruta
            if (isFirstOptimization) {
              await AsyncStorage.setItem('hasLoadedRouteBefore', 'true');
              setHasLoadedRouteBefore(true);
            }
          }
        }
        
        // 3. Cambiar a pestaña de mapa si hay coordenadas
        if (routeCoords.length > 0) {
          handleMapTabPress(routeCoords);
        }
      };

      // Llamar a la función de optimización con el callback
      await optimizeRoute(
        location,
        ordersWithStableCoords,
        onOptimizationComplete,
        setIsCalculatingRoute
      );

    } catch (error) {
      console.error('Error en handleOptimizeRoute:', error);
      Alert.alert('Error', 'No se pudo calcular o guardar la ruta');
    }
  }, [location, ordersWithStableCoords, optimizeRoute, saveOptimizedRoute, handleMapTabPress, hasLoadedRouteBefore]);

  // Función para cargar ruta guardada manualmente - MODIFICADA
  const handleLoadSavedRoute = useCallback(async () => {
    if (savedOptimizedRoute.length > 0) {
      setOptimizedRoute(savedOptimizedRoute);
      setRouteCoordinates(savedRouteCoordinates);
      setHasRestoredRoute(true);
      
      // Determinar mensaje según si es primera vez o no
      const message = hasLoadedRouteBefore 
        ? `✅ Ruta Restaurada\nSe cargó la ruta guardada con ${savedOptimizedRoute.length} pedidos`
        : `🚀 Ruta Cargada\nSe ha cargado la ruta optimizada con ${savedOptimizedRoute.length} pedidos`;
      
      Alert.alert(
        hasLoadedRouteBefore ? '✅ Ruta Restaurada' : '🚀 Ruta Cargada',
        message,
        [{ text: 'OK' }]
      );
      
      // Si es la primera vez, marcar que ya cargó una ruta
      if (!hasLoadedRouteBefore) {
        await AsyncStorage.setItem('hasLoadedRouteBefore', 'true');
        setHasLoadedRouteBefore(true);
      }
      
      // Cambiar a la pestaña de mapa
      setActiveTab('Mapa');
    } else {
      Alert.alert('ℹ️ Sin Ruta Guardada', 'No hay una ruta optimizada guardada. Optimiza una ruta primero.');
    }
  }, [savedOptimizedRoute, savedRouteCoordinates, hasLoadedRouteBefore]);

  // Handlers
  const handleOrderPress = useCallback((order) => {
    setSelectedOrder(makeOrderSerializable(order));
    setModalVisible(true);
  }, [makeOrderSerializable]);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedOrder(null);
  }, []);

  // Función para marcar pedido como entregado desde el modal
  const handleMarkDelivered = useCallback((orderId) => {
    if (orderId) {
      markAsDelivered(orderId);
      // Actualizar también en la ruta optimizada si está presente
      updateOrderInRoute(orderId, { estado: 'entregado' });
    }
  }, [markAsDelivered, updateOrderInRoute]);

  const handleForceRecalculate = useCallback(async () => {
    Alert.alert(
      '🔄 Recalcular Ruta',
      '¿Recalcular la ruta optimizada? Esto sobrescribirá la ruta guardada.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Recalcular', 
          onPress: async () => {
            setOptimizedRoute([]);
            setRouteCoordinates([]);
            await handleOptimizeRoute();
          }
        }
      ]
    );
  }, [handleOptimizeRoute]);

  const handleResetRoute = useCallback(() => {
    Alert.alert(
      '🗑️ Limpiar Ruta',
      '¿Eliminar la ruta optimizada? Esto también borrará la ruta guardada.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpiar', 
          style: 'destructive',
          onPress: async () => {
            setOptimizedRoute([]);
            setRouteCoordinates([]);
            await clearOptimizedRoute();
            setHasRestoredRoute(false);
            Alert.alert('✅ Ruta Eliminada', 'La ruta optimizada se ha eliminado correctamente.');
          }
        }
      ]
    );
  }, [clearOptimizedRoute]);

  const handleCenterMap = useCallback(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      }, 1000);
    } else if (mapRef.current && mapRegion) {
      mapRef.current.animateToRegion(mapRegion, 1000);
    }
  }, [location, mapRegion]);

  // Función para manejar la eliminación de pedidos
  const handleDeleteOrder = useCallback(async (orderId) => {
    Alert.alert(
      "Eliminar Pedido",
      "¿Estás seguro de que quieres eliminar este pedido?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            // Eliminar del contexto
            await deleteOrder(orderId);
            
            // Si el pedido eliminado estaba en la ruta optimizada, actualizar la ruta
            if (optimizedRoute.some(order => order.id === orderId)) {
              const updatedRoute = optimizedRoute.filter(order => order.id !== orderId);
              setOptimizedRoute(updatedRoute);
              
              // También actualizar la ruta guardada
              if (updatedRoute.length > 0) {
                await saveOptimizedRoute(updatedRoute, routeCoordinates);
              } else {
                // Si no quedan pedidos, limpiar todo
                setRouteCoordinates([]);
                await clearOptimizedRoute();
              }
            }
          }
        }
      ]
    );
  }, [deleteOrder, optimizedRoute, routeCoordinates, saveOptimizedRoute, clearOptimizedRoute]);
  
  // Componente Tab
  const TabButton = ({ icon, label, tab, onPress }) => (
    <TouchableOpacity 
      style={styles.tabButton} 
      onPress={onPress || (() => setActiveTab(tab))}
    >
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        <Ionicons name={icon} size={18} /> {label}
      </Text>
      {activeTab === tab && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );

  // Mostrar loading mientras se obtiene la ubicación
  if (isLoadingLocation && activeTab === 'Mapa') {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Header navigation={navigation} title="PEDIDOS" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Header navigation={navigation} title="PEDIDOS" showBack={true} />
      
      <View style={styles.fixedHeader}>
        <View style={styles.tabContainer}>
          <TabButton icon="list-outline" label="Pedidos" tab="Pedidos" />
          <TabButton 
            icon="map-outline" 
            label="Mapa" 
            tab="Mapa" 
            onPress={() => setActiveTab('Mapa')}
          />
        </View>

        {/* Botón para cargar ruta guardada */}
        {savedOptimizedRoute.length > 0 && optimizedRoute.length === 0 && (
          <TouchableOpacity 
            style={styles.loadRouteButton}
            onPress={handleLoadSavedRoute}
          >
            <Ionicons name="download-outline" size={18} color="#FFF" />
            <Text style={styles.loadRouteText}>
              {hasLoadedRouteBefore ? ' Cargar Ruta Guardada' : ' Cargar Ruta'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentArea}>
        {activeTab === 'Pedidos' ? (
          <OrderList
            optimizedRoute={optimizedRoute}
            ordersWithStableCoords={ordersWithStableCoords}
            isCalculatingRoute={isCalculatingRoute}
            onOptimizeRoute={handleOptimizeRoute}
            onForceRecalculate={handleForceRecalculate}
            onResetRoute={handleResetRoute}
            onOrderPress={handleOrderPress}
            onDeleteOrder={handleDeleteOrder}
            hasSavedRoute={hasSavedRoute}
            onLoadSavedRoute={handleLoadSavedRoute}
          />
        ) : (
          <MapViewer
            location={location}
            mapRegion={mapRegion}
            optimizedRoute={optimizedRoute}
            ordersWithStableCoords={ordersWithStableCoords}
            routeCoordinates={routeCoordinates}
            onOrderPress={handleOrderPress}
            onCenterMap={handleCenterMap}
            mapRef={mapRef}
          />
        )}
      </View>

      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onMarkDelivered={() => {
          if (selectedOrder?.id) {
            handleMarkDelivered(selectedOrder.id);
          }
          handleCloseModal();
        }}
      />

      <BottomBar 
        onScanPress={() => navigation.navigate('ScanPhase1')}
        onAddPress={() => navigation.navigate('ManualOrder')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
    </View>
  );
};

export default PedidosScreen;