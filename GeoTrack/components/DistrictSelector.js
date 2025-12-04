import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DISTRICTS = [
  'SAN JUAN DE LURIGANCHO',
  'SANTIAGO DE SURCO',
  'MIRAFLORES',
  'SAN ISIDRO',
  'LA MOLINA',
  'SURCO',
  'CHORRILLOS',
  'VILLA EL SALVADOR',
  'SAN MIGUEL',
  'MAGDALENA',
  'PUEBLO LIBRE',
  'JESÚS MARÍA',
  'LINCE',
  'LA VICTORIA',
  'BREÑA',
  'LIMA',
  'RIMAC',
  'SANTA ANITA',
  'ATE',
  'SANTA ROSA',
  'EL AGUSTINO',
  'SAN JUAN DE MIRAFLORES',
  'VILLA MARÍA DEL TRIUNFO',
  'PACHACAMAC',
  'PUNTA HERMOSA',
  'PUNTA NEGRA',
  'SAN BARTOLO',
  'SANTA MARÍA DEL MAR',
  'PUCUSANA'
];

const DistrictSelector = ({ 
  label, 
  value, 
  onSelect, 
  error, 
  placeholder = "Seleccione un distrito" 
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (district) => {
    onSelect(district);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={[styles.selector, error && styles.selectorError]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <Ionicons name="location" size={20} color="#5CE1E6" style={styles.locationIcon} />
          <Text style={[styles.selectorText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color="#666666" />
      </TouchableOpacity>
      
      {error && error.trim() !== '' ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Distrito</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.districtList}>
              {DISTRICTS.map((district, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.districtItem,
                    value === district && styles.selectedDistrict
                  ]}
                  onPress={() => handleSelect(district)}
                >
                  <Text style={[
                    styles.districtText,
                    value === district && styles.selectedDistrictText
                  ]}>
                    {district}
                  </Text>
                  {value === district && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 4,
    paddingHorizontal: 0,
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  selectorError: {
    borderBottomColor: '#FF4444',
  },
  selectorText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  placeholderText: {
    color: '#C0C0C0',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  districtList: {
    maxHeight: 400,
  },
  districtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedDistrict: {
    backgroundColor: '#E3F2FD',
  },
  districtText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  selectedDistrictText: {
    color: '#1976D2',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 0,
  },
});

export default DistrictSelector;