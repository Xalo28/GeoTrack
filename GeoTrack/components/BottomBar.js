import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRIcon from './QRIcon';
import MenuIcon from './MenuIcon';

const BottomBar = ({ onScanPress, onAddPress, onMenuPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.bottomBar, 
      { paddingBottom: 15 + insets.bottom } 
    ]}>
      {/* Botón Izquierdo: ESCANEAR */}
      <TouchableOpacity style={styles.iconButton} onPress={onScanPress}>
        <QRIcon />
      </TouchableOpacity>

      {/* Botón Central: AGREGAR (+) */}
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Botón Derecho: MENÚ */}
      <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
        <MenuIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Asegura que no se superponga
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#5CE1E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: -20,
    zIndex: 10, // Asegura que el botón esté por encima de todo
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
    marginTop: -4,
  },
});

export default BottomBar;