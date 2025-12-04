// polyfills.js
import 'react-native-web/dist/exports/Platform';

// Asegurar que Platform existe globalmente
if (typeof window !== 'undefined') {
  if (!window.Platform) {
    window.Platform = require('react-native-web/dist/exports/Platform').default;
  }
  
  // Polyfill para Dimensions si lo necesitas
  if (!window.Dimensions) {
    window.Dimensions = require('react-native-web/dist/exports/Dimensions');
  }
}