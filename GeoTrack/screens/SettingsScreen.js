import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="CONFIGURACIÓN" showBack={true} />
      
      <View style={styles.content}>
        <Text style={styles.groupTitle}>General</Text>
        
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Idioma</Text>
          <Text style={styles.rowValue}>Español</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Tema</Text>
          <Text style={styles.rowValue}>Claro</Text>
        </TouchableOpacity>

        <Text style={styles.groupTitle}>Sincronización</Text>
        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowText}>Modo Offline</Text>
          <Text style={styles.rowValue}>Desactivado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  groupTitle: {
    fontSize: 14, fontWeight: 'bold', color: '#999',
    marginTop: 10, marginBottom: 10, textTransform: 'uppercase'
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  rowText: { fontSize: 16, color: '#333' },
  rowValue: { fontSize: 16, color: '#666' }
});

export default SettingsScreen;