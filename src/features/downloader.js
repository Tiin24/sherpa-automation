const fs = require('fs');
const path = require('path');
const config = require('../core/config');

async function downloadManuscript(page, century = 'XIV') {
  try {
    console.log(`📜 Buscando manuscrito del siglo ${century}...`);
  
    // Selector mejorado para el botón que contiene el span
    const downloadButton = await page.waitForSelector(
      'button:has(span:has-text("Descargar PDF"))',
      { 
        state: 'visible',
        timeout: 30000 // 30 segundos de timeout
      }
    );

    // Verificar que encontramos el botón correcto
    const buttonText = await downloadButton.innerText();
    console.log(`🔘 Botón encontrado: "${buttonText.trim()}"`);

    // Configurar ruta de descarga
    const downloadDir = path.join(__dirname, '../../downloads');
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    const fileName = `manuscrito-${century}.pdf`;
    const filePath = path.join(downloadDir, fileName);

    // Iniciar descarga
    console.log('🖱️ Haciendo click en el botón...');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click(),
      page.waitForTimeout(3000) // Espera para la descarga
    ]);

    // Guardar archivo
    await download.saveAs(filePath);
    console.log(`✅ Descarga completada: ${fileName}`);
    return filePath;

  } catch (error) {
    console.error(`❌ Error al descargar manuscrito ${century}:`, error.message);
    throw error;
  }
}

module.exports = { downloadManuscript };