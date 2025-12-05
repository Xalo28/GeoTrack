import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ModalOption from './ModalOption';

const LanguageModal = ({ 
  modalScale, 
  modalOpacity, 
  selectedLanguage, 
  onSelectLanguage, 
  onClose 
}) => {
  const languages = [
    { id: 'español', label: 'Español', code: 'ES' },
    { id: 'ingles', label: 'Inglés', code: 'US' },
    { id: 'portugues', label: 'Portugués', code: 'BR' }
  ];

  return (
    <View style={[
      styles.modalContent,
      {
        transform: [{ scale: modalScale }],
        opacity: modalOpacity
      }
    ]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Seleccionar Idioma</Text>
        <TouchableOpacity onPress={onClose}>
          <MaterialIcons name="close" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalOptions}>
        {languages.map((language) => (
          <ModalOption
            key={language.id}
            label={language.label}
            isSelected={selectedLanguage === language.id}
            onSelect={() => onSelectLanguage(language.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = {
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.3)',
    shadowColor: '#5CE1E6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOptions: {
    padding: 20,
    gap: 10,
  },
};

export default LanguageModal;