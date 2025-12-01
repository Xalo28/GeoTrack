import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Image } from 'react-native';
import Header from '../components/Header';  
import BottomBar from '../components/BottomBar';  
import DistrictCard from '../components/DistrictCard'; // Importamos el nuevo componente
import LogoContainer from '../components/LogoContainer'; // Reutilizamos tu logo
import { useOrders } from '../context/OrdersContext';

const HomeScreen = ({ navigation }) => {
  const { orders, hasOrders } = useOrders();

  // 1. Lógica para agrupar pedidos por distrito
  const groupedOrders = orders.reduce((groups, order) => {
    const district = order.distrito || 'SIN DISTRITO';
    if (!groups[district]) {
      groups[district] = {
        name: district,
        pending: 0,
        delivered: 0,
        orders: []
      };
    }
    
    // Contar estados
    if (order.estado === 'Entregado') {
      groups[district].delivered += 1;
    } else {
      groups[district].pending += 1;
    }
    
    groups[district].orders.push(order);
    return groups;
  }, {});

  // Convertir objeto de grupos a array para mapear
  const districtsArray = Object.values(groupedOrders);

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => navigation.navigate('Menu');

  // Función para ir al detalle
  const handleDistrictPress = (districtData) => {
    navigation.navigate('Pedidos', { 
      districtFilter: districtData.name,
      districtOrders: districtData.orders 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header 
        navigation={navigation}
        title="RUTAS" // Título cambiado según imagen
        showBack={false}
      />

      <ScrollView style={styles.scrollContent}>
        {/* Logo SAVA en la parte superior */}
        <LogoContainer /> 

        {!hasOrders ? (
          // VISTA VACÍA (Pantalla Izquierda)
          <View style={styles.emptyContainer}>
            <Text style={styles.message}>No hay Rutas</Text>
            <Text style={styles.message}>pendientes...</Text>
          </View>
        ) : (
          // VISTA CON RUTAS AGRUPADAS (Pantalla Medio)
          <View style={styles.cardsContainer}>
            {districtsArray.map((district, index) => (
              <DistrictCard
                key={index}
                district={district.name}
                pendingCount={district.pending}
                deliveredCount={district.delivered}
                driverName="JUANITO LOPEZ" // Opcional: hacerlo dinámico
                onPress={() => handleDistrictPress(district)}
              />
            ))}
          </View>
        )}
      </ScrollView>

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
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    marginTop: 20,
    paddingBottom: 100, // Espacio para el BottomBar
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000', // Negro puro según imagen
    textAlign: 'center',
  },
});

export default HomeScreen;