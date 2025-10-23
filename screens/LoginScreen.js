import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errors, setErrors] = useState({ usuario: '', contrasena: '' });
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let valid = true;
    let newErrors = { usuario: '', contrasena: '' };

    // Validar usuario
    if (!usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
      valid = false;
    } else if (usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
      valid = false;
    }

    // Validar contraseña
    if (!contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
      valid = false;
    } else if (contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Aquí va tu lógica de autenticación con API
      // Por ahora solo navega al Home
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Triángulo superior izquierdo */}
      <View style={styles.triangleTopLeft} />
      
      {/* Triángulo inferior derecho */}
      <View style={styles.triangleBottomRight} />

      {/* Contenedor del logo */}
      <View style={styles.logoContainer}>
        {/* Aquí coloca tu imagen del logo SAVA */}
        {/* <Image 
          source={require('../assets/sava-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>LOGO SAVA</Text>
        </View>
      </View>

      {/* Contenedor del formulario */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.underline} />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.usuario && styles.inputError]}
            placeholder="Usuario"
            placeholderTextColor="#C0C0C0"
            value={usuario}
            onChangeText={(text) => {
              setUsuario(text);
              if (errors.usuario) setErrors({ ...errors, usuario: '' });
            }}
            autoCapitalize="none"
          />
          {errors.usuario ? (
            <Text style={styles.errorText}>{errors.usuario}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput, errors.contrasena && styles.inputError]}
              placeholder="Contraseña"
              placeholderTextColor="#C0C0C0"
              value={contrasena}
              onChangeText={(text) => {
                setContrasena(text);
                if (errors.contrasena) setErrors({ ...errors, contrasena: '' });
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {errors.contrasena ? (
            <Text style={styles.errorText}>{errors.contrasena}</Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  triangleTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 180,
    borderTopWidth: 380,
    borderRightColor: 'transparent',
    borderTopColor: '#5CE1E6',
  },
  triangleBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 180,
    borderBottomWidth: 280,
    borderLeftColor: 'transparent',
    borderBottomColor: '#5CE1E6',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5CE1E6',
    borderStyle: 'dashed',
  },
  logoText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
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
  inputContainer: {
    marginBottom: 25,
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
  button: {
    backgroundColor: '#5CE1E6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#5CE1E6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen;