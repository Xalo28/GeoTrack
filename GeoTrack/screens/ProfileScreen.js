import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../components/Header';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="MI PERFIL" showBack={true} />
      
      <ScrollView style={styles.content}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput style={styles.input} value="Juanito Lopez" editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput style={styles.input} value="juanito@geotrack.com" editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value="+51 987 654 321" editable={false} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>ID de Conductor</Text>
          <TextInput style={styles.input} value="DRV-2025-001" editable={false} />
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>SOLICITAR CAMBIOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  editButton: {
    backgroundColor: '#5CE1E6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  editButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ProfileScreen;