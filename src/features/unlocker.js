// src/features/unlocker.js
const config = require('../core/config');

async function unlockNextCentury(page, currentCentury, code) {
  const nextCentury = getNextCentury(currentCentury);
  console.log(`🔓 Preparando para desbloquear el siglo ${nextCentury}...`);

  try {
    // 1. Esperar a que la página esté estable
    await page.waitForLoadState('networkidle');
    
    // 2. Localizar el bloque del siglo objetivo
    const centuryBlockXPath = getCenturyBlockXPath(nextCentury);
    await scrollToCentury(page, centuryBlockXPath);
    
    // 3. Llenar el código
    const inputXPath = `${centuryBlockXPath}//input[@type='text']`;
    await page.fill(`xpath=${inputXPath}`, code);
    console.log(`🔑 Código ${code} insertado para el siglo ${nextCentury}`);
    
    // 4. Click en desbloquear
    const buttonXPath = `${centuryBlockXPath}//button[contains(., 'Desbloquear') and not(@disabled)]`;
    await page.click(`xpath=${buttonXPath}`);
    
    // 5. Verificar desbloqueo
    await verifyUnlock(page, centuryBlockXPath);
    
    console.log(`✅ ¡Siglo ${nextCentury} desbloqueado con éxito!`);
    return true;
  } catch (error) {
    console.error(`❌ Error al desbloquear siglo ${nextCentury}:`, error.message);
    await takeDebugScreenshots(page, nextCentury);
    throw error;
  }
}

// Funciones auxiliares
function getNextCentury(current) {
  const centuryOrder = ['XIV', 'XV', 'XVI', 'XVII', 'XVIII'];
  const currentIndex = centuryOrder.indexOf(current);
  if (currentIndex === -1 || currentIndex >= centuryOrder.length - 1) {
    throw new Error('No hay siglos posteriores para desbloquear');
  }
  return centuryOrder[currentIndex + 1];
}

function getCenturyBlockXPath(century) {
  return `//div[contains(@class, 'flex-col')][.//span[normalize-space()='Siglo ${century}']]`;
}

async function scrollToCentury(page, xpath) {
  await page.waitForSelector(`xpath=${xpath}`, { state: 'attached' });
  await page.$eval(`xpath=${xpath}`, el => el.scrollIntoView());
  await page.waitForSelector(`xpath=${xpath}`, { state: 'visible' });
}

async function verifyUnlock(page, centuryBlockXPath) {
  const downloadButtonXPath = `${centuryBlockXPath}//button[contains(., 'Descargar PDF')]`;
  await page.waitForSelector(`xpath=${downloadButtonXPath}`, {
    state: 'visible',
    timeout: config.TIMEOUT
  });
}

async function takeDebugScreenshots(page, century) {
  await page.screenshot({ path: `error-unlock-${century}.png` });
  await page.screenshot({ path: `error-unlock-${century}-full.png`, fullPage: true });
  console.log('📸 Capturas de diagnóstico guardadas');
}

module.exports = { unlockNextCentury };