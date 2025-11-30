import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = ({ navigation, title = "PEDIDOS", subtitle = "Juanito Lopez", showBack = true }) => {
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    // Capitalizar la primera letra
    const dateStr = now.toLocaleDateString('es-ES', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Ionicons name="arrow-back" size={28} color="#000000" />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>
              {title}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50, // Ajuste para notch/isla dinámica
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#5CE1E6',
    elevation: 4, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24, // Reducido un poco para evitar saltos de línea
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginTop: 2,
  },
  dateContainer: {
    maxWidth: '35%',
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'right',
    lineHeight: 16,
    textTransform: 'capitalize',
  },
});

export default Header;