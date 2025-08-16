/**
 * Consolidated Click Event Handlers
 * All click-related event handlers organized in one place
 */
import { eventManager } from '../../classes/EventManager.js';
import { conteudos } from '../conteudos.js';
import { SwalAlert, isEmpty, copiar, sanitizarCPF, primeiroNome, resizeTextArea, capitalize, cumprimentoHorario, verificarSeFIDvalido, feedbackInfo, feedbackButton, criarEBaixarArquivo } from '../utilitarios.js';
import { renderPendencias, renderResumo, renderTooltips } from '../funcoes-render.js';
import { atualizar, escutaEventoInput } from '../funcoes-base.js';
import { atualizarNumerosProponentes, setTheme, setAutocomplete } from '../funcoes-de-conteudo.js';
import { Settings } from '../../classes/Settings.js';
import { downloaded_txt_file, text_areas_editados } from '../../script.js';

/**
 * Initialize all click event handlers
 */
export function initializeClickHandlers() {
  // Modal trigger handlers
  initializeModalHandlers();
  
  // Form and data handlers
  initializeFormHandlers();
  
  // Copy handlers
  initializeCopyHandlers();
  
  // Proponente (proposer) handlers
  initializeProponenteHandlers();
  
  // Income (renda) handlers
  initializeRendaHandlers();
  
  // Download handlers
  initializeDownloadHandlers();
  
  // Navigation handlers
  initializeNavigationHandlers();
}

/**
 * Modal-related click handlers
 */
function initializeModalHandlers() {
  // Already handled by EventManager.initializeCommonPatterns()
  // Keep this function for any additional modal-specific logic
}

/**
 * Form-related click handlers
 */
function initializeFormHandlers() {
  // Settings handlers
  eventManager.delegateEvent(document, 'click', '[data-set-setting]', async (e) => {
    e.preventDefault();
    const settings = new Settings();
    const setting = e.target.dataset.setSetting;
    
    switch (setting) {
      case 'alterar-analista':
        const actualAnalyst = settings.getOption('analyst') || '';
        const resp = prompt('Alterar analista para:', actualAnalyst);
        if (resp && resp.length > 0 && (resp !== actualAnalyst)) {
          settings.setOption('analyst', resp);
        }
        break;

      case 'alterar-id-analista':
        const actualIDAnalyst = settings.getOption('id-analyst') || '';
        const respID = prompt('Alterar ID do analista para:', actualIDAnalyst);
        if (respID && respID.length > 0 && (respID !== actualIDAnalyst)) {
          settings.setOption('id-analyst', respID);
        }
        break;

      case 'alterar-tema':
        const actualTheme = settings.getOption('theme') || 'normal';
        if (confirm(`Confirma alterar para o tema ${actualTheme === 'dark' ? 'normal' : 'escuro'}?`)) {
          settings.setOption('theme', actualTheme === 'dark' ? 'default' : 'dark');
          setTheme(settings.getOption('theme'));
        }
        break;

      case 'alterar-autocomplete':
        const actualAutocomplete = settings.getOption('autocomplete');
        if (confirm(`Confirma alterar para ${actualAutocomplete ? 'desativar' : 'ativar'} o autocomplete?`)) {
          settings.setOption('autocomplete', !actualAutocomplete);
          setAutocomplete(settings.getOption('autocomplete'));
        }
        break;
    }
  });

  // Percentage calculation handlers
  eventManager.delegateEvent(document, 'click', '[data-action="calcular-percentual"], #modal-calcular-percentual .nav-item a.nav-link', (e) => {
    e.preventDefault();
    handlePercentageCalculation();
  });

  // Load pending items handler
  eventManager.delegateEvent(document, 'click', '[data-action="carregar-pendencias"]', (e) => {
    e.preventDefault();
    handleLoadPendencias(e.target);
  });
}

/**
 * Copy-related click handlers
 */
function initializeCopyHandlers() {
  eventManager.delegateEvent(document, 'click', '[data-action="copiar"]', (e) => {
    e.preventDefault();
    const btn = e.target.closest('[data-action="copiar"]');
    handleCopiarAction(btn);
  });

  eventManager.delegateEvent(document, 'click', '.btn-copy-float', (e) => {
    e.preventDefault();
    handleFloatingCopyButton(e.target);
  });
}

