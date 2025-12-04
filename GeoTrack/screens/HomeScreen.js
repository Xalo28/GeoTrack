import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  Animated, 
  Dimensions,
 
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';
import { useOrders } from '../context/OrdersContext';
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

  useEffect(() => {
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

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const renderDistrictCard = (district, index) => {
    const totalDistrictOrders = district.delivered + district.pending;
    
    return (
      <Animated.View 
        key={index}
        style={[
          styles.districtCard,
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
          style={styles.districtCardContent}
          onPress={() => handleDistrictPress(district)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.1)', 'rgba(0, 173, 181, 0.05)']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.districtIcon}>
                <MaterialIcons name="location-on" size={24} color="#5CE1E6" />
              </View>
              <Text style={styles.districtName}>{district.name}</Text>
              <View style={styles.statusBadge}>
                <Text style={[
                  styles.statusText,
                  { color: district.pending > 0 ? '#FF6B6B' : '#4ECB71' }
                ]}>
                  {district.pending > 0 ? 'PENDIENTE' : 'COMPLETADO'}
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons name="check-circle" size={20} color="#4ECB71" />
                </View>
                <Text style={styles.statLabel}>Entregados</Text>
                <Text style={[styles.statValue, styles.deliveredText]}>{district.delivered}</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons name="pending" size={20} color="#FFA726" />
                </View>
                <Text style={styles.statLabel}>Pendientes</Text>
                <Text style={[styles.statValue, styles.pendingText]}>{district.pending}</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons name="assessment" size={20} color="#5CE1E6" />
                </View>
                <Text style={styles.statLabel}>Progreso</Text>
                <Text style={[styles.statValue, styles.progressText]}>{district.progress}%</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${district.progress}%`,
                      backgroundColor: district.progress === 100 ? '#4ECB71' : 
                                      district.progress >= 50 ? '#5CE1E6' : '#FFA726'
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressLabel}>
                {district.progress === 100 ? '✅ Ruta completada' : 
                 district.progress >= 50 ? '⏳ En progreso' : '🚀 Por comenzar'}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewDetailsButton}
              onPress={() => handleDistrictPress(district)}
              activeOpacity={0.8}
            >
              <Text style={styles.viewDetailsText}>VER DETALLES DE LA RUTA</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>RUTAS</Text>
          <Text style={styles.headerSubtitle}>Juanito Lopez</Text>
        </View>
        
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <MaterialIcons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.dateContainer}>
          <MaterialIcons name="calendar-today" size={20} color="#5CE1E6" />
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.2)', 'rgba(0, 173, 181, 0.1)']}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="shipping-fast" size={40} color="#5CE1E6" />
            <Text style={styles.logoText}>SAVA LOGÍSTICA</Text>
            <Text style={styles.logoSubtext}>Gestión Inteligente</Text>
          </LinearGradient>
        </View>

        <Animated.View 
          style={[
            styles.statsPanel,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statsTitle}>RESUMEN DEL DÍA</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={[styles.statCircle, styles.totalCircle]}>
                  <MaterialIcons name="list-alt" size={24} color="#5CE1E6" />
                </View>
                <Text style={styles.statNumber}>{totalOrders}</Text>
                <Text style={styles.statLabelCard}>Total Pedidos</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statCircle, styles.deliveredCircle]}>
                  <MaterialIcons name="check-circle" size={24} color="#4ECB71" />
                </View>
                <Text style={styles.statNumber}>{deliveredOrders}</Text>
                <Text style={styles.statLabelCard}>Entregados</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statCircle, styles.pendingCircle]}>
                  <MaterialIcons name="pending" size={24} color="#FFA726" />
                </View>
                <Text style={styles.statNumber}>{pendingOrders}</Text>
                <Text style={styles.statLabelCard}>Pendientes</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statCircle, styles.progressCircle]}>
                  <MaterialIcons name="trending-up" size={24} color="#9C27B0" />
                </View>
                <Text style={styles.statNumber}>{completionRate}%</Text>
                <Text style={styles.statLabelCard}>Progreso</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>FILTRAR RUTAS</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                activeFilter === 'all' && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === 'all' && styles.filterButtonTextActive
              ]}>TODAS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                activeFilter === 'pending' && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('pending')}
            >
              <View style={styles.filterBadge}>
                <Text style={styles.badgeCount}>{pendingOrders}</Text>
              </View>
              <Text style={[
                styles.filterButtonText,
                activeFilter === 'pending' && styles.filterButtonTextActive
              ]}>PENDIENTES</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.filterButton, 
                activeFilter === 'delivered' && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter('delivered')}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === 'delivered' && styles.filterButtonTextActive
              ]}>ENTREGADAS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.districtsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RUTAS POR DISTRITO</Text>
            <Text style={styles.sectionCount}>{sortedDistricts.length} {sortedDistricts.length === 1 ? 'RUTA' : 'RUTAS'}</Text>
          </View>
          
          {!hasOrders || sortedDistricts.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="map" size={80} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyTitle}>No hay rutas {activeFilter !== 'all' ? activeFilter : ''}</Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'all' 
                  ? 'Comienza agregando nuevos pedidos' 
                  : `No hay rutas ${activeFilter === 'pending' ? 'pendientes' : 'entregadas'}`}
              </Text>
              <TouchableOpacity 
                style={styles.addRouteButton}
                onPress={handleAddPress}
              >
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.addRouteText}>CREAR NUEVA RUTA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.districtsList}>
              {sortedDistricts.map((district, index) => renderDistrictCard(district, index))}
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <LinearGradient
          colors={['rgba(26, 26, 46, 0.95)', 'rgba(26, 26, 46, 0.98)']}
          style={styles.bottomBarGradient}
        >
          <View style={styles.bottomBarContent}>
            <TouchableOpacity style={styles.bottomBarButton} onPress={handleScanPress}>
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.scanButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="qr-code-scanner" size={28} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>ESCANEAR</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bottomBarButton} onPress={handleAddPress}>
              <View style={styles.addButton}>
                <MaterialIcons name="add-circle" size={24} color="#5CE1E6" />
                <Text style={styles.bottomBarButtonText}>AGREGAR</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bottomBarButton} onPress={() => {}}>
              <View style={styles.homeButton}>
                <MaterialIcons name="dashboard" size={24} color="#5CE1E6" />
                <Text style={styles.bottomBarButtonText}>INICIO</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
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
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  logoGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    letterSpacing: 1,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#a0a0c0',
    marginTop: 5,
  },
  statsPanel: {
    marginBottom: 25,
  },
  statsGradient: {
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalCircle: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
  },
  deliveredCircle: {
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
  },
  pendingCircle: {
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
  },
  progressCircle: {
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabelCard: {
    fontSize: 12,
    color: '#a0a0c0',
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#5CE1E6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#a0a0c0',
  },
  filterButtonTextActive: {
    color: '#1a1a2e',
  },
  filterBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  sectionCount: {
    fontSize: 12,
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  addRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5CE1E6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addRouteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  districtsList: {
    gap: 15,
  },
  districtCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  districtCardContent: {
    flex: 1,
  },
  cardGradient: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  districtIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  districtName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliveredText: {
    color: '#4ECB71',
  },
  pendingText: {
    color: '#FFA726',
  },
  progressText: {
    color: '#5CE1E6',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5CE1E6',
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  bottomBarGradient: {
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  bottomBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarButton: {
    flex: 1,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  addButton: {
    alignItems: 'center',
  },
  homeButton: {
    alignItems: 'center',
  },
  bottomBarButtonText: {
    fontSize: 12,
    color: '#a0a0c0',
    marginTop: 5,
  },
};

export default HomeScreen;