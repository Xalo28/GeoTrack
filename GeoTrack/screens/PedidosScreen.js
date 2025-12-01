import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';

import Header from '../components/Header';
import LogoContainer from '../components/LogoContainer';
import BottomBar from '../components/BottomBar';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';

const { width, height } = Dimensions.get('window');

const PedidosScreen = ({ navigation, route }) => {
  const { districtFilter } = route.params || { districtFilter: 'TODOS' };
  const { orders } = useOrders();

  // Estados
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('Pedidos');
  
  // Estados para el Mapa
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);

  // Filtrado de pedidos
  const filteredOrders = orders.filter(order => 
    districtFilter === 'TODOS' ? true : order.distrito === districtFilter
  );

  // Obtener ubicación al cargar
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        Alert.alert("Permiso denegado", "Necesitamos tu ubicación para mostrar el mapa.");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Centrar el mapa en el usuario
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.015, // Zoom nivel calle
        longitudeDelta: 0.015,
      });
    })();
  }, []);

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Renderizado del contenido de la lista
  const renderListContent = () => (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LogoContainer />
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={[styles.columnHeader, { flex: 0.2 }]}>Orden</Text>
          <Text style={[styles.columnHeader, { flex: 0.6 }]}>Pedido</Text>
          <Text style={[styles.columnHeader, { flex: 0.2, textAlign: 'center' }]}>Status</Text>
        </View>

        {filteredOrders.map((order, index) => (
          <TouchableOpacity 
            key={order.id || index} 
            style={styles.row}
            onPress={() => handleOrderPress(order)}
            activeOpacity={0.7}
          >
            <Text style={[styles.cellText, { flex: 0.2, fontWeight: 'bold' }]}>
              {index + 1}
            </Text>
            
            <View style={{ flex: 0.6 }}>
              <Text style={styles.clientText} numberOfLines={1}>
                {order.cliente || 'Cliente'}
              </Text>
              <Text style={styles.addressText} numberOfLines={2}>
                {order.informacionContacto?.direccion || 'Sin dirección'}
              </Text>
              <Text style={styles.districtText}>
                {order.distrito}
              </Text>
            </View>

            <View style={{ flex: 0.2, alignItems: 'center' }}>
              {order.estado === 'Entregado' ? (
                <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
              ) : (
                <Ionicons name="time-outline" size={24} color="#5CE1E6" />
              )}
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <Text style={styles.emptyText}>No hay pedidos en este distrito.</Text>
        )}

        <TouchableOpacity style={styles.enrutarButton}>
          <Text style={styles.enrutarText}>ENRUTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Renderizado del Mapa
  const renderMapContent = () => {
    if (!location || !mapRegion) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5CE1E6" />
          <Text style={{marginTop: 10}}>Obteniendo ubicación...</Text>
        </View>
      );
    }

    return (
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          region={mapRegion}
          showsUserLocation={true} // Muestra el punto azul de tu ubicación
          showsMyLocationButton={true}
        >
          {filteredOrders.map((order, index) => {
            // Solo renderizar si tiene coordenadas
            if (order.coordinate) {
              return (
                <Marker
                  key={order.id || index}
                  coordinate={order.coordinate}
                  title={order.cliente}
                  description={order.informacionContacto.direccion}
                  pinColor={order.estado === 'Entregado' ? 'green' : 'red'}
                  onCalloutPress={() => handleOrderPress(order)}
                />
              );
            }
            return null;
          })}
        </MapView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Header navigation={navigation} title="PEDIDOS" showBack={true} />
      
      {/* Tabs fuera del ScrollView para que queden fijos arriba */}
      <View style={styles.fixedHeader}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setActiveTab('Pedidos')}
          >
            <Text style={[styles.tabText, activeTab === 'Pedidos' && styles.activeTabText]}>
              Pedidos
            </Text>
            {activeTab === 'Pedidos' && <View style={styles.activeLine} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.tabButton} 
            onPress={() => setActiveTab('Mapa')}
          >
            <Text style={[styles.tabText, activeTab === 'Mapa' && styles.activeTabText]}>
              Mapa
            </Text>
            {activeTab === 'Mapa' && <View style={styles.activeLine} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Cambiante */}
      <View style={styles.contentArea}>
        {activeTab === 'Pedidos' ? renderListContent() : renderMapContent()}
      </View>

      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />

      <BottomBar 
        onScanPress={() => navigation.navigate('ScanPhase1')}
        onAddPress={() => navigation.navigate('ManualOrder')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  fixedHeader: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    zIndex: 10,
  },
  contentArea: {
    flex: 1, // Ocupa el espacio restante
  },
  
  // Estilos del Mapa
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 40,
  },
  tabButton: { alignItems: 'center', paddingBottom: 5 },
  tabText: { fontSize: 16, color: '#999', fontWeight: '500' },
  activeTabText: { color: '#007AFF', fontWeight: 'bold' },
  activeLine: { width: '100%', height: 2, backgroundColor: '#007AFF', marginTop: 4 },

  // Lista
  scrollContent: { paddingHorizontal: 20 },
  listContainer: { paddingBottom: 100 },
  listHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  columnHeader: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
  },
  cellText: { fontSize: 14, color: '#333' },
  clientText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  addressText: { fontSize: 13, color: '#666', marginTop: 2 },
  districtText: { fontSize: 12, color: '#999', marginTop: 2 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  
  // Botón Enrutar
  enrutarButton: {
    backgroundColor: '#5CE1E6',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    shadowColor: "#5CE1E6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  enrutarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
});

export default PedidosScreen;