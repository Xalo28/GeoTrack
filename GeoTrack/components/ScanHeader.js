import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ScanHeader = ({ navigation, phaseTitle, instruction, showInstruction = true }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.phaseTitle}>{phaseTitle}</Text>
          {showInstruction && instruction ? (
            <Text style={styles.instruction}>{instruction}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 4,
  },
  headerText: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  instruction: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'left',
    opacity: 0.8,
  },
});

export default ScanHeader;