import React from 'react';
import { View, Text } from 'react-native';

const StatusIndicators = ({ isScanning, scanned, hasPermission }) => {
  const indicators = [
    {
      label: 'Cámara activa',
      active: isScanning,
      color: '#5CE1E6',
    },
    {
      label: 'Escaneo completado',
      active: scanned,
      color: '#4ECB71',
    },
    {
      label: 'Permiso de cámara',
      active: hasPermission,
      color: hasPermission ? '#4ECB71' : '#FF4444',
    },
  ];

  return (
    <View style={indicatorStyles.container}>
      {indicators.map((indicator, index) => (
        <View key={index} style={indicatorStyles.indicator}>
          <View style={[indicatorStyles.dot, {
            backgroundColor: indicator.active ? indicator.color : '#a0a0c0'
          }]} />
          <Text style={indicatorStyles.text}>{indicator.label}</Text>
        </View>
      ))}
    </View>
  );
};

const indicatorStyles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
    color: '#a0a0c0',
    textAlign: 'center',
  },
};

export default StatusIndicators;