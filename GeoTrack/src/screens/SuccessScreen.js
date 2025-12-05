import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';

// Componentes
import SuccessIcon from '../components/success/SuccessIcon';
import InfoCard from '../components/success/InfoCard';
import CompletionBanner from '../components/success/CompletionBanner';
import ActionButton from '../components/success/ActionButton';
import AdditionalInfo from '../components/success/AdditionalInfo';
import ScanAgainButton from '../components/success/ScanAgainButton';

const { width, height } = Dimensions.get('window');

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  console.log('SuccessScreen - Datos recibidos:', route.params);
  
  const { 
    nombre = 'Cliente no especificado', 
    cel = 'Teléfono no especificado', 
    dir = 'Dirección no especificada', 
    distrito = 'Distrito no especificado', 
    productos = ['Producto no especificado'],
    scanType = 'qr',
    scanDate = new Date().toISOString()
  } = route.params || {};
  
  const generateOrderNumber = () => {
    const now = new Date();
    const dateStr = now.getFullYear() + 
                   String(now.getMonth() + 1).padStart(2, '0') + 
                   String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + 
                    String(now.getMinutes()).padStart(2, '0') + 
                    String(now.getSeconds()).padStart(2, '0');
    return `PEDIDO-${dateStr}-${timeStr}`;
  };
  
  const orderNumber = generateOrderNumber();
  
  const productosArray = Array.isArray(productos) ? productos : 
                        (typeof productos === 'string' ? [productos] : ['Producto no especificado']);
  
  const newOrderData = {
    numeroPedido: orderNumber,
    cliente: nombre,
    informacionContacto: {
      direccion: dir,
      telefono: cel
    },
    distrito: distrito,
    productos: productosArray,
    fechaEscaneo: scanDate,
    tipoEscaneo: scanType
  };

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  useEffect(() => {
    console.log('Orden creada con datos del QR:', newOrderData);
    
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

  const handleAccept = () => navigation.navigate('Pedidos');
  const handleGoHome = () => navigation.navigate('Home');

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
              
              <SuccessIcon scaleAnim={scaleAnim} fadeAnim={fadeAnim} />
              
              <InfoCard 
                orderNumber={orderNumber}
                nombre={nombre}
                cel={cel}
                dir={dir}
                distrito={distrito}
                productosArray={productosArray}
              />
              
              <CompletionBanner />
            </LinearGradient>
          </Animated.View>

          <View style={styles.buttonsContainer}>
            <ActionButton
              onPress={handleAccept}
              icon="save"
              text="FINALIZAR Y GUARDAR"
              colors={['#5CE1E6', '#00adb5']}
            />

            <ActionButton
              onPress={handleGoHome}
              icon="home"
              text="VOLVER AL INICIO"
              colors={['#9575CD', '#7E57C2']}
            />

            <ActionButton
              onPress={() => navigation.navigate('ScanPhase1')}
              icon="qr-code-scanner"
              text="ESCANEAR OTRO CÓDIGO"
              colors={['#FF9800', '#F57C00']}
            />
          </View>

          <AdditionalInfo dir={dir} cel={cel} />

          <ScanAgainButton onPress={() => navigation.navigate('ScanPhase1')} />
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
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
};

export default SuccessScreen;