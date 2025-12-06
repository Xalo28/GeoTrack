import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { useCustomerInfo, usePackages } from '../lib/payments';

const SubscriptionStatus = ({ customerInfo }) => {
  const hasActiveSubscription = Object.keys(customerInfo?.entitlements.active || {}).length > 0;

  return (
    <View style={styles.statusContainer}>
      <View style={[styles.statusCard, hasActiveSubscription ? styles.statusCardActive : styles.statusCardInactive]}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIconContainer, hasActiveSubscription ? styles.statusIconActive : styles.statusIconInactive]}>
            <Ionicons
              name={hasActiveSubscription ? "checkmark-circle" : "alert-circle"}
              size={28}
              color="#FFF"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>
              {hasActiveSubscription ? "Suscripción Activa" : "Sin Suscripción"}
            </Text>
            <Text style={styles.statusDescription}>
              {hasActiveSubscription
                ? "Disfruta de todos los beneficios premium"
                : "Suscríbete para acceder a contenido exclusivo"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const PackagesScreen = ({ navigation }) => {
  const { packages, purchase, isLoading, isPurchasing } = usePackages();
  const { customerInfo, isLoading: isLoadingCustomer } = useCustomerInfo();
  const [purchasingPackageId, setPurchasingPackageId] = useState(null);

  const handlePurchase = async (pkg) => {
    setPurchasingPackageId(pkg.identifier);
    const result = await purchase(pkg);
    setPurchasingPackageId(null);

    if (result.success) {
      Alert.alert(
        "¡Compra exitosa!",
        `Has adquirido ${pkg.rcBillingProduct?.title || 'el paquete'}. Ya puedes disfrutar de todos los beneficios premium.`,
        [{ text: "Continuar", style: "default" }]
      );
    } else if (result.cancelled) {
      console.log("Purchase cancelled by user");
    } else {
      Alert.alert(
        "Error en la compra",
        result.error || "No se pudo completar la compra. Por favor, intenta nuevamente.",
        [{ text: "Entendido", style: "default" }]
      );
    }
  };

  const getPackageIcon = (title) => {
    const lowerTitle = (title || '').toLowerCase();
    if (lowerTitle.includes('month') || lowerTitle.includes('mes')) return 'calendar-outline';
    if (lowerTitle.includes('year') || lowerTitle.includes('año')) return 'calendar';
    if (lowerTitle.includes('week') || lowerTitle.includes('semana')) return 'time-outline';
    return 'gift-outline';
  };

  if (isLoading || isLoadingCustomer) {
    return (
      <View style={styles.container}>
        <Header navigation={navigation} title="PAQUETES" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5CE1E6" />
          <Text style={styles.loadingText}>Cargando planes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="PAQUETES" showBack={true} />
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Planes Premium</Text>
          <Text style={styles.headerSubtitle}>
            Elige el plan perfecto para ti y disfruta de contenido exclusivo
          </Text>
        </View>

        <SubscriptionStatus customerInfo={customerInfo} />

        <View style={styles.packagesContainer}>
          {packages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="cube-outline" size={40} color="#5CE1E6" />
              </View>
              <Text style={styles.emptyStateTitle}>No hay planes disponibles</Text>
              <Text style={styles.emptyStateText}>
                Los planes de suscripción aparecerán aquí cuando estén disponibles
              </Text>
            </View>
          ) : (
            packages.map((pkg, index) => {
              const iconName = getPackageIcon(pkg.rcBillingProduct?.title);
              const isPurchasing = purchasingPackageId === pkg.identifier;

              return (
                <View key={pkg.identifier} style={styles.packageCard}>
                  <View style={styles.packageHeader}>
                    <View style={styles.packageIconContainer}>
                      <Ionicons name={iconName} size={32} color="#FFF" />
                    </View>
                    <View style={styles.packageTitleContainer}>
                      <Text style={styles.packageTitle}>
                        {pkg.rcBillingProduct?.title || 'Plan Premium'}
                      </Text>
                      <Text style={styles.packageSubtitle}>
                        {pkg.rcBillingProduct?.description || 'Plan de suscripción'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.packagePriceContainer}>
                    <Text style={styles.packagePrice}>
                      {pkg.rcBillingProduct?.price?.formattedPrice || 'N/A'}
                    </Text>
                    <Text style={styles.packagePeriod}>
                      por {pkg.rcBillingProduct?.subscriptionPeriod || 'periodo'}
                    </Text>
                  </View>

                  <View style={styles.packageFeatures}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.featureText}>Acceso a funcionalidades premium</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.featureText}>Notificaciones avanzadas</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                      <Text style={styles.featureText}>Soporte prioritario</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.purchaseButton,
                      isPurchasing && styles.purchaseButtonDisabled
                    ]}
                    onPress={() => handlePurchase(pkg)}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator color="#5CE1E6" size="small" />
                    ) : (
                      <Text style={styles.purchaseButtonText}>
                        Suscribirse Ahora
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statusContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusCardActive: {
    backgroundColor: '#5CE1E615',
    borderWidth: 2,
    borderColor: '#5CE1E6',
  },
  statusCardInactive: {
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#DDD',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIconActive: {
    backgroundColor: '#5CE1E6',
  },
  statusIconInactive: {
    backgroundColor: '#999',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  packagesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  packageCard: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#5CE1E6',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  packageIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  packageTitleContainer: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  packageSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  packagePriceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  packagePrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  packagePeriod: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  packageFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    marginLeft: 10,
    flex: 1,
  },
  purchaseButton: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5CE1E6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default PackagesScreen;

