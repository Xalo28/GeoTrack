import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  error,
  required = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  editable = true,
  isDistrict = false,
  onDistrictPress,
  ...props
}) => {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        {required && <Text style={styles.requiredStar}> *</Text>}
      </View>
      
      {isDistrict ? (
        <TouchableOpacity 
          style={[styles.inputContainer, error && styles.inputError]}
          onPress={onDistrictPress}
          disabled={!editable}
        >
          <MaterialIcons name={iconName} size={20} color="#5CE1E6" style={styles.inputIcon} />
          <Text style={[styles.districtText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#a0a0c0" />
        </TouchableOpacity>
      ) : (
        <View style={[styles.inputContainer, error && styles.inputError]}>
          <MaterialIcons name={iconName} size={20} color="#5CE1E6" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#a0a0c0"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            maxLength={maxLength}
            editable={editable}
            {...props}
          />
        </View>
      )}
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: { 
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
  districtText: { 
    flex: 1, 
    color: '#FFFFFF', 
    fontSize: 16 
  },
  placeholderText: { 
    color: '#a0a0c0' 
  },
  errorText: { 
    color: '#FF4444', 
    fontSize: 12, 
    marginTop: 5, 
    marginLeft: 5 
  },
});
export default InputField;