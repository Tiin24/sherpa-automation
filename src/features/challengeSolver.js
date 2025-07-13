const config = require('../core/config');
const fs = require('fs');
const path = require('path');

async function clickDocumentationButton(page, century = 'XVII') {
  try {
    console.log(`🔍 Buscando bloque del Siglo ${century}...`);
    const centuryBlock = await page.locator(`//div[contains(@class, "flex-col")][.//span[normalize-space()="Siglo ${century}"]]`);
    await centuryBlock.waitFor({ state: 'visible', timeout: config.LONG_TIMEOUT });

    console.log('🕵️ Buscando botón "Ver Documentación"...');
    const button = centuryBlock.locator('button:has-text("Ver Documentación")');
    await button.waitFor({ state: 'visible', timeout: config.LONG_TIMEOUT });

    await button.hover();
    const isEnabled = await button.isEnabled();
    if (!isEnabled) throw new Error('El botón está deshabilitado');

    console.log('🖱️ Haciendo click en "Ver Documentación"...');
    await button.click({ delay: 500 });

    const modalSelector = 'div[role="dialog"][aria-modal="true"]';
    await page.waitForSelector(modalSelector, { state: 'visible', timeout: config.LONG_TIMEOUT });
    console.log('✅ Modal de desafío abierto');

    return modalSelector;
  } catch (error) {
    console.error('❌ Error al abrir modal:', error.message);
    throw new Error(`Fallo al abrir el desafío: ${error.message}`);
  }
}


async function extraerDatosDeModal(page, modalSelector) {
  console.log('🧩 Extrayendo datos del modal y guardando en config.js...');

  // Extraer endpoint de API
  const endpointLocator = page.locator(`${modalSelector} pre`);
  const endpoint = (await endpointLocator.textContent())?.trim();

  if (!endpoint || !endpoint.startsWith('http')) {
    throw new Error('❌ No se pudo extraer el endpoint de la API');
  }

  // Extraer nombres de parámetros
  const paramItems = await page.locator(`${modalSelector} li code`).allTextContents();
  const paramNames = paramItems.map(p => p.trim());

  if (!paramNames.includes('bookTitle') || !paramNames.includes('unlockCode')) {
    throw new Error('❌ No se encontraron los parámetros esperados en el modal');
  }

  // Guardar en config
  config.API_CONFIG = {
    endpoint,
    params: paramNames
  };

  console.log('✅ API_CONFIG actualizado en config.js:');
  console.log(config.API_CONFIG);

  // 4. Cerrar el modal
  const closeBtn = page.locator(`${modalSelector} button[aria-label="Cerrar modal"]`);
  await closeBtn.click();
  console.log('🚪 Modal cerrado');

  return config.API_CONFIG;
}

async function getBookNameForCentury(page, century = 'XVII') {
  try {
    // 1. Localizar el bloque del siglo
    const centuryBlock = await page.locator(`//div[contains(@class, "flex-col")][.//span[normalize-space()="Siglo ${century}"]]`);

    // 2. Buscar el h3 dentro de ese bloque
    const bookName = await centuryBlock.locator('h3').first().textContent();

    console.log(`📖 Nombre del libro para el siglo ${century}:`, bookName.trim());
    return bookName.trim();
  } catch (error) {
    console.error(`❌ Error al buscar nombre del libro para siglo ${century}:`, error);
    throw error;
  }
}

module.exports = {
  clickDocumentationButton,
  extraerDatosDeModal,
  getBookNameForCentury
};