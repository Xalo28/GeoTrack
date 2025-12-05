import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform } from 'react-native';

import {
  Header,
  DateDisplay,
  ScanAnimation,
  InfoCard,
  StepsIndicator,
  MessageInfo,
  styles
} from '../components/scanphase2';

const ScanPhase2Screen = ({ navigation, route }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingText, setProcessingText] = useState('Verificando código...');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Datos del QR
  const { 
    nombre = 'Cliente no especificado',
    cel = 'Teléfono no especificado',
    dir = 'Dirección no especificada',
    distrito = 'Distrito no especificado',
    productos = ['Producto no especificado'],
    scanType = 'qr',
    scanDate = new Date().toISOString()
  } = route.params || {};

  console.log('ScanPhase2Screen - Datos del QR recibidos:', {
    nombre, cel, dir, distrito, productos, scanType, scanDate
  });

  useEffect(() => {
    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de progreso
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    // Lógica del progreso
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 15;
        
        if (nextProgress >= 30 && nextProgress < 60) {
          setProcessingText('Validando información...');
        } else if (nextProgress >= 60 && nextProgress < 90) {
          setProcessingText('Actualizando base de datos...');
        } else if (nextProgress >= 90) {
          setProcessingText('¡Proceso completado!');
        }

        if (nextProgress >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          
          setTimeout(() => {
            navigation.navigate('Success', { 
              nombre, cel, dir, distrito, productos, scanType, scanDate
            });
          }, 1000);
          
          return 100;
        }
        return nextProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <Header />
      <DateDisplay />

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Procesando pedido, por favor espere...
        </Text>
      </View>

      <View style={styles.content}>
        <ScanAnimation
          pulseAnim={pulseAnim}
          processingText={processingText}
          isComplete={isComplete}
          progressAnim={progressAnim}
          progress={progress}
        />

        <InfoCard 
          nombre={nombre}
          cel={cel}
          dir={dir}
          distrito={distrito}
        />

        <StepsIndicator 
          progress={progress}
          isComplete={isComplete}
        />

        <MessageInfo />
      </View>
    </SafeAreaView>
  );
};

export default ScanPhase2Screen;