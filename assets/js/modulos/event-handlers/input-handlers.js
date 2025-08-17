/**
 * Consolidated Input Event Handlers
 * All input-related event handlers organized in one place
 */
import { eventManager } from '../../classes/EventManager.js';
import { isEmpty, resizeTextArea, verificarCPF, verificarData, verificarEmail, capitalize } from '../utilitarios.js';
import { renderResumo } from '../funcoes-render.js';

/**
 * Initialize all input event handlers
 */
export function initializeInputHandlers() {
  initializeNameInputHandlers();
  initializeCPFInputHandlers();
  initializeEmailInputHandlers();
  initializeDateInputHandlers();
  initializePhoneInputHandlers();
  initializeTextareaHandlers();
  initializeCheckboxHandlers();
  initializeFIDInputHandlers();
  initializeGeneralInputHandlers();
}

/**
 * Name input handlers
 */
function initializeNameInputHandlers() {
  eventManager.delegateEvent(document, 'input', '[data-input="nome"]', (e) => {
    const input = e.target;
    const container = input.closest('[data-identify]');
    
    if (container) {
      container.querySelectorAll('[data-content="nome"]').forEach(content => {
        content.textContent = !isEmpty(input.value) ? input.value.toUpperCase() : 'Nome do cliente';
      });
      renderResumo();
    }
  });
}

/**
 * CPF input handlers
 */
function initializeCPFInputHandlers() {
  eventManager.delegateEvent(document, 'blur', '[data-input="cpf"]', (e) => {
    const input = e.target;
    if (!isEmpty(input.value)) {
      const cpfValido = verificarCPF(input.value);
      updateInputValidation(input, cpfValido, 'CPF inválido');
    }
  });

  eventManager.delegateEvent(document, 'input', '[data-input="cpf"]', (e) => {
    clearInputValidation(e.target);
  });
}

/**
 * Email input handlers
 */
function initializeEmailInputHandlers() {
  eventManager.delegateEvent(document, 'blur', '[data-input="email"]', (e) => {
    const input = e.target;
    if (!isEmpty(input.value)) {
      const emailValido = verificarEmail(input.value);
      updateInputValidation(input, emailValido, 'Email inválido');
    }
  });

  eventManager.delegateEvent(document, 'input', '[data-input="email"]', (e) => {
    clearInputValidation(e.target);
  });
}

/**
 * Date input handlers
 */
function initializeDateInputHandlers() {
  eventManager.delegateEvent(document, 'blur', '[data-input="data_nascimento"]', (e) => {
    const input = e.target;
    if (!isEmpty(input.value)) {
      const dataValida = verificarData(input.value);
      updateInputValidation(input, dataValida, 'Data inválida');
    }
  });

  eventManager.delegateEvent(document, 'input', '[data-input="data_nascimento"]', (e) => {
    clearInputValidation(e.target);
  });
}

/**
 * Phone input handlers
 */
function initializePhoneInputHandlers() {
  eventManager.delegateEvent(document, 'input', '[data-input="telefone"]', (e) => {
    // Phone validation could be added here if needed
    clearInputValidation(e.target);
  });
}

/**
 * Textarea handlers
 */
function initializeTextareaHandlers() {
  eventManager.delegateEvent(document, 'input', 'textarea', (e) => {
    resizeTextArea(e.target);
  });

  // Modal textarea handlers
  eventManager.delegateEvent(document, 'input', '#modal-devolucao-fid textarea', (e) => {
    resizeTextArea(e.target);
  });
}

/**
 * Checkbox handlers
 */
function initializeCheckboxHandlers() {
  // Checkbox styling for custom checkboxes
  eventManager.delegateEvent(document, 'change', 'input[type="checkbox"][data-element="input"]', (e) => {
    updateCheckboxButtonStyle(e.target);
  });

  // Analysis checklist handlers
  eventManager.delegateEvent(document, 'input', '[data-form="checklist-analise-internalizada"] input[type=checkbox]', (e) => {
    try {
      const label = e.target.closest('div.form-group').querySelector('label');
      if (e.target.checked) {
        label.innerHTML = `<s>${label.textContent}</s>`;
      } else {
        label.innerHTML = label.textContent;
      }
    } catch (error) {
      console.warn('Error updating checkbox label:', error);
    }
  });
}

