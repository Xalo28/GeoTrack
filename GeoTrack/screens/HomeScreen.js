import React, { useCallback } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';  
import BottomBar from '../components/BottomBar';  
import { useOrders } from '../context/OrdersContext';

const HomeScreen = ({ navigation }) => {
  const { hasOrders } = useOrders();

  // Verifica si hay pedidos cada vez que entras a esta pantalla
  useFocusEffect(
    useCallback(() => {
      if (hasOrders) {
        // Redirección automática al Dashboard si hay datos
        navigation.navigate('Pedidos');
      }
    }, [hasOrders, navigation])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header 
        navigation={navigation}
        title="INICIO"
        showBack={false}
      />

      <View style={styles.content}>
        <Text style={styles.message}>No hay Rutas</Text>
        <Text style={styles.message}>pendientes...</Text>
        <Text style={styles.subMessage}>
          Usa el botón "+" para agregar o el QR para escanear.
        </Text>
      </View>

      <BottomBar 
        onScanPress={() => navigation.navigate('ScanPhase1')}
        onAddPress={() => navigation.navigate('ManualOrder')}
        onMenuPress={() => navigation.navigate('Menu')}
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
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;