/**
 * Proponente (proposer) related handlers
 */
function initializeProponenteHandlers() {
  eventManager.delegateEvent(document, 'click', '[data-action="incluir-proponente"]', (e) => {
    e.preventDefault();
    handleIncluirProponente();
  });

  eventManager.delegateEvent(document, 'click', '[data-action="remover-proponente"]', (e) => {
    e.preventDefault();
    handleRemoverProponente(e.target);
  });
}

/**
 * Income (renda) related handlers
 */
function initializeRendaHandlers() {
  eventManager.delegateEvent(document, 'click', '[data-action="incluir-renda"]', (e) => {
    e.preventDefault();
    handleIncluirRenda(e.target);
  });

  eventManager.delegateEvent(document, 'click', '[data-action="remover-renda"]', (e) => {
    e.preventDefault();
    handleRemoverRenda(e.target);
  });
}

/**
 * Download-related handlers
 */
function initializeDownloadHandlers() {
  eventManager.delegateEvent(document, 'click', '[data-action="baixar-dados"]', (e) => {
    e.preventDefault();
    handleDownloadDados();
  });

  eventManager.delegateEvent(document, 'click', '[data-action="baixar-relatorio"]', (e) => {
    e.preventDefault();
    handleDownloadRelatorio();
  });

  eventManager.delegateEvent(document, 'click', '[data-action="baixar-pendencias"]', (e) => {
    e.preventDefault();
    handleDownloadPendencias();
  });

  eventManager.delegateEvent(document, 'click', '[data-action="baixar-acompanhamento-FID"]', (e) => {
    e.preventDefault();
    handleDownloadAcompanhamentoFID();
  });
}

/**
 * Navigation-related handlers
 */
function initializeNavigationHandlers() {
  eventManager.delegateEvent(document, 'click', '[data-content="secao-controlada"] .card-header', (e) => {
    handleToggleSection(e.target);
  });
}

// Handler implementations
function handlePercentageCalculation() {
  const percentuais = {
    parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]')?.classList.contains('active') || false,
    financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]')?.classList.contains('active') || false,
  };
  // Implementation details can be added here as needed
}

function handleLoadPendencias(btn) {
  $(btn).tooltip('hide');
  
  text_areas_editados(false);
  
  if (renderPendencias()) {
    feedbackButton(btn, {
      html: '<i class="bi bi-check2"></i>',
      classe: 'btn btn-success',
      html_retorno: btn.innerHTML
    });
  } else {
    feedbackButton(btn, {
      html: '<i class="bi bi-x-lg"></i>',
      classe: 'btn btn-danger',
      html_retorno: btn.innerHTML
    });
  }
}

function handleCopiarAction(btn) {
  if (!isEmpty(btn)) {
    const resultado = copiar(btn.dataset.content);
    if (resultado) {
      feedbackButton(btn, {
        html: '<i class="bi bi-clipboard-check"></i>',
        classe: 'btn btn-success',
        html_retorno: btn.innerHTML
      });
    } else {
      feedbackButton(btn, {
        html: '<i class="bi bi-clipboard-x"></i>',
        classe: 'btn btn-danger',
        html_retorno: btn.innerHTML
      });
    }
  }
}

function handleFloatingCopyButton(btn) {
  const secao = btn.closest('[data-content="secao-controlada"]');
  const [html_inicial, cor_inicial, display_inicial] = [
    '<i class="bi bi-clipboard2"></i>', 
    btn.closest('html').getAttribute('data-bs-theme') === 'dark' ? '#FFFFFF50' : '#D3D3D3', 
    'none'
  ];
  
  try {
    const textContent = secao.querySelector('[data-form="conteudo-texto"]')?.innerText?.trim() || 
                       secao.querySelector('[data-form="conteudo-texto"]')?.value?.trim() || '';
    
    navigator.clipboard.writeText(textContent).then(() => {
      btn.style.backgroundColor = '#99CC99';
      btn.innerHTML = '<i class="bi bi-clipboard2-check"></i>';
    });
  } catch {
    btn.style.backgroundColor = '#F0928B';
    btn.innerHTML = '<i class="bi bi-clipboard2-x"></i>';
  } finally {
    btn.style.display = 'block';
  }

  setTimeout(() => {
    btn.style.backgroundColor = cor_inicial;
    btn.innerHTML = html_inicial;
    btn.style.display = display_inicial;
  }, 1000);
}

