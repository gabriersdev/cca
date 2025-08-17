/**
 * Consolidated Form Event Handlers
 * All form-related event handlers organized in one place
 */
import { eventManager } from '../../classes/EventManager.js';
import { isEmpty, sanitizarString, sanitizarNumero, splitArray, criarEBaixarArquivo, resizeTextArea } from '../utilitarios.js';

/**
 * Initialize all form event handlers
 */
export function initializeFormHandlers() {
  initializeLaudoFormHandler();
  initializePercentageCalculationForms();
  initializeFIDDevolutionForm();
  initializeInformacaoAdicionaisForm();
  initializeSearchForms();
  initializeRestrictionsForm();
  initializeTextGeneratorForm();
}

/**
 * Laudo form handler (desligamento page)
 */
function initializeLaudoFormHandler() {
  eventManager.delegateEvent(document, 'submit', '[data-action="form-laudo"]', (e) => {
    e.preventDefault();
    
    const saida = [];
    
    e.target.querySelectorAll('[data-input]').forEach(elemento => {
      if (['textarea', 'input'].includes(elemento.tagName.toLowerCase())) {
        switch (elemento.dataset.input) {
          case 'CPF':
          case 'cpf':
          case 'CEP':
          case 'cep':
          case 'telefone':
            saida.push(`${sanitizarString(elemento.dataset.input.toUpperCase(), ['-', ' '])}: ${sanitizarNumero(elemento.value)}`);
            break;

          case 'descricao':
            saida.push(`${sanitizarString(elemento.dataset.input.toUpperCase(), ['-', ' '])}: ${elemento.value}`);
            break;

          default:
            saida.push(`${sanitizarString(elemento.dataset.input.toUpperCase(), ['-', ' '])}: ${elemento.value.toUpperCase()}`);
            break;
        }
      }
    });

    const matricula = e.target.querySelector('[data-input="matricula"]')?.value || 'DOCUMENTO';
    const conteudo = 'SOLICITAÇÃO DE LAUDO\n\n' + 
                    splitArray(saida, [0, 4]).join('\n') + '\n\n' + 
                    splitArray(saida, [5, 6]).join('\n') + '\n\n' + 
                    splitArray(saida, [7, 10]).join('\n');
    
    criarEBaixarArquivo(JSON.stringify(conteudo), `LAUDO ${matricula}`, 'txt');
  });
}

/**
 * Percentage calculation forms
 */
function initializePercentageCalculationForms() {
  // Percentage calculation for installment
  eventManager.delegateEvent(document, 'submit', '#nav-percent-parcela form', (e) => {
    e.preventDefault();
    calculateInstallmentPercentage(e.target);
  });

  // Percentage calculation for financing
  eventManager.delegateEvent(document, 'submit', '#nav-percent-financiamento form', (e) => {
    e.preventDefault();
    calculateFinancingPercentage(e.target);
  });

  // Required income calculation
  eventManager.delegateEvent(document, 'submit', '#nav-renda-necessaria form', (e) => {
    e.preventDefault();
    calculateRequiredIncome(e.target);
  });

  // Reset handlers for calculation forms
  eventManager.delegateEvent(document, 'reset', '[data-tab] form', (e) => {
    setTimeout(() => {
      const container = e.target.closest('[data-tab]');
      const resultContainer = container?.querySelector('.percent-retorno');
      if (resultContainer) {
        resultContainer.innerHTML = '';
      }
    }, 0);
  });
}

/**
 * FID devolution form
 */
function initializeFIDDevolutionForm() {
  eventManager.delegateEvent(document, 'submit', '#modal-devolucao-fid form', (e) => {
    e.preventDefault();
    handleFIDDevolutionSubmit(e.target);
  });
}

/**
 * Additional information form
 */
function initializeInformacaoAdicionaisForm() {
  eventManager.delegateEvent(document, 'submit', '#modal-informacoes-adicionais form', (e) => {
    e.preventDefault();
    handleAdditionalInfoSubmit(e.target);
  });
}

/**
 * Search forms
 */
function initializeSearchForms() {
  eventManager.delegateEvent(document, 'submit', 'form[data-form="pesquisa"]', (e) => {
    e.preventDefault();
    handleSearchSubmit(e.target);
  });
}

/**
 * Restrictions form
 */
function initializeRestrictionsForm() {
  eventManager.delegateEvent(document, 'submit', '#modal-informar-restricoes form', (e) => {
    e.preventDefault();
    handleRestrictionsSubmit(e.target);
  });
}

/**
 * Text generator form (AI)
 */
function initializeTextGeneratorForm() {
  eventManager.delegateEvent(document, 'submit', '#form-gerar-texto-ia', (e) => {
    e.preventDefault();
    handleTextGeneratorSubmit(e.target);
  });
}

// Form handler implementations

