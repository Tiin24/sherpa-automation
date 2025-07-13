const config = require('../core/config');

async function unlockNextCentury(page, currentCentury, code) {
  const nextCentury = getNextCentury(currentCentury);
  console.log(`🔓 Preparando para desbloquear el siglo ${nextCentury}...`);

  try {
    await page.waitForLoadState('networkidle');

    const centuryBlockXPath = getCenturyBlockXPath(nextCentury);
    await scrollToCentury(page, centuryBlockXPath);

    const inputXPath = `${centuryBlockXPath}//input[@type='text']`;
    await page.fill(`xpath=${inputXPath}`, code);
    console.log(`🔑 Código ${code} insertado para el siglo ${nextCentury}`);

    const buttonXPath = `${centuryBlockXPath}//button[contains(., 'Desbloquear') and not(@disabled)]`;
    await page.click(`xpath=${buttonXPath}`);

    if (['XVII', 'XVIII'].includes(nextCentury)) {
      await page.waitForSelector('div[role="dialog"][aria-modal="true"]', {
        state: 'visible',
        timeout: config.TIMEOUT
      });

      const closeModalButton = await page.$('button[aria-label="Cerrar modal"]');
      if (closeModalButton) {
        await closeModalButton.click();
        console.log('🚪 Modal cerrado');
      } else {
        console.log('⚠️ No se encontró el botón para cerrar el modal');
      }
    }

    await verifyUnlock(page, centuryBlockXPath);
    console.log(`✅ ¡Siglo ${nextCentury} desbloqueado con éxito!`);
    return true;
  } catch (error) {
    console.error(`❌ Error al desbloquear siglo ${nextCentury}:`, error.message);
    throw error;
  }
}

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

module.exports = { unlockNextCentury };