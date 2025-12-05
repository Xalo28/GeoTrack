import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

// 1. Contexto ahora está dentro de src
import { OrdersProvider } from './src/context/OrdersContext'; 

// 2. Polyfills parece estar en la raíz (según la imagen), así que se queda igual
import './polyfills'; 

// 3. Pantallas: Ahora todas se importan desde ./src/screens/
// Pantallas Principales
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PedidosScreen from './src/screens/PedidosScreen';
import MenuScreen from './src/screens/MenuScreen';

// Pantallas de Flujo de Pedido
import ScanPhase1Screen from './src/screens/ScanPhase1Screen';
import ScanPhase2Screen from './src/screens/ScanPhase2Screen';
import SuccessScreen from './src/screens/SuccessScreen';
import ManualOrderScreen from './src/screens/ManualOrderScreen';

// Nuevas Pantallas del Menú
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpScreen from './src/screens/HelpScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <OrdersProvider>
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
            
            {/* Funcionalidades del Menú */}
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />

            {/* Flujo de Pedidos */}
            <Stack.Screen name="ScanPhase1" component={ScanPhase1Screen} />
            <Stack.Screen name="ScanPhase2" component={ScanPhase2Screen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="ManualOrder" component={ManualOrderScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </OrdersProvider>
    </SafeAreaProvider>
  );
}