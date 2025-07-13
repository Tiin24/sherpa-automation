const config = require('../core/config');

async function login(page) {
  try {
    console.log('🧙‍♂️ Iniciando ritual de entrada...');

    // Navegar a la página de login
    await page.goto(config.URL_LOGIN, { 
      waitUntil: 'networkidle',
      timeout: config.TIMEOUT
    });

    // Esperar a que los campos estén visibles
    await page.waitForSelector('input[type="email"]', { 
      state: 'visible',
      timeout: config.TIMEOUT
    });

    // Completar credenciales
    await page.fill('input[type="email"]', config.CREDENTIALS.username);
    await page.fill('input[type="password"]', config.CREDENTIALS.password);

    // Click en el botón de login con manejo de navegación
    await Promise.all([
      page.waitForNavigation({ 
        waitUntil: 'networkidle',
        timeout: config.TIMEOUT 
      }),
      page.click('button[type="submit"]')
    ]);

    // Verificar URL de destino
    const currentUrl = page.url();
    if (!currentUrl.includes('/portal')) {
      throw new Error(`Redirección inesperada a: ${currentUrl}`);
    }

    console.log('✅ Login exitoso: Portal desbloqueado');
    return true;
    
  } catch (error) {
    console.error('❌ Hechizo de login fallido:', error.message);
    return false;
  }
}

module.exports = { login };