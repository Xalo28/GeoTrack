import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';
const { width, height } = Dimensions.get('window');

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const scannedData = route?.params?.scannedData || 'PEDIDO-XXXXX-XXXXX';
  
  const newOrderData = {
    numeroPedido: scannedData,
    cliente: "Cliente Escaneado",
    informacionContacto: {
      direccion: 'Dirección detectada por GPS',
      telefono: '999-888-777'
    },
    distrito: 'San Isidro',
    productos: ['Caja Registrada', 'Documentos']
  };

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    addOrder(newOrderData);
  }, []);

  const handleAccept = () => {
    navigation.navigate('Pedidos');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const SuccessIcon = () => (
    <Animated.View 
      style={[
        styles.successIconContainer,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim
        }
      ]}
    >
      <LinearGradient
        colors={['#4ECB71', '#2E7D32']}
        style={styles.successCircle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialIcons name="check" size={60} color="#FFFFFF" />
      </LinearGradient>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>EXITO</Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <View style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Código procesado correctamente
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <Animated.View 
          style={[
            styles.successContent,
            { opacity: fadeAnim }
          ]}
        >
          <Animated.View 
            style={[
              styles.successArea,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={['rgba(76, 203, 113, 0.1)', 'rgba(76, 203, 113, 0.05)']}
              style={styles.successAreaGradient}
            >
              <Text style={styles.successTitle}>PEDIDO REGISTRADO</Text>
              
              <SuccessIcon />
              
              <View style={styles.infoCard}>
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Código Detectado:</Text>
                  <Text style={styles.value}>{scannedData}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Cliente:</Text>
                  <Text style={styles.value}>{newOrderData.cliente}</Text>
                </View>

                <View style={styles.divider} />
                
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Distrito:</Text>
                  <Text style={styles.value}>{newOrderData.distrito}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.infoSection}>
                  <Text style={styles.label}>Productos:</Text>
                  <Text style={styles.productsValue}>
                    {newOrderData.productos.join(', ')}
                  </Text>
                </View>
              </View>

              <View style={styles.completionContainer}>
                <MaterialIcons 
                  name="verified" 
                  size={30} 
                  color="#4ECB71" 
                  style={styles.verifiedIcon}
                />
                <Text style={styles.completionText}>
                  ¡PROCESO COMPLETADO CON ÉXITO!
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAccept}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#5CE1E6', '#00adb5']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="save" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>FINALIZAR Y GUARDAR</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.homeButton]}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#9575CD', '#7E57C2']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="home" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>VOLVER AL INICIO</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.scanAnotherButton]}
              onPress={() => navigation.navigate('ScanPhase1')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF9800', '#F57C00']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialIcons name="qr-code-scanner" size={24} color="#FFFFFF" />
                <Text style={styles.buttonText}>ESCANEAR OTRO CÓDIGO</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.additionalInfo}>
            <Text style={styles.additionalInfoTitle}>DETALLES ADICIONALES</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <MaterialIcons name="access-time" size={20} color="#5CE1E6" />
                <Text style={styles.detailLabel}>Hora de registro:</Text>
                <Text style={styles.detailValue}>
                  {new Date().toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="location-on" size={20} color="#5CE1E6" />
                <Text style={styles.detailLabel}>Dirección:</Text>
                <Text style={styles.detailValue}>
                  {newOrderData.informacionContacto.direccion}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialIcons name="phone" size={20} color="#5CE1E6" />
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>
                  {newOrderData.informacionContacto.telefono}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.scanAgainContainer}
            onPress={() => navigation.navigate('ScanPhase1')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="refresh" size={18} color="#5CE1E6" />
            <Text style={styles.scanAgainText}>¿Necesitas escanear más códigos? </Text>
            <Text style={styles.scanAgainLink}>Comenzar nuevo escaneo</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    alignItems: 'flex-start',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  instructionContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  successContent: {
    flex: 1,
  },
  successArea: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  successAreaGradient: {
    padding: 20,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  successIconContainer: {
    marginBottom: 25,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoSection: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  productsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CE1E6',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 203, 113, 0.2)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 203, 113, 0.4)',
  },
  verifiedIcon: {
    marginRight: 10,
  },
  completionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4ECB71',
    letterSpacing: 1,
    flex: 1,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  homeButton: {},
  scanAnotherButton: {},
  additionalInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  additionalInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#a0a0c0',
    marginLeft: 8,
    marginRight: 10,
    width: 100,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  scanAgainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  scanAgainText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 8,
  },
  scanAgainLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
    textDecorationLine: 'underline',
  },
};

export default SuccessScreen;