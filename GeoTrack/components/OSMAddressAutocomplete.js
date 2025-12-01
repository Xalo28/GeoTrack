import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  ActivityIndicator,
  Animated,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { height } = Dimensions.get('window');

// Color turquesa
const TURQUOISE = '#40E0D0';

const OSMAddressAutocomplete = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  onSelect,
  countryCode = 'pe',
  city = 'Lima'
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const debounceTimer = useRef(null);

  // Abrir modal en modo búsqueda
  const openModal = () => {
    setManualMode(false);
    setShowModal(true);
    setSearchText(value || '');
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Cerrar modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
      setSuggestions([]);
      setManualMode(false);
    });
  };

  // Cambiar a modo manual
  const handleManualEntry = () => {
    setManualMode(true);
  };

 const handleSaveManual = () => {
  if (searchText.trim()) {
    onChangeText(searchText.trim());  
    closeModal();
    if (onSelect) {
      onSelect({
        address: searchText.trim(),
        details: {},
        coordinates: null
      });
    }
  }
};

  // Buscar en OpenStreetMap Nominatim
  const searchOSMAddresses = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            q: `${query}, ${city}, Perú`,
            format: 'json',
            addressdetails: 1,
            limit: 10,
            countrycodes: countryCode,
            'accept-language': 'es',
            polygon_geojson: 0
          },
          headers: {
            'User-Agent': 'geotrack/1.0 (202121053@urp.edu.pe)'
          }
        }
      );

      const formattedSuggestions = response.data.map(item => ({
        id: item.place_id,
        display_name: item.display_name,
        address: {
          road: item.address?.road || '',
          suburb: item.address?.suburb || '',
          city: item.address?.city || item.address?.town || '',
          state: item.address?.state || '',
          postcode: item.address?.postcode || '',
          country: item.address?.country || ''
        },
        lat: item.lat,
        lon: item.lon,
        type: item.type,
        importance: item.importance
      }));

      // Ordenar por importancia
      formattedSuggestions.sort((a, b) => b.importance - a.importance);
      
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Error searching OSM addresses:', error);
      showLocalSuggestions(query);
    } finally {
      setIsLoading(false);
    }
  };

  // Sugerencias locales como fallback
  const showLocalSuggestions = (query) => {
    const localStreets = [
      'Av. Arequipa, Miraflores, Lima',
      'Jr. de la Unión, Cercado de Lima, Lima',
      'Av. La Marina, San Miguel, Lima',
      'Av. Brasil, Pueblo Libre, Lima',
      'Av. Javier Prado, San Isidro, Lima',
      'Calle Los Olivos, Los Olivos, Lima',
      'Av. Tacna, Cercado de Lima, Lima',
      'Av. Alfonso Ugarte, Cercado de Lima, Lima',
      'Prolongación Primavera, San Borja, Lima',
      'Av. Elmer Faucett, Callao, Callao'
    ];

    const filtered = localStreets.filter(street =>
      street.toLowerCase().includes(query.toLowerCase())
    ).map((street, index) => ({
      id: `local-${index}`,
      display_name: street,
      address: {
        road: street.split(',')[0],
        city: 'Lima',
        country: 'Perú'
      },
      type: 'local'
    }));

    setSuggestions(filtered);
  };

  // Debounce para búsqueda
  const handleSearch = (text) => {
    setSearchText(text);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      searchOSMAddresses(text);
    }, 400);
  };

  // Seleccionar dirección
  const handleSelectAddress = (item) => {
    onChangeText(item.display_name);
    if (onSelect) {
      onSelect({
        address: item.display_name,
        details: item.address,
        coordinates: item.lat && item.lon 
          ? { lat: parseFloat(item.lat), lng: parseFloat(item.lon) }
          : null
      });
    }
    closeModal();
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setSearchText('');
    setSuggestions([]);
  };

  // Renderizar sugerencia
  const renderSuggestion = ({ item }) => {
    const parts = [];
    if (item.address.road) parts.push(item.address.road);
    if (item.address.suburb) parts.push(item.address.suburb);
    
    const mainText = parts.join(', ') || item.display_name.split(',')[0];
    const secondaryText = `${item.address.city || ''}, ${item.address.state || ''}`.trim();
    
    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectAddress(item)}
      >
        <Ionicons 
          name={item.type === 'local' ? "location" : "map"} 
          size={20} 
          color={TURQUOISE}
        />
        <View style={styles.suggestionTextContainer}>
          <Text style={styles.suggestionMainText} numberOfLines={1}>
            {mainText}
          </Text>
          <Text style={styles.suggestionSecondaryText} numberOfLines={2}>
            {secondaryText}
          </Text>
        </View>
        {item.type === 'local' && (
          <Text style={styles.localBadge}>LOCAL</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {/* Input que abre el modal */}
      <TouchableOpacity 
        style={[styles.inputContainer, error && styles.inputError]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
        
        <View style={styles.inputTextContainer}>
          <Text 
            style={value ? styles.inputText : styles.placeholderText}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
        </View>
        
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal de búsqueda */}
      <Modal
        visible={showModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer, 
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={closeModal}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {manualMode ? 'Ingresar dirección' : 'Buscar dirección'}
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            {manualMode ? (
              /* MODO MANUAL - Escribir directamente */
              <View style={styles.manualModeContainer}>
                <Text style={styles.manualModeTitle}>
                  Escribe la dirección completa:
                </Text>
                
                <TextInput
                  style={styles.manualInput}
                  placeholder="Ej: Av. Arequipa 123, Miraflores, Lima"
                  placeholderTextColor="#999"
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  autoCapitalize="words"
                />
                
                <View style={styles.manualButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.cancelManualButton}
                    onPress={() => setManualMode(false)}
                  >
                    <Text style={styles.cancelManualButtonText}>Volver a buscar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.saveManualButton,
                      !searchText.trim() && styles.saveManualButtonDisabled
                    ]}
                    onPress={handleSaveManual}
                    disabled={!searchText.trim()}
                  >
                    <Text style={styles.saveManualButtonText}>Guardar dirección</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* MODO BÚSQUEDA - Buscar con OpenStreetMap */
              <>
                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                  <View style={styles.searchInputWrapper}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Ej: Av. Arequipa, Miraflores"
                      placeholderTextColor="#999"
                      value={searchText}
                      onChangeText={handleSearch}
                      autoFocus
                      autoCapitalize="words"
                      returnKeyType="search"
                    />
                    {searchText.length > 0 && (
                      <TouchableOpacity 
                        onPress={handleClear}
                        style={styles.clearButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close-circle" size={20} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.searchHint}>
                    Escribe al menos 3 caracteres para buscar
                  </Text>
                </View>

                {/* Contenido - Lista de resultados */}
                <View style={styles.resultsContainer}>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={TURQUOISE} />
                      <Text style={styles.loadingText}>Buscando direcciones...</Text>
                    </View>
                  ) : suggestions.length > 0 ? (
                    <FlatList
                      data={suggestions}
                      renderItem={renderSuggestion}
                      keyExtractor={(item) => item.id.toString()}
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.listContent}
                    />
                  ) : searchText.length >= 3 ? (
                    <View style={styles.noResultsContainer}>
                      <Ionicons name="location-outline" size={50} color="#DDD" />
                      <Text style={styles.noResultsText}>No se encontraron direcciones</Text>
                      <Text style={styles.noResultsHint}>
                        Intenta con otro nombre o ingresa manualmente
                      </Text>
                      <TouchableOpacity 
                        style={styles.manualFromNoResults}
                        onPress={handleManualEntry}
                      >
                        <Text style={styles.manualFromNoResultsText}>
                          Ingresar dirección manualmente
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.initialStateContainer}>
                      <Ionicons name="location-outline" size={50} color={TURQUOISE} />
                      <Text style={styles.initialStateText}>
                        Escribe una dirección para buscar
                      </Text>
                      <Text style={styles.initialStateHint}>
                        Ej: Av. Arequipa, Jr. de la Unión, Calle Los Olivos
                      </Text>
                    </View>
                  )}
                </View>

                {/* Footer con opción manual */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.manualButton}
                    onPress={handleManualEntry}
                  >
                    <Ionicons name="create-outline" size={20} color={TURQUOISE} />
                    <Text style={styles.manualButtonText}>Ingresar dirección manualmente</Text>
                  </TouchableOpacity>
                  <Text style={styles.footerNote}>
                    Datos proporcionados por OpenStreetMap
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  icon: {
    marginRight: 10,
  },
  inputTextContainer: {
    flex: 1,
  },
  inputText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  errorText: {
    fontSize: 12,
    color: '#FF4444',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    margin: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginLeft: 4,
  },
  resultsContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionMainText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  localBadge: {
    fontSize: 10,
    color: '#FF9800',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  manualFromNoResults: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: TURQUOISE,
    borderRadius: 8,
  },
  manualFromNoResultsText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  initialStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  initialStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: TURQUOISE,
    marginTop: 16,
    textAlign: 'center',
  },
  initialStateHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#F8F9FA',
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: TURQUOISE,
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
  },
  manualButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: TURQUOISE,
    marginLeft: 8,
  },
  footerNote: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  // Nuevos estilos para modo manual
  manualModeContainer: {
    flex: 1,
    padding: 20,
  },
  manualModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  manualInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#FFF',
  },
  manualButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelManualButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelManualButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  saveManualButton: {
    flex: 1,
    backgroundColor: TURQUOISE,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveManualButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveManualButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default OSMAddressAutocomplete;