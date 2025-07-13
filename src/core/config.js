// src/core/config.js
module.exports = {
  URL_LOGIN: 'https://pruebatecnica-sherpa-production.up.railway.app/login',
  PORTAL_URL: 'https://pruebatecnica-sherpa-production.up.railway.app/portal',
  CREDENTIALS: {
    username: 'monje@sherpa.local',
    password: 'cript@123'
  },
  TIMEOUT: 60000,       // 60 segundos para operaciones normales
  LONG_TIMEOUT: 120000, // 120 segundos para operaciones críticas
  HEADLESS: false,      // Cambiar a true en producción
  SLOW_MO: 200,         // Pausas entre acciones (ms)
  DOWNLOAD_DIR: './downloads',
  SPECIAL_API_TIMEOUT: 30000, // 30 segundos para APIs
  API_CONFIG: {} // esto lo vamos a llenar dinámicamente
};