import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = {
  // Estilos del contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  
  // Estilos de fondo
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  
  // Elementos decorativos
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 173, 181, 0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '40%',
    right: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(92, 225, 230, 0.07)',
  },
  
  // Layout y contenedores
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  
  // Logo y header
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(92, 225, 230, 0.3)',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 2,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#5CE1E6',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  
  // Features
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 15,
  },
  
  // Botón de login
  authButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  buttonGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 12,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  
  // Información y nota de seguridad
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 225, 230, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  securityText: {
    fontSize: 12,
    color: '#5CE1E6',
    marginLeft: 8,
  },
};