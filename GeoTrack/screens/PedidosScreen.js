import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, BackHandler, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';

import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import TruckImageSection from '../components/TruckImageSection';
import ScanButton from '../components/ScanButton';
import RecentOrders from '../components/RecentOrders';


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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Header navigation={navigation} onBackPress={showLogoutAlert} />
      <StatsCard /> 
      <ScanButton navigation={navigation} />
      <RecentOrders orders={orders} />
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