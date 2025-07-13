const axios = require('axios');
const config = require('../core/config');

async function obtenerDesafioDesdeAPI(bookTitle, unlockCode) {
  console.log('🌐 Invocando API sagrada...');

  const { endpoint, params } = config.API_CONFIG;

  if (!endpoint || !params?.includes('bookTitle') || !params?.includes('unlockCode')) {
    throw new Error('⚠️ Configuración incompleta en API_CONFIG');
  }

  // Construir query string según el orden correcto de los parámetros
  const url = `${endpoint}?${params.map(p => `${p}=${encodeURIComponent(p === 'bookTitle' ? bookTitle : unlockCode)}`).join('&')}`;

  try {
    console.log('📡 URL construida:', url);
    console.log('📤 bookTitle:', bookTitle);
    console.log('📤 unlockCode:', unlockCode);


    const response = await axios.get(url, { timeout: 15000 });

    if (response.status !== 200 || !response.data) {
      throw new Error(`Respuesta inesperada: ${response.status}`);
    }

    console.log('✅ Desafío recibido correctamente');
    return response.data;
  } catch (error) {
    console.error('❌ Error al consultar la API:', error.message);
    throw error;
  }
}

module.exports = { obtenerDesafioDesdeAPI };