"use strict";

import {conteudos} from './modulos/conteudos.js';
import {
  atualizarDatas,
  isEmpty,
  atribuirLinks,
  ordernarString,
  limparEFocar,
  sanitizarNumero,
  sanitizarString,
  criarEBaixarArquivo,
  resizeTextArea,
  splitArray,
} from './modulos/utilitarios.js';
import {verificacao} from './modulos/confirmacao.js';
import {funcoesBase} from './modulos/funcoes-base.js';
import {
  adicionarOpcoesAutoComplete, renderConteudosPagina, setAutocomplete, setTheme
} from './modulos/funcoes-de-conteudo.js';
import {Settings} from './classes/Settings.js';
import {eventManager} from './classes/EventManager.js';
import {initializeClickHandlers, registerClickGlobalHandlers} from './modulos/event-handlers/click-handlers.js';
import {initializeInputHandlers, setupInputMasking} from './modulos/event-handlers/input-handlers.js';
import {initializeFormHandlers} from './modulos/event-handlers/form-handlers.js';

(() => {
    const apresentarDadosProjeto = (dados_do_projeto, novas_funcionalidades) => {
      // Exibindo dados
      console.groupCollapsed(`${dados_do_projeto['Project name'] ?? 'Projeto'}, Version ${dados_do_projeto.Version ?? '-'}`);
      console.table(dados_do_projeto);
      console.groupEnd();

      console.groupCollapsed('New features');
      novas_funcionalidades.toSorted((a, b) => a.localeCompare(b)).forEach((feature) => {
        console.info(`${feature}`);
      });
      console.groupEnd();
      // Fim da apresentação do projeto
    }

    // Apresentação do Projeto no console
    let dados_do_projeto = {
      Hostname: new URL(window.location).hostname, Origin: new URL(window.location).origin, Status: 'Active',
    };

    const novas_funcionalidades = [...'Corrigido problemas de resposta na API de Cartórios', 'Melhorias de design e responsividade realizadas'];

    // Carregando dados do arquivo de manifest.json
    let path = 'manifest.json';
    switch (document.title) {
      case "Confirmação de dados - CCA":
        path = 'manifest.json';
        break;

      default:
        path = '../manifest.json';
        break;
    }

    fetch(path)
      .then((response) => {
        return response.json();
      })
      .then((manifest) => {
        const dados_manifest = {
          'Project name': manifest.name,
          'Developer': manifest.developer,
          'Version': manifest.version,
          'Release Date': manifest.release_date
        };
        dados_do_projeto = (Object.assign({}, dados_manifest, dados_do_projeto));
        apresentarDadosProjeto(dados_do_projeto, novas_funcionalidades);
      })
      .catch((error) => {
        console.info('Não foi possível carregar o arquivo de manifest.json.');
        console.error(error);
      });

    Object.freeze(novas_funcionalidades);
    Object.freeze(dados_do_projeto);

    function clickEnviarConfirmacaoSenha(evento, elemento, referencia) {
      verificacao(evento, elemento, referencia);
    }

    // Register with EventManager instead of global window assignment
    eventManager.registerGlobalHandler('clickEnviarConfirmacaoSenha', clickEnviarConfirmacaoSenha);

    // Initialize centralized event management
    eventManager.initializeCommonPatterns();
    initializeClickHandlers();
    initializeInputHandlers();
    initializeFormHandlers();
    
    // Register global handlers for backward compatibility
    registerClickGlobalHandlers();

    // Simplified page reload handler (now managed by EventManager)
    // eventManager already handles [data-recarrega-pagina] clicks

    const pagina = new URL(window.location).pathname.trim().replace('/', '');
    const body = document.querySelector('body');

    // TODO: Separar os blocos grandes em funções em outros arquivos
    if (pagina == 'index.html' || pagina == 'cca/' || pagina == 'cca/index.html' || isEmpty(pagina)) {
      body.innerHTML += conteudos.conteudo_pagina_confirmacao;
      const accordion_item = document.createElement('div');
      accordion_item.classList.value = 'accordion-item';
      accordion_item.innerHTML = conteudos.accordion_item(1);
      document.querySelector('.accordion').appendChild(accordion_item);
      document.querySelector('#modais').innerHTML += conteudos.modal_tutorial;
    } else if (pagina == 'consultas/index.html' || pagina == 'cca/consultas/' || pagina == 'cca/consultas/index.html') {
      body.innerHTML += conteudos.conteudo_pagina_consultas;
      const area_consultas = document.querySelector('[data-content="area-consultas"]');

      renderConteudosPagina(area_consultas, ordernarString(conteudos.consultas), 'consultas');
      adicionarOpcoesAutoComplete();
    } else if (pagina == 'arquivos/index.html' || pagina == 'cca/arquivos/' || pagina == 'cca/arquivos/index.html') {
      body.innerHTML += conteudos.conteudo_pagina_arquivos;
      const area_arquivos = document.querySelector('[data-content="area-arquivos"]');

      renderConteudosPagina(area_arquivos, ordernarString(conteudos.arquivos), 'arquivos');
      document.querySelectorAll('a').forEach(a => {

        // Verifica se a URL no parâmetro HREF é válida ou não. Se for, o código do bloco CATCH não é executado e não será necessária confirmação de senha para ir para a página.
        try {
          new URL(a.getAttribute('href'));
        } catch (error) {
          a.setAttribute('confirm', a.getAttribute('href'));
          a.removeAttribute('href');
          a.setAttribute('onclick', 'clickConfirm(this)');
        }
      })

      function clickConfirm(elemento) {
        $('#modal-confirmar-senha').modal('show');
        const modal = document.querySelector('#modal-confirmar-senha');
        const input = modal.querySelectorAll('input')[0];
        limparEFocar(input, 'clear');
        setTimeout(() => {
          limparEFocar(input, 'focus');
          input.setAttribute('type', 'password');
          modal.querySelector('button[type="submit"]').setAttribute('onclick', `clickEnviarConfirmacaoSenha(event, this, '${elemento.getAttribute('confirm')}')`);
        }, 500);
      }

      // Register with EventManager instead of global window assignment
      eventManager.registerGlobalHandler('clickConfirm', clickConfirm);
    } else if (pagina == 'desligamento/index.html' || pagina == 'cca/desligamento/' || pagina == 'cca/desligamento/index.html') {
      $(body).append(conteudos.conteudo_pagina_desligamento)
      // $(body).load('../assets/html/pagina-desligamento.html')

      // Página ignora preventDefault() se não houver tiver o setTimeout()
      window.addEventListener('DOMContentLoaded', () => {
        $('[data-action="form-laudo"]').submit((event) => {
          event.preventDefault()
          const saida = new Array();

          event.target.querySelectorAll('[data-input]').forEach(elemento => {
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
          })

          criarEBaixarArquivo(JSON.stringify('SOLICITAÇÃO DE LAUDO\n\n' + splitArray(saida, [0, 4]).join('\n') + '\n\n' + splitArray(saida, [5, 6]).join('\n') + '\n\n' + splitArray(saida, [7, 10]).join('\n')), `LAUDO ${event.target.querySelector('[data-input="matricula"]').value}`, 'txt')
        })

        $('textarea').each((index, elemento) => {
          resizeTextArea(elemento);
        })

        $('textarea').on('input', (evento) => {
          resizeTextArea(evento.target);
        })
      })

      try {
        document.querySelector('[data-form="desligamento-internalizado"] [data-form="conteudo-texto"]').value = `Prezados, bom dia! \n\nGentileza gerar formulários e dar andamento ao processo que está em desligamento.\n\nModalidade: \nEmpreendimento: \nUnidade: \nValor de contrato: \nValor de financiamento: \nValor de FGTS: \n\n[Observações]`;
      } catch (error) {
        console.error(error);
      }
    }

    $(body).prepend(conteudos.nav)
    $(body).append(conteudos.rodape)
    if (!($('#modal-tutorial').length)) $(body).append(conteudos.modal_tutorial)

    window.addEventListener("load", function () {
      // Initialize centralized event management system
      eventManager.initializeCommonPatterns();
      
      // Load settings and apply theme/autocomplete
      const settings = new Settings();
      settings.createSettingsObject(localStorage.getItem('cca-configs'))
      setTheme(settings.getOption('theme'));
      setAutocomplete(settings.getOption('autocomplete'));

      // Initialize input masking for existing elements
      setupInputMasking();

      const modal = $('#modal-tutorial');
      let intervaloAtualizacao = null

      $(modal).on('show.bs.modal', () => {
        const listas = $(modal).find('.list-group');
        const progress = $(modal).find('.progress');

        const adicaoTempo = 1;
        let index = 0;
        let value = 0;

        $(progress).attr('aria-valuenow', 0)
        $(progress).find('.progress-bar').attr('style', `width: ${0}%`)

        // Inicializando a primeira lista
        $(Array.from(listas)[0]).show()

        Array.from(listas).forEach((lista, i) => {
          value = 0;
          clearInterval(intervaloAtualizacao)
          intervaloAtualizacao = setInterval(() => {
            value += 2.5;
            $(progress).attr('aria-valuenow', value)
            $(progress).find('.progress-bar').attr('style', `width: ${value}%`)
            if (progress.attr('aria-valuenow') === "100") {
              setTimeout(() => {
                value = -10;
                if (Array.from(listas)[Array.from(listas).length - 1] === Array.from(listas)[index]) {
                  clearInterval(intervaloAtualizacao);
                  $(modal).modal('hide');
                }
                index++
                $(Array.from(listas)[index - 1]).hide()
                window.scrollTo({top: 0, behavior: 'smooth'})
                $(Array.from(listas)[index]).show()
              }, 100 * i);
            }
          }, 100 * i)
        })
      });

      $(modal).on('hide.bs.modal', () => {
        clearInterval(intervaloAtualizacao);
      })

      $('.overlay').hide();

      funcoesBase();
      atribuirLinks();
      atualizarDatas();
    });

    document.addEventListener('DOMContentLoaded', () => {
      const id_pagina_atual = new String(Date.now() + Math.ceil(Math.random() * 5));
      let houve_edicao = true;

      const intervalo_verificacao = (() => {
        if (houve_edicao) {
          const els = Array.from($('[data-element="input"]'));

          // Elementos de preenchimento que não estão vazios
          els.filter((el) => !isEmpty(el.value) && el.value !== 'R$ 0,00');
        }
      }, (1000 * 10))

      // Section toggle handler - now managed by EventManager in click-handlers.js
      // Copy button handler - now managed by EventManager in click-handlers.js
    })

  }
)
();

let text_areas_foram_editados = false;
let download_txt_file = false;

export function text_areas_editados(condicao) {
  if (isEmpty(condicao) && !typeof condicao !== 'boolean') {
    try {
      return text_areas_foram_editados
    } catch (error) {
      return false;
    }
  } else {
    text_areas_foram_editados = condicao;
    return condicao;
  }
};

export function downloaded_txt_file(condicao) {
  if (isEmpty(condicao) && !typeof condicao !== 'boolean') {
    try {
      return download_txt_file
    } catch (error) {
      return false;
    }
  } else {
    download_txt_file = condicao;
    return condicao;
  }
};
