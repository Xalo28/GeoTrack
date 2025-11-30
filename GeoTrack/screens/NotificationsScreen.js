import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Header from '../components/Header';

const NotificationsScreen = ({ navigation }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);

  const ToggleItem = ({ title, value, onValueChange }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#5CE1E6" }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="NOTIFICACIONES" showBack={true} />
      
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>Preferencias de Alertas</Text>
        
        <ToggleItem 
          title="Notificaciones Push" 
          value={pushEnabled} 
          onValueChange={setPushEnabled} 
        />
        <ToggleItem 
          title="Alertas por Correo" 
          value={emailEnabled} 
          onValueChange={setEmailEnabled} 
        />
        <ToggleItem 
          title="Alertas SMS (Urgentes)" 
          value={smsEnabled} 
          onValueChange={setSmsEnabled} 
        />
        
        <Text style={styles.infoText}>
          Recibirás notificaciones sobre nuevos pedidos asignados y cambios en tus rutas activas.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  itemText: { fontSize: 16, color: '#333' },
  infoText: { marginTop: 20, color: '#888', fontSize: 14, lineHeight: 20 }
});

export default NotificationsScreen;