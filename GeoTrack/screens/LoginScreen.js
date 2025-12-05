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
  SafeAreaView,
  TextInput
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

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

  const redirectUri = makeRedirectUri({ scheme: 'geotrack',useProxy: true });
  console.log("TU URL DE REDIRECCION ES:", redirectUri);
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
    promptAsync({ useProxy: true });
  };

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
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
          <View style={styles.logoContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.logoCircle}>
                <FontAwesome5 name="shipping-fast" size={60} color="#5CE1E6" />
              </View>
            </Animated.View>
            
            <Text style={styles.appName}>SAVA S.A.C</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>Gestión de Logística Inteligente</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="location-on" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Rastreo en tiempo real</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="assessment" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Reportes automatizados</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="security" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Acceso seguro</Text>
            </View>
          </View>
          
          <AnimatedTouchableOpacity 
            style={[styles.authButton, { transform: [{ scale: pulseAnim }] }]} 
            onPress={handleLogin}
            disabled={!request || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="login" size={24} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.authButtonText}>INGRESAR / REGISTRARSE</Text>
                </>
              )}
            </LinearGradient>
          </AnimatedTouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Accede a la plataforma de gestión logística más avanzada
            </Text>
            <View style={styles.securityNote}>
              <MaterialIcons name="verified-user" size={16} color="#5CE1E6" />
              <Text style={styles.securityText}>Autenticación 100% segura con Auth0</Text>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 173, 181, 0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '40%',
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(92, 225, 230, 0.07)',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(92, 225, 230, 0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 2,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#5CE1E6',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  authButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  buttonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  securityText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 8,
  },
};

export default LoginScreen;