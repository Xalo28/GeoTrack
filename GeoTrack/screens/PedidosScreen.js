import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import TruckImageSection from '../components/TruckImageSection';
import ScanButton from '../components/ScanButton';
import RecentOrders from '../components/RecentOrders';
import BottomBar from '../components/BottomBar';

const PedidosScreen = ({ navigation }) => {
  const { orders } = useOrders();

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
          onPress: () => navigation.replace('Login')
        }
      ]
    );
  };

  useEffect(() => {
    const backAction = () => {
      showLogoutAlert();
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
  const handleMenuPress = () => console.log('Menu pressed');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header y componentes fijos */}
      <Header navigation={navigation} onBackPress={showLogoutAlert} />
      <StatsCard /> 
      <ScanButton navigation={navigation} />
      
      {/* RecentOrders con su propio scroll interno */}
      <View style={styles.ordersContainer}>
        <RecentOrders orders={orders} />
      </View>

      {/* BottomBar fijo */}
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
    paddingHorizontal: 10,
  },
  ordersContainer: {
    flex: 1, // Ocupa todo el espacio disponible entre el ScanButton y el BottomBar
  },
});

export default PedidosScreen;