const { launchBrowser } = require('./core/browser');
const { login } = require('./features/auth');

async function main() {
  console.log('🚀 Iniciando el scraping arcano...');
  
  const { browser, page } = await launchBrowser();
  
  try {
    // Paso 1: Login
    if (!await login(page)) {
      throw new Error('No se pudo completar el login');
    }
    
    console.log('🔮 Continuando con los manuscritos...');
    // Aquí irá el resto de la lógica
    
  } catch (error) {
    console.error('💀 Hechizo fallido:', error);
  } finally {
    await browser.close();
    console.log('🏁 Ritual completado');
  }
}

main();