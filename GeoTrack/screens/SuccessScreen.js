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
import styles from '../styles/SuccessScreenStyles';

const { width, height } = Dimensions.get('window');

const SuccessScreen = ({ navigation, route }) => {
  const { addOrder } = useOrders();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Datos del escáner - usando el dato real de la imagen
  const scannedData = route?.params?.scannedData || 'exp://192.168.1.46:8081';
  
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
    // Animación de pulso continuo
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

    // Animaciones de entrada
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

    // Guardar automáticamente el pedido
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
      {/* Fondo gradiente igual que ScanPhase2 */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      {/* Header personalizado - igual que ScanPhase2 */}
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

      {/* Fecha - mismo estilo */}
      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {/* Instrucción - en lugar de mensaje */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Código procesado correctamente
        </Text>
      </View>

      {/* ScrollView para hacer la pantalla desplazable */}
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
          {/* Área principal con gradiente similar a ScanPhase2 */}
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
              
              {/* Ícono de éxito */}
              <SuccessIcon />
              
              {/* Tarjeta de información */}
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

                {/* Información adicional */}
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

              {/* Indicador de éxito */}
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

          {/* Botones con gradientes similares */}
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

          {/* Información adicional */}
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

          {/* Opción para escanear otro */}
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

export default SuccessScreen;