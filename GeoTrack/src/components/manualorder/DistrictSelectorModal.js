import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const DISTRICTS = [
  'SAN JUAN DE LURIGANCHO', 'SANTIAGO DE SURCO', 'MIRAFLORES', 'SAN ISIDRO',
  'LA MOLINA', 'SURCO', 'CHORRILLOS', 'VILLA EL SALVADOR', 'SAN MIGUEL',
  'MAGDALENA', 'PUEBLO LIBRE', 'JESÚS MARÍA', 'LINCE', 'LA VICTORIA',
  'BREÑA', 'LIMA', 'RIMAC', 'SANTA ANITA', 'ATE', 'SANTA ROSA',
  'EL AGUSTINO', 'SAN JUAN DE MIRAFLORES', 'VILLA MARÍA DEL TRIUNFO',
  'PACHACAMAC', 'PUNTA HERMOSA', 'PUNTA NEGRA', 'SAN BARTOLO',
  'SANTA MARÍA DEL MAR', 'PUCUSANA'
];

export const DistrictSelectorModal = ({ 
  visible, 
  onClose, 
  selectedDistrict, 
  onSelectDistrict 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Distrito</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={onClose}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.districtList}>
            {DISTRICTS.map((district, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.districtItem,
                  selectedDistrict === district && styles.selectedDistrict
                ]}
                onPress={() => {
                  onSelectDistrict(district);
                  onClose();
                }}
              >
                <Text style={[
                  styles.districtItemText,
                  selectedDistrict === district && styles.selectedDistrictText
                ]}>{district}</Text>
                {selectedDistrict === district && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#1a1a2e', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    maxHeight: '70%' 
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  modalCloseButton: { 
    padding: 5 
  },
  modalCloseText: { 
    fontSize: 18, 
    color: '#a0a0c0' 
  },
  districtList: { 
    maxHeight: 400 
  },
  districtItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.1)' 
  },
  selectedDistrict: { 
    backgroundColor: 'rgba(92, 225, 230, 0.2)' 
  },
  districtItemText: { 
    fontSize: 16, 
    color: '#FFFFFF', 
    flex: 1 
  },
  selectedDistrictText: { 
    color: '#5CE1E6', 
    fontWeight: '600' 
  },
  checkmark: { 
    fontSize: 16, 
    color: '#4ECB71', 
    fontWeight: 'bold' 
  },
});
export default DistrictSelectorModal;