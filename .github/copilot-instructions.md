# CCA - Correspondentes Bancários Tool

**ALWAYS follow these instructions first and only fallback to additional search or bash commands if the information here is incomplete or found to be in error.**

CCA (Correspondentes Caixa Aqui) is a static web application that helps bank correspondents with loan processes, specifically focused on housing financing. The application is built with HTML, CSS, and JavaScript (ES6 modules) and deployed on GitHub Pages.

## Working Effectively

### Prerequisites
- Any modern web browser
- HTTP server (Python, Node.js, or any static file server)
- No Node.js, npm, or build tools required

### Quick Start
1. **Clone and serve the application:**
   ```bash
   git clone https://github.com/gabriersdev/cca.git
   cd cca
   python3 -m http.server 8000
   ```
   - **TIMING**: Server starts in <1 second. NEVER CANCEL.
   - Application loads in ~10ms
   - Access at: http://localhost:8000

2. **Alternative servers (any will work):**
   ```bash
   # Node.js (if available)
   npx http-server -p 8000
   
   # PHP (if available)
   php -S localhost:8000
   ```

### Application Structure
- **Main page** (`index.html`): Data confirmation and validation
- **Consultas** (`consultas/`): Collection of banking links and tools
- **Arquivos** (`arquivos/`): File management and downloads
- **Desligamento** (`desligamento/`): Process termination workflows

## Testing and Validation

### Manual Validation Scenarios
**ALWAYS test these complete scenarios after making changes:**

1. **Complete Data Entry Workflow:**
   - Navigate to main page (http://localhost:8000)
   - Fill in client data:
     - Name: "João Silva"
     - CPF: "12345678901" (will auto-format to 123.456.789-01)
     - Birth date: "01/01/1990"
     - Email: "joao@exemplo.com"
     - Phone: "(11) 99999-9999"
   - Verify automatic validation removes "Inválido" labels
   - Click "Copiar" button in Resumo section (should show tooltip)
   - Verify "Pendências" field updates automatically with client data
   - Test "Baixar" (download) functionality generates .txt files

2. **Navigation and Page Testing:**
   - Click "Consultas" link → Should open consultas page in new tab
   - Verify consultas page shows organized banking links by category:
     - Cadastro (registration)
     - Dossiê (document management)
     - Útil (utilities)
     - Verificação (verification)
   - Click "Arquivos" link → Should load file management page
   - Click "Desligamento" link → Should load process termination page
   - Test all external links point to correct banking/government systems

3. **Core Features Testing:**
   - Test "Incluir proponente" (add participant) button
   - Verify all "Copiar" (copy) buttons show feedback
   - Test report generation and text downloads
   - Test settings persistence (check browser localStorage)
   - Verify form validation (invalid CPF, email formats)

### Browser Console Validation
- Open browser dev tools (F12)
- Check for project information display:
  ```
  CCA, Version 3.1.0
  Project name: CCA, Developer: Gabriel Ribeiro, Version: 3.1.0...
  New features
  ```
- Verify no JavaScript errors except font loading (which is expected)
- Confirm ES6 module loading works correctly

## Key Technical Details

### No Build Process Required
- This is a **static website** with no compilation or build steps
- All dependencies are included in `assets/js/frameworks/` or loaded via CDN
- ES6 modules are used but work directly in modern browsers
- No package.json, webpack, or npm scripts

### File Organization
```
├── index.html              # Main application page
├── assets/
│   ├── css/               # Stylesheets (Bootstrap + custom)
│   ├── js/
│   │   ├── script.js      # Main application entry point
│   │   ├── modulos/       # ES6 modules for functionality
│   │   ├── frameworks/    # Third-party libraries
│   │   └── classes/       # JavaScript classes
│   └── img/              # Images and icons
├── consultas/            # Banking links page
├── arquivos/             # File management page
├── desligamento/         # Process termination pages
└── manifest.json         # PWA manifest
```

### Dependencies (Already Included)
- Bootstrap 5.x (CSS framework)
- jQuery 3.x (DOM manipulation)
- jQuery Mask (input formatting)
- FileSaver.js (file downloads)
- CryptoJS (data encryption)
- Moment.js (date handling)
- SweetAlert (dialogs)

## Common Development Tasks

### Making Changes
1. **Edit HTML/CSS/JS files directly** - no build step needed
2. **Refresh browser** to see changes immediately
3. **Test manually** using validation scenarios above
4. **Check browser console** for any JavaScript errors

### Adding New Features
- Follow existing ES6 module pattern in `assets/js/modulos/`
- Import new modules in `assets/js/script.js`
- Use existing utility functions from `utilitarios.js`
- Follow Bootstrap CSS framework conventions

### Key JavaScript Modules
- `script.js` - Main entry point and project metadata
- `funcoes-base.js` - Core functionality and event handlers
- `utilitarios.js` - Utility functions (validation, file operations)
- `conteudos.js` - External link definitions for consultas page
- `confirmacao.js` - Data validation and processing logic
- `Settings.js` - Local storage configuration management

### Local Storage Features
- Application uses `localStorage` for user settings
- Key: `cca-configs` stores user preferences (theme, autocomplete, etc.)
- Test settings persistence across browser sessions
- Clear localStorage if settings appear corrupted

## Frequently Used URLs and Links

### Development
- **Local development**: http://localhost:8000
- **Main page**: http://localhost:8000/ (data confirmation)
- **Consultas**: http://localhost:8000/consultas/ (banking links)
- **Arquivos**: http://localhost:8000/arquivos/ (file management)
- **Desligamento**: http://localhost:8000/desligamento/ (process termination)

### Production
- **Live application**: https://gabriersdev.github.io/cca/
- **GitHub repository**: https://github.com/gabriersdev/cca

## Deployment
- **GitHub Pages**: Automatically deploys from main branch
- **Live URL**: https://gabriersdev.github.io/cca/
- **No CI/CD pipelines** - direct file deployment

## Troubleshooting

### Common Issues
1. **CORS errors**: Must serve files via HTTP server, not file:// protocol
2. **Module loading errors**: Ensure all paths in import statements are correct
3. **Local storage issues**: Clear browser cache if settings corruption occurs

### Browser Compatibility
- **Requires modern browser** with ES6 module support
- **Tested on**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+

## Important Notes
- **No build process exists** - do not try to run npm install, npm build, etc.
- **All timing is immediate** - no long-running operations to wait for
- **Manual testing is critical** - no automated test suite exists
- **Always test file download functionality** when making changes to data processing
- **Verify external links work** when modifying consultas page

## External Dependencies (CDN/External)
- Google Fonts (for typography)
- External banking system links (in consultas section)
- Optional API endpoint for AI text generation (graceful fallback if unavailable)