function calculateInstallmentPercentage(form) {
  const rendaBrutaTotal = parseFloat(form.querySelector('#renda-bruta-total')?.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  const parcelaLiberada = parseFloat(form.querySelector('#parcela-liberada')?.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  
  if (rendaBrutaTotal > 0 && parcelaLiberada > 0) {
    const percentual = (parcelaLiberada / rendaBrutaTotal) * 100;
    const resultContainer = form.closest('[data-tab]').querySelector('.percent-retorno');
    
    resultContainer.innerHTML = `
      <div class="alert alert-info mt-3">
        <strong>Resultado:</strong> ${percentual.toFixed(2)}% da renda bruta total
      </div>
    `;
  }
}

function calculateFinancingPercentage(form) {
  const valorCompraVenda = parseFloat(form.querySelector('#valor-de-compra-e-venda')?.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  const valorFinanciado = parseFloat(form.querySelector('#valor-financiado')?.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  
  if (valorCompraVenda > 0 && valorFinanciado > 0) {
    const percentual = (valorFinanciado / valorCompraVenda) * 100;
    const resultContainer = form.closest('[data-tab]').querySelector('.percent-retorno');
    
    resultContainer.innerHTML = `
      <div class="alert alert-info mt-3">
        <strong>Resultado:</strong> ${percentual.toFixed(2)}% do valor de compra e venda
      </div>
    `;
  }
}

function calculateRequiredIncome(form) {
  const percentualCondicionamento = parseFloat(form.querySelector('#percentual-condicionamento')?.value || '0');
  const parcelaNecessaria = parseFloat(form.querySelector('#parcela-necessaria')?.value?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
  
  if (percentualCondicionamento > 0 && parcelaNecessaria > 0) {
    const rendaNecessaria = parcelaNecessaria / (percentualCondicionamento / 100);
    const resultContainer = form.closest('[data-tab]').querySelector('.percent-retorno');
    
    resultContainer.innerHTML = `
      <div class="alert alert-info mt-3">
        <strong>Renda necessária:</strong> R$ ${rendaNecessaria.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    `;
  }
}

function handleFIDDevolutionSubmit(form) {
  // Collect form data
  const formData = new FormData(form);
  const data = {};
  
  // Process radio buttons and regular inputs
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  // Process radio button groups
  const radioGroups = ['dev-financ', 'dev-status-parcela', 'dev-tabela'];
  radioGroups.forEach(group => {
    const checked = form.querySelector(`input[name="${group}"]:checked`);
    if (checked) {
      data[group] = checked.id.replace(`${group}-`, '');
    }
  });
  
  // Generate the devolution text based on collected data
  const devolutionText = generateDevolutionText(data);
  
  // You can either display this in a textarea or download it
  console.log('FID Devolution Data:', devolutionText);
  
  // Close the modal
  $('#modal-devolucao-fid').modal('hide');
}

function handleAdditionalInfoSubmit(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  // Process the additional information
  const infoText = generateAdditionalInfoText(data);
  
  console.log('Additional Info:', infoText);
  
  // Close the modal
  $('#modal-informacoes-adicionais').modal('hide');
}

function handleSearchSubmit(form) {
  const input = form.querySelector('input');
  const searchTerm = input?.value?.trim();
  
  if (!isEmpty(searchTerm)) {
    // Import and call the search function
    import('../funcoes-de-conteudo.js').then(module => {
      if (module.pesquisaConteudo) {
        module.pesquisaConteudo({ target: input, preventDefault: () => {} });
      }
    });
  } else {
    input?.focus();
  }
}

function handleRestrictionsSubmit(form) {
  const textarea = form.querySelector('#text-restricoes');
  const restrictions = textarea?.value?.trim();
  
  if (!isEmpty(restrictions)) {
    // Process the restrictions and add them to the FID devolution form
    const fidForm = document.querySelector('#modal-devolucao-fid');
    const restrictionsInput = fidForm?.querySelector('#dev-restricoes');
    
    if (restrictionsInput) {
      restrictionsInput.value = restrictions;
    }
    
    // Close this modal and return to FID devolution modal
    $('#modal-informar-restricoes').modal('hide');
    $('#modal-devolucao-fid').modal('show');
  }
}

function handleTextGeneratorSubmit(form) {
  const textarea = form.querySelector('#txt-gerar-texto-ia');
  const prompt = textarea?.value?.trim();
  
  if (!isEmpty(prompt)) {
    // Call the AI text generation API
    generateTextWithAI(prompt, form);
  }
}

// Helper functions

function generateDevolutionText(data) {
  let text = 'DEVOLUÇÃO DE FID\n\n';
  
  if (data['dev-financ']) {
    text += `Modalidade: ${data['dev-financ'].toUpperCase()}\n`;
  }
  
  if (data['dev-renda']) {
    text += `Renda: ${data['dev-renda']}\n`;
  }
  
  if (data['dev-parcela']) {
    text += `Parcela: ${data['dev-parcela']}\n`;
  }
  
  if (data['dev-status-parcela']) {
    text += `Status: ${data['dev-status-parcela'].toUpperCase()}\n`;
  }
  
  // Add more fields as needed
  
  return text;
}

function generateAdditionalInfoText(data) {
  let text = 'INFORMAÇÕES ADICIONAIS\n\n';
  
  Object.entries(data).forEach(([key, value]) => {
    if (!isEmpty(value) && key !== 'add-data-hora' && key !== 'limpar-txt-area') {
      const label = key.replace(/id-/, '').replace(/-/g, ' ').toUpperCase();
      text += `${label}: ${value}\n`;
    }
  });
  
  if (data['add-data-hora'] === 'on') {
    text += `\nData/Hora: ${new Date().toLocaleString('pt-BR')}\n`;
  }
  
  return text;
}

async function generateTextWithAI(prompt, form) {
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;
  
  try {
    button.textContent = 'Gerando...';
    button.disabled = true;
    
    const hostname = window.location.hostname;
    const apiUrl = hostname !== 'localhost' 
      ? 'https://gabriers.up.railway.app/api/text-generator' 
      : 'http://localhost:8001/api/text-generator/';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Generated text:', result);
      // Handle the generated text (display in textarea, etc.)
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Error generating text:', error);
    // Show error message to user
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}