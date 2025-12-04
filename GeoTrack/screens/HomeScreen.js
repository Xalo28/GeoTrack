import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOrders } from '../context/OrdersContext';
import Svg, { Circle } from 'react-native-svg';
import HomeScreenStyles from '../styles/HomeScreenStyles'; // Importa los estilos

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { orders, hasOrders, stats } = useOrders();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'pending', 'delivered'
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Calcular estadísticas generales
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.estado === 'Entregado').length;
  const pendingOrders = totalOrders - deliveredOrders;
  const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // 1. Lógica para agrupar pedidos por distrito
  const groupedOrders = orders.reduce((groups, order) => {
    const district = order.distrito || 'SIN DISTRITO';
    if (!groups[district]) {
      groups[district] = {
        name: district,
        pending: 0,
        delivered: 0,
        orders: [],
        progress: 0
      };
    }
    
    // Contar estados
    if (order.estado === 'Entregado') {
      groups[district].delivered += 1;
    } else {
      groups[district].pending += 1;
    }
    
    groups[district].orders.push(order);
    
    // Calcular progreso del distrito
    const totalDistrictOrders = groups[district].delivered + groups[district].pending;
    groups[district].progress = totalDistrictOrders > 0 
      ? Math.round((groups[district].delivered / totalDistrictOrders) * 100) 
      : 0;
    
    return groups;
  }, {});

  // Filtrar distritos según filtro activo
  let filteredDistricts = Object.values(groupedOrders);
  if (activeFilter === 'pending') {
    filteredDistricts = filteredDistricts.filter(district => district.pending > 0);
  } else if (activeFilter === 'delivered') {
    filteredDistricts = filteredDistricts.filter(district => district.delivered > 0);
  }

  // Ordenar por progreso (menor a mayor) o alfabéticamente
  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    if (activeFilter === 'pending') {
      return b.pending - a.pending;
    }
    return b.progress - a.progress;
  });

  useEffect(() => {
    // Animaciones al cargar
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      )
    ]).start();
  }, []);

  const handleDistrictPress = (districtData) => {
    navigation.navigate('Pedidos', { 
      districtFilter: districtData.name,
      districtOrders: districtData.orders 
    });
  };

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => navigation.navigate('Menu');
  const handleProfilePress = () => navigation.navigate('Profile');

  // Fecha actual formateada
  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  // Renderizar tarjeta de distrito
  const renderDistrictCard = (district, index) => {
    const totalDistrictOrders = district.delivered + district.pending;
    
    return (
      <Animated.View 
        key={index}
        style={[
          HomeScreenStyles.districtCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: pulseAnim }
            ]
          }
        ]}
      >
        <TouchableOpacity 
          style={HomeScreenStyles.districtCardContent}
          onPress={() => handleDistrictPress(district)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.1)', 'rgba(0, 173, 181, 0.05)']}
            style={HomeScreenStyles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={HomeScreenStyles.cardHeader}>
              <View style={HomeScreenStyles.districtIcon}>
                <MaterialIcons name="location-on" size={24} color="#5CE1E6" />
              </View>
              <Text style={HomeScreenStyles.districtName}>{district.name}</Text>
              <View style={HomeScreenStyles.statusBadge}>
                <Text style={[
                  HomeScreenStyles.statusText,
                  { color: district.pending > 0 ? '#FF6B6B' : '#4ECB71' }
                ]}>
                  {district.pending > 0 ? 'PENDIENTE' : 'COMPLETADO'}
                </Text>
              </View>
            </View>

            <View style={HomeScreenStyles.statsContainer}>
              <View style={HomeScreenStyles.statItem}>
                <View style={HomeScreenStyles.statIcon}>
                  <MaterialIcons name="check-circle" size={20} color="#4ECB71" />
                </View>
                <Text style={HomeScreenStyles.statLabel}>Entregados</Text>
                <Text style={[HomeScreenStyles.statValue, HomeScreenStyles.deliveredText]}>{district.delivered}</Text>
              </View>
              
              <View style={HomeScreenStyles.statDivider} />
              
              <View style={HomeScreenStyles.statItem}>
                <View style={HomeScreenStyles.statIcon}>
                  <MaterialIcons name="pending" size={20} color="#FFA726" />
                </View>
                <Text style={HomeScreenStyles.statLabel}>Pendientes</Text>
                <Text style={[HomeScreenStyles.statValue, HomeScreenStyles.pendingText]}>{district.pending}</Text>
              </View>
              
              <View style={HomeScreenStyles.statDivider} />
              
              <View style={HomeScreenStyles.statItem}>
                <View style={HomeScreenStyles.statIcon}>
                  <MaterialIcons name="assessment" size={20} color="#5CE1E6" />
                </View>
                <Text style={HomeScreenStyles.statLabel}>Progreso</Text>
                <Text style={[HomeScreenStyles.statValue, HomeScreenStyles.progressText]}>{district.progress}%</Text>
              </View>
            </View>

            {/* Barra de progreso */}
            <View style={HomeScreenStyles.progressContainer}>
              <View style={HomeScreenStyles.progressBackground}>
                <View 
                  style={[
                    HomeScreenStyles.progressFill,
                    { 
                      width: `${district.progress}%`,
                      backgroundColor: district.progress === 100 ? '#4ECB71' : 
                                      district.progress >= 50 ? '#5CE1E6' : '#FFA726'
                    }
                  ]}
                />
              </View>
              <Text style={HomeScreenStyles.progressLabel}>
                {district.progress === 100 ? '✅ Ruta completada' : 
                 district.progress >= 50 ? '⏳ En progreso' : '🚀 Por comenzar'}
              </Text>
            </View>

            <TouchableOpacity 
              style={HomeScreenStyles.viewDetailsButton}
              onPress={() => handleDistrictPress(district)}
              activeOpacity={0.8}
            >
              <Text style={HomeScreenStyles.viewDetailsText}>VER DETALLES DE LA RUTA</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={HomeScreenStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={HomeScreenStyles.backgroundGradient}
      />
      
      {/* Elementos decorativos */}
      <Svg height={height} width={width} style={HomeScreenStyles.decorativeCircles}>
        <Circle cx={width * 0.2} cy={height * 0.1} r={150} fill="rgba(92, 225, 230, 0.03)" />
        <Circle cx={width * 0.8} cy={height * 0.8} r={100} fill="rgba(0, 173, 181, 0.04)" />
        <Circle cx={width * 0.4} cy={height * 0.9} r={120} fill="rgba(92, 225, 230, 0.02)" />
      </Svg>

      {/* Header personalizado */}
      <View style={HomeScreenStyles.customHeader}>
        <TouchableOpacity style={HomeScreenStyles.profileButton} onPress={handleProfilePress}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={HomeScreenStyles.profileCircle}
          >
            <Text style={HomeScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={HomeScreenStyles.headerCenter}>
          <Text style={HomeScreenStyles.headerTitle}>RUTAS</Text>
          <Text style={HomeScreenStyles.headerSubtitle}>Juanito Lopez</Text>
        </View>
        
        <TouchableOpacity style={HomeScreenStyles.menuButton} onPress={handleMenuPress}>
          <MaterialIcons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={HomeScreenStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={HomeScreenStyles.scrollContent}
      >
        {/* Fecha actual */}
        <View style={HomeScreenStyles.dateContainer}>
          <MaterialIcons name="calendar-today" size={20} color="#5CE1E6" />
          <Text style={HomeScreenStyles.dateText}>{formattedDate}</Text>
        </View>

        {/* Logo SAVA moderno */}
        <View style={HomeScreenStyles.logoContainer}>
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
            style={HomeScreenStyles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="shipping-fast" size={40} color="#5CE1E6" />
            <Text style={HomeScreenStyles.logoText}>SAVA LOGÍSTICA</Text>
            <Text style={HomeScreenStyles.logoSubtext}>Gestión Inteligente</Text>
          </LinearGradient>
        </View>

        {/* Panel de estadísticas */}
        <Animated.View 
          style={[
            HomeScreenStyles.statsPanel,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={HomeScreenStyles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={HomeScreenStyles.statsTitle}>RESUMEN DEL DÍA</Text>
            
            <View style={HomeScreenStyles.statsGrid}>
              <View style={HomeScreenStyles.statCard}>
                <View style={[HomeScreenStyles.statCircle, HomeScreenStyles.totalCircle]}>
                  <MaterialIcons name="list-alt" size={24} color="#5CE1E6" />
                </View>
                <Text style={HomeScreenStyles.statNumber}>{totalOrders}</Text>
                <Text style={HomeScreenStyles.statLabelCard}>Total Pedidos</Text>
              </View>
              
              <View style={HomeScreenStyles.statCard}>
                <View style={[HomeScreenStyles.statCircle, HomeScreenStyles.deliveredCircle]}>
                  <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
                </View>
                <Text style={HomeScreenStyles.statNumber}>{deliveredOrders}</Text>
                <Text style={HomeScreenStyles.statLabelCard}>Entregados</Text>
              </View>
              
              <View style={HomeScreenStyles.statCard}>
                <View style={[HomeScreenStyles.statCircle, HomeScreenStyles.pendingCircle]}>
                  <MaterialIcons name="pending" size={24} color="#FFA726" />
                </View>
                <Text style={HomeScreenStyles.statNumber}>{pendingOrders}</Text>
                <Text style={HomeScreenStyles.statLabelCard}>Pendientes</Text>
              </View>
              
              <View style={HomeScreenStyles.statCard}>
                <View style={[HomeScreenStyles.statCircle, HomeScreenStyles.progressCircle]}>
                  <MaterialIcons name="trending-up" size={24} color="#9C27B0" />
                </View>
                <Text style={HomeScreenStyles.statNumber}>{completionRate}%</Text>
                <Text style={HomeScreenStyles.statLabelCard}>Progreso</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Filtros */}
        <View style={HomeScreenStyles.filterContainer}>
          <Text style={HomeScreenStyles.sectionTitle}>FILTRAR RUTAS</Text>
          <View style={HomeScreenStyles.filterButtons}>
            <TouchableOpacity 
              style={[
                HomeScreenStyles.filterButton, 
                activeFilter === 'all' && HomeScreenStyles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[
                HomeScreenStyles.filterButtonText,
                activeFilter === 'all' && HomeScreenStyles.filterButtonTextActive
              ]}>TODAS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                HomeScreenStyles.filterButton, 
                activeFilter === 'pending' && HomeScreenStyles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('pending')}
            >
              <View style={HomeScreenStyles.filterBadge}>
                <Text style={HomeScreenStyles.badgeCount}>{pendingOrders}</Text>
              </View>
              <Text style={[
                HomeScreenStyles.filterButtonText,
                activeFilter === 'pending' && HomeScreenStyles.filterButtonTextActive
              ]}>PENDIENTES</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                HomeScreenStyles.filterButton, 
                activeFilter === 'delivered' && HomeScreenStyles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('delivered')}
            >
              <Text style={[
                HomeScreenStyles.filterButtonText,
                activeFilter === 'delivered' && HomeScreenStyles.filterButtonTextActive
              ]}>ENTREGADAS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de distritos/rutas */}
        <View style={HomeScreenStyles.districtsSection}>
          <View style={HomeScreenStyles.sectionHeader}>
            <Text style={HomeScreenStyles.sectionTitle}>RUTAS POR DISTRITO</Text>
            <Text style={HomeScreenStyles.sectionCount}>{sortedDistricts.length} {sortedDistricts.length === 1 ? 'RUTA' : 'RUTAS'}</Text>
          </View>
          
          {!hasOrders || sortedDistricts.length === 0 ? (
            // Vista vacía
            <View style={HomeScreenStyles.emptyState}>
              <MaterialIcons name="map" size={80} color="rgba(255, 255, 255, 0.3)" />
              <Text style={HomeScreenStyles.emptyTitle}>No hay rutas {activeFilter !== 'all' ? activeFilter : ''}</Text>
              <Text style={HomeScreenStyles.emptySubtitle}>
                {activeFilter === 'all' 
                  ? 'Comienza agregando nuevos pedidos' 
                  : `No hay rutas ${activeFilter === 'pending' ? 'pendientes' : 'entregadas'}`}
              </Text>
              <TouchableOpacity 
                style={HomeScreenStyles.addRouteButton}
                onPress={handleAddPress}
              >
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
                <Text style={HomeScreenStyles.addRouteText}>CREAR NUEVA RUTA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Lista de distritos
            <View style={HomeScreenStyles.districtsList}>
              {sortedDistricts.map((district, index) => renderDistrictCard(district, index))}
            </View>
          )}
        </View>
        
        {/* Espacio para el bottom bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar personalizada */}
      <View style={HomeScreenStyles.bottomBar}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(26, 26, 46, 0.98)']}
          style={HomeScreenStyles.bottomBarGradient}
        >
          <View style={HomeScreenStyles.bottomBarContent}>
            <TouchableOpacity style={HomeScreenStyles.bottomBarButton} onPress={handleScanPress}>
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={HomeScreenStyles.scanButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
                <Text style={HomeScreenStyles.scanButtonText}>ESCANEAR</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={HomeScreenStyles.bottomBarButton} onPress={handleAddPress}>
              <View style={HomeScreenStyles.addButton}>
                <MaterialIcons name="add-circle" size={24} color="#5CE1E6" />
                <Text style={HomeScreenStyles.bottomBarButtonText}>AGREGAR</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={HomeScreenStyles.bottomBarButton} onPress={() => {}}>
              <View style={HomeScreenStyles.homeButton}>
                <MaterialIcons name="dashboard" size={24} color="#5CE1E6" />
                <Text style={HomeScreenStyles.bottomBarButtonText}>INICIO</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default HomeScreen;