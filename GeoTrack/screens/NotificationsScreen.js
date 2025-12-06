import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useCustomerInfo } from '../lib/payments';

const NotificationsScreen = ({ navigation }) => {
  const { customerInfo, isLoading } = useCustomerInfo();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const hasActiveSubscription = Object.keys(customerInfo?.entitlements.active || {}).length > 0;

  const ToggleItem = ({ title, value, onValueChange }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#5CE1E6" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="NOTIFICACIONES" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5CE1E6" />
          <Text style={styles.loadingText}>Verificando suscripción...</Text>
        </View>
      </View>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="NOTIFICACIONES" showBack={true} />
        <View style={styles.premiumContainer}>
          <View style={styles.premiumIconContainer}>
            <Ionicons name="notifications" size={64} color="#5CE1E6" />
            <View style={styles.lockBadge}>
              <Ionicons name="lock-closed" size={24} color="#FFF" />
            </View>
          </View>
          <Text style={styles.premiumTitle}>Notificaciones Premium</Text>
          <Text style={styles.premiumDescription}>
            Las notificaciones avanzadas son una función exclusiva para miembros premium.
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Notificaciones personalizadas</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Alertas en tiempo real</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={24} color="#5CE1E6" />
              <Text style={styles.featureText}>Configuración avanzada</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('Packages')}
          >
            <Ionicons name="star" size={20} color="#FFF" />
            <Text style={styles.upgradeButtonText}>Actualizar a Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="NOTIFICACIONES" showBack={true} />
      
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Preferencias de Alertas</Text>
        
        <ToggleItem 
          title="Notificaciones Push" 
          value={pushEnabled} 
          onValueChange={setPushEnabled} 
        />
        <ToggleItem 
          title="Alertas por Correo" 
          value={emailEnabled} 
          onValueChange={setEmailEnabled} 
        />
        <ToggleItem 
          title="Alertas SMS (Urgentes)" 
          value={smsEnabled} 
          onValueChange={setSmsEnabled} 
        />
        
        <Text style={styles.infoText}>
          Recibirás notificaciones sobre nuevos pedidos asignados y cambios en tus rutas activas.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  premiumContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  premiumIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    backgroundColor: '#5CE1E620',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  premiumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  premiumDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 10,
    color: '#666',
  },
  featuresList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    color: '#333',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#5CE1E6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FFF',
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  itemText: { fontSize: 16, color: '#333' },
  infoText: { marginTop: 20, color: '#888', fontSize: 14, lineHeight: 20 }
});

export default NotificationsScreen;