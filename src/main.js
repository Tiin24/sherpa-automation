// src/main.js
const { launchBrowser } = require('./core/browser');
const { login } = require('./features/auth');
const { downloadManuscript } = require('./features/downloader');
const { extractCodeFromPdf } = require('./features/pdfHandler');
const { unlockNextCentury } = require('./features/unlocker');

async function processCentury(page, century) {
  console.log(`\n📜 === PROCESANDO SIGLO ${century} ===`);
  const pdfPath = await downloadManuscript(page, century);
  const code = await extractCodeFromPdf(pdfPath);
  return { century, code };
}

async function main() {
  console.log('🔮✨ INICIANDO EL RITUAL DE SCRAPING ARCANO...');
  
  const { browser, page } = await launchBrowser();
  const firstPageCenturies = ['XIV', 'XV', 'XVI'];
  const secondPageCenturies = ['XVII', 'XVIII'];
  let previousCode = null;
  
  try {
    // 1. Autenticación
    console.log('\n🔐 REALIZANDO LOGIN...');
    await login(page);
    
    // 2. Procesar siglos de la primera página
    for (let i = 0; i < firstPageCenturies.length; i++) {
      const century = firstPageCenturies[i];
      
      if (i > 0) {
        console.log(`\n🔓 DESBLOQUEANDO SIGLO ${century}...`);
        await unlockNextCentury(page, firstPageCenturies[i-1], previousCode);
      }
      
      const result = await processCentury(page, century);
      previousCode = result.code;
      console.log(`✅ SIGLO ${century} COMPLETADO. CÓDIGO: ${previousCode}`);
    }
    
    console.log('\n🌈 ¡TODOS LOS SIGLOS HAN SIDO DESBLOQUEADOS!');
    console.log('🎉 ¡EL GRAN DESAFÍO DEL SCRAPING ARCANO HA SIDO COMPLETADO!');
    
  } catch (error) {
    console.error('\n💀 EL RITUAL FALLÓ:', error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log('\n🏁 EL PORTAL SE HA CERRADO.');
  }
}

main().catch(console.error);