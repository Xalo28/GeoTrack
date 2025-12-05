import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const colors = {
  primary: '#5CE1E6',
  primaryDark: '#00adb5',
  secondary: '#1a1a2e',
  secondaryLight: '#16213e',
  success: '#4ECB71',
  error: '#FF4444',
  text: '#FFFFFF',
  textSecondary: '#a0a0c0',
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
};

export const scanStyles = {
  scanArea: {
    height: width * 0.8,
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },
  scanFrame: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: colors.text,
    borderRadius: 10,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  scanLine: {
    height: 2,
    backgroundColor: colors.primary,
    width: '100%',
  },
};

export const textStyles = {
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
};