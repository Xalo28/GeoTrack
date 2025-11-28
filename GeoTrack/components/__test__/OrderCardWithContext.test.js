import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OrdersProvider } from '../../context/OrdersContext';
import OrderCard from '../../components/OrderCard';

// Componente wrapper para pruebas con contexto
const OrderCardWithProvider = ({ order, onViewDetails }) => (
  <OrdersProvider>
    <OrderCard order={order} onViewDetails={onViewDetails} />
  </OrdersProvider>
);

describe('OrderCard with Context', () => {
  const mockOnViewDetails = jest.fn();
  const sampleOrder = {
    id: 'TEST-123',
    customer: 'Maria Garcia',
    status: 'Pendiente',
    time: '14:30',
    estado: 'Pendiente'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders order card within context provider', () => {
    const { getByText } = render(
      <OrderCardWithProvider 
        order={sampleOrder} 
        onViewDetails={() => mockOnViewDetails(sampleOrder)} 
      />
    );

    expect(getByText('TEST-123')).toBeTruthy();
    expect(getByText('Maria Garcia')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
  });

  test('handles details button press within context', () => {
    const { getByText } = render(
      <OrderCardWithProvider 
        order={sampleOrder} 
        onViewDetails={() => mockOnViewDetails(sampleOrder)} 
      />
    );

    const detailsButton = getByText('Ver detalles');
    fireEvent.press(detailsButton);
    
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    expect(mockOnViewDetails).toHaveBeenCalledWith(sampleOrder);
  });
});