import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OrdersProvider } from './context/OrdersContext';

// Payments Context
import { PaymentsContext } from './hooks/usePaymentsConfig';
import { initializePayments } from './lib/payments';

// Pantallas Principales
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PedidosScreen from './screens/PedidosScreen';
import MenuScreen from './screens/MenuScreen';

// Pantallas de Flujo de Pedido
import ScanPhase1Screen from './screens/ScanPhase1Screen';
import ScanPhase2Screen from './screens/ScanPhase2Screen';
import SuccessScreen from './screens/SuccessScreen';
import ManualOrderScreen from './screens/ManualOrderScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';

// NUEVAS PANTALLAS DEL MENÚ
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SecurityScreen from './screens/SecurityScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';
import PackagesScreen from './screens/PackagesScreen';

const Stack = createStackNavigator();

function Navigation() {
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Para desarrollo: usar la key directamente
      // En producción, usar variables de entorno
      const key = Platform.select({
        ios: process.env.EXPO_PUBLIC_IOS_API_KEY || 'test_GFPijiQJrSlvnVUWGGRmSwSiBUY',
        android: process.env.EXPO_PUBLIC_ANDROID_API_KEY || 'test_GFPijiQJrSlvnVUWGGRmSwSiBUY',
        web: process.env.EXPO_PUBLIC_WEB_BILLING_API_KEY || 'test_GFPijiQJrSlvnVUWGGRmSwSiBUY',
      });

      if (!key) {
        console.warn('NO API KEY FOUND FOR PAYMENTS INITIALIZATION');
        setIsConfigured(false);
        return;
      }

      try {
        await initializePayments(key);
        setIsConfigured(true);
      } catch (error) {
        console.error('Error initializing payments:', error);
        setIsConfigured(false);
      }
    };

    initialize();
  }, []);

  return (
    <PaymentsContext.Provider value={{ isConfigured }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          {/* Auth & Home */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          
          {/* Navegación Principal */}
          <Stack.Screen name="Pedidos" component={PedidosScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          
          {/* Funcionalidades del Menú (NUEVAS) */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Security" component={SecurityScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="Packages" component={PackagesScreen} />

          {/* Flujo de Pedidos */}
          <Stack.Screen name="ScanPhase1" component={ScanPhase1Screen} />
          <Stack.Screen name="ScanPhase2" component={ScanPhase2Screen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="ManualOrder" component={ManualOrderScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaymentsContext.Provider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <OrdersProvider>
        <Navigation />
      </OrdersProvider>
    </SafeAreaProvider>
  );
}