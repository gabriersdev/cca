import {downloaded_txt_file, text_areas_editados} from '../script.js';
import {
  setTheme,
  setAutocomplete,
  atualizarNumerosProponentes
} from './funcoes-de-conteudo.js';
import {renderTooltips, renderPopover, renderPendencias, renderResumo} from './funcoes-render.js';
import {SwalAlert, feedbackButton, isEmpty, resizeTextArea, verificarSeFIDvalido} from './utilitarios.js';
import {outrosProjetosExibicao} from './dados.js';
import {Settings} from '../classes/Settings.js';

const verificarInputsRecarregamento = () => {
  window.onbeforeunload = (evento) => {
    // Há o que preservar
    // TODO - Adicionar monitoramento de campos editados que são inicializados com conteúdo (pendências, análise internalizada, etc.)
    if (Array.from($('input, textarea')).filter(e => e.checked === undefined ? e.value !== "R$ 0,00" && e.value.trim().length > 0 : '').length > 0) {
      evento.preventDefault();

      // Verificas se os dados das pendências e relatório foram baixados e exibe o aviso Swal.Alert
      if (!downloaded_txt_file()) SwalAlert('aviso', 'warning', 'Há campos preenchidos e as pendências ou relatório não foram baixados', 'Você tem certeza que deseja sair? Os dados preenchidos não foram salvos e serão perdidos pra sempre...');
    } else {
      // Não há o que preservar
    }
  }
}

const escutaEventoInput = () => {
  const inputs = Array.from(document.querySelectorAll('[data-element="input"]'));
  inputs.forEach(elemento => {

    tratamentoCampos(elemento);

    if (elemento.dataset.input == "nome") {
      edicaoInputNome();
    } else if (elemento.dataset.input == 'cpf') {
      edicaoInputCPF(elemento)
    } else if (elemento.dataset.input == 'email') {
      edicaoInputEmail(elemento);
    } else if (elemento.dataset.input == 'data_nascimento') {
      edicaoInputData(elemento);
    } else if (elemento.dataset.input == 'telefone') {
      edicaoInputTelefone(elemento);
    } else if (elemento.dataset.input == 'id-fid') {
      edicaoInputFID(elemento);
    }
  });

  edicaoTextAreaRelatorio();
  edicaoTextAreaPendencias();
  edicaoTextAreaRestricoes();
}

const edicaoInputNome = () => {
  document.querySelectorAll('[data-input="nome"]').forEach(input => {
    input.addEventListener('input', () => {
      input.closest('[data-identify]').querySelectorAll('[data-content="nome"]').forEach(content => {
        content.textContent = !isEmpty(input.value) ? input.value.toUpperCase() : 'Nome do cliente';
        renderResumo();
      }) 
    })
  })
} 

const edicaoInputCPF = (elemento) => {
  elemento.addEventListener('blur', () => {
    if (!isEmpty(elemento.value)) {
      // Add CPF validation logic here
    }
  });
}

const edicaoInputEmail = (elemento) => {
  elemento.addEventListener('blur', () => {
    if (!isEmpty(elemento.value)) {
      // Add email validation logic here
    }
  });
}

const edicaoInputData = (elemento) => {
  elemento.addEventListener('blur', () => {
    if (!isEmpty(elemento.value)) {
      // Add date validation logic here
    }
  });
}

const edicaoInputTelefone = (elemento) => {
  elemento.addEventListener('input', () => {
    // Add phone formatting logic here
  });
}

const edicaoInputFID = (elemento) => {
  elemento.addEventListener('input', () => {
    const botoes = elemento.closest('.form-group').querySelectorAll('[data-element="btn-ref-link-FID"]');
    
    if (!isEmpty(elemento.value) && elemento.value.trim().length > 0) {
      botoes.forEach(botao => botao.removeAttribute('disabled'));
    } else {
      botoes.forEach(botao => botao.setAttribute('disabled', 'true'));
    }
  });
}

const edicaoTextAreaRelatorio = () => {
  const textAreaRelatorio = document.querySelector('[data-content="relatorio"]');
  if (!isEmpty(textAreaRelatorio)) {
    textAreaRelatorio.addEventListener('input', (evento) => {
      resizeTextArea(evento.target);
      text_areas_editados(true);
    });
  }
}

