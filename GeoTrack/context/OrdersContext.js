import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  // Inicializamos con un estado vacío, pero listo para funcionar
  const [orders, setOrders] = useState([]);
  
  // Derivamos hasOrders directamente del array, es más seguro
  const hasOrders = orders.length > 0;

  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      estado: 'Pendiente',
      productos: newOrder.productos || [
        'Producto estándar',
        'Paquete frágil'
      ],
      informacionContacto: {
        telefono: newOrder.informacionContacto.telefono,
        direccion: newOrder.distrito 
          ? `${newOrder.informacionContacto.direccion}, ${newOrder.distrito}`
          : newOrder.informacionContacto.direccion
      }
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

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};