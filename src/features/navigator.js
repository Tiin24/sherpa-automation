// src/features/navigator.js
const config = require('../core/config');

async function goToNextPage(page) {
  try {
    console.log('➡️ BUSCANDO PAGINADOR NUMÉRICO...');
    
    // Esperar paginador
    const paginationSelector = 'div.flex.justify-center.gap-1\\.5.pt-6';
    await page.waitForSelector(paginationSelector, {
      state: 'visible',
      timeout: config.TIMEOUT
    });

    // Verificar página actual
    const currentPageBtn = await page.$(`${paginationSelector} button.bg-sherpa-primary`);
    if (!currentPageBtn) throw new Error('No se pudo identificar la página actual');
    
    const currentPage = await currentPageBtn.textContent();
    if (currentPage === '2') {
      console.log('ℹ️ YA ESTAMOS EN LA PÁGINA 2');
      return true;
    }

    // Navegar a página 2
    console.log('🔄 NAVEGANDO A PÁGINA 2...');
    const page2Button = await page.$(`${paginationSelector} button:nth-child(2)`);
    if (!page2Button) throw new Error('Botón de página 2 no encontrado');
    
    await page2Button.click();

    // Verificar con siglo XVIII
    console.log('🔍 VERIFICANDO CARGA CON SIGLO XVII...');
    await page.waitForSelector('//span[normalize-space()="Siglo XVII"]', {
      state: 'visible',
      timeout: config.LONG_TIMEOUT
    });

    console.log('✅ PÁGINA 2 CARGADA CORRECTAMENTE (VERIFICADO CON SIGLO XVII)');
    return true;

  } catch (error) {
    console.error('❌ ERROR EN NAVEGACIÓN:', error.message);
    throw error;
  }
}

module.exports = { goToNextPage };