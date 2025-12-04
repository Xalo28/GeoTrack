import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Dimensions,
  Platform,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import ScanPhase2ScreenStyles from '../styles/ScanPhase2ScreenStyles'; // Importa los estilos

const { width } = Dimensions.get('window');

const ScanPhase2Screen = ({ navigation, route }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [processingText, setProcessingText] = useState('Verificando código...');
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const scannedData = route.params?.scannedData || 'PEDIDO-XXXXX-XXXXX';

  useEffect(() => {
    // Animación de pulso
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progreso animado
    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    progressAnimation.start();

    // Simular proceso de verificación
    const interval = setInterval(() => {
      setProgress(prev => {
        const nextProgress = prev + Math.random() * 15;
        
        // Actualizar texto según el progreso
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
          
          // Navegar automáticamente después de 1 segundo
          setTimeout(() => {
            navigation.navigate('Success', { 
              scannedData: scannedData,
              scanDate: new Date().toISOString()
            });
          }, 1000);
          
          return 100;
        }
        return nextProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={ScanPhase2ScreenStyles.container}>
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={ScanPhase2ScreenStyles.backgroundGradient}
      />

      {/* Header personalizado */}
      <View style={ScanPhase2ScreenStyles.customHeader}>
        <View style={ScanPhase2ScreenStyles.headerLeft}>
          <Text style={ScanPhase2ScreenStyles.headerTitle}>ESCANEO FASE - 2</Text>
          <Text style={ScanPhase2ScreenStyles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <View style={ScanPhase2ScreenStyles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={ScanPhase2ScreenStyles.profileCircle}
          >
            <Text style={ScanPhase2ScreenStyles.profileInitial}>JL</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Fecha */}
      <View style={ScanPhase2ScreenStyles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={ScanPhase2ScreenStyles.dateText}>{formattedDate}</Text>
      </View>

      {/* Instrucción */}
      <View style={ScanPhase2ScreenStyles.instructionContainer}>
        <Text style={ScanPhase2ScreenStyles.instructionText}>
          Procesando pedido, por favor espere...
        </Text>
      </View>

      {/* Contenido principal */}
      <View style={ScanPhase2ScreenStyles.content}>
        {/* Área de escaneo */}
        <Animated.View 
          style={[
            ScanPhase2ScreenStyles.scanArea,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
            style={ScanPhase2ScreenStyles.scanAreaGradient}
          >
            <Text style={ScanPhase2ScreenStyles.scanningTitle}>ESCANEANDO</Text>
            
            <View style={ScanPhase2ScreenStyles.processingCard}>
              <Text style={ScanPhase2ScreenStyles.processingText}>{processingText}</Text>
              
              {/* Barra de progreso */}
              <View style={ScanPhase2ScreenStyles.progressContainer}>
                <View style={ScanPhase2ScreenStyles.progressBar}>
                  <Animated.View 
                    style={[
                      ScanPhase2ScreenStyles.progressFill,
                      { width: progressWidth }
                    ]} 
                  />
                </View>
                
                <Text style={ScanPhase2ScreenStyles.progressPercentage}>{Math.round(progress)}%</Text>
              </View>

              {/* Spinner animado */}
              <View style={ScanPhase2ScreenStyles.spinnerContainer}>
                <MaterialIcons 
                  name={isComplete ? "check-circle" : "rotate-right"} 
                  size={40} 
                  color={isComplete ? "#4ECB71" : "#5CE1E6"} 
                  style={ScanPhase2ScreenStyles.spinnerIcon}
                />
                <Text style={ScanPhase2ScreenStyles.processingIndicator}>
                  {isComplete ? '¡PROCESO COMPLETADO!' : 'PROCESANDO...'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Información del pedido */}
        <View style={ScanPhase2ScreenStyles.infoCard}>
          <MaterialIcons name="inventory" size={20} color="#5CE1E6" />
          <View style={ScanPhase2ScreenStyles.infoContent}>
            <Text style={ScanPhase2ScreenStyles.infoLabel}>Código escaneado:</Text>
            <Text style={ScanPhase2ScreenStyles.infoValue}>{scannedData}</Text>
          </View>
        </View>

        {/* Pasos del proceso */}
        <View style={ScanPhase2ScreenStyles.stepsContainer}>
          <View style={ScanPhase2ScreenStyles.step}>
            <View style={[ScanPhase2ScreenStyles.stepDot, ScanPhase2ScreenStyles.stepDotActive]} />
            <Text style={[ScanPhase2ScreenStyles.stepText, ScanPhase2ScreenStyles.stepTextActive]}>Escaneo</Text>
          </View>
          
          <View style={ScanPhase2ScreenStyles.stepLine} />
          
          <View style={ScanPhase2ScreenStyles.step}>
            <View style={[
              ScanPhase2ScreenStyles.stepDot, 
              progress > 20 && ScanPhase2ScreenStyles.stepDotActive
            ]} />
            <Text style={[
              ScanPhase2ScreenStyles.stepText, 
              progress > 20 && ScanPhase2ScreenStyles.stepTextActive
            ]}>Verificación</Text>
          </View>
          
          <View style={ScanPhase2ScreenStyles.stepLine} />
          
          <View style={ScanPhase2ScreenStyles.step}>
            <View style={[
              ScanPhase2ScreenStyles.stepDot, 
              progress > 50 && ScanPhase2ScreenStyles.stepDotActive
            ]} />
            <Text style={[
              ScanPhase2ScreenStyles.stepText, 
              progress > 50 && ScanPhase2ScreenStyles.stepTextActive
            ]}>Procesando</Text>
          </View>
          
          <View style={ScanPhase2ScreenStyles.stepLine} />
          
          <View style={ScanPhase2ScreenStyles.step}>
            <View style={[
              ScanPhase2ScreenStyles.stepDot, 
              isComplete && ScanPhase2ScreenStyles.stepDotActive
            ]} />
            <Text style={[
              ScanPhase2ScreenStyles.stepText, 
              isComplete && ScanPhase2ScreenStyles.stepTextActive
            ]}>Completado</Text>
          </View>
        </View>

        {/* Mensaje informativo */}
        <View style={ScanPhase2ScreenStyles.messageContainer}>
          <MaterialIcons name="info" size={18} color="#5CE1E6" />
          <Text style={ScanPhase2ScreenStyles.messageText}>
            El proceso se completará automáticamente
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScanPhase2Screen;