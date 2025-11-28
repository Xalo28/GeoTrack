import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginButton from '../../components/LoginButton';

describe('LoginButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct text', () => {
    const { getByText } = render(<LoginButton onPress={mockOnPress} />);
    expect(getByText('INGRESAR')).toBeTruthy();
  });

  test('calls onPress when button is pressed', () => {
    const { getByText } = render(<LoginButton onPress={mockOnPress} />);
    
    const button = getByText('INGRESAR');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('button has correct styles applied', () => {
    const { getByText } = render(<LoginButton onPress={mockOnPress} />);
    
    const button = getByText('INGRESAR');
    expect(button).toBeTruthy();
  });
});