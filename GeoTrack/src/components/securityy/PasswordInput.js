import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const PasswordInput = ({ 
  label, 
  value, 
  onChangeText, 
  error, 
  secureTextEntry = true, 
  placeholder 
}) => (
  <View style={styles.passwordInputGroup}>
    <Text style={styles.passwordLabel}>{label}</Text>
    <View style={[styles.passwordInputContainer, error && styles.inputError]}>
      <MaterialIcons name="lock" size={20} color="#5CE1E6" style={styles.inputIcon} />
      <TextInput
        style={styles.passwordInput}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = {
  passwordInputGroup: {
    marginBottom: 20,
  },
  passwordLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#FF4444',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 0,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
};
export default PasswordInput;