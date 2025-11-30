import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Header from '../components/Header';  
import BottomBar from '../components/BottomBar';  
import { useOrders } from '../context/OrdersContext';

const HomeScreen = ({ navigation }) => {
  const { hasOrders } = useOrders();

  // Si hay pedidos, redirigir automáticamente a la pantalla de Pedidos
  useEffect(() => {
    if (hasOrders) {
      navigation.replace('Pedidos');
    }
  }, [hasOrders, navigation]);

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => navigation.navigate('Menu'); // <--- Conectado

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* En Home, showBack={false} porque es la raíz después del login */}
      <Header 
        navigation={navigation}
        title="INICIO"
        showBack={false}
      />

      <View style={styles.content}>
        <Text style={styles.message}>No hay Rutas</Text>
        <Text style={styles.message}>pendientes...</Text>
        <Text style={styles.subMessage}>Escanea un código o agrega un pedido para comenzar</Text>
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subMessage: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default HomeScreen;