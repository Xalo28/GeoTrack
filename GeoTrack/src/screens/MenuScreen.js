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

const { width } = Dimensions.get('window');

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

  const MenuItem = ({ icon, title, subtitle, onPress, isFirst, isLast, iconColor = '#5CE1E6' }) => (
    <TouchableOpacity 
      style={[
        styles.menuItem,
        isFirst && styles.menuItemFirst,
        isLast && styles.menuItemLast
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemContent}>
        <View style={[styles.iconContainer, { backgroundColor: `rgba(${parseInt(iconColor.slice(1, 3), 16)}, ${parseInt(iconColor.slice(3, 5), 16)}, ${parseInt(iconColor.slice(5, 7), 16)}, 0.1)` }]}>
          <MaterialIcons name={icon} size={22} color={iconColor} />
        </View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="rgba(255, 255, 255, 0.3)" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>MENÚ</Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>JL</Text>
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Juanito Lopez</Text>
              <View style={styles.profileRoleContainer}>
                <MaterialIcons name="directions-car" size={16} color="#5CE1E6" />
                <Text style={styles.profileRole}>Conductor / Repartidor</Text>
              </View>
              <View style={styles.profileIdContainer}>
                <MaterialIcons name="badge" size={14} color="#a0a0c0" />
                <Text style={styles.profileId}>ID: DRV-2025-001</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CUENTA</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.menuItemsContainer}>
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

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>APLICACIÓN</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.menuItemsContainer}>
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

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255, 68, 68, 0.3)', 'rgba(255, 68, 68, 0.2)']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.logoutContent}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                <MaterialIcons name="exit-to-app" size={24} color="#FF4444" />
              </View>
              <View style={styles.logoutTextContainer}>
                <Text style={styles.logoutTitle}>Cerrar Sesión</Text>
                <Text style={styles.logoutSubtitle}>Salir de tu cuenta actual</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>GeoTrack Delivery</Text>
          <Text style={styles.versionNumber}>Versión 1.0.0 (Build 2025)</Text>
          <Text style={styles.versionCopyright}>© 2025 GeoTrack. Todos los derechos reservados.</Text>
        </View>
        
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  profileCard: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 6,
  },
  profileIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileId: {
    fontSize: 11,
    color: '#a0a0c0',
    marginLeft: 6,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  logoutButton: {
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutGradient: {
    padding: 15,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  logoutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
    marginBottom: 3,
  },
  logoutSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 68, 68, 0.7)',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  versionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CE1E6',
    marginBottom: 5,
  },
  versionNumber: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  versionCopyright: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
};

export default MenuScreen;