import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import MenuScreenStyles from '../styles/MenuScreenStyles'; // Importa los estilos

const { width } = Dimensions.get('window');

// TUS CREDENCIALES
const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

const MenuScreen = ({ navigation }) => {
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const handleLogout = async () => {
    try {
      const returnTo = makeRedirectUri({ scheme: 'geotrack' });
      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
      
      // Abrimos navegador para limpiar cookie de Auth0
      await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      
      // Reseteamos navegación al Login
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      // Si falla, forzamos salida local
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

  const MenuItem = ({ icon, title, subtitle, onPress, isFirst, isLast, iconColor = '#5CE1E6' }) => (
    <TouchableOpacity 
      style={[
        MenuScreenStyles.menuItem,
        isFirst && MenuScreenStyles.menuItemFirst,
        isLast && MenuScreenStyles.menuItemLast
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={MenuScreenStyles.menuItemContent}>
        <View style={[MenuScreenStyles.iconContainer, { backgroundColor: `rgba(${parseInt(iconColor.slice(1, 3), 16)}, ${parseInt(iconColor.slice(3, 5), 16)}, ${parseInt(iconColor.slice(5, 7), 16)}, 0.1)` }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={MenuScreenStyles.menuItemTextContainer}>
          <Text style={MenuScreenStyles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={MenuScreenStyles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={MenuScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={MenuScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
      <View style={MenuScreenStyles.customHeader}>
        <TouchableOpacity 
          style={MenuScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={MenuScreenStyles.headerCenter}>
          <Text style={MenuScreenStyles.headerTitle}>MENÚ</Text>
          <Text style={MenuScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={MenuScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={MenuScreenStyles.profileCircle}
          >
            <Text style={MenuScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={MenuScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={MenuScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={MenuScreenStyles.scrollView}
        contentContainerStyle={MenuScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Perfil del usuario */}
        <View style={MenuScreenStyles.profileCard}>
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
            style={MenuScreenStyles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={MenuScreenStyles.avatarContainer}>
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={MenuScreenStyles.avatarGradient}
              >
                <Text style={MenuScreenStyles.avatarText}>JL</Text>
              </LinearGradient>
            </View>
            <View style={MenuScreenStyles.profileInfo}>
              <Text style={MenuScreenStyles.profileName}>Juanito Lopez</Text>
              <View style={MenuScreenStyles.profileRoleContainer}>
                <MaterialIcons name="directions-car" size={16} color="#5CE1E6" />
                <Text style={MenuScreenStyles.profileRole}>Conductor / Repartidor</Text>
              </View>
              <View style={MenuScreenStyles.profileIdContainer}>
                <MaterialIcons name="badge" size={14} color="#a0a0c0" />
                <Text style={MenuScreenStyles.profileId}>ID: DRV-2025-001</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Sección Cuenta */}
        <View style={MenuScreenStyles.section}>
          <View style={MenuScreenStyles.sectionHeader}>
            <Text style={MenuScreenStyles.sectionTitle}>CUENTA</Text>
            <View style={MenuScreenStyles.sectionDivider} />
          </View>
          <View style={MenuScreenStyles.menuItemsContainer}>
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
          </View>
        </View>

        {/* Sección Aplicación */}
        <View style={MenuScreenStyles.section}>
          <View style={MenuScreenStyles.sectionHeader}>
            <Text style={MenuScreenStyles.sectionTitle}>APLICACIÓN</Text>
            <View style={MenuScreenStyles.sectionDivider} />
          </View>
          <View style={MenuScreenStyles.menuItemsContainer}>
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
          </View>
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity 
          style={MenuScreenStyles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.2)']}
            style={MenuScreenStyles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={MenuScreenStyles.logoutContent}>
              <View style={[MenuScreenStyles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                <MaterialIcons name="exit-to-app" size={24} color="#FF4444" />
              </View>
              <View style={MenuScreenStyles.logoutTextContainer}>
                <Text style={MenuScreenStyles.logoutTitle}>Cerrar Sesión</Text>
                <Text style={MenuScreenStyles.logoutSubtitle}>Salir de tu cuenta actual</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Información de versión */}
        <View style={MenuScreenStyles.versionContainer}>
          <Text style={MenuScreenStyles.versionText}>GeoTrack Delivery</Text>
          <Text style={MenuScreenStyles.versionNumber}>Versión 1.0.0 (Build 2025)</Text>
          <Text style={MenuScreenStyles.versionCopyright}>© 2025 GeoTrack. Todos los derechos reservados.</Text>
        </View>
        
        {/* Espacio final */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;