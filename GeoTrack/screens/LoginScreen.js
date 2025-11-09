import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';
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
      
      <Header
        centerComponent={{ text: 'Inicio de Sesión', style: styles.headerText }}
        backgroundColor="#FFFFFF"
        containerStyle={styles.headerContainer}
      />
      
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
  headerContainer: {
    borderBottomWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;