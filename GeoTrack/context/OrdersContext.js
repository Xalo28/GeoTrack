import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersContext = createContext();
const ORDERS_STORAGE_KEY = '@delivery_orders';
const OPTIMIZED_ROUTE_KEY = '@optimized_route';
const ROUTE_COORDINATES_KEY = '@route_coordinates';

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [savedOptimizedRoute, setSavedOptimizedRoute] = useState([]);
  const [savedRouteCoordinates, setSavedRouteCoordinates] = useState([]);

  // Cargar pedidos y rutas al iniciar
  useEffect(() => {
    checkNetworkStatus();
    initializeOrders();
    loadSavedOptimizedRoute();
  }, []);

  // Cargar ruta optimizada guardada
  const loadSavedOptimizedRoute = async () => {
    try {
      const [savedRoute, savedCoords] = await Promise.all([
        AsyncStorage.getItem(OPTIMIZED_ROUTE_KEY),
        AsyncStorage.getItem(ROUTE_COORDINATES_KEY)
      ]);
      
      if (savedRoute) {
        const parsedRoute = JSON.parse(savedRoute);
        setSavedOptimizedRoute(parsedRoute);
        console.log('Ruta optimizada cargada desde almacenamiento:', parsedRoute.length, 'pedidos');
      }
      
      if (savedCoords) {
        const parsedCoords = JSON.parse(savedCoords);
        setSavedRouteCoordinates(parsedCoords);
      }
    } catch (error) {
      console.error('Error cargando ruta optimizada:', error);
    }
  };

  // Guardar ruta optimizada
  const saveOptimizedRoute = async (route, coordinates) => {
    try {
      // Asegurar que la ruta tenga todos los datos necesarios
      const routeToSave = route.map(order => ({
        ...order,
        coordinate: order.coordinate || (order.latitude && order.longitude ? {
          latitude: order.latitude,
          longitude: order.longitude
        } : null)
      }));

      await Promise.all([
        AsyncStorage.setItem(OPTIMIZED_ROUTE_KEY, JSON.stringify(routeToSave)),
        AsyncStorage.setItem(ROUTE_COORDINATES_KEY, JSON.stringify(coordinates))
      ]);
      
      setSavedOptimizedRoute(routeToSave);
      setSavedRouteCoordinates(coordinates);
      
      console.log('Ruta optimizada guardada:', routeToSave.length, 'pedidos');
      return true;
    } catch (error) {
      console.error('Error guardando ruta optimizada:', error);
      return false;
    }
  };

  // Limpiar ruta guardada
  const clearOptimizedRoute = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(OPTIMIZED_ROUTE_KEY),
        AsyncStorage.removeItem(ROUTE_COORDINATES_KEY)
      ]);
      
      setSavedOptimizedRoute([]);
      setSavedRouteCoordinates([]);
      console.log('Ruta optimizada eliminada');
    } catch (error) {
      console.error('Error eliminando ruta optimizada:', error);
    }
  };

  // Verificar si hay una ruta guardada
  const hasSavedRoute = savedOptimizedRoute.length > 0;

  // Verificar estado de red
  const checkNetworkStatus = () => {
    setIsOnline(navigator.onLine !== false);
  };

  // Inicializar pedidos
  const initializeOrders = async () => {
    try {
      await loadLocalOrders();
    } catch (error) {
      console.error('Error initializing orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar pedidos locales
  const loadLocalOrders = async () => {
    try {
      const storedOrders = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders !== null) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading local orders:', error);
      setOrders([]);
    }
  };

  // Función para guardar pedidos localmente
  const saveOrdersToStorage = async (ordersToSave) => {
    try {
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Error saving orders to storage:', error);
    }
  };

  // FUNCIÓN PRINCIPAL: Agregar nuevo pedido
  const addOrder = async (newOrder) => {
    try {
      const orderId = Date.now().toString();
      
      const orderWithId = {
        ...newOrder,
        id: orderId,
        date: new Date().toISOString(),
        estado: 'pendiente',
        cliente: newOrder.cliente || 'Cliente General',
        productos: newOrder.productos || ['Carga General'],
        informacionContacto: {
          telefono: newOrder.informacionContacto?.telefono || 'No registrado',
          direccion: newOrder.informacionContacto?.direccion || 'Sin dirección',
        },
        distrito: newOrder.distrito || 'LIMA',
        coordinate: newOrder.coordinate || null,
        isSynced: false
      };

      const updatedOrders = [orderWithId, ...orders];
      setOrders(updatedOrders);
      await saveOrdersToStorage(updatedOrders);

      return orderWithId;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  // Función para formatear fecha
  const formatDateForDisplay = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        dateString: date.toLocaleDateString(),
        timeString: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullDate: date
      };
    } catch (error) {
      return {
        dateString: 'Fecha inválida',
        timeString: '',
        fullDate: new Date()
      };
    }
  };

  // Eliminar pedido
  const deleteOrder = async (orderId) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      await saveOrdersToStorage(updatedOrders);

      // Actualizar ruta guardada si contiene este pedido
      if (savedOptimizedRoute.some(order => order.id === orderId)) {
        const updatedRoute = savedOptimizedRoute.filter(order => order.id !== orderId);
        await saveOptimizedRoute(updatedRoute, savedRouteCoordinates);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Marcar como entregado
  const markAsDelivered = async (orderId) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, estado: 'entregado' } : order
      );
      
      setOrders(updatedOrders);
      await saveOrdersToStorage(updatedOrders);

      // Actualizar ruta guardada si contiene este pedido
      if (savedOptimizedRoute.some(order => order.id === orderId)) {
        const updatedRoute = savedOptimizedRoute.map(order =>
          order.id === orderId ? { ...order, estado: 'entregado' } : order
        );
        await saveOptimizedRoute(updatedRoute, savedRouteCoordinates);
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  // Limpiar todos los pedidos
  const clearOrders = async () => {
    try {
      await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
      // También limpiar ruta al limpiar pedidos
      await clearOptimizedRoute();
      setOrders([]);
    } catch (error) {
      console.error('Error clearing orders:', error);
    }
  };

  // Sincronizar manualmente (ahora solo recarga desde AsyncStorage)
  const syncOrders = async () => {
    try {
      await loadLocalOrders();
      return { success: true, message: 'Datos recargados correctamente' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const hasOrders = orders.length > 0;

  return (
    <OrdersContext.Provider value={{
      orders,
      hasOrders,
      isLoading,
      isOnline,
      savedOptimizedRoute,
      savedRouteCoordinates,
      hasSavedRoute,
      addOrder,
      deleteOrder,
      markAsDelivered,
      clearOrders,
      syncOrders,
      saveOptimizedRoute,
      clearOptimizedRoute,
      formatDateForDisplay,
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};