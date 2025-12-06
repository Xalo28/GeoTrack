import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export const AddressAutocomplete = ({
  label,
  value,
  onChangeText,
  onLocationSelect, // <--- Nuevo prop para devolver coordenadas
  error,
  district,
  isLoading,
  onLoadingChange
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef(null);

  const fetchAddressPredictions = async (text) => {
    if (!text || text.length < 3) return;

    const query = district 
      ? `${text}, ${district}, Peru` 
      : `${text}, Lima, Peru`;

    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&components=country:pe`;

    try {
      onLoadingChange(true);
      const response = await fetch(apiUrl);
      const json = await response.json();
      
      if (json.status === 'OK') {
        setSuggestions(json.predictions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error(error);
      setShowSuggestions(false);
    } finally {
      onLoadingChange(false);
    }
  };

  const handleTextChange = (text) => {
    onChangeText(text);
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (text.length <= 2) {
      setShowSuggestions(false);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      fetchAddressPredictions(text);
    }, 600);
  };

  const selectSuggestion = async (suggestion) => {
    const cleanAddress = suggestion.description.replace(', Perú', '');
    onChangeText(cleanAddress);
    setShowSuggestions(false);

    // Lógica para obtener coordenadas exactas del Place ID seleccionado
    if (suggestion.place_id && onLocationSelect) {
      try {
        onLoadingChange(true);
        // Usamos Places Details API para obtener la geometría exacta
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&fields=geometry&key=${GOOGLE_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.result.geometry) {
          const { lat, lng } = data.result.geometry.location;
          // Devolvemos las coordenadas exactas al componente padre
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      } catch (error) {
        console.error("Error obteniendo detalles del lugar", error);
      } finally {
        onLoadingChange(false);
      }
    }
  };

  return (
    <View style={[styles.container, { zIndex: 1000 }]}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.requiredStar}> *</Text>
        {isLoading && <ActivityIndicator size="small" color="#5CE1E6" style={{marginLeft: 10}} />}
      </View>
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <MaterialIcons name="location-on" size={20} color="#5CE1E6" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={handleTextChange}
          placeholder="Escribe la dirección..."
          placeholderTextColor="#a0a0c0"
        />
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity 
              key={suggestion.place_id || index} 
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(suggestion)}
            >
              <MaterialIcons name="place" size={16} color="#a0a0c0" style={{ marginRight: 8 }} />
              <Text style={styles.suggestionText}>{suggestion.description}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.poweredByGoogle}>
            <Text style={styles.poweredText}>Powered by Google</Text>
          </View>
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: 20 
  },
  labelContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  inputLabel: { 
    fontSize: 14, 
    color: '#e0e0ff', 
    fontWeight: '500' 
  },
  requiredStar: { 
    color: '#FF4444', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    height: 50 
  },
  inputError: { 
    borderColor: '#FF4444', 
    borderWidth: 1.5 
  },
  inputIcon: { 
    marginRight: 12 
  },
  textInput: { 
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: 16, 
    padding: 0 
  },
  errorText: { 
    color: '#FF4444', 
    fontSize: 12, 
    marginTop: 5, 
    marginLeft: 5 
  },
  suggestionsContainer: { 
    position: 'absolute', 
    top: '100%', 
    left: 0, 
    right: 0, 
    backgroundColor: '#2a2a40', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: 'rgba(92, 225, 230, 0.3)', 
    zIndex: 9999, 
    marginTop: 5, 
    maxHeight: 180, 
    overflow: 'hidden', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 8 
  },
  suggestionItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255, 255, 255, 0.05)', 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  suggestionText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    flex: 1 
  },
  poweredByGoogle: { 
    alignItems: 'flex-end', 
    padding: 5, 
    backgroundColor: 'rgba(255,255,255,0.05)' 
  },
  poweredText: { 
    color: '#a0a0c0', 
    fontSize: 10, 
    fontStyle: 'italic' 
  }
});
export default AddressAutocomplete;