// src/components/menu/VersionInfo.js
import React from 'react';
import { View, Text } from 'react-native';

const VersionInfo = ({ 
  appName = "GeoTrack Delivery", 
  version = "1.0.0", 
  build = "2025",
  copyright = "© 2025 GeoTrack. Todos los derechos reservados." 
}) => {
  return (
    <View style={styles.versionContainer}>
      <Text style={styles.versionText}>{appName}</Text>
      <Text style={styles.versionNumber}>Versión {version} (Build {build})</Text>
      <Text style={styles.versionCopyright}>{copyright}</Text>
    </View>
  );
};

const styles = {
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  versionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5CE1E6',
    marginBottom: 5,
  },
  versionNumber: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 3,
  },
  versionCopyright: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
};

export default VersionInfo;