import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import Header from '../components/Header';

// TUS CREDENCIALES
const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

const MenuScreen = ({ navigation }) => {

  const handleLogout = async () => {
    try {
      const returnTo = makeRedirectUri({ scheme: 'geotrack' });
      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
      await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (e) {
      console.log('Error al salir:', e);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
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

  const MenuItem = ({ icon, title, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: '#F0F8FF' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="MENÚ" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* Perfil Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JL</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juanito Lopez</Text>
            <Text style={styles.profileRole}>Conductor / Repartidor</Text>
            <Text style={styles.profileId}>ID: DRV-2025-001</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <MenuItem icon="person-outline" title="Mi Perfil" onPress={() => {}} />
          <MenuItem icon="notifications-outline" title="Notificaciones" onPress={() => {}} />
          <MenuItem icon="shield-checkmark-outline" title="Seguridad" onPress={() => {}} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación</Text>
          <MenuItem icon="settings-outline" title="Configuración" onPress={() => {}} />
          <MenuItem icon="help-circle-outline" title="Ayuda y Soporte" onPress={() => {}} />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FFF" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.version}>Versión 1.0.0 (Build 2025)</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5CE1E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileId: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF4444',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  version: {
    textAlign: 'center',
    color: '#CCC',
    marginTop: 30,
    fontSize: 12,
  },
});

export default MenuScreen;