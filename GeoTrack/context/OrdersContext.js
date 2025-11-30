import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  // Estado inicial de pedidos.
  // Puedes descomentar el objeto dentro para tener un pedido de prueba al iniciar la app.
  const [orders, setOrders] = useState([
    /*
    {
      id: '1',
      numeroPedido: 'PED-001',
      date: new Date().toISOString(),
      cliente: 'Juan Perez',
      estado: 'Pendiente',
      informacionContacto: { 
        direccion: 'Av. Siempre Viva 123', 
        telefono: '123456789' 
      },
      productos: ['Caja x2'],
      distrito: 'San Isidro'
    }
    */
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
      distrito: newOrder.distrito || 'Lima'
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