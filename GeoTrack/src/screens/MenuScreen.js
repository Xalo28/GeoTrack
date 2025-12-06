// src/screens/MenuScreen.js
import React from 'react';
import { 
  View, 
  ScrollView, 
  Alert,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Importar componentes
import HeaderMenu from '../components/menu/HeaderMenu';
import DateDisplay from '../components/menu/DateDisplay';
import ProfileCard from '../components/menu/ProfileCard';
import MenuSection from '../components/menu/MenuSection';
import MenuItem from '../components/menu/MenuItem';
import LogoutButton from '../components/menu/LogoutButton';
import VersionInfo from '../components/menu/VersionInfo';

const { width } = Dimensions.get('window');

const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

const MenuScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      //const returnTo = makeRedirectUri({ scheme: 'geotrack' });
      const returnTo = "geotrack://";
      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
      
      await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: handleLogout, style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <HeaderMenu 
        navigation={navigation}
        title="MENÚ"
        subtitle="JUANITO LOPEZ"
        profileInitial="JL"
      />

      <DateDisplay />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard 
          name="Juanito Lopez"
          role="Conductor / Repartidor"
          id="DRV-2025-001"
          initials="JL"
        />

        <MenuSection title="CUENTA">
          <MenuItem 
            icon="person" 
            title="Mi Perfil" 
            subtitle="Gestiona tu información personal"
            onPress={() => navigation.navigate('Profile')}
            isFirst={true}
          />
          <MenuItem 
            icon="notifications" 
            title="Notificaciones" 
            subtitle="Configura tus alertas y notificaciones"
            onPress={() => navigation.navigate('Notifications')}
          />
          <MenuItem 
            icon="security" 
            title="Seguridad" 
            subtitle="Contraseña y autenticación"
            onPress={() => navigation.navigate('Security')}
            isLast={true}
            iconColor="#4ECB71"
          />
        </MenuSection>

        <MenuSection title="APLICACIÓN">
          <MenuItem 
            icon="settings" 
            title="Configuración" 
            subtitle="Ajustes de la aplicación"
            onPress={() => navigation.navigate('Settings')}
            isFirst={true}
          />
          <MenuItem 
            icon="help-outline" 
            title="Ayuda y Soporte" 
            subtitle="Centro de ayuda y contacto"
            onPress={() => navigation.navigate('Help')}
            isLast={true}
            iconColor="#FFA726"
          />
        </MenuSection>

        <LogoutButton onPress={confirmLogout} />

        <VersionInfo 
          appName="GeoTrack Delivery"
          version="1.0.0"
          build="2025"
          copyright="© 2025 GeoTrack. Todos los derechos reservados."
        />
        
        <View style={{ height: 30 }} />
      </ScrollView>
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
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
};

export default MenuScreen;