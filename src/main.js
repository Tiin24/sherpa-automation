const { launchBrowser } = require('./core/browser');
const { login } = require('./features/auth');
const { downloadManuscript } = require('./features/downloader');
const { extractCodeFromPdf } = require('./features/pdfHandler');
const { unlockNextCentury } = require('./features/unlocker');
const { goToNextPage } = require('./features/navigator');
const {
  clickDocumentationButton,
  extraerDatosDeModal,
  getBookNameForCentury
} = require('./features/challengeSolver');
const { obtenerDesafioDesdeAPI } = require('./features/apiHandler');
const { solveBinarySearchChallenge } = require('./features/apiSolver');

async function processCentury(page, century, previousCode) {
  console.log(`\n📜 === PROCESANDO SIGLO ${century} ===`);

  try {
    if (previousCode) {
      console.log(`🔓 DESBLOQUEANDO SIGLO ${century}...`);
      await unlockNextCentury(page, getPreviousCentury(century), previousCode);
    }

    console.log(`⬇️ DESCARGANDO MANUSCRITO DEL SIGLO ${century}...`);
    const pdfPath = await downloadManuscript(page, century);

    console.log(`🔍 EXTRAYENDO CÓDIGO SECRETO...`);
    const code = await extractCodeFromPdf(pdfPath);

    console.log(`🔑 CÓDIGO DEL SIGLO ${century}: ${code}`);
    return { century, code };
  } catch (error) {
    console.error(`❌ ERROR PROCESANDO SIGLO ${century}:`, error.message);
    throw error;
  }
}

async function processSecondPageCenturies(page, centuries, previousCode) {
  try {
    for (const century of centuries) {
      console.log(`\n📜 === PROCESANDO SIGLO ${century} (PÁGINA 2) ===`);

      console.log(`🔓 DESBLOQUEANDO SIGLO ${century}...`);
      await unlockNextCentury(page, getPreviousCentury(century), previousCode);

      console.log(`⬇️ DESCARGANDO MANUSCRITO DEL SIGLO ${century}...`);
      const pdfPath = await downloadManuscript(page, century);

      console.log(`🔍 EXTRAYENDO CÓDIGO SECRETO...`);
      try {
        const code = await extractCodeFromPdf(pdfPath);
        console.log(`🔑 CÓDIGO DEL SIGLO ${century}: ${code}`);
        return { century, code };
      } catch (error) {
        if (century === 'XVIII') {
          console.log('⚠️ El siglo XVIII no tiene código secreto. Procediendo...');
          return { century, code: null }; // Retorna null para el código
        }
        throw error; // Relanza otros errores
      }
    }
  } catch (error) {
    console.error(`❌ ERROR PROCESANDO SIGLOS DE PÁGINA 2:`, error.message);
    throw error;
  }
}

function getPreviousCentury(current) {
  const centuryOrder = ['XIV', 'XV', 'XVI', 'XVII', 'XVIII'];
  const index = centuryOrder.indexOf(current);
  if (index <= 0) throw new Error(`No hay siglo anterior para ${current}`);
  return centuryOrder[index - 1];
}

async function main() {
  console.log('🔮✨ INICIANDO EL RITUAL DE SCRAPING ARCANO...');

  const { browser, page } = await launchBrowser();
  const firstPageCenturies = ['XIV', 'XV', 'XVI'];
  const secondPageCenturies = ['XVII', 'XVIII'];
  let previousCode = null;

  try {
    console.log('\n🔐 REALIZANDO LOGIN...');
    const loginSuccess = await login(page);
    if (!loginSuccess) throw new Error('Falló el proceso de login');

    for (const century of firstPageCenturies) {
      const result = await processCentury(page, century, previousCode);
      previousCode = result.code;
    }

    console.log('\n🌀 NAVEGANDO A SEGUNDA PÁGINA...');
    await goToNextPage(page);

    try {
      for (const century of secondPageCenturies) {
        console.log(`\n🔄 INTERACTUANDO CON BOTÓN "VER DOCUMENTACIÓN" PARA SIGLO ${century}...`);
        const modalSelector = await clickDocumentationButton(page, century);
        console.log('📄 Procesando contenido del modal...');
        await extraerDatosDeModal(page, modalSelector);

        const bookName = await getBookNameForCentury(page, century);
        console.log(`Nombre encontrado: ${bookName}`);

        const apiResponse = await obtenerDesafioDesdeAPI(bookName, previousCode);
        const { password } = await solveBinarySearchChallenge(apiResponse);

        const result = await processSecondPageCenturies(page, [century], password);

        // Solo actualiza previousCode si existe un código nuevo
        if (result.code) {
          previousCode = result.code;
        }
      }
    } catch (error) {
      if (error.message.includes('No se encontró el código') && century === 'XVIII') {
        console.log('✅ El siglo XVIII no requiere código. Continuando...');
      } else {
        console.error('\n❌ Error al resolver el desafío:', error);
        throw error;
      }
    }

    console.log('\n🌈 ¡TODOS LOS SIGLOS HAN SIDO DESBLOQUEADOS!');
    console.log('🎉 ¡EL GRAN DESAFÍO DEL SCRAPING ARCANO HA SIDO COMPLETADO!');

  } catch (error) {
    console.error('\n💀 EL RITUAL FALLÓ:', error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
    console.log('\n🌀 EL PORTAL SE HA CERRADO.');
  }
}

main().catch(error => {
  console.error('🔥 ERROR NO MANEJADO:', error);
  process.exit(1);
});
