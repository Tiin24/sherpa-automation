// src/features/pdfHandler.js
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function extractCodeFromPdf(filePath) {
  console.log(`🧙‍♂️ Buscando el código oculto en el manuscrito: ${path.basename(filePath)}`);

  try {
    // 1. Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error('El manuscrito no fue encontrado en el camino arcano');
    }

    // 2. Leer el archivo con magia moderna (File System)
    const buffer = fs.readFileSync(filePath);

    // 3. Extraer texto con conjuro pdf-parse o runas antiguas
    let text = '';
    try {
      const data = await pdf(buffer);
      text = data.text;
    } catch (parseError) {
      console.log('⚠️ El conjuro pdf-parse falló, intentando con magia antigua...');
      text = buffer.toString('latin1');
    }

    // 4. Invocar el conjuro de búsqueda mejorado
    const regex = /(c.{0,5}digo|clave|contrase.{0,3}a|palabra sagrada)[^\n:]{0,30}(secreto|acceso|final)?[^\n:]{0,30}:?\s*([A-Z0-9]{6,})/i;
    const match = text.match(regex);

    if (match) {
      const code = match[3].trim();
      console.log(`🔮 ¡Código secreto hallado!: ${code}`);
      return code;
    } else {
      // Guardar texto para diagnóstico
      const txtPath = filePath.replace(/\.pdf$/, '.txt');
      fs.writeFileSync(txtPath, text, 'utf8');
      throw new Error(`No se encontró el código. Texto completo guardado en ${txtPath}`);
    }
  } catch (error) {
    console.error(`💀 Hechizo fallido: ${error.message}`);
    
    // Guardar copia del PDF problemático
    const errorPdfPath = path.join(path.dirname(filePath), 'error_pdf.pdf');
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, errorPdfPath);
      console.log(`📜 Se guardó copia del manuscrito problemático en ${errorPdfPath}`);
    }
    
    throw error;
  }
}

module.exports = { extractCodeFromPdf };