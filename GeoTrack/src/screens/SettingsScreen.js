import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const [themeModal, setThemeModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [offlineModal, setOfflineModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('claro');
  const [selectedLanguage, setSelectedLanguage] = useState('español');
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [modalScale] = useState(new Animated.Value(0.5));
  const [modalOpacity] = useState(new Animated.Value(0));

  const currentDate = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('es-ES', options).toUpperCase();

  const themes = [
    { id: 'claro', label: 'Claro', icon: 'light-mode' },
    { id: 'oscuro', label: 'Oscuro', icon: 'dark-mode' },
    { id: 'auto', label: 'Automático', icon: 'brightness-auto' }
  ];

  const languages = [
    { id: 'español', label: 'Español', code: 'ES' },
    { id: 'ingles', label: 'Inglés', code: 'US' },
    { id: 'portugues', label: 'Portugués', code: 'BR' }
  ];

  const animateModalIn = (modalType) => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    if (modalType === 'theme') setThemeModal(true);
    else if (modalType === 'language') setLanguageModal(true);
    else if (modalType === 'offline') setOfflineModal(true);
  };

  const animateModalOut = () => {
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 0.5,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setThemeModal(false);
      setLanguageModal(false);
      setOfflineModal(false);
    });
  };

  const ModalOption = ({ icon, label, isSelected, onSelect, iconColor = '#5CE1E6' }) => (
    <TouchableOpacity 
      style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.modalOptionContent}>
        {icon && (
          <MaterialIcons name={icon} size={24} color={isSelected ? '#5CE1E6' : iconColor} />
        )}
        <Text style={[styles.modalOptionLabel, isSelected && styles.modalOptionLabelSelected]}>
          {label}
        </Text>
      </View>
      {isSelected && (
        <MaterialIcons name="check-circle" size={24} color="#5CE1E6" />
      )}
    </TouchableOpacity>
  );

  const renderThemeModal = () => (
    <Animated.View style={[
      styles.modalContent,
      {
        transform: [{ scale: modalScale }],
        opacity: modalOpacity
      }
    ]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Seleccionar Tema</Text>
        <TouchableOpacity onPress={animateModalOut}>
          <MaterialIcons name="close" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalOptions}>
        {themes.map((theme) => (
          <ModalOption
            key={theme.id}
            icon={theme.icon}
            label={theme.label}
            isSelected={selectedTheme === theme.id}
            onSelect={() => {
              setSelectedTheme(theme.id);
              setTimeout(animateModalOut, 300);
            }}
          />
        ))}
      </View>
    </Animated.View>
  );

  const renderLanguageModal = () => (
    <Animated.View style={[
      styles.modalContent,
      {
        transform: [{ scale: modalScale }],
        opacity: modalOpacity
      }
    ]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Seleccionar Idioma</Text>
        <TouchableOpacity onPress={animateModalOut}>
          <MaterialIcons name="close" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.modalOptions}>
        {languages.map((language) => (
          <ModalOption
            key={language.id}
            label={language.label}
            isSelected={selectedLanguage === language.id}
            onSelect={() => {
              setSelectedLanguage(language.id);
              setTimeout(animateModalOut, 300);
            }}
          />
        ))}
      </View>
    </Animated.View>
  );

  const renderOfflineModal = () => (
    <Animated.View style={[
      styles.modalContent,
      {
        transform: [{ scale: modalScale }],
        opacity: modalOpacity
      }
    ]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Modo Offline</Text>
        <TouchableOpacity onPress={animateModalOut}>
          <MaterialIcons name="close" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.offlineModalContent}>
        <MaterialIcons 
          name={offlineEnabled ? "wifi-off" : "wifi"} 
          size={50} 
          color="#5CE1E6" 
          style={styles.offlineIcon}
        />
        
        <Text style={styles.offlineTitle}>
          {offlineEnabled ? 'Modo Offline Activado' : 'Activar Modo Offline'}
        </Text>
        
        <Text style={styles.offlineDescription}>
          {offlineEnabled 
            ? 'La aplicación funciona sin conexión a internet. Algunas funciones pueden estar limitadas.' 
            : 'Al activar el modo offline, los datos se almacenarán localmente para su uso sin internet.'}
        </Text>
        
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={animateModalOut}
          >
            <Text style={styles.modalButtonSecondaryText}>CANCELAR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={() => {
              setOfflineEnabled(!offlineEnabled);
              setTimeout(animateModalOut, 300);
            }}
          >
            <LinearGradient
              colors={['#5CE1E6', '#00adb5']}
              style={styles.modalButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.modalButtonPrimaryText}>
                {offlineEnabled ? 'DESACTIVAR' : 'ACTIVAR'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>CONFIGURACIÓN</Text>
          <Text style={styles.headerSubtitle}>JUANITO LOPEZ</Text>
        </View>
        
        <TouchableOpacity style={styles.profileButton}>
          <LinearGradient
            colors={['#5CE1E6', '#00adb5']}
            style={styles.profileCircle}
          >
            <Text style={styles.profileInitial}>JL</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="calendar-today" size={16} color="#5CE1E6" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="settings" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>GENERAL</Text>
          </View>
          
          <View style={styles.optionsList}>
            <TouchableOpacity 
              style={[styles.optionItem, styles.optionItemFirst]}
              onPress={() => animateModalIn('language')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <MaterialIcons name="language" size={24} color="#5CE1E6" />
                <Text style={styles.optionText}>Idioma</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={styles.optionValue}>
                  {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => animateModalIn('theme')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <MaterialIcons name={selectedTheme === 'oscuro' ? 'dark-mode' : 'light-mode'} size={24} color="#5CE1E6" />
                <Text style={styles.optionText}>Tema</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={styles.optionValue}>
                  {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="sync" size={20} color="#5CE1E6" />
            <Text style={styles.sectionTitle}>SINCRONIZACIÓN</Text>
          </View>
          
          <View style={styles.optionsList}>
            <TouchableOpacity 
              style={[styles.optionItem, styles.optionItemFirst]}
              onPress={() => animateModalIn('offline')}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <MaterialIcons name={offlineEnabled ? "wifi-off" : "wifi"} size={24} color="#5CE1E6" />
                <Text style={styles.optionText}>Modo Offline</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={[styles.optionValue, offlineEnabled && styles.optionValueActive]}>
                  {offlineEnabled ? 'Activado' : 'Desactivado'}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color="#a0a0c0" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="info" size={18} color="#5CE1E6" />
            <Text style={styles.infoTitle}>Información de la Aplicación</Text>
          </View>
          <Text style={styles.infoText}>
            Versión 1.0.0{'\n'}
            © 2025 GeoTrack. Todos los derechos reservados.
          </Text>
        </View>
      </View>

      <Modal
        visible={themeModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          {renderThemeModal()}
        </Animated.View>
      </Modal>

      <Modal
        visible={languageModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          {renderLanguageModal()}
        </Animated.View>
      </Modal>

      <Modal
        visible={offlineModal}
        transparent={true}
        animationType="none"
        onRequestClose={animateModalOut}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          {renderOfflineModal()}
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Platform.OS === 'ios' ? 200 : 180,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5CE1E6',
    marginTop: 2,
    fontWeight: '500',
  },
  profileButton: {
    width: 40,
    height: 40,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
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
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(92, 225, 230, 0.3)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  optionsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionItemFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    fontSize: 12,
    color: '#a0a0c0',
    marginRight: 8,
  },
  optionValueActive: {
    color: '#5CE1E6',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#5CE1E6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#5CE1E6',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    width: width * 0.9,
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalOptionSelected: {
    backgroundColor: 'rgba(92, 225, 230, 0.2)',
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  modalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalOptionLabel: {
    fontSize: 16,
    color: '#a0a0c0',
    marginLeft: 12,
    flex: 1,
  },
  modalOptionLabelSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  offlineModalContent: {
    padding: 20,
    alignItems: 'center',
  },
  offlineIcon: {
    marginBottom: 20,
  },
  offlineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  offlineDescription: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(92, 225, 230, 0.4)',
  },
  modalButtonPrimary: {
    backgroundColor: 'transparent',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    color: '#5CE1E6',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
};

export default SettingsScreen;