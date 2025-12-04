import React, { useEffect, useState } from 'react';
import { 
  View, 
  StatusBar, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import LoginScreenStyles from '../styles/LoginScreenStyles'; // Importa los estilos

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

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  // ESTA LÍNEA ES LA CLAVE: Genera la URI dinámica
  const redirectUri = makeRedirectUri({ scheme: 'geotrack' });
  
  // Imprímela en la consola para ver cuál es
  console.log("====================================");
  console.log("COPIA ESTA URL EXACTA EN AUTH0:", redirectUri);
  console.log("====================================");

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: redirectUri, // Asegúrate de usar la variable aquí, NO el texto fijo
      responseType: ResponseType.Token,
      extraParams: { prompt: 'login', ui_locales: 'es' }
    },
    discovery
  );

  useEffect(() => {
    // Animaciones al cargar el componente
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      )
    ]).start();
  }, []);

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

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView style={LoginScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Fondo con gradiente y elementos decorativos */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={LoginScreenStyles.backgroundGradient}
      />
      
      {/* Elementos decorativos */}
      <View style={LoginScreenStyles.decorativeCircle1} />
      <View style={LoginScreenStyles.decorativeCircle2} />
      <View style={LoginScreenStyles.decorativeCircle3} />
      
      {/* SVG decorativo en la parte superior */}
      <Svg 
        height={height * 0.25} 
        width={width} 
        style={LoginScreenStyles.topWave}
      >
        <Defs>
          <SvgLinearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#5CE1E6" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#00adb5" stopOpacity="0.4" />
          </SvgLinearGradient>
        </Defs>
        <Path 
          d={`M0,60 Q${width/4},0 ${width/2},60 T${width},60 V${height*0.25} H0 Z`} 
          fill="url(#waveGradient)" 
        />
      </Svg>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={LoginScreenStyles.keyboardAvoid}
      >
        <Animated.View 
          style={[
            LoginScreenStyles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Logo y título */}
          <View style={LoginScreenStyles.logoContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={LoginScreenStyles.logoCircle}>
                <FontAwesome5 name="shipping-fast" size={60} color="#5CE1E6" />
              </View>
            </Animated.View>
            
            <Text style={LoginScreenStyles.appName}>SAVA S.A.C</Text>
            <View style={LoginScreenStyles.divider} />
            <Text style={LoginScreenStyles.tagline}>Gestión de Logística Inteligente</Text>
          </View>
          
          {/* Información de la app */}
          <View style={LoginScreenStyles.featuresContainer}>
            <View style={LoginScreenStyles.featureItem}>
              <MaterialIcons name="location-on" size={24} color="#5CE1E6" />
              <Text style={LoginScreenStyles.featureText}>Rastreo en tiempo real</Text>
            </View>
            <View style={LoginScreenStyles.featureItem}>
              <MaterialIcons name="assessment" size={24} color="#5CE1E6" />
              <Text style={LoginScreenStyles.featureText}>Reportes automatizados</Text>
            </View>
            <View style={LoginScreenStyles.featureItem}>
              <MaterialIcons name="security" size={24} color="#5CE1E6" />
              <Text style={LoginScreenStyles.featureText}>Acceso seguro</Text>
            </View>
          </View>
          
          {/* Botón de login */}
          <AnimatedTouchableOpacity 
            style={[LoginScreenStyles.authButton, { transform: [{ scale: pulseAnim }] }]} 
            onPress={handleLogin}
            disabled={!request || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={LoginScreenStyles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="login" size={24} color="#FFFFFF" style={LoginScreenStyles.buttonIcon} />
                  <Text style={LoginScreenStyles.authButtonText}>INGRESAR / REGISTRARSE</Text>
                </>
              )}
            </LinearGradient>
          </AnimatedTouchableOpacity>
          
          {/* Texto informativo */}
          <View style={LoginScreenStyles.infoContainer}>
            <Text style={LoginScreenStyles.infoText}>
              Accede a la plataforma de gestión logística más avanzada
            </Text>
            <View style={LoginScreenStyles.securityNote}>
              <MaterialIcons name="verified-user" size={16} color="#5CE1E6" />
              <Text style={LoginScreenStyles.securityText}>Autenticación 100% segura con Auth0</Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;