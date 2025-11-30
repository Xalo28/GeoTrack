import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useOrders } from '../context/OrdersContext';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ScanButton from '../components/ScanButton';
import RecentOrders from '../components/RecentOrders';
import BottomBar from '../components/BottomBar';

const PedidosScreen = ({ navigation }) => {
  const { orders } = useOrders();

  // Manejo del botón físico de atrás en Android
  useEffect(() => {
    const backAction = () => {
      // Si estamos en la lista de pedidos, ir atrás debería volver al Home
      // o preguntar si salir, pero lo ideal es ir al Home
      navigation.navigate('Home');
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
  const handleMenuPress = () => navigation.navigate('Menu'); // <--- Conectado

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Header navigation={navigation} title="MIS PEDIDOS" showBack={true} />
      
      <View style={styles.content}>
        <StatsCard /> 
        <ScanButton navigation={navigation} />
        
        <View style={styles.ordersContainer}>
          <RecentOrders orders={orders} />
        </View>
      </View>

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  ordersContainer: {
    flex: 1,
    marginTop: 10,
  },
});

export default PedidosScreen;