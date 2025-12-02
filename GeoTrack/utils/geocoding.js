// utils/geocoding.js - VERSIÓN MEJORADA
import axios from 'axios';

// ==================== GEOCODING PRECISO ====================

// Usar OpenStreetMap Nominatim
export const geocodeAddress = async (address, district = '') => {
  try {
    console.log('📍 Geocodificando:', address.substring(0, 50));
    
    if (!address || address.trim() === '') {
      console.log('⚠️ Dirección vacía, usando distrito');
      return getSmartDistrictLocation(district, address);
    }
    
    // Limpiar y preparar la dirección
    const cleanAddress = cleanAddressString(address);
    const searchQuery = `${cleanAddress}, ${district}, Lima, Perú`;
    
    console.log('🔍 Buscando:', searchQuery);
    
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: searchQuery,
          format: 'json',
          limit: 1,
          countrycodes: 'pe',
          'accept-language': 'es',
          addressdetails: 1
        },
        headers: {
          'User-Agent': 'DeliveryApp/1.0'
        },
        timeout: 5000
      }
    );
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      console.log('✅ Geocoding exitoso para:', address.substring(0, 30));
      console.log('   Resultado:', result.display_name.substring(0, 50));
      
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        _source: 'osm_precise',
        _accuracy: 'high',
        _originalAddress: address
      };
    }
    
    // Si no encuentra con distrito, intentar solo la dirección
    console.log('🔄 Intentando sin distrito...');
    const response2 = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: cleanAddress,
          format: 'json',
          limit: 1,
          countrycodes: 'pe'
        },
        headers: {
          'User-Agent': 'DeliveryApp/1.0'
        }
      }
    );
    
    if (response2.data && response2.data.length > 0) {
      const result = response2.data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        _source: 'osm_address_only',
        _accuracy: 'medium',
        _originalAddress: address
      };
    }
    
    // Fallback a coordenadas del distrito
    console.log('⚠️ No se encontró, usando ubicación del distrito');
    return getSmartDistrictLocation(district, address);
    
  } catch (error) {
    console.error('❌ Error en geocoding:', error.message);
    return getSmartDistrictLocation(district, address);
  }
};

// ==================== DISTRITOS INTELIGENTES ====================

const getSmartDistrictLocation = (district, address = '') => {
  // Centroides de distritos de Lima (más precisos)
  const districtCenters = {
    'SAN MIGUEL': { 
      latitude: -12.0833, 
      longitude: -77.0925,
      bounds: { latDelta: 0.02, lngDelta: 0.02 }
    },
    'SANTIAGO DE SURCO': { 
      latitude: -12.1487, 
      longitude: -76.9978,
      bounds: { latDelta: 0.03, lngDelta: 0.03 }
    },
    'MIRAFLORES': { 
      latitude: -12.1211, 
      longitude: -77.0341,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'SAN ISIDRO': { 
      latitude: -12.0975, 
      longitude: -77.0368,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'SAN BORJA': { 
      latitude: -12.0956, 
      longitude: -77.0078,
      bounds: { latDelta: 0.02, lngDelta: 0.02 }
    },
    'LA VICTORIA': { 
      latitude: -12.0700, 
      longitude: -77.0175,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'LINCE': { 
      latitude: -12.0875, 
      longitude: -77.0361,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'JESUS MARIA': { 
      latitude: -12.0833, 
      longitude: -77.0500,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'BREÑA': { 
      latitude: -12.0667, 
      longitude: -77.0500,
      bounds: { latDelta: 0.01, lngDelta: 0.01 }
    },
    'LIMA': { 
      latitude: -12.0464, 
      longitude: -77.0428,
      bounds: { latDelta: 0.03, lngDelta: 0.03 }
    },
    'CALLAO': { 
      latitude: -12.0667, 
      longitude: -77.1500,
      bounds: { latDelta: 0.03, lngDelta: 0.03 }
    }
  };
  
  const districtUpper = (district || '').toUpperCase().trim();
  const center = districtCenters[districtUpper] || districtCenters['LIMA'];
  
  // Generar coordenadas únicas basadas en la dirección (para que no todos caigan en el mismo punto)
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Variación dentro del distrito (±~500 metros)
  const latOffset = ((hash % 1000) / 100000) - 0.005;
  const lngOffset = ((Math.abs(hash) % 1000) / 100000) - 0.005;
  
  const finalLat = center.latitude + latOffset;
  const finalLng = center.longitude + lngOffset;
  
  console.log(`📍 Distrito ${districtUpper}: ${finalLat.toFixed(6)}, ${finalLng.toFixed(6)}`);
  
  return {
    latitude: finalLat,
    longitude: finalLng,
    _source: 'district_fallback',
    _district: districtUpper,
    _addressHash: hash,
    _accuracy: 'low',
    _originalAddress: address.substring(0, 30)
  };
};

// ==================== FUNCIONES AUXILIARES ====================

// Limpiar cadena de dirección
const cleanAddressString = (address) => {
  if (!address) return '';
  
  // Eliminar caracteres extraños
  let cleaned = address.toString()
    .replace(/[^\w\s,.\-\/áéíóúÁÉÍÓÚñÑ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Abreviaturas comunes
  cleaned = cleaned
    .replace(/\bav\.?\b/gi, 'Avenida')
    .replace(/\bavda\.?\b/gi, 'Avenida')
    .replace(/\bcll\.?\b/gi, 'Calle')
    .replace(/\bjr\.?\b/gi, 'Jirón')
    .replace(/\bpje\.?\b/gi, 'Pasaje')
    .replace(/\blt\.?\b/gi, 'Lote')
    .replace(/\bmz\.?\b/gi, 'Manzana')
    .replace(/\burb\.?\b/gi, 'Urbanización');
  
  return cleaned;
};

// Geocodificar múltiples direcciones
export const geocodeAllAddresses = async (orders) => {
  console.log('🌍 Geocodificando direcciones:', orders.length);
  
  const results = [];
  
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    
    // Extraer dirección de diferentes posibles campos
    const address = order.informacionContacto?.direccion || 
                   order.direccion || 
                   order.address || 
                   '';
    
    const district = order.distrito || order.district || '';
    
    console.log(`  ${i + 1}/${orders.length}: "${address.substring(0, 40)}..."`);
    
    const geocoded = await geocodeAddress(address, district);
    
    results.push({
      ...order,
      coordinate: geocoded,
      realAddress: address,
      distrito: district
    });
    
    // Pequeña pausa para ser amable con el servidor OSM
    if (i < orders.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log(`✅ Geocodificación completada: ${results.length} pedidos`);
  
  // Mostrar resumen
  const sources = results.reduce((acc, order) => {
    const source = order.coordinate?._source || 'unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📊 Fuentes de geocoding:', sources);
  
  return results;
};