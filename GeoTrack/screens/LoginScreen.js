import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { Header } from 'react-native-elements';
import BackgroundTriangles from '../components/BackgroundTriangles';
import LogoContainer from '../components/LogoContainer';

// Necesario para que el navegador se cierre correctamente en web
WebBrowser.maybeCompleteAuthSession();

// TUS DATOS DE AUTH0
const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

// Endpoints de Auth0
const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
};

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Hook de Expo para manejar la autenticación
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: 'geotrack'
      }),
      responseType: ResponseType.Token, // Usamos Token directo para simplificar
      extraParams: {
        prompt: 'login', // Forzar login siempre
        ui_locales: 'es' // Idioma español
      }
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      if (access_token) {
        getUserData(access_token);
      }
    } else if (response?.type === 'error') {
      setLoading(false);
      Alert.alert("Error", "Ocurrió un error en el inicio de sesión");
    } else if (response?.type === 'dismiss') {
      setLoading(false); // Usuario canceló
    }
  }, [response]);

  // Función para obtener datos del usuario con el token recibido
  const getUserData = async (token) => {
    try {
      const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await userInfoResponse.json();
      
      console.log("Usuario logueado:", user);
      // Aquí podrías guardar el usuario en un Context global si quisieras
      
      setLoading(false);
      navigation.replace('Home'); // Navegar al Home
    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert("Error", "No se pudo obtener la información del usuario");
    }
  };

  const handleLogin = () => {
    setLoading(true);
    promptAsync({ useProxy: false }); // Lanza la ventana de Auth0
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <BackgroundTriangles />
      <LogoContainer />
      
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Gestión de Logística</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#5CE1E6" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity 
            style={styles.authButton} 
            onPress={handleLogin}
            disabled={!request}
          >
            <Text style={styles.authButtonText}>INGRESAR / REGISTRARSE</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 40,
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  authButton: {
    backgroundColor: '#5CE1E6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default LoginScreen;