/**
 * FID input handlers
 */
function initializeFIDInputHandlers() {
  eventManager.delegateEvent(document, 'input', '[data-input="id-fid"]', (e) => {
    const input = e.target;
    const container = input.closest('.form-group');
    
    if (container) {
      const buttons = container.querySelectorAll('[data-element="btn-ref-link-FID"]');
      
      if (!isEmpty(input.value) && input.value.trim().length > 0) {
        buttons.forEach(btn => btn.removeAttribute('disabled'));
      } else {
        buttons.forEach(btn => btn.setAttribute('disabled', 'true'));
      }
    }
  });
}

/**
 * General input handlers for field tracking
 */
function initializeGeneralInputHandlers() {
  // Track field changes for before unload warning
  eventManager.delegateEvent(document, 'input', 'input, textarea', (e) => {
    // This helps track changes for the before unload warning
    // The actual implementation is handled in funcoes-base.js
  });
}

/**
 * Helper function to update input validation styling
 */
function updateInputValidation(input, isValid, errorMessage) {
  clearInputValidation(input);
  
  if (!isValid) {
    input.classList.add('is-invalid');
    
    // Add error message if it doesn't exist
    let feedback = input.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.classList.add('invalid-feedback');
      input.parentNode.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
  } else {
    input.classList.add('is-valid');
  }
}

/**
 * Helper function to clear input validation styling
 */
function clearInputValidation(input) {
  input.classList.remove('is-invalid', 'is-valid');
  
  const feedback = input.parentNode.querySelector('.invalid-feedback');
  if (feedback) {
    feedback.remove();
  }
}

/**
 * Helper function to update checkbox button styling
 */
function updateCheckboxButtonStyle(input) {
  const btn = input.closest('div.form-group')?.querySelector('label.btn');
  if (btn) {
    if (input.checked) {
      btn.classList.add('checked');
    } else {
      btn.classList.remove('checked');
    }
  }
}

/**
 * Setup input masking and formatting
 */
export function setupInputMasking() {
  // This function handles the input masking that was previously in tratamentoCampos
  const inputs = document.querySelectorAll('[data-element="input"]');
  
  inputs.forEach(input => {
    applyInputMask(input);
  });
}

/**
 * Apply appropriate mask to input based on data attributes
 */
function applyInputMask(input) {
  if (!input.dataset.input && !input.dataset.maskc) return;
  
  $(document).ready(function () {
    switch (input.dataset.input) {
      case 'cpf':
        $(input).mask('000.000.000-00', {reverse: true});
        break;

      case 'cep':
        $(input).mask('00000-000', {reverse: true});
        break;

      case 'data_nascimento':
        $(input).mask('00/00/0000');
        break;

      case 'telefone':
        $(input).mask('(00) 00000-0000');
        break;

      case 'id-fid':
        $(input).mask('000000');
        break;

      case 'id-valor-imovel':
        setupMoneyMask(input);
        break;

      case 'matricula':
        $(input).mask('0000000');
        break;
    }

    switch (input.dataset.maskc) {
      case 'money':
        setupMoneyMask(input);
        input.setAttribute('maxlength', '20');
        input.setAttribute('placeholder', 'R$ 0,00');
        break;
    }
  });
}

/**
 * Setup money mask for currency inputs
 */
function setupMoneyMask(input) {
  if (isEmpty(input.value)) {
    input.value = 'R$ 0,00';
  }

  input.addEventListener('focus', () => {
    if (input.value === 'R$ 0,00') {
      input.value = '';
    }
  });

  input.addEventListener('blur', () => {
    if (isEmpty(input.value)) {
      input.value = 'R$ 0,00';
    }
  });

  // Apply SimpleMaskMoney for currency formatting
  if (typeof SimpleMaskMoney !== 'undefined') {
    SimpleMaskMoney.setMask(input, {
      prefix: 'R$ ',
      fixed: true,
      fractionDigits: 2,
      decimalSeparator: ',',
      thousandsSeparator: '.',
      cursor: 'end'
    });
  }
}