import React from 'react';
import { render, renderHook, act } from '@testing-library/react-native';
import { OrdersProvider, useOrders } from '../../context/OrdersContext';

// Wrapper para las pruebas del contexto
const OrdersWrapper = ({ children }) => (
  <OrdersProvider>{children}</OrdersProvider>
);

describe('OrdersContext', () => {
  test('provides initial empty orders', () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: OrdersWrapper
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.hasOrders).toBe(false);
  });

  test('addOrder adds new order with correct structure', () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: OrdersWrapper
    });

    const newOrder = {
      customer: 'Nuevo Cliente',
      distrito: 'Miraflores',
      informacionContacto: {
        telefono: '999888777',
        direccion: 'Av. Principal 123'
      }
    };

    act(() => {
      result.current.addOrder(newOrder);
    });

    expect(result.current.orders).toHaveLength(1);
    expect(result.current.hasOrders).toBe(true);
    
    const addedOrder = result.current.orders[0];
    expect(addedOrder.customer).toBe('Nuevo Cliente');
    expect(addedOrder.estado).toBe('Pendiente');
    expect(addedOrder.id).toBeDefined();
    expect(addedOrder.date).toBeDefined();
    expect(addedOrder.productos).toEqual(['Producto por definir']);
    expect(addedOrder.informacionContacto.direccion).toBe('Av. Principal 123, Miraflores');
  });

  test('markAsDelivered updates order status correctly', () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: OrdersWrapper
    });

    // Primero agregar un pedido
    act(() => {
      result.current.addOrder({
        customer: 'Cliente Test',
        distrito: 'San Isidro',
        informacionContacto: {
          telefono: '111222333',
          direccion: 'Calle Test 456'
        }
      });
    });

    const orderId = result.current.orders[0].id;

    // Marcar como entregado
    act(() => {
      result.current.markAsDelivered(orderId);
    });

    expect(result.current.orders[0].estado).toBe('Entregado');
  });

  test('clearOrders removes all orders', () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: OrdersWrapper
    });

    // Agregar algunos pedidos
    act(() => {
      result.current.addOrder({
        customer: 'Cliente 1',
        distrito: 'Lima',
        informacionContacto: { telefono: '111', direccion: 'Dir 1' }
      });
      result.current.addOrder({
        customer: 'Cliente 2', 
        distrito: 'Callao',
        informacionContacto: { telefono: '222', direfono: 'Dir 2' }
      });
    });

    expect(result.current.orders).toHaveLength(2);
    expect(result.current.hasOrders).toBe(true);

    // Limpiar pedidos
    act(() => {
      result.current.clearOrders();
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.hasOrders).toBe(false);
  });

  test('throws error when useOrders is used outside provider', () => {
    // No wrapper para forzar el error
    expect(() => {
      renderHook(() => useOrders());
    }).toThrow('useOrders must be used within an OrdersProvider');
  });
});