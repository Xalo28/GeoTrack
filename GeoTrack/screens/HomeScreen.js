import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import Header from '../components/Header';  
import BottomBar from '../components/BottomBar';  
import { useOrders } from '../context/OrdersContext';

const HomeScreen = ({ navigation }) => {
  const { hasOrders } = useOrders();

  useEffect(() => {
    if (hasOrders) {
      navigation.navigate('Pedidos');
    }
  }, [hasOrders, navigation]);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "CANCELAR", style: "cancel" },
        { 
          text: "SÍ", 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => console.log('Menu pressed');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header 
        navigation={navigation}
        onBackPress={handleLogout}
        title="INICIO"
        subtitle="Juanito Lopez"
      />

      <View style={styles.content}>
        <Text style={styles.message}>No hay Rutas</Text>
        <Text style={styles.message}>pendientes...</Text>
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
    color: '#000000',
    textAlign: 'center',
  },
});

export default HomeScreen;