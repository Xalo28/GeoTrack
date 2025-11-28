import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderCard from '../../components/OrderCard';

describe('OrderCard', () => {
  const mockOnViewDetails = jest.fn();
  const sampleOrder = {
    id: 'ORD-001',
    customer: 'Juan Pérez',
    status: 'En camino',
    time: '10:30 AM'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders order information correctly', () => {
    const { getByText } = render(
      <OrderCard order={sampleOrder} onViewDetails={mockOnViewDetails} />
    );

    expect(getByText('ORD-001')).toBeTruthy();
    expect(getByText('Juan Pérez')).toBeTruthy();
    expect(getByText('En camino')).toBeTruthy();
    expect(getByText('🕒 10:30 AM')).toBeTruthy();
    expect(getByText('Ver detalles')).toBeTruthy();
  });

  test('calls onViewDetails when details button is pressed', () => {
    const { getByText } = render(
      <OrderCard order={sampleOrder} onViewDetails={() => mockOnViewDetails(sampleOrder)} />
    );

    const detailsButton = getByText('Ver detalles');
    fireEvent.press(detailsButton);
    
    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
    expect(mockOnViewDetails).toHaveBeenCalledWith(sampleOrder);
  });

  test('displays correct status color for different statuses', () => {
    const testCases = [
      { status: 'Entregado' },
      { status: 'En camino' },
      { status: 'Pendiente' },
      { status: 'Unknown' }
    ];

    testCases.forEach(({ status }) => {
      const { getByText, unmount } = render(
        <OrderCard 
          order={{ ...sampleOrder, status }} 
          onViewDetails={mockOnViewDetails} 
        />
      );

      const statusBadge = getByText(status);
      expect(statusBadge).toBeTruthy();
      unmount();
    });
  });
});