import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OrdersProvider } from './context/OrdersContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PedidosScreen from './screens/PedidosScreen';
import ScanPhase1Screen from './screens/ScanPhase1Screen';
import ScanPhase2Screen from './screens/ScanPhase2Screen';
import SuccessScreen from './screens/SuccessScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <OrdersProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Pedidos" component={PedidosScreen} />
          <Stack.Screen name="ScanPhase1" component={ScanPhase1Screen} />
          <Stack.Screen name="ScanPhase2" component={ScanPhase2Screen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </OrdersProvider>
  );
}