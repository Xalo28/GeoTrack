# 🚚 GeoTrack

**GeoTrack** es una aplicación móvil de gestión logística y seguimiento de entregas desarrollada con **React Native** y **Expo**. Diseñada para optimizar el flujo de trabajo de conductores y repartidores, permite la gestión de pedidos, optimización de rutas, escaneo de paquetes mediante QR y seguimiento en tiempo real.

![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![Framework](https://img.shields.io/badge/Framework-React%20Native%20%7C%20Expo-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características Principales

* **🔐 Autenticación Segura:** Inicio de sesión integrado con **Auth0**.
* **📊 Dashboard Interactivo:** Resumen en tiempo real de pedidos pendientes, entregados y métricas de rendimiento.
* **🗺️ Rutas Optimizadas:**
    * Algoritmo del "Vecino más cercano" para ordenar paradas eficientemente.
    * Integración con **Google Maps** para navegación y visualización de rutas.
    * Cálculo de tiempos y distancias estimadas.
* **📦 Gestión de Pedidos:**
    * Listado detallado de pedidos por distrito.
    * Ingreso manual de pedidos con autocompletado de direcciones (Google Places).
    * Detalle de pedido con acciones rápidas (Llamar, SMS, Navegar).
* **📷 Escaneo Inteligente (QR):**
    * Flujo de escaneo en dos fases para validación de paquetes.
    * Lectura de estructuras JSON complejas desde códigos QR.
* **⚙️ Configuración y Perfil:**
    * Gestión de perfil de conductor.
    * Ajustes de seguridad (Biometría, cambio de contraseña).
    * Modo Offline y preferencias de idioma/tema.

## 🛠️ Stack Tecnológico

* **Core:** [React Native](https://reactnative.dev/) (v0.76+), [Expo](https://expo.dev/) (SDK 52).
* **Navegación:** [React Navigation](https://reactnavigation.org/) (Stack).
* **Mapas y Ubicación:** `react-native-maps`, `expo-location`, `react-native-maps-directions`.
* **Cámara:** `expo-camera`.
* **UI/UX:** `expo-linear-gradient`, `@expo/vector-icons`.
* **Estado Global:** React Context API (`OrdersContext`).
* **Autenticación:** `expo-auth-session` (Auth0).

## 🚀 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### Prerrequisitos

* Node.js (LTS recomendado)
* npm o yarn
* Expo CLI (`npm install -g expo-cli`)
* Dispositivo físico o emulador (Android Studio / Xcode)

### Pasos

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/geotrack.git](https://github.com/tu-usuario/geotrack.git)
    cd geotrack
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y agrega tu API Key de Google Maps (necesaria para mapas y geocodificación):

    ```env
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_aqui
    ```

    > **Nota:** Asegúrate de que tu API Key tenga habilitados los servicios de Maps SDK for Android/iOS, Directions API y Places API.

4.  **Ejecutar la aplicación:**
    ```bash
    npx expo start
    ```
    * Presiona `a` para Android.
    * Presiona `i` para iOS.
    * Escanea el QR con la app **Expo Go** en tu dispositivo físico.

## 📂 Estructura del Proyecto

```text
GeoTrack/
├── assets/                 # Iconos, splash screens e imágenes estáticas
├── src/
│   ├── components/         # Componentes reutilizables (Help, Banners, etc.)
│   ├── constants/          # Datos estáticos (FAQ, items de menú)
│   ├── context/            # Estado global (OrdersContext)
│   ├── hooks/              # Hooks personalizados (useRouteOptimization)
│   ├── screens/            # Pantallas de la aplicación
│   │   ├── HomeScreen.js       # Pantalla principal / Dashboard
│   │   ├── PedidosScreen.js    # Lista y Mapa de pedidos
│   │   ├── ScanPhase1Screen.js # Escáner QR
│   │   ├── ManualOrderScreen.js# Formulario de nuevo pedido
│   │   └── ... (Profile, Settings, Login, etc.)
│   ├── styles/             # Estilos compartidos
│   └── utils/              # Funciones auxiliares (geocoding, helpers, rutas)
├── App.js                  # Punto de entrada y navegación principal
├── app.json                # Configuración de Expo
├── babel.config.js         # Configuración de Babel
└── package.json            # Dependencias y scripts
