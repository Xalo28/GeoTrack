import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const FormInput = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  secureTextEntry = false,
  showPassword = false,
  onTogglePassword,
  autoCapitalize = 'none'
}) => {
  const isPassword = label === 'contrasena';

  return (
    <View style={styles.inputContainer}>
      {isPassword ? (
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, error && styles.inputError]}
            placeholder={placeholder}
            placeholderTextColor="#C0C0C0"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            autoCapitalize={autoCapitalize}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={onTogglePassword}
          >
            <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor="#C0C0C0"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
        />
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    color: '#000000',
  },
  inputError: {
    borderBottomColor: '#FF4444',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 0,
    top: 8,
    padding: 8,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 0,
  },
});

export default FormInput;