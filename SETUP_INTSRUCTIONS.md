# 🚀 Setup Instructions - RPG Sound Assistant

Esta guía te ayudará a configurar el proyecto en tu entorno local paso a paso, incluyendo todas las correcciones y mejoras implementadas.

## 📋 Requisitos Previos

- **Node.js** versión 14 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js) o **yarn**
- **Cuenta de Spotify** (opcional, pero recomendado)
- **Editor de código** (recomendado: VS Code)
- **Git** (para clonar el repositorio)

## 🏗️ Pasos de Instalación

### 1. Clonar o Crear el Proyecto

#### Opción A: Clonar desde GitHub
```bash
git clone https://github.com/Yeipi/RPGSoundAssistant.git
cd RPGSoundAssistant
```

#### Opción B: Crear nuevo proyecto React
```bash
# Crear nuevo proyecto React
npx create-react-app rpg-sound-assistant
cd rpg-sound-assistant

# Instalar dependencias adicionales
npm install lucide-react
```

### 2. Configurar la Estructura de Carpetas

Si creaste el proyecto desde cero, crea la siguiente estructura en `src/`:

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

### 4. Copiar los Archivos del Proyecto

#### Archivos de Configuración (raíz del proyecto):
- `package.json` → raíz del proyecto
- `.gitignore` → raíz del proyecto
- `README.md` → raíz del proyecto

#### Archivos de Código Principal:
- `src/index.css` → reemplazar el existente
- `src/index.js` → reemplazar el existente
- `src/App.jsx` → reemplazar el existente

#### Archivos de Configuración y Utilidades:
- `src/utils/constants.js`
- `src/config/spotify.js`

#### Servicios:
- `src/services/spotifyAPI.js`
- `src/services/audioService.js`

#### Hooks:
- `src/hooks/useSoundButtons.js`
- `src/hooks/useAudioPlayer.js`
- `src/hooks/useSpotify.js`

#### Componentes:
- `src/components/Header/Header.jsx`
- `src/components/PlayerControls/PlayerControls.jsx`
- `src/components/SoundButton/SoundButton.jsx`
- `src/components/SpotifySearch/SpotifySearch.jsx`
- `src/components/ButtonModal/ButtonModal.jsx`

### 5. Configurar Variables de Entorno

#### 5.1 Crear archivo .env.local

Copia el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

O crea `.env.local` manualmente:
```bash
# Spotify Integration Configuration
REACT_APP_SPOTIFY_CLIENT_ID=tu_client_id_aqui
REACT_APP_REDIRECT_URI=http://127.0.0.1:3000
```

#### 5.2 Configurar Aplicación en Spotify (Opcional pero Recomendado)

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
7. Pégalo en `.env.local` reemplazando `tu_client_id_aqui`

### 6. Instalar Dependencias y Ejecutar

```bash
# Instalar todas las dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

El proyecto se abrirá automáticamente en `http://localhost:3000`, pero deberás acceder mediante `http://127.0.0.1:3000` para que Spotify funcione correctamente.

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

### Configurar Git (Recomendado)

```bash
# Configurar terminaciones de línea para compatibilidad multiplataforma
git config --global core.autocrlf true

# Inicializar repositorio Git (si no clonaste)
git init
git add .
git commit -m "Initial commit: RPG Sound Assistant"
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
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot read property of undefined"
- Verificar que todos los archivos estén en las ubicaciones correctas
- Revisar que los imports en cada archivo sean correctos
- Asegurar que los nombres de archivos coincidan exactamente

### Spotify no conecta
- Verificar que el Client ID esté configurado correctamente en `.env.local`
- **IMPORTANTE**: Usar `http://127.0.0.1:3000` en lugar de `localhost` (Spotify ya no permite localhost)
- Comprobar que la Redirect URI coincida exactamente en Spotify Dashboard (`http://127.0.0.1:3000`)
- Asegurar que estés accediendo a la app desde `http://127.0.0.1:3000`
- Verificar que no haya errores en la consola del navegador

### Audio no reproduce
- Verificar que los archivos de audio estén en `public/audio/`
- Comprobar que las URLs sean correctas (relativas a `public/`)
- Para Spotify: asegurar que tienes cuenta **Premium**
- Verificar que el navegador permita autoplay (interactuar con la página primero)

### Warnings de Git sobre CRLF/LF
```bash
# Configurar Git para manejar terminaciones de línea automáticamente
git config --global core.autocrlf true
```
Estos warnings son normales y no afectan la funcionalidad.

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

## 🔒 Consideraciones de Seguridad

### Variables de Entorno
- **NUNCA** commitees archivos `.env*` al repositorio
- Usa `.env.example` como template para otros desarrolladores
- El `.gitignore` incluido protege automáticamente estos archivos

### Spotify Integration
- El Client ID **NO es secreto** y puede ser público
- **NO hay Client Secret** en aplicaciones frontend (esto es normal)
- La autenticación usa PKCE (Proof Key for Code Exchange) que es seguro

## 🎯 Próximos Pasos

1. **Probar la aplicación**:
   - Crear tu primer botón de sonido
   - Conectar con Spotify (requiere Premium para reproducción)
   - Probar reproducción de audio local

2. **Personalizar**:
   - Agregar tus propios archivos de audio
   - Crear botones para tus escenarios favoritos de RPG
   - Configurar colores y nombres descriptivos

3. **Expandir funcionalidades**:
   - Agregar más tipos de botones
   - Crear presets para diferentes campañas
   - Implementar shortcuts de teclado personalizados

## 📚 Recursos Adicionales

- [Documentación de React](https://reactjs.org/docs)
- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/icons)

## 📧 Soporte

Si tienes problemas durante la configuración:

1. Revisa cada paso cuidadosamente
2. Verifica que todos los archivos estén en las ubicaciones correctas
3. Comprueba la consola del navegador para errores específicos
4. Asegúrate de que todas las dependencias estén instaladas
5. Revisa que las variables de entorno estén configuradas correctamente

## 🎲 ¡Disfruta creando ambientes épicos para tus sesiones de RPG!

---

### 📝 Notas de la Versión Actual

**Características implementadas:**
- ✅ Integración completa con Spotify (Web API + Web Playback SDK)
- ✅ Reproducción de audio local
- ✅ Control avanzado de pausa/resume
- ✅ Búsqueda automática en Spotify
- ✅ Interfaz responsiva y moderna
- ✅ Gestión de playlists
- ✅ Control de volumen unificado
- ✅ Manejo robusto de errores

**Correcciones incluidas:**
- 🔧 Flujo de autenticación Spotify con PKCE
- 🔧 Gestión de tokens y renovación automática
- 🔧 Control mejorado de estado de reproducción
- 🔧 Sincronización entre audio local y Spotify
- 🔧 Manejo de errores de red y permisos
- 🔧 Compatibilidad multiplataforma (Windows/Mac/Linux)