import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FormInput from '../../components/FormInput';

describe('FormInput', () => {
  const mockOnChangeText = jest.fn();
  const mockOnTogglePassword = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders regular input correctly', () => {
    const { getByPlaceholderText } = render(
      <FormInput
        label="email"
        placeholder="Enter email"
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  test('renders password input when label is "contrasena"', () => {
    const { getByPlaceholderText, getByText } = render(
      <FormInput
        label="contrasena"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        showPassword={false}
        onTogglePassword={mockOnTogglePassword}
      />
    );

    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByText('👁️‍🗨️')).toBeTruthy();
  });

  test('calls onChangeText when text is entered', () => {
    const { getByPlaceholderText } = render(
      <FormInput
        label="email"
        placeholder="Enter email"
        value=""
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Enter email');
    fireEvent.changeText(input, 'test@example.com');
    expect(mockOnChangeText).toHaveBeenCalledWith('test@example.com');
  });

  test('calls onTogglePassword when eye icon is pressed', () => {
    const { getByText } = render(
      <FormInput
        label="contrasena"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        showPassword={false}
        onTogglePassword={mockOnTogglePassword}
      />
    );

    const eyeIcon = getByText('👁️‍🗨️');
    fireEvent.press(eyeIcon);
    expect(mockOnTogglePassword).toHaveBeenCalledTimes(1);
  });

  test('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <FormInput
        label="email"
        placeholder="Enter email"
        value=""
        onChangeText={mockOnChangeText}
        error="Invalid email"
      />
    );

    expect(getByText('Invalid email')).toBeTruthy();
  });

  test('shows different eye icon based on showPassword prop', () => {
    const { getByText, rerender } = render(
      <FormInput
        label="contrasena"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        showPassword={false}
        onTogglePassword={mockOnTogglePassword}
      />
    );

    expect(getByText('👁️‍🗨️')).toBeTruthy();

    rerender(
      <FormInput
        label="contrasena"
        placeholder="Enter password"
        value=""
        onChangeText={mockOnChangeText}
        showPassword={true}
        onTogglePassword={mockOnTogglePassword}
      />
    );

    expect(getByText('👁️')).toBeTruthy();
  });
});