import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Importar estilos
import { styles } from '../styles/SettingsScreenStyles';

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
      {/* Fondo gradiente */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      />

      {/* Header personalizado */}
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

      {/* Fecha */}
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
            {/* Idioma */}
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

            {/* Tema */}
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
            {/* Modo Offline */}
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

        {/* Información */}
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

      {/* Modal de tema */}
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

      {/* Modal de idioma */}
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

      {/* Modal de modo offline */}
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

export default SettingsScreen;