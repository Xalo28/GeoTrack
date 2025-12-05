import React from 'react';
import { View, Text } from 'react-native';
import HelpScreenStyles from '../../styles/HelpScreenStyles';

const steps = [
  { id: 1, title: 'Escaneo de Paquetes', description: 'Usa el escáner QR para registrar paquetes rápidamente' },
  { id: 2, title: 'Seguimiento en Tiempo Real', description: 'Monitorea la ubicación de tus envíos en tiempo real' },
  { id: 3, title: 'Reportes y Estadísticas', description: 'Genera reportes detallados de tu actividad' },
];

const GuideSteps = () => (
  <View style={HelpScreenStyles.guideContainer}>
    {steps.map((step) => (
      <View key={step.id} style={HelpScreenStyles.guideStep}>
        <View style={HelpScreenStyles.guideNumber}>
          <Text style={HelpScreenStyles.guideNumberText}>{step.id}</Text>
        </View>

        <View style={HelpScreenStyles.guideContent}>
          <Text style={HelpScreenStyles.guideStepTitle}>{step.title}</Text>
          <Text style={HelpScreenStyles.guideStepDescription}>{step.description}</Text>
        </View>
      </View>
    ))}
  </View>
);

export default GuideSteps;
