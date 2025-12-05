import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export const HeaderSection = ({ navigation, isEditMode, currentDate }) => {
  return (
    <>
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{isEditMode ? "EDITAR PEDIDO" : "NUEVO PEDIDO"}</Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient colors={['#5CE1E6', '#00adb5']} style={styles.profileCircle}>
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 1 },
  headerSubtitle: { fontSize: 14, color: '#5CE1E6', marginTop: 2, fontWeight: '500' },
  profileButton: { width: 40, height: 40 },
  profileCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  profileInitial: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginTop: 5,
  },
  dateText: { fontSize: 12, color: '#FFFFFF', marginLeft: 8, fontWeight: '500' },
});
export default HeaderSection;