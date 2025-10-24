import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Componentes
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import TruckImageSection from '../components/TruckImageSection';
import ScanButton from '../components/ScanButton';
import RecentOrders from '../components/RecentOrders';
import TechnicianInfo from '../components/TechnicianInfo';

const PedidosScreen = ({ navigation }) => {
  // Función para mostrar alerta de cerrar sesión
  const showLogoutAlert = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí", 
          onPress: () => navigation.replace('Login') // Volver al Login
        }
      ]
    );
  };

  // Manejar el botón de retroceso físico
  useEffect(() => {
    const backAction = () => {
      showLogoutAlert();
      return true; // Previene el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Pasar la función showLogoutAlert al Header */}
      <Header navigation={navigation} onBackPress={showLogoutAlert} />
      <StatsCard />
      <TruckImageSection />
      <ScanButton navigation={navigation} />
      <RecentOrders />
      <TechnicianInfo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
});

export default PedidosScreen;