import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

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

    const progressAnimation = Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: false,
    });

    progressAnimation.start();

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ESCANEO FASE - 2</Text>
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

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Procesando pedido, por favor espere...
        </Text>
      </View>

      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.scanArea,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={['rgba(92, 225, 230, 0.1)', 'rgba(92, 225, 230, 0.05)']}
            style={styles.scanAreaGradient}
          >
            <Text style={styles.scanningTitle}>ESCANEANDO</Text>
            
            <View style={styles.processingCard}>
              <Text style={styles.processingText}>{processingText}</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      { width: progressWidth }
                    ]} 
                  />
                </View>
                
                <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
              </View>

              <View style={styles.spinnerContainer}>
                <MaterialIcons 
                  name={isComplete ? "check-circle" : "rotate-right"} 
                  size={40} 
                  color={isComplete ? "#4ECB71" : "#5CE1E6"} 
                  style={styles.spinnerIcon}
                />
                <Text style={styles.processingIndicator}>
                  {isComplete ? '¡PROCESO COMPLETADO!' : 'PROCESANDO...'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.infoCard}>
          <MaterialIcons name="inventory" size={20} color="#5CE1E6" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Código escaneado:</Text>
            <Text style={styles.infoValue}>{scannedData}</Text>
          </View>
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <Text style={[styles.stepText, styles.stepTextActive]}>Escaneo</Text>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={[
              styles.stepDot, 
              progress > 20 && styles.stepDotActive
            ]} />
            <Text style={[
              styles.stepText, 
              progress > 20 && styles.stepTextActive
            ]}>Verificación</Text>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={[
              styles.stepDot, 
              progress > 50 && styles.stepDotActive
            ]} />
            <Text style={[
              styles.stepText, 
              progress > 50 && styles.stepTextActive
            ]}>Procesando</Text>
          </View>
          
          <View style={styles.stepLine} />
          
          <View style={styles.step}>
            <View style={[
              styles.stepDot, 
              isComplete && styles.stepDotActive
            ]} />
            <Text style={[
              styles.stepText, 
              isComplete && styles.stepTextActive
            ]}>Completado</Text>
          </View>
        </View>

        <View style={styles.messageContainer}>
          <MaterialIcons name="info" size={18} color="#5CE1E6" />
          <Text style={styles.messageText}>
            El proceso se completará automáticamente
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  instructionContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scanArea: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  scanAreaGradient: {
    padding: 20,
    alignItems: 'center',
  },
  scanningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  processingCard: {
    width: '100%',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 25,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#5CE1E6',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CE1E6',
    textAlign: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
  },
  spinnerIcon: {
    marginBottom: 10,
  },
  processingIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5CE1E6',
    letterSpacing: 1,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.2)',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: '#5CE1E6',
  },
  stepText: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  stepTextActive: {
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 5,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
  },
  messageText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 8,
    fontWeight: '500',
  },
};

export default ScanPhase2Screen;