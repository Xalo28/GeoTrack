import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import QRIcon from './QRIcon';
import MenuIcon from './MenuIcon';

const BottomBar = ({ onScanPress, onAddPress, onMenuPress }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.iconButton} onPress={onScanPress}>
        <QRIcon />
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

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
    paddingVertical: 15,
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
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
    marginTop: -4,
  },
});

export default BottomBar;