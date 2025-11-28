import React from 'react';
import { render } from '@testing-library/react-native';
import StatsCard from '../../components/StatsCard';

// Mock del contexto
jest.mock('../../context/OrdersContext', () => ({
  useOrders: () => ({
    orders: [
      { id: '1', estado: 'Entregado' },
      { id: '2', estado: 'Pendiente' },
      { id: '3', estado: 'Entregado' },
      { id: '4', estado: 'Pendiente' },
      { id: '5', estado: 'Entregado' },
      { id: '6', estado: 'Pendiente' },
    ]
  })
}));

describe('StatsCard', () => {
  test('renders without crashing and shows statistics labels', () => {
    const { getByText } = render(<StatsCard />);

    // Verificar que los labels están presentes
    expect(getByText('Total')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('Entregado')).toBeTruthy();
  });

  test('displays numeric values for statistics', () => {
    const { getAllByText } = render(<StatsCard />);
    
    // Verificar que hay números (sin importar cuáles)
    const numberElements = getAllByText(/\d/);
    expect(numberElements.length).toBe(3); // Debería haber 3 números
  });
});