const edicaoTextAreaPendencias = () => {
  const textAreaPendencias = document.querySelector('[data-content="pendencias"]');
  if (!isEmpty(textAreaPendencias)) {
    textAreaPendencias.addEventListener('input', (evento) => {
      resizeTextArea(evento.target);
      text_areas_editados(true);
    });
  }
}

const edicaoTextAreaRestricoes = () => {
  const textAreaRestricoes = document.querySelector('[data-content="text-restricoes"]');
  if (!isEmpty(textAreaRestricoes)) {
    textAreaRestricoes.addEventListener('input', (evento) => {
      resizeTextArea(evento.target);
    });
  }
}

const tratamentoCampos = (input) => {
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
        mascararValores(input);
        break;

      case 'matricula':
        $(input).mask('0000000');
        break;

      default:
        break;
    }

    switch (input.dataset.maskc) {
      case 'money':
        mascararValores(input);
        input.setAttribute('maxlength', 20);
        input.setAttribute('placeholder', 'R$ 0,00');
        break;
    }

    function mascararValores(input) {
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
  });
}

function funcoesBase() {
  verificarInputsRecarregamento();
  
  // Essential rendering functions
  renderTooltips();
  renderPopover();
  renderResumo();
  renderPendencias();
  
  // Load other projects (keeping this as it's specific to this function)
  loadOtherProjects();
  
  // Setup external links behavior
  setupExternalLinks();
  
  // Keep essential modal and input field setup
  setupEssentialComponents();
}

function atualizar() {
  renderTooltips();
  renderPopover();
  renderPendencias();
  escutaEventoInput();
  atualizarNumerosProponentes();
  setAutocomplete(new Settings().getOption('autocomplete'));
}

// Helper functions for funcoesBase
function loadOtherProjects() {
  $('[data-action="carregar-outros-projetos"]').ready(() => {
    if (outrosProjetosExibicao.length > 0) {
      outrosProjetosExibicao.toSorted((a, b) => a.nome.localeCompare(b.nome)).toSpliced(4).forEach((projeto) => {
        $('[data-action="carregar-outros-projetos"]').append(`<li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="${projeto.link}">${projeto.nome}</a></li>`)
      })
    } else {
      $('[data-action="carregar-outros-projetos"]').append(`<li>Acesse o <a data-link="github-dev">GitHub</a> e conheça outros projetos do desenvolvedor.</li>`)
    }
  })
}

function setupExternalLinks() {
  if (Array.from(document.querySelectorAll('[data-link="external"]')).length > 0) {
    document.querySelectorAll('[data-link="external"]').forEach(link => {
      $(link).on('mousemove focus', () => {
        link.querySelector('[data-icon="icone"]').classList.value = 'bi bi-arrow-up-right-square-fill';
      })

      $(link).on('mouseout blur', () => {
        link.querySelector('[data-icon="icone"]').classList.value = 'bi bi-arrow-up-right-square';
      })
    })
  }
}

function setupEssentialComponents() {
  // Setup pending items button
  const btnCarregarPendencias = document.querySelector('[data-action="carregar-pendencias"]');
  if (!isEmpty(btnCarregarPendencias)) {
    btnCarregarPendencias.onclick = carregarPendencias;
  }

  function carregarPendencias(evento) {
    evento.preventDefault();
    $(evento.target).tooltip('hide');

    text_areas_editados(false);
    if (renderPendencias()) {
      feedbackButton(btnCarregarPendencias, {
        html: '<i class="bi bi-check2"></i>',
        classe: 'btn btn-success',
        html_retorno: btnCarregarPendencias.innerHTML
      });
    } else {
      feedbackButton(btnCarregarPendencias, {
        html: '<i class="bi bi-x-lg"></i>',
        classe: 'btn btn-danger',
        html_retorno: btnCarregarPendencias.innerHTML
      });
    }
  }

  // Setup modal textareas
  const modal = document.querySelector('#modal-devolucao-fid');
  if (!isEmpty(modal)) {
    modal.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', (evento) => {
        resizeTextArea(textarea);
      })
    })
  }
}

export {
  escutaEventoInput,
  funcoesBase,
  atualizar,
  verificarInputsRecarregamento,
  edicaoInputNome,
  edicaoInputCPF,
  edicaoInputEmail,
  edicaoInputData,
  edicaoInputTelefone,
  edicaoInputFID,
  edicaoTextAreaRelatorio,
  edicaoTextAreaPendencias,
  edicaoTextAreaRestricoes,
  tratamentoCampos
}