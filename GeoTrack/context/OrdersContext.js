import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [hasOrders, setHasOrders] = useState(false);

  const addOrder = (newOrder) => {
    const orderWithId = {
      ...newOrder,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      estado: 'Pendiente', // Estado inicial
      numeroPedido: 'FEO-' + Math.floor(100000 + Math.random() * 900000),
      productos: [
        'Comida para perros',
        'Juguete Peluche Pingüino Little',
        'Funda protectora'
      ],
      informacionContacto: {
        telefono: '+51 987 654 321',
        direccion: 'Av. Los Páñones 123, San Juan de Lurigancho'
      }
    };
    
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
    setHasOrders(true);
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
    setHasOrders(false);
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      hasOrders,
      addOrder,
      markAsDelivered,
      clearOrders,
      setHasOrders
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