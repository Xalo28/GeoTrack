import React, { useEffect, useState } from 'react';
import { 
  View, 
  StatusBar, 
  Text, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated, 
  Dimensions 
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

// Importar componentes - Asegúrate que la ruta sea correcta
import {
  BackgroundElements,
  LogoHeader,
  FeatureItem,
  LoginButton,
  SecurityNote,
  styles
} from '../components/login'; 

WebBrowser.maybeCompleteAuthSession();

const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
};

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  const redirectUri = makeRedirectUri({ scheme: 'geotrack', useProxy: false });
  
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: redirectUri,
      responseType: ResponseType.Token,
      extraParams: { prompt: 'login', ui_locales: 'es' }
    },
    discovery
  );

  useEffect(() => {
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
      setLoading(false);
    }
  }, [response]);

  const getUserData = async (token) => {
    try {
      const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await userInfoResponse.json();
      
      setLoading(false);
      navigation.replace('Home');
    } catch (e) {
      console.log(e);
      setLoading(false);
      Alert.alert("Error", "No se pudo obtener la información del usuario");
    }
  };

  const handleLogin = () => {
    setLoading(true);
    promptAsync({ useProxy: false });
  };

  const features = [
    { icon: 'location-on', text: 'Rastreo en tiempo real' },
    { icon: 'assessment', text: 'Reportes automatizados' },
    { icon: 'security', text: 'Acceso seguro' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <BackgroundElements />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LogoHeader pulseAnim={pulseAnim} />
          
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                icon={feature.icon}
                text={feature.text}
              />
            ))}
          </View>
          
          <LoginButton 
            loading={loading}
            pulseAnim={pulseAnim}
            onPress={handleLogin}
            disabled={!request || loading}
          />
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Accede a la plataforma de gestión logística más avanzada
            </Text>
            <SecurityNote />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;