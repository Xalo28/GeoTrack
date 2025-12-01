import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  // Estado inicial de pedidos con datos de prueba y COORDENADAS
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
      // Coordenadas de ejemplo (San Isidro, Lima)
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
      // Coordenadas de ejemplo (Miraflores, Lima)
      coordinate: { 
        latitude: -12.119799, 
        longitude: -77.029019 
      }
    }
  ]);

  // Propiedad derivada para saber si hay pedidos activos
  const hasOrders = orders.length > 0;

  // Función para agregar un nuevo pedido
  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(), // ID único basado en tiempo
      date: new Date().toISOString(),
      estado: 'Pendiente', // Estado inicial siempre es Pendiente
      // Valores por defecto para robustez si vienen vacíos
      cliente: newOrder.cliente || 'Cliente General',
      productos: newOrder.productos || ['Carga General', 'Paquete Estándar'],
      informacionContacto: {
        telefono: newOrder.informacionContacto?.telefono || 'No registrado',
        direccion: newOrder.informacionContacto?.direccion || 'Sin dirección',
      },
      distrito: newOrder.distrito || 'LIMA',
      // Si no vienen coordenadas (pedido manual), se pone null
      coordinate: newOrder.coordinate || null 
    };
    
    // Agregamos el nuevo pedido al principio de la lista (LIFO)
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };

  // Función para marcar un pedido como entregado
  const markAsDelivered = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, estado: 'Entregado' } : order
      )
    );
  };

  // Función para limpiar todos los pedidos (útil al cerrar sesión)
  const clearOrders = () => {
    setOrders([]);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      hasOrders,
      addOrder,
      markAsDelivered,
      clearOrders,
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};