import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header con logo */}
      <View style={styles.header}>
        {/* Aquí coloca tu imagen del logo SAVA */}
        {/* <Image 
          source={require('../assets/sava-logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        /> */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SAVA</Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <Text style={styles.message}>No hay Rutas</Text>
        <Text style={styles.message}>pendientes...</Text>
      </View>

      {/* Barra de navegación inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => console.log('QR Scanner pressed')}
        >
          <View style={styles.qrIcon}>
            <View style={styles.qrCorner1} />
            <View style={styles.qrCorner2} />
            <View style={styles.qrCorner3} />
            <View style={styles.qrCorner4} />
            <View style={styles.qrCenter} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => console.log('Add new route pressed')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => console.log('Menu pressed')}
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 100,
    height: 60,
  },
  logoPlaceholder: {
    width: 100,
    height: 60,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5CE1E6',
    borderStyle: 'dashed',
  },
  logoText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrIcon: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCorner1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 15,
    height: 15,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner2: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 15,
    height: 15,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCorner4: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#5CE1E6',
  },
  qrCenter: {
    width: 18,
    height: 18,
    backgroundColor: '#5CE1E6',
    borderRadius: 3,
  },
  menuIcon: {
    width: 28,
    height: 24,
    justifyContent: 'space-between',
  },
  menuLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#5CE1E6',
    borderRadius: 2,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5CE1E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5CE1E6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
    marginTop: -4,
  },
});

export default HomeScreen;