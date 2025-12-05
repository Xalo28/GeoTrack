import { findDistrict, getDistrictCoordinates } from '../constants/districts';

/**
 * Formatea la fecha actual en español
 * @returns {string} Fecha formateada en español
 */
export const formatSpanishDate = () => {
  const date = new Date();
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName.toUpperCase()}, ${day} DE ${month.toUpperCase()} DE ${year}`;
};

/**
 * Formatea una fecha específica en español
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada en español
 */
export const formatSpanishDateFromDate = (date) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName.toUpperCase()}, ${day} DE ${month.toUpperCase()} DE ${year}`;
};

/**
 * Genera un ID de pedido único
 * @param {string} existingId - ID existente (opcional)
 * @returns {string} ID de pedido
 */
export const generateOrderId = (existingId = '') => {
  if (existingId && existingId.trim()) {
    return existingId;
  }
  
  const timestamp = Date.now().toString().slice(-6);
  const randomChars = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `MAN-${timestamp}-${randomChars}`;
};

/**
 * Formatea un número de teléfono peruano
 * @param {string} phone - Número de teléfono sin formato
 * @returns {string} Número de teléfono formateado
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Si tiene código de país (+51), lo mantenemos
  if (cleaned.length === 11 && cleaned.startsWith('51')) {
    const number = cleaned.substring(2);
    return `+51 ${number.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`;
  }
  
  // Para números de 9 dígitos (Perú)
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  // Para otros formatos, devolver el original
  return phone;
};

/**
 * Valida un número de teléfono peruano
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} True si es válido
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  
  // Números peruanos pueden ser 9 dígitos o 11 dígitos con código de país
  const isValidLength = cleaned.length === 9 || cleaned.length === 11;
  const startsWithValidPrefix = /^9/.test(cleaned) || cleaned.startsWith('519');
  
  return isValidLength && startsWithValidPrefix;
};

/**
 * Valida los datos del formulario de pedido
 * @param {Object} formData - Datos del formulario
 * @returns {Object} Objeto con errores y validez
 */
export const validateOrderForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Validar nombre del cliente
  if (!formData.clientName || !formData.clientName.trim()) {
    errors.clientName = 'Nombre del cliente es requerido';
    isValid = false;
  } else if (formData.clientName.trim().length < 3) {
    errors.clientName = 'Nombre debe tener al menos 3 caracteres';
    isValid = false;
  }

  // Validar teléfono
  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = 'Teléfono es requerido';
    isValid = false;
  } else if (!validatePhoneNumber(formData.phone)) {
    errors.phone = 'Teléfono inválido (debe ser un número peruano válido)';
    isValid = false;
  }

  // Validar distrito
  if (!formData.district || !formData.district.trim()) {
    errors.district = 'Distrito es requerido';
    isValid = false;
  } else {
    const foundDistrict = findDistrict(formData.district);
    if (!foundDistrict) {
      errors.district = 'Distrito no válido';
      isValid = false;
    }
  }

  // Validar dirección
  if (!formData.address || !formData.address.trim()) {
    errors.address = 'Dirección es requerida';
    isValid = false;
  } else if (formData.address.trim().length < 10) {
    errors.address = 'Dirección debe ser más específica (mínimo 10 caracteres)';
    isValid = false;
  }

  return { errors, isValid };
};

/**
 * Obtiene coordenadas aproximadas basadas en distrito y dirección
 * @param {string} address - Dirección completa
 * @param {string} district - Distrito
 * @returns {Promise<Object>} Coordenadas {latitude, longitude}
 */
export const getApproximateCoordinates = async (address, district) => {
  try {
    // Primero intentar con el distrito encontrado
    const foundDistrict = findDistrict(district);
    let baseCoords;
    
    if (foundDistrict) {
      baseCoords = getDistrictCoordinates(foundDistrict);
    } else {
      // Coordenadas por defecto de Lima centro
      baseCoords = { latitude: -12.0464, longitude: -77.0428 };
    }
    
    // Agregar offset aleatorio para simular variación dentro del distrito
    const latOffset = (Math.random() * 0.02 - 0.01); // +/- 0.01 grados (~1.1km)
    const lngOffset = (Math.random() * 0.02 - 0.01); // +/- 0.01 grados (~1.1km)

    return {
      latitude: baseCoords.latitude + latOffset,
      longitude: baseCoords.longitude + lngOffset,
    };
  } catch (error) {
    console.error('Error obteniendo coordenadas aproximadas:', error);
    // Coordenadas por defecto en caso de error
    return { latitude: -12.0464, longitude: -77.0428 };
  }
};

/**
 * Formatea la hora actual en formato HH:MM
 * @returns {string} Hora formateada
 */
export const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

/**
 * Capitaliza un texto (primera letra de cada palabra en mayúscula)
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Limpia y normaliza texto para búsqueda
 * @param {string} text - Texto a normalizar
 * @returns {string} Texto normalizado
 */
export const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .trim();
};

/**
 * Genera un color aleatorio para identificación visual
 * @returns {string} Color hexadecimal
 */
export const generateRandomColor = () => {
  const colors = [
    '#5CE1E6', '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
    '#118AB2', '#EF476F', '#7209B7', '#F72585', '#4361EE'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Calcula la distancia entre dos coordenadas (fórmula de Haversine)
 * @param {number} lat1 - Latitud punto 1
 * @param {number} lon1 - Longitud punto 1
 * @param {number} lat2 - Latitud punto 2
 * @param {number} lon2 - Longitud punto 2
 * @returns {number} Distancia en kilómetros
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Formatea un número a moneda peruana (PEN)
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount);
};