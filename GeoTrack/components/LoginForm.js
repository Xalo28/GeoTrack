import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FormInput from './FormInput';
import LoginButton from './LoginButton';

const LoginForm = ({
  usuario,
  contrasena,
  errors,
  onUsuarioChange,
  onContrasenaChange,
  onErrorsChange,
  onLogin
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = { usuario: '', contrasena: '' };

    if (!usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
      valid = false;
    } else if (usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
      valid = false;
    }

    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
      valid = false;
    } else if (contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }

    onErrorsChange(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      onLogin();
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.underline} />

      <FormInput
        label="usuario"
        value={usuario}
        onChangeText={(text) => {
          onUsuarioChange(text);
          if (errors.usuario) onErrorsChange({ ...errors, usuario: '' });
        }}
        error={errors.usuario}
        placeholder="Usuario"
        autoCapitalize="none"
      />

      <FormInput
        label="contrasena"
        value={contrasena}
        onChangeText={(text) => {
          onContrasenaChange(text);
          if (errors.contrasena) onErrorsChange({ ...errors, contrasena: '' });
        }}
        error={errors.contrasena}
        placeholder="Contraseña"
        secureTextEntry={!showPassword}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        autoCapitalize="none"
      />

      <LoginButton onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  underline: {
    width: 180,
    height: 4,
    backgroundColor: '#5CE1E6',
    marginBottom: 40,
  },
});

export default LoginForm;