import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ navigation, onBackPress }) => {
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('es-ES', options);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      // Si se proporciona una función personalizada, usarla
      onBackPress();
    } else {
      // Comportamiento por defecto: navegar hacia atrás
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>PEDIDOS</Text>
            <Text style={styles.headerSubtitle}>Juanito Lopez</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  backButton: {
    marginRight: 15,
    marginTop: 5,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
  },
  timeContainer: {
    alignItems: 'flex-end',
    maxWidth: '40%',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'right',
  },
});

export default Header;