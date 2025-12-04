import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  ActivityIndicator,
  Animated,
  Platform,
  SafeAreaView,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { useOrders } from '../context/OrdersContext';
import PedidosScreenStyles from '../styles/PedidosScreenStyles'; // Importa los estilos

const { width, height } = Dimensions.get('window');

const PedidosScreen = ({ navigation, route }) => {
  const { districtFilter = 'TODOS', districtOrders = [] } = route.params || {};
  const { orders } = useOrders();

  // Estados
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBottomTab, setActiveBottomTab] = useState('inicio'); // 'escanear', 'agregar', 'inicio'
  
  // Estados para el Mapa
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  const [mapType, setMapType] = useState('standard');

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const mapAnim = useRef(new Animated.Value(0)).current;

  // Filtrado de pedidos
  const filteredOrders = districtOrders.length > 0 
    ? districtOrders 
    : orders.filter(order => 
        districtFilter === 'TODOS' ? true : order.distrito === districtFilter
      );

  // Filtrar por estado y búsqueda
  const displayOrders = filteredOrders.filter(order => {
    // Filtro por estado
    const statusMatch = selectedStatus === 'all' ? true : 
                       selectedStatus === 'pending' ? order.estado !== 'Entregado' :
                       order.estado === 'Entregado';
    
    // Filtro por búsqueda
    const searchMatch = !searchQuery || 
                       order.cliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.distrito?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.informacionContacto?.direccion?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

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
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  useEffect(() => {
    // Animaciones al cambiar de pestaña
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleNavigateToOrder = (order) => {
    // Aquí iría la lógica para navegación al pedido
    Alert.alert('Navegar', `Navegando a: ${order.cliente}`);
  };

  const handleEnrutar = () => {
    Alert.alert('Enrutamiento', 'Iniciando ruta optimizada...');
  };

  // Funciones para el BottomBar
  const handleScanPress = () => {
    setActiveBottomTab('escanear');
    navigation.navigate('ScanPhase1');
  };

  const handleAddPress = () => {
    setActiveBottomTab('agregar');
    navigation.navigate('ManualOrder');
  };

  const handleHomePress = () => {
    setActiveBottomTab('inicio');
    navigation.navigate('Home');
  };

  // Estadísticas
  const pendingCount = filteredOrders.filter(o => o.estado !== 'Entregado').length;
  const deliveredCount = filteredOrders.filter(o => o.estado === 'Entregado').length;
  const completionRate = filteredOrders.length > 0 
    ? Math.round((deliveredCount / filteredOrders.length) * 100) 
    : 0;

  // Fecha actual formateada
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  // Renderizar tarjeta de pedido
  const renderOrderCard = (order, index) => (
    <Animated.View 
      key={order.id || index}
      style={[
        PedidosScreenStyles.orderCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        style={PedidosScreenStyles.cardContent}
        onPress={() => handleOrderPress(order)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={PedidosScreenStyles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={PedidosScreenStyles.cardHeader}>
            <View style={PedidosScreenStyles.orderNumberContainer}>
              <Text style={PedidosScreenStyles.orderNumber}>#{index + 1}</Text>
            </View>
            
            <View style={PedidosScreenStyles.statusContainer}>
              <View style={[
                PedidosScreenStyles.statusBadge,
                order.estado === 'Entregado' ? PedidosScreenStyles.statusDelivered : PedidosScreenStyles.statusPending
              ]}>
                <Text style={PedidosScreenStyles.statusText}>
                  {order.estado === 'Entregado' ? 'ENTREGADO' : 'PENDIENTE'}
                </Text>
              </View>
            </View>
          </View>

          <View style={PedidosScreenStyles.clientInfo}>
            <View style={PedidosScreenStyles.clientIcon}>
              <MaterialIcons name="person" size={20} color="#5CE1E6" />
            </View>
            <View style={PedidosScreenStyles.clientDetails}>
              <Text style={PedidosScreenStyles.clientName}>{order.cliente || 'Cliente no disponible'}</Text>
              <Text style={PedidosScreenStyles.orderId}>ID: {order.id || `ORD-${index + 1000}`}</Text>
            </View>
          </View>

          <View style={PedidosScreenStyles.addressContainer}>
            <MaterialIcons name="location-on" size={18} color="#FFA726" style={PedidosScreenStyles.addressIcon} />
            <Text style={PedidosScreenStyles.addressText}>
              {order.informacionContacto?.direccion || 'Dirección no disponible'}
            </Text>
          </View>

          <View style={PedidosScreenStyles.districtContainer}>
            <View style={PedidosScreenStyles.districtTag}>
              <Text style={PedidosScreenStyles.districtText}>{order.distrito || 'SIN DISTRITO'}</Text>
            </View>
            
            <View style={PedidosScreenStyles.timeContainer}>
              <MaterialIcons name="access-time" size={14} color="#a0a0c0" />
              <Text style={PedidosScreenStyles.timeText}>15-30 min</Text>
            </View>
          </View>

          <View style={PedidosScreenStyles.cardFooter}>
            <TouchableOpacity 
              style={PedidosScreenStyles.detailsButton}
              onPress={() => handleOrderPress(order)}
            >
              <Text style={PedidosScreenStyles.detailsButtonText}>VER DETALLES</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#5CE1E6" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={PedidosScreenStyles.navigateButton}
              onPress={() => handleNavigateToOrder(order)}
            >
              <MaterialIcons name="directions" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Renderizar vista de lista
  const renderListView = () => (
    <Animated.View 
      style={[
        PedidosScreenStyles.contentContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={PedidosScreenStyles.scrollContent}
      >
        {/* Estadísticas rápidas */}
        <View style={PedidosScreenStyles.statsQuickView}>
          <View style={PedidosScreenStyles.statQuickItem}>
            <Text style={PedidosScreenStyles.statQuickNumber}>{filteredOrders.length}</Text>
            <Text style={PedidosScreenStyles.statQuickLabel}>TOTAL</Text>
          </View>
          <View style={PedidosScreenStyles.statDivider} />
          <View style={PedidosScreenStyles.statQuickItem}>
            <Text style={[PedidosScreenStyles.statQuickNumber, { color: '#FFA726' }]}>{pendingCount}</Text>
            <Text style={PedidosScreenStyles.statQuickLabel}>PENDIENTES</Text>
          </View>
          <View style={PedidosScreenStyles.statDivider} />
          <View style={PedidosScreenStyles.statQuickItem}>
            <Text style={[PedidosScreenStyles.statQuickNumber, { color: '#4ECB71' }]}>{deliveredCount}</Text>
            <Text style={PedidosScreenStyles.statQuickLabel}>ENTREGADOS</Text>
          </View>
        </View>

        {/* Lista de pedidos */}
        <View style={PedidosScreenStyles.ordersList}>
          {displayOrders.length > 0 ? (
            displayOrders.map((order, index) => renderOrderCard(order, index))
          ) : (
            <View style={PedidosScreenStyles.emptyState}>
              <MaterialIcons name="assignment" size={60} color="rgba(255, 255, 255, 0.2)" />
              <Text style={PedidosScreenStyles.emptyTitle}>No hay pedidos</Text>
              <Text style={PedidosScreenStyles.emptySubtitle}>
                {searchQuery ? 'No se encontraron resultados' : 
                 selectedStatus !== 'all' ? `No hay pedidos ${selectedStatus === 'pending' ? 'pendientes' : 'entregados'}` :
                 'No hay pedidos en este filtro'}
              </Text>
            </View>
          )}
        </View>

        {/* Espacio para el bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );

  // Renderizar vista de mapa - SIN FONDO
  const renderMapView = () => {
    if (!location || !mapRegion) {
      return (
        <View style={PedidosScreenStyles.mapLoadingContainer}>
          <ActivityIndicator size="large" color="#5CE1E6" />
          <Text style={PedidosScreenStyles.mapLoadingText}>Cargando mapa...</Text>
        </View>
      );
    }

    return (
      <View style={PedidosScreenStyles.mapContainer}>
        <MapView
          style={PedidosScreenStyles.map}
          provider={PROVIDER_GOOGLE}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapType={mapType}
          // Sin customMapStyle para usar el estilo por defecto
        >
          {displayOrders.map((order, index) => {
            // Simular coordenadas si no existen
            const latOffset = (index % 3) * 0.002;
            const lngOffset = (index % 2) * 0.002;
            
            const coordinate = order.coordinate || {
              latitude: mapRegion.latitude + latOffset,
              longitude: mapRegion.longitude + lngOffset,
            };

            return (
              <Marker
                key={order.id || index}
                coordinate={coordinate}
                title={order.cliente}
                description={order.distrito}
                pinColor={order.estado === 'Entregado' ? '#4ECB71' : '#FFA726'}
                onPress={() => handleOrderPress(order)}
              >
                <Callout tooltip onPress={() => handleOrderPress(order)}>
                  <View style={PedidosScreenStyles.mapCallout}>
                    <Text style={PedidosScreenStyles.mapCalloutTitle}>{order.cliente}</Text>
                    <Text style={PedidosScreenStyles.mapCalloutAddress}>
                      {order.informacionContacto?.direccion}
                    </Text>
                    <Text style={PedidosScreenStyles.mapCalloutDistrict}>{order.distrito}</Text>
                    <TouchableOpacity 
                      style={PedidosScreenStyles.mapCalloutButton}
                      onPress={() => handleNavigateToOrder(order)}
                    >
                      <Text style={PedidosScreenStyles.mapCalloutButtonText}>NAVEGAR</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>

        {/* Controles del mapa */}
        <View style={PedidosScreenStyles.mapControls}>
          <TouchableOpacity 
            style={PedidosScreenStyles.mapControlButton}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <MaterialIcons 
              name={mapType === 'standard' ? 'satellite' : 'map'} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={PedidosScreenStyles.mapControlButton}
            onPress={() => {
              setMapRegion({
                ...mapRegion,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              });
            }}
          >
            <MaterialIcons name="zoom-in" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={PedidosScreenStyles.mapControlButton}
            onPress={() => {
              setMapRegion({
                ...mapRegion,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              });
            }}
          >
            <MaterialIcons name="zoom-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Renderizar BottomBar personalizado
  const renderBottomBar = () => (
    <View style={PedidosScreenStyles.bottomBar}>
      <LinearGradient
        colors={['rgba(26, 26, 46, 0.95)', 'rgba(26, 26, 46, 0.98)']}
        style={PedidosScreenStyles.bottomBarGradient}
      >
        <View style={PedidosScreenStyles.bottomBarContent}>
          {/* Botón Escanear */}
          <TouchableOpacity 
            style={PedidosScreenStyles.bottomBarButton} 
            onPress={handleScanPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={PedidosScreenStyles.scanButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
              <Text style={PedidosScreenStyles.scanButtonText}>ESCANEAR</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Botón Agregar */}
          <TouchableOpacity 
            style={PedidosScreenStyles.bottomBarButton} 
            onPress={handleAddPress}
            activeOpacity={0.8}
          >
            <View style={[
              PedidosScreenStyles.addButton,
              activeBottomTab === 'agregar' && PedidosScreenStyles.activeBottomButton
            ]}>
              <MaterialIcons 
                name="add-circle" 
                size={24} 
                color={activeBottomTab === 'agregar' ? '#5CE1E6' : '#a0a0c0'} 
              />
              <Text style={[
                PedidosScreenStyles.bottomBarButtonText,
                activeBottomTab === 'agregar' && PedidosScreenStyles.activeBottomBarText
              ]}>AGREGAR</Text>
            </View>
          </TouchableOpacity>
          
          {/* Botón Inicio */}
          <TouchableOpacity 
            style={PedidosScreenStyles.bottomBarButton} 
            onPress={handleHomePress}
            activeOpacity={0.8}
          >
            <View style={[
              PedidosScreenStyles.homeButton,
              activeBottomTab === 'inicio' && PedidosScreenStyles.activeBottomButton
            ]}>
              <MaterialIcons 
                name="dashboard" 
                size={24} 
                color={activeBottomTab === 'inicio' ? '#5CE1E6' : '#a0a0c0'} 
              />
              <Text style={[
                PedidosScreenStyles.bottomBarButtonText,
                activeBottomTab === 'inicio' && PedidosScreenStyles.activeBottomBarText
              ]}>INICIO</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={PedidosScreenStyles.container}>
      <StatusBar style="light" />
      
      {/* Fondo gradiente solo para la parte superior */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={PedidosScreenStyles.topBackgroundGradient}
      />

      {/* Header personalizado */}
      <View style={PedidosScreenStyles.customHeader}>
        <TouchableOpacity 
          style={PedidosScreenStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={PedidosScreenStyles.headerCenter}>
          <Text style={PedidosScreenStyles.headerTitle}>PEDIDOS</Text>
          <Text style={PedidosScreenStyles.headerSubtitle}>{districtFilter}</Text>
        </View>
        
        <TouchableOpacity style={PedidosScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={PedidosScreenStyles.profileCircle}
          >
            <Text style={PedidosScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Fecha */}
      <View style={PedidosScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={PedidosScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      {/* Filtros y búsqueda */}
      <View style={PedidosScreenStyles.filterSection}>
        {/* Tabs principales */}
        <View style={PedidosScreenStyles.tabContainer}>
          <TouchableOpacity 
            style={[PedidosScreenStyles.tabButton, activeTab === 'list' && PedidosScreenStyles.activeTabButton]}
            onPress={() => setActiveTab('list')}
          >
            <MaterialIcons 
              name="list-alt" 
              size={20} 
              color={activeTab === 'list' ? '#FFFFFF' : '#a0a0c0'} 
            />
            <Text style={[PedidosScreenStyles.tabText, activeTab === 'list' && PedidosScreenStyles.activeTabText]}>
              LISTA
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[PedidosScreenStyles.tabButton, activeTab === 'map' && PedidosScreenStyles.activeTabButton]}
            onPress={() => setActiveTab('map')}
          >
            <MaterialIcons 
              name="map" 
              size={20} 
              color={activeTab === 'map' ? '#FFFFFF' : '#a0a0c0'} 
            />
            <Text style={[PedidosScreenStyles.tabText, activeTab === 'map' && PedidosScreenStyles.activeTabText]}>
              MAPA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtros de estado */}
        <View style={PedidosScreenStyles.statusFilters}>
          <TouchableOpacity 
            style={[
              PedidosScreenStyles.statusFilterButton,
              selectedStatus === 'all' && PedidosScreenStyles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('all')}
          >
            <Text style={[
              PedidosScreenStyles.statusFilterText,
              selectedStatus === 'all' && PedidosScreenStyles.activeStatusFilterText
            ]}>
              TODOS ({filteredOrders.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              PedidosScreenStyles.statusFilterButton,
              selectedStatus === 'pending' && PedidosScreenStyles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('pending')}
          >
            <Text style={[
              PedidosScreenStyles.statusFilterText,
              selectedStatus === 'pending' && PedidosScreenStyles.activeStatusFilterText
            ]}>
              PENDIENTES ({pendingCount})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              PedidosScreenStyles.statusFilterButton,
              selectedStatus === 'delivered' && PedidosScreenStyles.activeStatusFilter
            ]}
            onPress={() => setSelectedStatus('delivered')}
          >
            <Text style={[
              PedidosScreenStyles.statusFilterText,
              selectedStatus === 'delivered' && PedidosScreenStyles.activeStatusFilterText
            ]}>
              ENTREGADOS ({deliveredCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={PedidosScreenStyles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#5CE1E6" />
          <TextInput
            style={PedidosScreenStyles.searchInput}
            placeholder="Buscar pedido..."
            placeholderTextColor="#a0a0c0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#a0a0c0" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Contenido principal */}
      <View style={PedidosScreenStyles.mainContent}>
        {activeTab === 'list' ? renderListView() : renderMapView()}
      </View>

      {/* Botón Enrutar flotante */}
      {activeTab === 'list' && displayOrders.length > 0 && (
        <TouchableOpacity 
          style={PedidosScreenStyles.enrutarButton}
          onPress={handleEnrutar}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={PedidosScreenStyles.enrutarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialIcons name="route" size={24} color="#FFFFFF" />
            <Text style={PedidosScreenStyles.enrutarText}>OPTIMIZAR RUTA</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Bottom Bar personalizado */}
      {renderBottomBar()}

      {/* Modal de detalles */}
      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default PedidosScreen;