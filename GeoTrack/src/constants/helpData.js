export const faqItems = [
  {
    id: 1,
    question: '¿Cómo escaneo un pedido?',
    answer: 'Ve al inicio y pulsa el botón "QR" o "Escanear". Enfoca el código de barras del paquete.',
    icon: 'qr-code-scanner',
    color: '#5CE1E6'
  },
  {
    id: 2,
    question: '¿Qué hago si no tengo internet?',
    answer: 'La app guardará los datos localmente y los subirá cuando recuperes conexión.',
    icon: 'wifi-off',
    color: '#5CE1E6'
  },
  {
    id: 3,
    question: '¿Cómo cambio mi contraseña?',
    answer: 'Ve al menú > Seguridad > Cambiar Contraseña.',
    icon: 'vpn-key',
    color: '#5CE1E6'
  },
  {
    id: 4,
    question: '¿Cómo reportar un problema técnico?',
    answer: 'Contacta a soporte técnico con "Reportar Problema" o llamando al 01-800-GEOTRACK.',
    icon: 'report-problem',
    color: '#5CE1E6'
  },
  {
    id: 5,
    question: '¿La app funciona en segundo plano?',
    answer: 'Sí, permite notificaciones y procesos mientras está en segundo plano.',
    icon: 'background',
    color: '#5CE1E6'
  },
  {
    id: 6,
    question: '¿Cómo actualizar mis datos personales?',
    answer: 'Ve a Menú > Perfil > Editar Perfil.',
    icon: 'person',
    color: '#5CE1E6'
  }
];

export const contactItems = [
  {
    id: 1,
    title: 'Llamada Telefónica',
    description: '01-800-GEOTRACK',
    icon: 'phone',
    color: '#5CE1E6',
    action: () => Linking.openURL('tel:01800GEOTRACK')
  },
  {
    id: 2,
    title: 'Correo Electrónico',
    description: 'soporte@geotrack.com',
    icon: 'email',
    color: '#FFA726',
    action: () => Linking.openURL('mailto:soporte@geotrack.com')
  },
  {
    id: 3,
    title: 'Chat en Vivo',
    description: 'Disponible 24/7',
    icon: 'chat',
    color: '#4ECB71',
    action: () => console.log('Abrir chat en vivo')
  }
];
