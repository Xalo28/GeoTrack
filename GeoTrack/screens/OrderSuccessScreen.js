import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity,
  Alert,
  ScrollView 
} from 'react-native';
import Header from '../components/Header';
import BottomBar from '../components/BottomBar';
import { Ionicons } from '@expo/vector-icons';

const OrderSuccessScreen = ({ navigation, route }) => {
  const { orderData } = route.params || {};

  const handleAccept = () => {
    // Volver a la pantalla principal
    navigation.navigate('Home');
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "CANCELAR", style: "cancel" },
        { 
          text: "SÍ", 
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleScanPress = () => navigation.navigate('ScanPhase1');
  const handleAddPress = () => navigation.navigate('ManualOrder');
  const handleMenuPress = () => console.log('Menu pressed');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header 
        navigation={navigation}
        onBackPress={handleLogout}
        title="INICIO"
        subtitle="Juanito Lopez"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta de Estadísticas */}
        <View style={styles.statsCard}>
          {/* Sección de Ruta Actual */}
          <View style={styles.routeSection}>
            <Text style={styles.routeLabel}>RUTA ACTUAL</Text>
            <View style={styles.routeInfo}>
              <View style={styles.truckIconContainer}>
                <Text style={styles.truckEmoji}>🚛</Text>
              </View>
              <Text style={styles.routeText}>SAN JUAN DE LURIGANCHO → TASAYCO → SANTIAGO DE SURCO</Text>
            </View>
          </View>
          
          {/* Estadísticas */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>41</Text>
              <Text style={styles.statLabel}>Entregados</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>21</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>62</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Sección de Éxito */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>INGRESO DE PEDIDO</Text>
          <Text style={styles.successSubtitle}>EXITOSO</Text>
        </View>

        {/* Tarjeta de Confirmación */}
        <View style={styles.orderCard}>
          <View style={styles.orderContent}>
            {orderData && (
              <>
                <Text style={styles.clientName}>{orderData.clientName}</Text>
                <Text style={styles.orderCode}>Código: {orderData.orderId}</Text>
                <Text style={styles.orderAddress}>Dirección: {orderData.address}</Text>
                <Text style={styles.orderDistrict}>Distrito: {orderData.district}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.acceptButton} 
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>ACEPTAR</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Espacio extra para el scroll
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkmark: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 3,
  },
  successSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  routeSection: {
    backgroundColor: '#5CE1E6',
    padding: 15,
    alignItems: 'center',
  },
  routeLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 10,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  truckIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  truckEmoji: {
    fontSize: 20,
  },
  routeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 20,
    marginHorizontal: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#5CE1E6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderContent: {
    padding: 15,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  orderCode: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  orderDistrict: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  controls: {
    padding: 25,
    backgroundColor: 'transparent',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrderSuccessScreen;