function handleIncluirProponente() {
  const accordion = document.querySelector('.accordion');
  if (!accordion) return;
  
  const accordion_item = document.createElement('div');
  accordion_item.classList.value = 'accordion-item';
  
  const numeroProponente = accordion.querySelectorAll('.accordion-item').length + 1;
  accordion_item.innerHTML = conteudos.accordion_item(numeroProponente);
  
  accordion.appendChild(accordion_item);
  
  atualizar();
  atualizarNumerosProponentes();
  renderResumo();
  renderPendencias();
}

function handleRemoverProponente(btn) {
  SwalAlert('confirmacao', 'question', 'Tem certeza que deseja remover?', 'Esta ação não poderá ser desfeita').then((retorno) => {
    if (retorno.isConfirmed) {
      btn.closest('.accordion-item').remove();
      renderResumo();
      atualizarNumerosProponentes();
      renderPendencias();
    }
  });
}

function handleIncluirRenda(btn) {
  const proponente = btn.closest('[data-identify]');
  if (!proponente) return;
  
  const div = document.createElement('div');
  div.classList.value = `input-group mt-2 mb-2`;
  div.dataset.element = "renda";
  
  let length = 0;
  try { 
    length = proponente.querySelectorAll('[data-element="renda"]').length; 
  } catch (error) { }
  
  div.innerHTML = conteudos.secao_rendas(length + 1);
  const areaRendas = proponente.querySelector('[data-element="area_rendas"]');
  if (areaRendas) {
    areaRendas.appendChild(div);
  }

  // Remove "sem renda" alert if present
  try {
    const alertPrimary = btn.closest('[data-element="secao_rendas"]')?.querySelector('[data-element="area_rendas"]')?.querySelector(`div.alert.alert-primary`);
    if (alertPrimary) {
      alertPrimary.remove();
    }
  } catch (error) { }

  escutaEventoInput();
  setupRemoveRendaHandler(div.querySelector('[data-action="remover-renda"]'));
  renderPendencias();
  renderTooltips();
}

function setupRemoveRendaHandler(btn) {
  if (!btn) return;
  
  // Remove any existing listeners to avoid duplicates
  eventManager.removeElementListeners(btn);
  
  eventManager.addListener(btn, 'click', (evento) => {
    evento.preventDefault();
    $(btn).tooltip('dispose');
    
    const rendaElement = btn.closest('[data-element="renda"]');
    const areaRendas = btn.closest('[data-element="area_rendas"]');
    
    if (rendaElement) {
      rendaElement.remove();
    }
    
    if (areaRendas && areaRendas.querySelectorAll('[data-element="renda"]').length === 0) {
      $(areaRendas).html(`<div class="alert alert-primary mt-2 mb-2">Proponente sem renda</div>`);
    }
    
    renderPendencias();
  });
}

function handleRemoverRenda(btn) {
  setupRemoveRendaHandler(btn);
}

function handleDownloadDados() {
  const proponentes = Array.from(document.querySelectorAll('[data-identify]'));
  const primeirosNomes = [];
  const saida = [];

  proponentes.forEach((proponente) => {
    const nome = proponente.querySelector('[data-input="nome"]')?.value?.trim() || '';
    if (!isEmpty(nome)) {
      primeirosNomes.push(primeiroNome(nome));
    }
  });

  baixarDados(proponentes, primeirosNomes, saida);
}

function handleDownloadRelatorio() {
  const proponentes = Array.from(document.querySelectorAll('[data-identify]'));
  const primeirosNomes = [];

  proponentes.forEach((proponente) => {
    const nome = proponente.querySelector('[data-input="nome"]')?.value?.trim() || '';
    if (!isEmpty(nome)) {
      primeirosNomes.push(primeiroNome(nome));
    }
  });

  baixarRelatorio(primeirosNomes);
}

function handleDownloadPendencias() {
  const proponentes = Array.from(document.querySelectorAll('[data-identify]'));
  const primeirosNomes = [];

  proponentes.forEach((proponente) => {
    const nome = proponente.querySelector('[data-input="nome"]')?.value?.trim() || '';
    if (!isEmpty(nome)) {
      primeirosNomes.push(primeiroNome(nome));
    }
  });

  baixarPendencias(primeirosNomes);
}

