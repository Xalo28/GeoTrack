import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ScanButton from '../components/ScanButton';
import RecentOrders from '../components/RecentOrders';
import BottomBar from '../components/BottomBar';

// --- IMPORTACIONES PARA LOGOUT ---
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// TUS CREDENCIALES DE AUTH0
const AUTH0_DOMAIN = 'dev-usdq4caghn6ibx5y.us.auth0.com';
const AUTH0_CLIENT_ID = 'cWXgVdLInYcSnZVi3w3isNhu0G1IKEwi';

const PedidosScreen = ({ navigation }) => {
  const { orders } = useOrders();

  const handleLogout = async () => {
    try {
      const returnTo = makeRedirectUri({ scheme: 'geotrack' });
      const logoutUrl = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
      await WebBrowser.openAuthSessionAsync(logoutUrl, returnTo);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      console.log('Error al salir:', e);
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  const showLogoutAlert = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí", onPress: handleLogout }
      ]
    );
  };

  // Manejo del botón físico de atrás en Android
  useEffect(() => {
    const backAction = () => {
      // Evitamos volver a la pantalla de carga o login con el botón físico
      // Opcionalmente podrías minimizar la app aquí
      return true; 
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => navigation.navigate('Menu');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 1. Header Fijo en la parte superior */}
      <Header navigation={navigation} title="MIS PEDIDOS" showBack={false} />
      
      {/* 2. ScrollView Principal: Envuelve TODO el contenido central */}
      {/* Esto permite que si la lista crece, baje todo (incluidos los stats) */}
      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatsCard />
        <ScanButton navigation={navigation} />
        
        {/* RecentOrders ahora debe ser solo una View (sin scroll propio) */}
        <RecentOrders orders={orders} />
      </ScrollView>

      {/* 3. Barra Inferior Fija en la parte inferior */}
      <BottomBar 
        onScanPress={handleScanPress}
        onAddPress={handleAddPress}
        onMenuPress={handleMenuPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1, // Ocupa todo el espacio disponible entre Header y BottomBar
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    // Un poco de espacio extra al final para que el último elemento no quede pegado
    paddingBottom: 20, 
  },
});

export default PedidosScreen;