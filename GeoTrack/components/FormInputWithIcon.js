import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FormInputWithIcon = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  iconName,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'none'
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={iconName} size={20} color="#5CE1E6" style={styles.icon} />
        <TextInput
          style={[
            styles.input, 
            error && styles.inputError,
            multiline && styles.multilineInput
          ]}
          placeholder={placeholder}
          placeholderTextColor="#C0C0C0"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          spellCheck={false}
          underlineColorAndroid="transparent"
          selectionColor="#5CE1E6"
        />
      </View>
      {error && error.trim() !== '' ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
    paddingTop: 4,
  },
  icon: {
    marginRight: 12,
    width: 24,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    minHeight: 20,
  },
  inputError: {
    borderBottomColor: '#FF4444',
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 60,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 0,
  },
});

export default FormInputWithIcon;
