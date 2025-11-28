import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ScanButton from '../../components/ScanButton';

// Mock de navigation
const mockNavigation = {
  navigate: jest.fn()
};

describe('ScanButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders scan button with correct text', () => {
    const { getByText } = render(<ScanButton navigation={mockNavigation} />);
    
    expect(getByText('🚚 ESCANEAR NUEVO PEDIDO')).toBeTruthy();
  });

  test('navigates to ScanPhase1 when button is pressed', () => {
    const { getByText } = render(<ScanButton navigation={mockNavigation} />);
    
    const button = getByText('🚚 ESCANEAR NUEVO PEDIDO');
    fireEvent.press(button);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ScanPhase1');
    expect(mockNavigation.navigate).toHaveBeenCalledTimes(1);
  });
});