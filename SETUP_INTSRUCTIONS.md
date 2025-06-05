# 🚀 Setup Instructions - RPG Sound Assistant

Esta guía te ayudará a configurar el proyecto en tu entorno local paso a paso.

## 📋 Requisitos Previos

- **Node.js** versión 14 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js) o **yarn**
- **Cuenta de Spotify** (opcional, pero recomendado)
- **Editor de código** (recomendado: VS Code)

## 🏗️ Pasos de Instalación

### 1. Crear el Proyecto

```bash
# Crear nuevo proyecto React
npx create-react-app rpg-sound-assistant
cd rpg-sound-assistant

# Instalar dependencias adicionales
npm install lucide-react
```

### 2. Configurar la Estructura de Carpetas

Crea la siguiente estructura de carpetas en `src/`:

```
src/
├── components/
│   ├── Header/
│   ├── PlayerControls/
│   ├── SoundButton/
│   ├── ButtonModal/
│   └── SpotifySearch/
├── hooks/
├── services/
├── utils/
└── config/
```

```bash
# Comandos para crear las carpetas
mkdir -p src/components/Header
mkdir -p src/components/PlayerControls
mkdir -p src/components/SoundButton
mkdir -p src/components/ButtonModal
mkdir -p src/components/SpotifySearch
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils
mkdir -p src/config
```

### 3. Configurar Tailwind CSS

```bash
# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Actualiza `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Copiar los Archivos

Copia cada archivo de los artifacts proporcionados en su ubicación correspondiente:

#### Archivos de Configuración:
- `package.json` → raíz del proyecto
- `.env` → raíz del proyecto (renombrar a `.env.local`)
- `src/index.css` → reemplazar el existente
- `src/index.js` → reemplazar el existente

#### Archivos de Código:
- `src/utils/constants.js`
- `src/config/spotify.js`
- `src/services/spotifyAPI.js`
- `src/services/audioService.js`
- `src/hooks/useSoundButtons.js`
- `src/hooks/useAudioPlayer.js`
- `src/hooks/useSpotify.js`
- `src/components/Header/Header.jsx`
- `src/components/PlayerControls/PlayerControls.jsx`
- `src/components/SoundButton/SoundButton.jsx`
- `src/components/SpotifySearch/SpotifySearch.jsx`
- `src/components/ButtonModal/ButtonModal.jsx`
- `src/App.jsx` → reemplazar el existente

### 5. Configurar Spotify (Opcional pero Recomendado)

#### 5.1 Crear Aplicación en Spotify

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Inicia sesión con tu cuenta de Spotify
3. Haz clic en "Create App"
4. Llena los campos:
   - **App name**: "RPG Sound Assistant"
   - **App description**: "Audio manager for RPG sessions"
   - **Website**: `http://127.0.0.1:3000`
   - **Redirect URI**: `http://127.0.0.1:3000`
5. Acepta los términos y crea la app
6. Copia el **Client ID**

#### 5.2 Configurar Variables de Entorno

Edita el archivo `.env.local`:
```bash
REACT_APP_SPOTIFY_CLIENT_ID=tu_client_id_aqui
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
```

### 6. Ejecutar el Proyecto

```bash
# Instalar todas las dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

El proyecto se abrirá automáticamente en `http://127.0.0.1:3000`

## 🔧 Configuración Adicional

### Configurar HTTPS (Opcional)

Para usar HTTPS en desarrollo (requerido por algunas funciones de Spotify):

```bash
# En Windows
set HTTPS=true && npm start

# En macOS/Linux
HTTPS=true npm start
```

### Configurar Puerto Personalizado

```bash
# En Windows
set PORT=3001 && npm start

# En macOS/Linux
PORT=3001 npm start
```

## 🎵 Configuración de Audio Local

### Preparar Archivos de Audio

1. **Crear carpeta de audio**:
   ```bash
   mkdir public/audio
   ```

2. **Agregar archivos de audio**:
   - Formatos soportados: MP3, WAV, OGG
   - Ubicación: `public/audio/`
   - URLs de ejemplo: `./audio/combat-music.mp3`

3. **Estructura recomendada**:
   ```
   public/audio/
   ├── combat/
   │   ├── battle-theme.mp3
   │   └── boss-fight.mp3
   ├── ambience/
   │   ├── tavern.mp3
   │   └── forest.mp3
   └── effects/
       ├── thunder.mp3
       └── magic-spell.mp3
   ```

## 🚨 Resolución de Problemas

### Error: "Module not found"
```bash
# Limpiar cache e instalar dependencias
npm ci
```

### Error: "Cannot read property of undefined"
- Verificar que todos los archivos estén en las ubicaciones correctas
- Revisar que los imports en cada archivo sean correctos

### Spotify no conecta
- Verificar que el Client ID esté configurado correctamente
- Comprobar que la Redirect URI coincida exactamente
- Asegurar que estés usando HTTPS si es necesario

### Audio no reproduce
- Verificar que los archivos de audio estén en `public/audio/`
- Comprobar que las URLs sean correctas (relativas a `public/`)
- Para Spotify: asegurar que tienes cuenta Premium

## 📱 Desarrollo Mobile

Para probar en dispositivos móviles:

1. **Encontrar tu IP local**:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. **Acceder desde móvil**:
   - URL: `http://TU_IP:3000`
   - Ejemplo: `http://192.168.1.100:3000`

## 🎯 Próximos Pasos

1. **Probar la aplicación**:
   - Crear tu primer botón de sonido
   - Conectar con Spotify
   - Probar reproducción de audio

2. **Personalizar**:
   - Agregar tus propios archivos de audio
   - Crear botones para tus escenarios favoritos
   - Configurar colores y nombres descriptivos

3. **Expandir**:
   - Agregar más funcionalidades
   - Crear presets para diferentes campañas
   - Implementar shortcuts de teclado

## 📧 Soporte

Si tienes problemas durante la configuración:

1. Revisa cada paso cuidadosamente
2. Verifica que todos los archivos estén en las ubicaciones correctas
3. Comprueba la consola del navegador para errores específicos
4. Asegúrate de que todas las dependencias estén instaladas

¡Disfruta creando ambientes épicos para tus sesiones de RPG! 🎲🎵