function handleDownloadAcompanhamentoFID() {
  const input = document.querySelector('[data-input="id-fid"]');
  if (!input) return;
  
  const link = input.value.trim();

  try {
    const linkUrl = new URL(link);
    const split = linkUrl.search.split('codigo=');
    const FID = split[1]?.split("=")[0]?.split("&")[0];

    const valido = [
      linkUrl.origin.toLowerCase() === 'https://portalsafi.direcional.com.br',
      linkUrl.pathname.toLowerCase() === '/fluxo',
      linkUrl.search.includes("codigo"),
      split.length === 2,
      typeof (parseInt(FID)) === "number" && !isNaN(parseInt(FID))
    ];

    if (verificarSeFIDvalido(FID) && valido.every(e => e === true)) {
      reportarResultado(true);
      criarEBaixarHTMLAcompanhamento(parseInt(FID), `Acompanhe o FID ${parseInt(FID)}`);
    } else {
      reportarResultado(false, 'O link informado para o FID não é válido');
    }
  } catch (error) {
    reportarResultado(false, 'O link informado para o FID não é válido');
  }

  function reportarResultado(condicao, texto) {
    const retorno = document.querySelector('[data-element="retorno-link-fid"]');
    if (retorno) {
      if (!condicao) {
        retorno.setAttribute('class', 'alert alert-danger mt-3 mb-0');
        retorno.innerText = texto || '';
      } else {
        retorno.setAttribute('class', '');
        retorno.innerText = '';
      }
    }
  }
}

function handleToggleSection(target) {
  const secao = target.closest('[data-content="secao-controlada"]');
  if (!secao) return;
  
  $(secao).find('.card-body').toggleClass('none');
  
  if ($(secao).find('.card-body').css('display') !== 'none') {
    $(secao).find('.card-header span').text('');
  } else {
    $(secao).find('.card-header span').text('Clique para abrir');
  }
}

// Helper functions (moved from other modules to consolidate)
function baixarDados(proponentes, primeirosNomes, saida) {
  proponentes.forEach((proponente, index) => {
    const nome = proponente.querySelector('[data-input="nome"]')?.value?.trim() || '';
    const cpf = proponente.querySelector('[data-input="cpf"]')?.value?.trim() || '';
    const dataNasc = proponente.querySelector('[data-input="data_nascimento"]')?.value?.trim() || '';
    const telefone = proponente.querySelector('[data-input="telefone"]')?.value?.replaceAll('-', '').trim() || '';
    const email = proponente.querySelector('[data-input="email"]')?.value?.trim() || '';
    
    saida.push(`PROPONENTE ${index + 1}\n` + 
               `NOME: ${!isEmpty(nome) ? nome.toUpperCase() : ''}\n` + 
               `CPF: ${sanitizarCPF(cpf)}\n` + 
               `DT NASC: ${dataNasc}\n` + 
               `TELEFONE: ${telefone}\n` + 
               `EMAIL: ${email}\n\n`);
  });
  
  criarEBaixarArquivo(JSON.stringify(saida.join('\n')), `DADOS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`, 'txt');
}

function baixarRelatorio(primeirosNomes) {
  const relatorio = document.querySelector('[data-content="relatorio"]')?.value || '';
  criarEBaixarArquivo(JSON.stringify(relatorio), `RELATORIO${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`, 'txt');
}

function baixarPendencias(primeirosNomes) {
  const pendencias = document.querySelector('[data-content="pendencias"]')?.value || '';
  criarEBaixarArquivo(JSON.stringify(pendencias), `PENDENCIAS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`, 'txt');
}

function criarEBaixarHTMLAcompanhamento(FID, titulo) {
  // Implementation for creating and downloading HTML follow-up file
  // This would contain the specific implementation for FID tracking
  console.log(`Creating HTML follow-up for FID: ${FID} with title: ${titulo}`);
}

// Register global handlers for backward compatibility (to be removed gradually)
export function registerClickGlobalHandlers() {
  eventManager.registerGlobalHandler('clickIncluirRenda', handleIncluirRenda);
  eventManager.registerGlobalHandler('acaoClickIncluirProponente', handleIncluirProponente);
  eventManager.registerGlobalHandler('acaoClickCopiar', handleCopiarAction);
}