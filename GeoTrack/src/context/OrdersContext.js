import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  // Estado inicial de pedidos
  const [orders, setOrders] = useState([
    {
      id: '1',
      numeroPedido: 'PED-001',
      date: new Date().toISOString(),
      cliente: 'Juan Perez',
      estado: 'Pendiente',
      distrito: 'SAN ISIDRO',
      informacionContacto: { 
        direccion: 'Av. Javier Prado 123', 
        telefono: '999-888-777' 
      },
      productos: ['Caja x2'],
      coordinate: { 
        latitude: -12.097054, 
        longitude: -77.037160 
      }
    },
    {
      id: '2',
      numeroPedido: 'PED-002',
      date: new Date().toISOString(),
      cliente: 'Maria Lopez',
      estado: 'Entregado',
      distrito: 'MIRAFLORES',
      informacionContacto: { 
        direccion: 'Calle Esperanza 456', 
        telefono: '999-666-333' 
      },
      productos: ['Sobre x1'],
      coordinate: { 
        latitude: -12.119799, 
        longitude: -77.029019 
      }
    }
  ]);

  // --- NUEVO: Estado para almacenar MÚLTIPLES rutas (Diccionario por distrito) ---
  const [activeRoutes, setActiveRoutes] = useState({});

  // Cargar rutas guardadas al iniciar la app
  useEffect(() => {
    const loadPersistedRoutes = async () => {
      try {
        const savedRoutes = await AsyncStorage.getItem('saved_routes_db');
        if (savedRoutes) {
          setActiveRoutes(JSON.parse(savedRoutes));
        }
      } catch (error) {
        console.error('Error cargando rutas:', error);
      }
    };
    loadPersistedRoutes();
  }, []);

  // Función para guardar la ruta DE UN DISTRITO ESPECÍFICO
  const saveRouteForDistrict = async (district, routeData) => {
    try {
      const newRoutes = { ...activeRoutes, [district]: routeData };
      setActiveRoutes(newRoutes);
      await AsyncStorage.setItem('saved_routes_db', JSON.stringify(newRoutes));
    } catch (error) {
      console.error('Error guardando ruta:', error);
    }
  };

  // Función para limpiar la ruta DE UN DISTRITO ESPECÍFICO
  const clearRouteForDistrict = async (district) => {
    try {
      const newRoutes = { ...activeRoutes };
      delete newRoutes[district]; // Borramos solo la clave de este distrito
      setActiveRoutes(newRoutes);
      await AsyncStorage.setItem('saved_routes_db', JSON.stringify(newRoutes));
    } catch (error) {
      console.error('Error limpiando ruta:', error);
    }
  };
  // -------------------------------------------------------

  const hasOrders = orders.length > 0;

  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      estado: 'Pendiente',
      cliente: newOrder.cliente || 'Cliente General',
      productos: newOrder.productos || ['Carga General', 'Paquete Estándar'],
      informacionContacto: {
        telefono: newOrder.informacionContacto?.telefono || 'No registrado',
        direccion: newOrder.informacionContacto?.direccion || 'Sin dirección',
      },
      distrito: newOrder.distrito || 'LIMA',
      coordinate: newOrder.coordinate || null 
    };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };

  const markAsDelivered = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, estado: 'Entregado' } : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      hasOrders,
      addOrder,
      markAsDelivered,
      deleteOrder,
      clearOrders,
      // Exportamos las nuevas funciones y el objeto completo de rutas
      activeRoutes,
      saveRouteForDistrict,
      clearRouteForDistrict
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