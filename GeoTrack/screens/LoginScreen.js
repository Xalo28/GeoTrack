import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import BackgroundTriangles from '../components/BackgroundTriangles';
import LogoContainer from '../components/LogoContainer';
import LoginForm from '../components/LoginForm';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({ usuario: '', contrasena: '' });

  const handleLogin = () => {
    // Lógica de validación y login
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <BackgroundTriangles />
      <LogoContainer />
      
      <LoginForm
        usuario={usuario}
        contrasena={contrasena}
        errors={errors}
        onUsuarioChange={setUsuario}
        onContrasenaChange={setContrasena}
        onErrorsChange={setErrors}
        onLogin={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default LoginScreen;