import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import { OrdersProvider } from './context/OrdersContext';

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
import SecurityScreen from './screens/SecurityScreen';
import SettingsScreen from './screens/SettingsScreen';
import HelpScreen from './screens/HelpScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    // 2. ENVOLVER TODO EN SafeAreaProvider
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
            
            {/* Funcionalidades del Menú (NUEVAS) */}
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />

            {/* Flujo de Pedidos */}
            <Stack.Screen name="ScanPhase1" component={ScanPhase1Screen} />
            <Stack.Screen name="ScanPhase2" component={ScanPhase2Screen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="ManualOrder" component={ManualOrderScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </OrdersProvider>
    </SafeAreaProvider>
  );
  
}