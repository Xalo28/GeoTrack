import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const SecurityScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="SEGURIDAD" showBack={true} />
      
      <View style={styles.content}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.iconBg}>
            <Ionicons name="key-outline" size={24} color="#5CE1E6" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Cambiar Contraseña</Text>
            <Text style={styles.cardSub}>Actualiza tu clave de acceso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.iconBg}>
            <Ionicons name="finger-print-outline" size={24} color="#5CE1E6" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Biometría</Text>
            <Text style={styles.cardSub}>Usar huella/FaceID para entrar</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  content: { padding: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2
  },
  iconBg: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#E0F7FA', alignItems: 'center', justifyContent: 'center',
    marginRight: 15
  },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSub: { fontSize: 13, color: '#888' }
});

export default SecurityScreen;