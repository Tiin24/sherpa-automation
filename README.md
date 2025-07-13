# 📜 Proyecto de Automatización - Desafíos Arcanos

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![Playwright](https://img.shields.io/badge/Playwright-1.30+-blue) ![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)

Sistema automatizado para resolver desafíos secuenciales en un portal web interactivo, desbloqueando siglos históricos (XIV-XVIII) mediante códigos ocultos en manuscritos PDF.

## 🌟 Características Principales

- **Autenticación segura** con manejo de sesiones
- **Descarga inteligente** de manuscritos por siglo
- **Extracción avanzada** de códigos secretos en PDFs
- **Algoritmo de búsqueda binaria** para resolver desafíos API
- **Navegación adaptativa** entre páginas del portal
- **Sistema de logs detallado** para diagnóstico

## 📚 Conocimientos Técnicos
- **Automatización de navegadores** (manejo de selectores, eventos, waits)

- **Procesamiento de PDFs** (extracción de texto, manejo de buffers)

- **Consumo de APIs REST** (peticiones GET, manejo de parámetros)

- **Algoritmos de búsqueda** (implementación de búsqueda binaria)

- **Manejo de asincronía** (Promesas, async/await)

- **Expresiones regulares** (para extracción de patrones en texto)

## 🛠️ Tecnologías Utilizadas

| Módulo           | Tecnologías                          |
|------------------|--------------------------------------|
| Navegación       | Playwright (Chromium)                |
| PDF Processing   | pdf-parse + fallback a texto plano   |
| API Handling     | Axios con timeout configurable       |
| Challenge Solver | Algoritmos de búsqueda binaria       |
| Core             | Node.js + ES Modules                 |

## 📂 Estructura del Proyecto

```bash
src/
├── main.js                # Punto de entrada principal
├── features/
│   ├── auth.js            # Autenticación y manejo de sesión
│   ├── downloader.js      # Descarga de manuscritos PDF
│   ├── pdfHandler.js      # Extracción de códigos en PDFs
│   ├── navigator.js       # Control de navegación entre páginas
│   ├── unlocker.js        # Lógica de desbloqueo entre siglos
│   ├── apiHandler.js      # Comunicación con API de desafíos
│   ├── apiSolver.js       # Resolución de desafíos binarios
│   └── challengeSolver.js # Interacción con modales
└── core/
    ├── browser.js         # Configuración del navegador
    └── config.js         # Variables globales y credenciales
```
## 🚀 Instalación

```bash
git clone https://github.com/Tiin24/sherpa-automation.git
cd arcano-scraper
npm install
```

## ⚡ Ejecución
```bash
npm start
```

## 📊 Logs de Ejemplo
```plaintext
🔮✨ INICIANDO EL RITUAL DE SCRAPING ARCANO...
🧙‍♂️ Iniciando ritual de entrada...
✅ Login exitoso: Portal desbloqueado
📜 === PROCESANDO SIGLO XIV ===
📜 Buscando manuscrito del siglo XIV...
✅ Descarga completada: manuscrito-XIV.pdf
🔮 ¡Código secreto hallado!: ABC123
```

## 🔄 Flujo de Ejecución

```mermaid
graph TD
    A[Inicio] --> B{{auth.js}}
    
    subgraph "Secuencia Principal"
        B --> C[processCentury XIV]
        C --> D[downloadManuscript]
        D --> E[extractCode]
        E --> F[unlockNextCentury XV]
        F --> G[processCentury XV...]
        G --> H[goToNextPage]
    end

    subgraph "Challenge API"
        H --> I[clickDocumentationButton]
        I --> J[extraerDatosDeModal]
        J --> K[getBookNameForCentury]
        K --> L[obtenerDesafioDesdeAPI]
        L --> M[solveBinarySearchChallenge]
    end

    subgraph "Módulos"
        C & G -.-> N[main.js]
        D -.-> O[downloader.js]
        E -.-> P[pdfHandler.js]
        F -.-> Q[unlocker.js]
        I & J & K -.-> R[challengeSolver.js]
        L -.-> S[apiHandler.js]
        M -.-> T[apiSolver.js]
    end

    style A fill:#2ecc71,stroke:#333
    style subgraph "Secuencia Principal" fill:#f9f9f9,stroke:#2980b9
    style subgraph "Challenge API" fill:#e8f4f8,stroke:#16a085
    style subgraph "Módulos" fill:#f5f5f5,stroke:#7f8c8d
```


## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## ✍️ Autor

Desarrollado por [Isaias Agustin Romero](https://www.linkedin.com/in/isaias-romero//)

