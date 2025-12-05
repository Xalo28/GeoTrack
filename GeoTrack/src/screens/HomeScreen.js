import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  ScrollView, 
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useOrders } from '../context/OrdersContext';
import HomeHeader from '../components/homes/HomeHeader';
import StatsPanel from '../components/homes/StatsPanel';
import DistrictCard from '../components/homes/DistrictCard';
import FilterButtons from '../components/homes/FilterButtons';
import BottomNavBar from '../components/homes/BottomNavBar';
import EmptyState from '../components/homes/EmptyState';
import DateDisplay from '../components/homes/DateDisplay';
import LogoHeader from '../components/homes/LogoHeader';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { orders, hasOrders } = useOrders();
  const [activeFilter, setActiveFilter] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(order => order.estado === 'Entregado').length;
  const pendingOrders = totalOrders - deliveredOrders;
  const completionRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

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
    
    if (order.estado === 'Entregado') {
      groups[district].delivered += 1;
    } else {
      groups[district].pending += 1;
    }
    
    groups[district].orders.push(order);
    
    const totalDistrictOrders = groups[district].delivered + groups[district].pending;
    groups[district].progress = totalDistrictOrders > 0 
      ? Math.round((groups[district].delivered / totalDistrictOrders) * 100) 
      : 0;
    
    return groups;
  }, {});

  let filteredDistricts = Object.values(groupedOrders);
  if (activeFilter === 'pending') {
    filteredDistricts = filteredDistricts.filter(district => district.pending > 0);
  } else if (activeFilter === 'delivered') {
    filteredDistricts = filteredDistricts.filter(district => district.delivered > 0);
  }

  const sortedDistricts = [...filteredDistricts].sort((a, b) => {
    if (activeFilter === 'pending') {
      return b.pending - a.pending;
    }
    return b.progress - a.progress;
  });

  // useEffect CORREGIDO - Versión segura sin useNativeDriver
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false, // Desactivado para evitar errores
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false, // Desactivado para evitar errores
      }),
    ]).start(() => {
      // Iniciar la animación de pulso después de que terminen las otras
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: false, // Desactivado para evitar errores
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false, // Desactivado para evitar errores
          }),
        ])
      ).start();
    });
  }, []);

  const handleDistrictPress = (districtData) => {
    navigation.navigate('Pedidos', { 
      districtFilter: districtData.name,
    });
  };

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => navigation.navigate('Menu');
  const handleProfilePress = () => navigation.navigate('Profile');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <HomeHeader 
        onProfilePress={handleProfilePress}
        onMenuPress={handleMenuPress}
        userName="Juanito Lopez"
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DateDisplay />
        <LogoHeader />

        <StatsPanel 
          totalOrders={totalOrders}
          deliveredOrders={deliveredOrders}
          pendingOrders={pendingOrders}
          completionRate={completionRate}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        <FilterButtons 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          pendingOrders={pendingOrders}
        />

        <View style={styles.districtsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RUTAS POR DISTRITO</Text>
            <Text style={styles.sectionCount}>
              {sortedDistricts.length} {sortedDistricts.length === 1 ? 'RUTA' : 'RUTAS'}
            </Text>
          </View>
          
          {!hasOrders || sortedDistricts.length === 0 ? (
            <EmptyState 
              activeFilter={activeFilter}
              onAddPress={handleAddPress}
            />
          ) : (
            <View style={styles.districtsList}>
              {sortedDistricts.map((district, index) => (
                <DistrictCard
                  key={index}
                  district={district}
                  onPress={handleDistrictPress}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                  pulseAnim={pulseAnim}
                />
              ))}
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar 
        onScanPress={handleScanPress}
        onAddPress={handleAddPress}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  districtsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionCount: {
    fontSize: 12,
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  districtsList: {
    gap: 15,
  },
};

export default HomeScreen;