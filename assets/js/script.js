// noinspection JSUnresolvedReference

"use strict";

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
  SwalAlert,
  sanitizarCPF,
  copiar,
  feedbackButton,
  primeiroNome,
  verificarSeFIDvalido,
  capitalize,
  cumprimentoHorario,
  feedbackInfo,
  verificarCPF,
  verificarEmail,
  verificarData,
} from './modulos/utilitarios.js';

import {conteudos} from './modulos/conteudos.js';
import {verificacao} from './modulos/confirmacao.js';
import {Settings} from './classes/Settings.js';
import {outrosProjetosExibicao} from "./modulos/dados.js";

// import {renderPendencias, renderPopover, renderResumo, renderTooltips} from "./modulos/funcoes-render";
// import {atualizar, escutaEventoInput, funcoesBase, verificarInputsRecarregamento} from './modulos/funcoes-base.js';
// import { adicionarOpcoesAutoComplete, atualizarNumerosProponentes, renderConteudosPagina, setAutocomplete, setTheme} from './modulos/funcoes-de-conteudo.js';
// import {
//   edicaoInputCPF,
//   edicaoInputData,
//   edicaoInputEmail,
//   edicaoInputNome,
//   edicaoTextAreaPendencias,
//   edicaoTextAreaRelatorio,
//   edicaoTextAreaRestricoes
// } from "./modulos/funcoes-de-conteudo";
// import {
//   acaoClickIncluirProponente,
//   acionarDevolucaoFID,
//   acionarModalAddInformacoes,
//   clickAcionarModal,
//   clickAddDevolucaoFID,
//   clickAddInformacoes,
//   clickCopiar,
//   clickDownload,
//   clickEnviarDados,
//   clickImportarPendencias,
//   clickIncluirProponente,
//   clickLimparProcesso,
//   clickLimparTudoSecao,
//   clickRemoverProponente,
//   clickRemoverRenda,
//   clickVisibilidadeSenha,
//   submitAddDevolucaoFID,
//   submitInformarRestricoes
// } from "./modulos/funcoes-click";


(() => {
  if (!"saveAs" in window) {
    const saveAs = (s) => {
      console.log(s);
      alert('Não é possível salvar o arquivo. A instância do saveAs não foi disponibilizada globalmente.')
    }
    saveAs();
  }

  if (!"$" in window) {
    const $ = (s) => {
      console.log(s);
    }
    $('#')
  }

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
  let path;
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
        'Developer': manifest.developer || "",
        'Version': manifest.version,
        'Release Date': manifest.release_date || "",
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

  window.clickEnviarConfirmacaoSenha = (evento, elemento, referencia) => {
    verificacao(evento, elemento, referencia);
  }

  const adicionarOpcoesAutoComplete = () => {
    const opcoes = document.querySelector('[data-content="area-consultas"]').querySelectorAll('.content');

    const tags = [];
    const titulos = [];
    const elementos = [];
    const sistemas = [];

    opcoes.forEach((opcao) => {
      titulos.push(opcao.querySelector('h5').textContent);
      elementos.push(opcao);
    })

    const form = document.querySelector('form[data-form="pesquisa"]');

    [].concat(tags, titulos, sistemas).forEach((elemento) => {
      form.querySelector('datalist').innerHTML += `<option value="${elemento}"><option>`;
    })

    const verificarSeValorExiste = (valor) => {
      const resultados = [];
      [].concat(tags, titulos, sistemas).forEach((elemento, index) => {
        if (elemento.substr(0, (valor.trim().length)).toLowerCase() === valor.toLowerCase().trim()) {
          const e = elementos[index]
          resultados.push({
            tag: e.querySelector('.content-tag').textContent.toLowerCase(),
            titulo: e.querySelector('h5').textContent,
            sistema: e.querySelector('.content-principal').querySelector('span').textContent,
            link: e.href
          });
        }
      })
      return resultados;
    }

    window.pesquisaConteudo = (evento) => {
      evento.preventDefault();
      const input = evento.target.closest('div').querySelector('input');
      const pesquisado = input.value.trim();
      const area_consultas = document.querySelector('[data-content="area-consultas"]');

      if (isEmpty(pesquisado)) {
        input.focus();
        renderConteudosPagina(area_consultas, ordernarString(conteudos.consultas), 'consultas');
      } else {
        const resultados = verificarSeValorExiste(pesquisado);
        if (isEmpty(resultados)) {
          area_consultas.innerHTML = '';
          area_consultas.innerHTML += `<h5 class="text-muted titulo-consultas">Resultados para "${pesquisado}"</h5><div class="alert alert-secondary">Nenhum resultado foi encontrado para a sua busca.</div>`
        } else {
          renderConteudosPagina(area_consultas, resultados, 'consultas', `Resultados para "${pesquisado}"`);
        }
      }
    }
  }

  const pagina = new URL(window.location).pathname.trim().replace('/', '');
  const body = document.querySelector('body');

  // TODO: Separar os blocos grandes em funções em outros arquivos
  if (pagina === 'index.html' || pagina === 'cca/' || pagina === 'cca/index.html' || isEmpty(pagina)) {
    body.innerHTML += conteudos.conteudo_pagina_confirmacao;
    const accordion_item = document.createElement('div');
    accordion_item.classList.value = 'accordion-item';
    accordion_item.innerHTML = conteudos.accordion_item(1);
    document.querySelector('.accordion').appendChild(accordion_item);
    document.querySelector('#modais').innerHTML += conteudos.modal_tutorial;
  } else if (pagina === 'consultas/index.html' || pagina === 'cca/consultas/' || pagina === 'cca/consultas/index.html') {
    body.innerHTML += conteudos.conteudo_pagina_consultas;
    const area_consultas = document.querySelector('[data-content="area-consultas"]');

    renderConteudosPagina(area_consultas, ordernarString(conteudos.consultas), 'consultas');
    adicionarOpcoesAutoComplete();
  } else if (pagina === 'arquivos/index.html' || pagina === 'cca/arquivos/' || pagina === 'cca/arquivos/index.html') {
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

    window.clickConfirm = clickConfirm;
  } else if (pagina === 'desligamento/index.html' || pagina === 'cca/desligamento/' || pagina === 'cca/desligamento/index.html') {
    $(body).append(conteudos.conteudo_pagina_desligamento)
    // $(body).load('../assets/html/pagina-desligamento.html')

    // Página ignora preventDefault() se não houver tiver o setTimeout()
    window.addEventListener('DOMContentLoaded', () => {
      $('[data-action="form-laudo"]').submit((event) => {
        event.preventDefault()
        const saida = [];

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
    // TODO: Separar responsabilidades e scripts carregados por página
    // Carregando configurações do localStorage
    const settings = new Settings();
    settings.createSettingsObject(localStorage.getItem('cca-configs'))
    setTheme(settings.getOption('theme'));
    setAutocomplete(settings.getOption('autocomplete'));

    const modal = $('#modal-tutorial');
    let intervaloAtualizacao = null

    $(modal).on('show.bs.modal', () => {
      const listas = $(modal).find('.list-group');
      const progress = $(modal).find('.progress');

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
    $('[data-content="secao-controlada"] .card-header').on('click', (evento) => {
      const secao = evento.target.closest('[data-content="secao-controlada"]');
      $(secao).find('.card-body').toggleClass('none');
      if ($(secao).find('.card-body').css('display') !== 'none') {
        // $('[data-content="secao-controlada"] .card-header span').text('Clique para fechar');
        $(secao).find('.card-header span').text('');
      } else {
        $(secao).find('.card-header span').text('Clique para abrir');
      }
    })

    $('.btn-copy-float').on('click', (evento) => {
      evento.preventDefault();
      const secao = evento.target.closest('[data-content="secao-controlada"]');
      const btn = secao.querySelector('.btn-copy-float');

      const [html_inicial, cor_inicial, display_inicial] = ['<i class="bi bi-clipboard2"></i>', btn.closest('html').getAttribute('data-bs-theme') === 'dark' ? '#FFFFFF50' : '#D3D3D3', 'none'];
      try {
        navigator.clipboard.writeText(secao.querySelector('[data-form="conteudo-texto"]').innerText.trim() || secao.querySelector('[data-form="conteudo-texto"]').value.trim()).then(() => {
        })
        btn.style.backgroundColor = '#99CC99';
        btn.innerHTML = '<i class="bi bi-clipboard2-check"></i>';
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
      }, 1000)
    })
  })

  const clickAcionarModal = () => {
    document.querySelectorAll('[data-action="acionar-modal"]').forEach(botao => {
      botao.addEventListener('click', (evento) => {
        const modal_nome = evento.target.getAttribute('data-bs-target') || evento.target.closest('button').getAttribute('data-bs-target');
        if (!isEmpty(modal_nome)) {
          setTimeout(() => {
            const inputs = document.querySelector(modal_nome).querySelectorAll('input')
            const texts_areas = document.querySelector(modal_nome).querySelectorAll('textarea');

            if (!isEmpty(inputs) && inputs.length > 0) {
              inputs[0].focus();
            } else if (!isEmpty(texts_areas) && texts_areas.length > 0) {
              texts_areas[0].focus();
            }
          }, 500)
        }
      })
    })
  }

  window.clickIncluirRenda = (botao) => {
    const proponente = botao.closest('[data-identify]');
    const div = document.createElement('div');
    div.classList.value = `input-group mt-2 mb-2`;
    div.dataset.element = "renda";
    let length = null;
    try {
      length = proponente.querySelectorAll('[data-element="renda"]').length
    } catch (error) {
    }
    div.innerHTML = `${conteudos.secao_rendas(!isEmpty(length) ? length + 1 : 1)}`;
    proponente.querySelector('[data-element="area_rendas"]').appendChild(div);

    try {
      if (botao.closest('[data-element="secao_rendas"]').querySelector('[data-element="area_rendas"]').querySelector(`div.alert.alert-primary`) !== null) {
        botao.closest('[data-element="secao_rendas"]').querySelector('[data-element="area_rendas"]').querySelector(`div.alert.alert-primary`).remove();
      }
    } catch (error) {
    }

    escutaEventoInput();
    clickRemoverRenda(div);
    renderPendencias();
    renderTooltips();
  }

  const clickRemoverRenda = (elemento) => {
    if (!isEmpty(elemento)) {
      acao(elemento.querySelector('[data-action="remover-renda"]'));
    } else {
      document.querySelectorAll('[data-action="remover-renda"]').forEach(botao => {
        acao(botao);
        renderPendencias();
      })
    }

    function acao(botao) {
      removeEventListener('click', botao);
      botao.addEventListener('click', (evento) => {
        try {
          if (elemento.closest('[data-element="area_rendas"]').querySelectorAll('[data-element="renda"]').length - 1 === 0) {
            $(elemento.closest('[data-element="area_rendas"]')).html(`<div class="alert alert-primary mt-2 mb-2">Proponente sem renda</div>`);
          }
        } catch (error) {
          try {
            if (evento.target.closest('[data-element="area_rendas"]').querySelectorAll('[data-element="renda"]').length - 1 === 0) {
              $(evento.target.closest('[data-element="area_rendas"]')).html(`<div class="alert alert-primary mt-2 mb-2">Proponente sem renda</div>`);
            }
          } catch (error) {
          }
        }

        evento.preventDefault();
        $(botao).tooltip('dispose')
        botao.closest('[data-element="renda"]').remove();
      })
    }
  }

// BUG - Verificar falha no evento de escuta em clickIncluirProponente
  const clickIncluirProponente = () => {
    if (document.querySelector('[data-action="incluir-proponente"]')) {
      document.querySelector('[data-action="incluir-proponente"]').onclick = () => {
        console.log('click');
      }
    }
  }

  const acaoClickIncluirProponente = () => {
    // console.log('Click!');
    // alert('Ação!');
    const div = document.createElement('div');
    div.classList.value = `accordion-item`;
    div.innerHTML = `${conteudos.accordion_item(document.querySelectorAll('.accordion-item').length + 1)}`;
    document.querySelector('.accordion').appendChild(div);

    if (Array.from($('.accordion-item')).length > 1) {
      $(div).find('.accordion-button').click();
    }

    setTimeout(() => {
      $(div).find('[data-input="nome"]').focus();
    }, 100);

    renderResumo();
    renderPendencias();
    clickRemoverRenda();
    clickRemoverProponente();
    escutaEventoInput();
    atualizar();
  }

// BUG - Verificar falha no evento de escuta em clickIncluirProponente
  window.acaoClickIncluirProponente = acaoClickIncluirProponente;

  const clickRemoverProponente = () => {
    document.querySelectorAll('[data-action="remover-proponente"]').forEach(botao => {
      removeEventListener('click', botao);
      botao.addEventListener('click', async (evento) => {
        evento.preventDefault();
        SwalAlert('confirmacao', 'question', 'Tem certeza que deseja remover?', 'Esta ação não poderá ser desfeita').then((retorno) => {
          if (retorno.isConfirmed) {
            botao.closest('.accordion-item').remove();
            renderResumo();
            atualizarNumerosProponentes();
            renderPendencias();
          }
        });
      })
    })
  }

  const clickCopiar = () => {
    const btns = document.querySelectorAll('[data-action="copiar"]');
    btns.forEach(btn => {
      if (!isEmpty(btn)) {
        acaoClickCopiar(btn)
      }
    })
  }

  window.acaoClickCopiar = (btn) => {
    try {
      btn.addEventListener('click', () => {
        let e = null;
        let html_retorno = null;
        if (isEmpty(btn.dataset.actionTarget) && btn.dataset.actionTarget !== 'copiar-nomes') {
          const elemento = btn.closest('[data-node="card"]').querySelector('[data-copiar="texto"]');
          e = elemento.value || elemento.innerText;

          const data_input = elemento.dataset.input;

          if (!isEmpty(data_input) && data_input.trim().toLowerCase() === 'nome') {
            e = e.toUpperCase();
          } else if (!isEmpty(data_input) && data_input.trim().toLowerCase() === 'cpf') {
            e = (sanitizarCPF(e));
          }
        } else {
          e = [];
          document.querySelectorAll('[data-input="nome"]').forEach(nome => {
            !isEmpty(nome.value) ? e.push(nome.value.trim().toUpperCase()) : '';
          })
          e = e.join(', ');
          html_retorno = 'N_'
        }

        copiar(e).then(() => {
          if (btn.getAttribute('onclick')) {
            feedbackButton(btn, {
              html: '<i class="bi bi-check2"></i>', classe: 'btn btn-outline-success', html_retorno: html_retorno
            });
          } else {
            feedbackButton(btn, {
              html: '<i class="bi bi-check2"></i>', classe: 'btn btn-success', html_retorno: html_retorno
            });
          }
        });
      })
    } catch (error) {
      if (btn.getAttribute('onclick')) {
        feedbackButton(btn, {html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-outline-danger'});
      } else {
        feedbackButton(btn, {html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-danger', html_retorno: ""});
      }
    }
  }

// TODO - Definir origin para ação de download de acompanhamento de FID
  const clickDownload = (elemento, evento) => {
    evento.preventDefault();
    const saida = [];
    const proponentes = document.querySelectorAll('.accordion-item');
    const primeirosNomes = [];

    proponentes.forEach((proponente) => {
      !isEmpty(proponente.querySelector('[data-input="nome"]').value.trim()) ? primeirosNomes.push(primeiroNome(proponente.querySelector('[data-input="nome"]').value.trim())) : '';
    })

    switch (elemento.dataset.download) {
      case 'baixar-dados':
        baixarDados(proponentes, primeirosNomes, saida);
        break;

      case 'baixar-relatorio':
        baixarRelatorio(primeirosNomes);
        break;

      case 'baixar-pendencias':
        baixarPendencias(primeirosNomes);
        break;

      case 'baixar-acompanhar-fid':
        try {
          const link = new URL(document.querySelector('#input-URL-acompanhar-FID').value);
          const split = link.search.split('codigo=');
          const FID = split[1].split("=")[0].split("&")[0];

          const valido = [link.origin.toLowerCase() === 'https://portalsafi.direcional.com.br', link.pathname.toLowerCase() === '/fluxo', link.search.includes("codigo"), split.length === 2, !isNaN(parseInt(FID)) && !isNaN(parseInt(split[1]))]

          if (verificarSeFIDvalido(FID) && valido.every(e => e === true)) {
            reportar(true);
            criarEBaixarHTMLAcompanhamento(parseInt(FID), `Acompanhe o FID ${parseInt(FID)}`);
          } else {
            reportar(false, 'O link informado para o FID não é válido');
          }

        } catch (error) {
          reportar(false, 'O link informado para o FID não é válido');
        }

      function reportar(condicao, texto) {
        const retorno = document.querySelector('[data-element="retorno-link-fid"]');
        if (!condicao) {
          retorno.setAttribute('class', 'alert alert-danger mt-3 mb-0');
          retorno.innerText = texto;
        } else {
          retorno.setAttribute('class', '');
          retorno.innerText = '';
        }
      }

        break;
    }
  }
  window.clickDownload = clickDownload;

  const baixarDados = (proponentes, primeirosNomes, saida) => {
    //Selecionar Nome, CPF e data de nascimento de todos os proponentes
    proponentes.forEach((proponente, index) => {
      const nome = proponente.querySelector('[data-input="nome"]').value.trim();
      saida.push(`PROPONENTE ${index + 1}\n` + `NOME: ${!isEmpty(nome) ? nome.toUpperCase() : ''}\n` + `CPF: ${sanitizarCPF(proponente.querySelector('[data-input="cpf"]').value.trim())}\n` + `DT NASC: ${proponente.querySelector('[data-input="data_nascimento"]').value.trim()}\n` + `TELEFONE: ${proponente.querySelector('[data-input="telefone"]').value.replaceAll('-', '').trim()}\n` + `EMAIL: ${proponente.querySelector('[data-input="email"]').value.trim()}\n\n`)
    });
    criarEBaixarTXT(JSON.stringify(saida.join('\n')), `DADOS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`);
  }

  const baixarRelatorio = (primeirosNomes) => {
    //Selecionar conteúdo no textarea de relatório
    const relatorio = document.querySelector('[data-content="relatorio"]').value;
    criarEBaixarTXT(JSON.stringify(relatorio), `RELATORIO${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`, 'relatorio');
  }

  const baixarPendencias = (primeirosNomes) => {
    //Selecionar conteúdo no textarea de pendências
    const pendencias = document.querySelector('[data-content="pendencias"]').value;
    criarEBaixarTXT(JSON.stringify(pendencias), `PENDENCIAS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`, 'pendencias');
  }

  const criarEBaixarTXT = (conteudo, nome, origin) => {
    // TODO - marcar que foi baixado
    if (origin) {
      // Apenas os downloads do relatório e das pendências são marcados como baixados pela variável de controle
      if (['relatorio', 'pendencias'].includes(origin)) {
        txtFileHasDownloaded(true);
      }
    }

    let blob = new Blob([`${JSON.parse(conteudo)}`], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${nome.toUpperCase()}.txt`);
  }

  const criarEBaixarHTMLAcompanhamento = (FID, nome) => {
    let blob = new Blob([`${conteudos.HTMLacompanharFID(String(FID), `https://portalsafi.direcional.com.br/Fluxo?codigo=${FID}`)}`], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${nome.trim()}.html`);
  }

  function clickLimparProcesso() {
    const btn = document.querySelector('[data-action="limpar-processo"]');

    if (!isEmpty(btn)) {
      btn.addEventListener('click', (evento) => {
        evento.preventDefault();

        SwalAlert('confirmacao', 'question', 'Tem certeza que deseja limpar todo o processo?', 'Esta ação não poderá ser desfeita').then((retorno) => {
          if (retorno.isConfirmed) {
            verificarInputsRecarregamento('clear');
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();

            document.querySelectorAll('[data-input]').forEach(input => {
              if (input.tagName.toLowerCase() === 'textarea' || input.tagName.toLowerCase() === 'input' && input.getAttribute('type') === 'text') {
                input.value = '';
              } else if (input.tagName.toLowerCase() === 'input' && input.getAttribute('type') === 'checkbox') {
                input.checked = false;
              }
            })

            document.querySelectorAll('textarea').forEach(textarea => {
              textarea.value = '';
              textarea.style.height = '100px';
            })

            document.querySelectorAll('input[type=url]').forEach(input => {
              input.value = '';
            })

            document.querySelectorAll('.accordion-item').forEach(item => {
              item.remove()
            });
            renderResumo();
            atualizarNumerosProponentes();
            renderPendencias();
          }
        });
      })
    }
  }

  function clickAddInformacoes() {
    const modal = document.querySelector('#modal-informacoes-adicionais');
    if (!isEmpty(modal)) {
      document.querySelector('[data-action="add-informacoes"]').addEventListener('click', (evento) => {
        evento.preventDefault();
        acionarModalAddInformacoes();
      })

      modal.querySelector('form').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const dados = {
          'fid': evento.target.querySelector('[data-input="id-fid"]').value,
          'gerente': evento.target.querySelector('#id-gerente-ou-corretor').value,
          'empreendimento': evento.target.querySelector('#id-empreendimento').value,
          'valor': evento.target.querySelector('[data-input="id-valor-imovel"]').value,
          analista: evento.target.querySelector('[data-input="id-analista"]'),
          'add_data_hora': evento.target.querySelector('#add-data-hora').checked,
          'limpar_txt_area': evento.target.querySelector('#limpar-txt-area').checked,
        };

        const textarea = document.querySelector('[data-content="relatorio"]');

        !isEmpty(dados.limpar_txt_area) ? dados.limpar_txt_area ? textarea.value = '' : '' : '';

        textarea.value += `FID: ${dados.fid}\n` + `GERENTE: ${!isEmpty(dados.gerente) ? dados.gerente.trim().toUpperCase() : ''}\n` + `EMPREENDIMENTO: ${!isEmpty(dados.empreendimento) ? dados.empreendimento.trim().toUpperCase() : ''}\n` + `VALOR IMÓVEL: ${dados.valor}\n`;

        !isEmpty(dados.add_data_hora) ? dados.add_data_hora ? textarea.value += `\n## ${moment().format('DD/MM/YYYY HH:mm')} - ${!isEmpty(dados.analista.value) ? dados.analista.value.toUpperCase().trim() : '[ANALISTA]'} ##\n` : '' : '';

        resizeTextArea(textarea);
        $(modal).modal('hide');

        setTimeout(() => {
          textarea.focus()
        }, 500);
      })
    }
  }

  function acionarModalAddInformacoes() {
    const modal = document.querySelector('#modal-informacoes-adicionais');
    // console.log('aqui')
    $(modal).modal('show');
    setTimeout(() => {
      modal.querySelector('[data-input="id-fid"]').focus();
      modal.querySelector('#id-analista').value = new Settings().getOption('analyst') || '';
    }, 500)
  }

  function clickVisibilidadeSenha() {
    const botao = document.querySelector('[data-action="btn-visibilidade-senha"]');
    if (!isEmpty(botao)) {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        const input = botao.parentElement.querySelectorAll('input')[0];
        input.setAttribute('type', input.type === 'text' ? 'password' : 'text');
      })
    }
  }

  function clickAddDevolucaoFID() {
    const botao = document.querySelector('[data-action="add-devolucao-fid"]');
    if (!isEmpty(botao)) {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        acionarDevolucaoFID();
      })
    }
  }

  function acionarDevolucaoFID() {
    const modal = document.querySelector('#modal-devolucao-fid');
    // SwalAlert('aviso', 'error', 'Desculpe. Esta função ainda não foi implementada.', '');
    $(modal).modal('show');

    setTimeout(() => {
      modal.querySelectorAll('input')[0].focus();
      modal.querySelector('#dev-analista').value = `ANL. ${new Settings().getOption('id-analyst')}` || '';
    }, 500);
  }

  function submitAddDevolucaoFID() {
    const modal = document.querySelector('#modal-devolucao-fid');
    if (!isEmpty(modal)) {
      modal.querySelector('form').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const form = evento.target;
        const finac = form.querySelector('#dev-financ-NPMCMV').checked ? 'NPMCMV' : form.querySelector('#dev-financ-SBPE').checked ? 'SBPE' : form.querySelector('#dev-financ-PROCOTISTA').checked ? 'Pró-cotista' : '';

        const subsidio_valido = !isEmpty(form.querySelector('#dev-subsidio').value.trim()) && form.querySelector('#dev-subsidio').value.trim() !== 'R$ 0,00';

        const FGTS_valido = !isEmpty(form.querySelector('#dev-FGTS').value.trim()) && form.querySelector('#dev-FGTS').value.trim() !== 'R$ 0,00';

        const analista = form.querySelector('#dev-analista').value.trim();

        const complemento = {
          tela_endividamento: '',
          FGTS_solicitado: '',
          verificacao_FGTS: '',
          autorizacao_FGTS: '',
          aviso_IRPF: '',
          restricao_externa: '',
          prejuizo_scr: '',
          dividas_vencidas: '',
          pendencia_cef: '',
          autorizacao_pesquisa: '',
          ciencia_DARF: '',
          autorizacoes_pesquisas: ''
        }

        evento.target.querySelectorAll('.selecao-multiplas-opcoes input[type=checkbox]').forEach(input => {
          // console.log(input, input.dataset.valueFormComp, input.checked)
          complemento[input.getAttribute('id').replaceAll('-', '_')] = input.checked ? input.dataset.valueFormComp.toString() : '';
          // console.log(complemento[input.getAttribute('id').replaceAll('-', '_')])
        })

        // console.log(complemento);

        const dev = {
          renda: `Renda: ${form.querySelector('#dev-renda').value.trim()}. `,
          parcela: `Parcela ${form.querySelector('#dev-status-parcela-aprovado').checked ? 'aprovada' : 'possível'}: ${form.querySelector('#dev-parcela').value}. `,
          situacao: `${form.querySelector('#dev-tabela-price').checked ? 'PRICE' : 'SAC'}. `,
          modalidade: `${finac}. `,
          prazo: `${form.querySelector('#dev-prazo').value} meses. `,
          primeira: `1ª parcela: ${form.querySelector('#dev-parcela-1').value} - Seguro ${capitalize(form.querySelector('#dev-seguro').value.trim())}. `,
          subsidio: `${subsidio_valido ? 'Subsídio: ' + form.querySelector('#dev-subsidio').value.trim() + '. ' : ''}`,
          financiamento: `Valor de financiamento: ${form.querySelector('#dev-valor-de-financiamento').value.trim()}. `,
          taxa: `Taxa de juros: ${form.querySelector('#dev-taxa-juros').value.substr(0, 4).trim()}% a.a. `,
          FGTS: `${FGTS_valido ? '## FGTS: ' + form.querySelector('#dev-FGTS').value.trim() + '. ' : ''}`,
          pendencias: `${!isEmpty(form.querySelector('#dev-pendencias').value.trim()) ? '## Pendência(s): ' + form.querySelector('#dev-pendencias').value.trim() + '. ' : ''}`,
          restricoes: `${!isEmpty(form.querySelector('#dev-restricoes').value.trim()) ? '## Restrição(s): ' + form.querySelector('#dev-restricoes').value.trim() + '. ' : complemento.autorizacao_pesquisa ? '## Restrição(s): ' + complemento.autorizacao_pesquisa + '. ' : complemento.autorizacoes_pesquisas ? '## Restrição(s): ' + complemento.autorizacoes_pesquisas : ''}`,
          analista: `${!isEmpty(analista) ? '## ' + analista.toUpperCase() : ''}`
        }

        // Tabela percentual FINANC
        const maximo_financiamento_condicionamento = {
          SBPE: {
            financiamento: {
              PRICE: 0.8, SAC: 0.9
            }, comprometimento: {
              PRICE: 0.25, SAC: 0.3
            }
          }, NPMCMV: {
            financiamento: {
              PRICE: 0.8, SAC: 0.8
            }, comprometimento: {
              PRICE: 0.3, SAC: 0.3
            }
          }, "PRÓ-COTISTA": {
            financiamento: {
              PRICE: 0.8, SAC: 0.8
            }, comprometimento: {
              PRICE: 0.25, SAC: 0.3
            }
          }
        }

        const BRLToFloat = (value) => {
          return parseFloat(value.replace('R$', '').replaceAll('.', '').replace(',', '.'));
        };

        // TODO - Usar a mesma lógica e código da funcionalidade de cálculo para o percentual de financiamento e comprometimento
        const percent_financiamento = BRLToFloat(document.querySelector('[data-input="id-valor-imovel"]').value.trim()) > 0 ? (BRLToFloat(form.querySelector('#dev-valor-de-financiamento').value.trim()) * 100 / BRLToFloat(document.querySelector('[data-input="id-valor-imovel"]').value.trim())).toFixed(2) + '%. | ' + maximo_financiamento_condicionamento[finac.toUpperCase()]["financiamento"][form.querySelector('#dev-tabela-price').checked ? 'PRICE' : 'SAC'] : 'Não calculado.';

        const percent_comprom = BRLToFloat(form.querySelector('#dev-parcela').value.trim()) > 0 && BRLToFloat(form.querySelector('#dev-renda').value.trim()) > 0 ? ((BRLToFloat(form.querySelector('#dev-parcela').value.trim())) * 100 / BRLToFloat(form.querySelector('#dev-renda').value.trim())).toFixed(2) + '%.' : 'Não calculado.';

        const condicionou = percent_comprom !== 'Não calculado' ? maximo_financiamento_condicionamento[finac.toUpperCase()]["comprometimento"][form.querySelector('#dev-tabela-price').checked ? 'PRICE' : 'SAC'] > parseFloat(percent_comprom.replace('%.', '') / 100) ? 'Sim' : 'Não' : 'Não calculado.';

        const res = `<b>- Percentual de Financiamento:</b> ${percent_financiamento}<br><b>- Percentual de Comprometimento:</b> ${percent_comprom}<br><b>- Condicionou: ${condicionou}</b>`;

        Swal.fire({
          title: 'Percentuais de Financiamento e Comprometimento', html: res, icon: 'info'
        })

        // Exibindo no console para verificação de falha no cálculo
        console.groupCollapsed('Percentuais de Financiamento e Comprometimento - Devolução FID - ' + new Date().toLocaleString());
        console.table({
          'Valor de compra e venda': BRLToFloat(document.querySelector('[data-input="id-valor-imovel"]').value.trim()),
          'Valor de financiamento': BRLToFloat(form.querySelector('#dev-valor-de-financiamento').value.trim()),
          'Renda': BRLToFloat(form.querySelector('#dev-renda').value.trim()),
          'Parcela': BRLToFloat(form.querySelector('#dev-parcela').value.trim()),
          'Financiamento': finac,
          'Tabela': form.querySelector('#dev-tabela-price').checked ? 'PRICE' : 'SAC',
          'Retorno': res.replace(/<br>/g, '\n').replace(/<\/*b>/g, '')
        });
        console.groupEnd();

        let devolucao = dev.renda + dev.parcela + complemento.tela_endividamento + complemento.dividas_vencidas + complemento.pendencia_cef + complemento.prejuizo_scr + complemento.restricao_externa + dev.situacao + dev.modalidade + dev.prazo + dev.primeira + dev.subsidio + dev.financiamento + dev.taxa + complemento.FGTS_solicitado + complemento.verificacao_FGTS + complemento.autorizacao_FGTS + dev.FGTS + dev.pendencias + complemento.ciencia_DARF + complemento.aviso_IRPF + dev.restricoes + dev.analista + `\n\n${res.replace(/<br>/g, '\n').replace(/<\/*b>/g, '')}`;

        const textarea = document.querySelector('[data-content="relatorio"]');
        textarea.value += `Prezados, ${cumprimentoHorario()}! ${devolucao}`;

        $(modal).modal('hide');
        resizeTextArea(textarea);

        setTimeout(() => {
          textarea.focus()
        }, 500);
      })
    }
  }

  function clickImportarPendencias() {
    const botao = document.querySelector('[data-action="importar-pendencias"]');
    if (!isEmpty(botao)) {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();
        const textarea = botao.closest('.row').querySelector('#dev-pendencias');
        const pendencias = document.querySelector('[data-content="pendencias"]').value;
        const texto = (((pendencias.replace('\n', '')).replaceAll(':', ': ')).replaceAll('\n\n', '. ')).replaceAll('\n', ', ')
        textarea.value += capitalize(texto.toLowerCase());
        resizeTextArea(textarea);
      })
    }
  }

  function submitInformarRestricoes() {
    $('#modal-informar-restricoes form').submit((evento) => {
      evento.preventDefault();
      const text_area = evento.target.querySelector('#text-restricoes');
      let valor_text_area = evento.target.querySelector('#text-restricoes').value;

      if (!isEmpty(valor_text_area) && valor_text_area.trim().length > 0) {
        valor_text_area = valor_text_area.replaceAll('\n', '')
        const valor_split = valor_text_area.split(' ');

        const saida = (valor_split.filter(e => e !== '').map(e => e.trim())).join(' ')
        // console.log(saida)

        $('#dev-restricoes').val(saida);
        $('#modal-informar-restricoes').modal('hide');
        $('#modal-devolucao-fid').modal('show');

        setTimeout(() => {
          $('#dev-restricoes').focus();
        }, 500);
      } else {
        // Informar que o campo está em branco
        text_area.value = '';
        text_area.focus();
      }
    })
  }

  function clickLimparTudoSecao() {
    $('[data-action="limpar-tudo-secao"]').each((index, botao) => {
      $(botao).click(() => {
        // Implementado apenas para limpar os inputs/textareas dos modais da seção de relatório

        const elementos_nomes = ['modal-informacoes-adicionais', 'modal-devolucao-fid', 'modal-informar-restricoes', 'modal-calcular-percentual']

        try {
          elementos_nomes.forEach(elemento => {
            const formulario = document.querySelectorAll(`#${elemento} form`);

            formulario.forEach(form => {
              const [inputs, textareas, inputs_checks] = [form.querySelectorAll(`input`), form.querySelectorAll(`textarea`), form.querySelectorAll(`.form-check-input`)]

              if (!isEmpty(inputs)) {
                inputs.forEach(input => {
                  input.value = '';
                })
              }

              if (!isEmpty(textareas)) {
                textareas.forEach(textarea => {
                  textarea.value = '';
                })
              }

              if (!isEmpty(inputs_checks)) {
                inputs_checks.forEach(input => {
                  input.checked = false;
                })
              }
            });
          });

          // Desmarcar todos os checkboxes da seleção múltipla de opções
          $('.selecao-multiplas-opcoes').find('.form-group').each((index, grupo) => {
            $(grupo).find('input[type=checkbox]').each((index, input) => {
              $(input).prop('checked', false);
            });

            $(grupo).find('label').each((index, label) => {
              $(label).removeClass('checked');
            });
          })

          feedbackInfo({html: '<i class="bi bi-check2"></i>', classe: 'btn btn-success'}, botao)
        } catch (error) {
          console.log('Ocorreu um erro ao tentar limpar os elementos. Erro: %s', error);
        }
      })
    })
  }

  const clickEnviarDados = () => {
    const botoes = document.querySelectorAll('[data-action="enviar-dados"]');
    botoes.forEach(botao => {
      botao.addEventListener('click', (evento) => {
        evento.preventDefault();

        const nomes = [document.querySelectorAll('[data-input="nome"]')[0], document.querySelectorAll('[data-input="nome"]')[1]];
        const CPFs = [document.querySelectorAll('[data-input="cpf"]')[0], document.querySelectorAll('[data-input="cpf"]')[1]];
        const saida = [];

        if (!nomes.every(nome => nome === undefined) && !CPFs.every(CPF => CPF === undefined)) {
          if (nomes[0] !== undefined) {
            if (!isEmpty(nomes[0].value)) {
              saida.push(`nome_1=${sanitizarStringParaURL(nomes[0].value)}`);
            }
          }

          if (CPFs[0] !== undefined) {
            if (!isEmpty(CPFs[0].value)) {
              saida.push(`CPF_1=${sanitizarStringParaURL(CPFs[0].value)}`);
            }
          }

          if (nomes[1] !== undefined) {
            if (!isEmpty(nomes[1].value)) {
              saida.push(`nome_2=${sanitizarStringParaURL(nomes[1].value)}`);
            }
          }

          if (CPFs[1] !== undefined) {
            if (!isEmpty(CPFs[1].value)) {
              saida.push(`CPF_2=${sanitizarStringParaURL(CPFs[1].value)}`);
            }
          }
        }

        if (!isEmpty(saida)) {
          window.open(`https://gabriersdev.github.io/capa-de-dossies?${saida.join('&')}`)
        } else {
          SwalAlert('error', 'warning', 'Necessário preencher os dados básicos do(s) proponente(s)').then(() => {
          });
        }

        function sanitizarStringParaURL(string) {
          if (!isEmpty(string)) {
            return string.trim().toLowerCase().replaceAll(' ', '-');
          } else {
            return '';
          }
        }
      })
    })
  }

  window.subirProponente = (element, event) => {
    event.preventDefault();
    const accordion = element.closest('.accordion');
    const accordionItens = Array.from(accordion.querySelectorAll('.accordion-item'));
    const accordionElement = accordionItens.find((item) => item === element.closest('.accordion-item'));

    if (accordion && accordionItens.length > 0 && accordionElement) {
      if (accordionItens.indexOf(accordionElement) > 0) {
        accordionItens.forEach((item) => {
          if (item !== accordionElement) {
            item.remove();
            $(accordion).append(item);
          }
        })
        atualizarNumerosProponentes();
      }
    }
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

  const atualizarNumerosProponentes = () => {
    document.querySelectorAll('.accordion-header').forEach((elemento, index) => {
      const valorInputNome = elemento.closest('.accordion-item').querySelector('[data-input="nome"]').value;
      elemento.querySelector('span').innerHTML = `Proponente ${index + 1} - <b data-content="nome" data-information="nome-proponente">${!isEmpty(valorInputNome) ? valorInputNome.toUpperCase() : 'Nome do cliente'}</b>`;
      edicaoInputNome();
    })
  }

  const edicaoInputCPF = (input) => {
    input.addEventListener('input', () => {
      verificarCPF(input.value.trim()) ? input.parentElement.classList.remove('invalido') : input.parentElement.classList.add('invalido');
    })
  }

  const edicaoInputEmail = (input) => {
    input.addEventListener('input', () => {
      verificarEmail(input.value.trim()) ? input.parentElement.classList.remove('invalido') : input.parentElement.classList.add('invalido');
    })
  }

  const edicaoInputData = (input) => {
    input.addEventListener('input', () => {
      verificarData(input.value.trim()) ? input.parentElement.classList.remove('invalido') : input.parentElement.classList.add('invalido');
    })
  }

  const edicaoTextAreaRelatorio = (textarea) => {
    textarea.addEventListener('input', () => {
      textarea.addEventListener('input', () => {
        resizeTextArea(textarea)
      });
    })
  }

  const edicaoTextAreaPendencias = (textarea) => {
    textarea.addEventListener('input', () => {
      textarea.addEventListener('input', () => {
        resizeTextArea(textarea)
      });
    })
  }

  const edicaoTextAreaRestricoes = (textarea) => {
    textarea.addEventListener('input', () => {
      textarea.addEventListener('input', () => {
        resizeTextArea(textarea)
      });
    })
  }

  function renderConteudosPagina(area_elementos, elementos, objeto, caso) {
    const tags = [];
    let conteudos_tag = [];
    area_elementos.innerHTML = '';

    elementos.forEach(e => {
      if (!tags.includes(e.tag) && !isEmpty(e.tag)) {
        tags.push(e.tag);
      }
    })

    tags.sort((a, b) => a.localeCompare(b)).forEach(tag => {
      conteudos_tag.push(elementos.filter(e => e.tag === tag))
    })

    if (!isEmpty(caso)) {
      conteudos_tag = [elementos];
    }

    conteudos_tag.forEach((conteudo_tag, index) => {
      const titulo = document.createElement('h5');
      titulo.classList.value = `titulo-${objeto} text-muted`;
      if (!isEmpty(caso)) {
        titulo.appendChild(document.createTextNode(`${(caso)}`));
      } else {
        titulo.appendChild(document.createTextNode(`${capitalize(tags[index])}`));
      }
      const div = document.createElement('div');
      div.classList.add(`${objeto}`);

      area_elementos.appendChild(titulo)
      area_elementos.appendChild(div);

      conteudo_tag.forEach(elemento => {
        const div_elemento = area_elementos.querySelectorAll(`div.${objeto}`);
        const a = document.createElement('a');
        a.classList.add('content');
        a.setAttribute('href', `${elemento.link}`)
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noreferrer noopener')
        a.innerHTML = `<span class="content-tag">${capitalize(elemento.tag)}</span><div class="content-principal"><h5>${elemento.titulo}</h5>${elemento.subtitulo ? '<span class="text-muted">' + elemento.subtitulo + '</span><br>' : ''}<span>${elemento.sistema}</span></div>`;
        div_elemento[(div_elemento.length - 1)].appendChild(a);
      })
    })
  }

  const setTheme = (theme) => {
    const origin = new URL(window.location).origin;
    if (theme === 'dark' || theme === 'default') {
      $('html').attr('data-bs-theme', theme);
      $('link[rel="stylesheet"]').each((i, link) => {
        if (link.href.match(/\/assets\/css\/cores-(default|dark).css/i)) {
          if (origin !== 'https://gabriersdev.github.io') {
            link.setAttribute('href', `${origin}/assets/css/cores-${theme}.css`);
          } else {
            link.setAttribute('href', `${origin}/cca/assets/css/cores-${theme}.css`);
          }
        }
      })
    } else {
      $('html').attr('data-bs-theme', 'normal');
    }
  }

  const setAutocomplete = (autocomplete) => {
    if (autocomplete === true) {
      $('form, textarea').attr('autocomplete', 'on');
    } else {
      $('form, textarea').attr('autocomplete', 'off');
    }
  }

  const verificarInputsRecarregamento = () => {
    window.onbeforeunload = (evento) => {
      // Há o que preservar
      // TODO - Adicionar monitoramento de campos editados que são inicializados com conteúdo (pendências, análise internalizada, etc.)
      if (Array.from($('input, textarea')).filter(e => e.checked === undefined ? e.value !== "R$ 0,00" && e.value.trim().length > 0 : '').length > 0) {
        evento.preventDefault();

        // Verificas se os dados das pendências e relatório foram baixados e exibe o aviso Swal.Alert
        if (!txtFileHasDownloaded()) SwalAlert('aviso', 'warning', 'Há campos preenchidos e as pendências ou relatório não foram baixados', 'Você tem certeza que deseja sair? Os dados preenchidos não foram salvos e serão perdidos pra sempre...').then(() => {
        });
      } else {
        // Não há o que preservar
      }
    }
  }

  const escutaEventoInput = () => {
    const inputs = Array.from(document.querySelectorAll('[data-element="input"]'));
    inputs.forEach(elemento => {

      tratamentoCampos(elemento);

      if (elemento.dataset.input === "nome") {
        edicaoInputNome();
      } else if (elemento.dataset.input === 'cpf') {
        edicaoInputCPF(elemento)
      } else if (elemento.dataset.input === 'email') {
        edicaoInputEmail(elemento);
      } else if (elemento.dataset.input === 'data_nascimento') {
        edicaoInputData(elemento)
      } else if (elemento.dataset.content === 'relatorio') {
        edicaoTextAreaRelatorio(elemento)
      } else if (elemento.dataset.content === 'pendencias') {
        edicaoTextAreaPendencias(elemento)
        elemento.addEventListener('keypress', () => {
          textAreasEditados(true);
        })
        elemento.addEventListener('input', () => {
          textAreasEditados(true);
        })
      } else if (elemento.dataset.content === 'text-restricoes') {
        edicaoTextAreaRestricoes(elemento);
      } else if (elemento.dataset.input === 'id-fid') {
        let linkGerado;

        elemento.addEventListener('input', () => {
          if (verificarSeFIDvalido(elemento.value)) {
            // Exibir botão para ir até o link de acompanhamento
            $('[data-element="btn-ref-link-FID"]').attr('disabled', false);

            linkGerado = `https://portalsafi.direcional.com.br/Fluxo?codigo=${elemento.value}`;

            // Limpar link de acompanhamento
            $('#input-URL-acompanhar-FID').val(linkGerado);
          } else {
            // Ocultar botão para ir até o link de acompanhamento
            $('[data-element="btn-ref-link-FID"]').attr('disabled', true);

            linkGerado = '';

            // Limpar link de acompanhamento
            $('#input-URL-acompanhar-FID').val('');
          }
        })

        // TODO - Separar em outro arquivo
        $('[data-action="ir-para-link-FID-gerado"]').on('click', (evento) => {
          evento.preventDefault();
          if (evento.target.disabled === false) {
            $('#modal-informacoes-adicionais').modal('hide');
            window.scrollTo({top: document.querySelector('#area-acompanhamento-fid').offsetTop, behavior: 'smooth'});
          }
        })

        $('[data-action="baixar-acompanhamento-FID"]').on('click', (evento) => {
          evento.preventDefault();
          if (evento.target.disabled === false) {
            if (!isEmpty(linkGerado)) {
              evento.target.disabled = true;
              // Atraso para evitar que o navegador baixe multiplos arquivos - 1 segundo
              setTimeout(() => {
                clickDownload({dataset: {download: 'baixar-acompanhar-fid'}}, evento);
                evento.target.disabled = false;
                // Focando no campo de empreendimento para continuar o preenchimento
                setTimeout(() => {
                  $('#id-empreendimento').focus();
                }, 500);
              }, 500);
            }
          }
        })

        $('[data-action="abrir-link-FID"]').on('click', (evento) => {
          evento.preventDefault();
          if (evento.target.disabled === false) {
            if (!isEmpty(linkGerado)) window.open(linkGerado, '_blank', 'noopener,noreferrer');
          }

        })
      }

      if (elemento.tagName.toLowerCase() !== 'textarea') {
        elemento.addEventListener('input', () => {
          renderPendencias();
        });
      }
    })
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
        // Créditos https://stackoverflow.com/questions/62894283/javascript-input-mask-currency
        // console.log(input)
        // console.log(input.value)

        if (isEmpty(input.value)) {
          input.value = 'R$ 0,00';
        }

        input.addEventListener('input', () => {
          const value = input.value.replace('.', '').replace(',', '').replace(/\D/g, '')

          const options = {minimumFractionDigits: 2}
          const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100)

          if (isNaN(result) && result === 'NaN') {
            input.value = 'R$ 0,00';
          } else {
            input.value = 'R$ ' + result;
          }
        })

        input.removeAttribute('maxlength');
      }
    });
  }

  const getURLPlanilhaPerMonth = (month) => {
    // const path: `/assets/docs/planilhas/apuracao-mes-${month}.xlsx`,
    const planilhas = conteudos.planilhas;
    const monthTrated = parseInt(month, 10);

    if (![null, undefined].includes(planilhas.find(planilha => planilha.month === monthTrated).code) && ![null, undefined].includes(monthTrated)) {
      // return `https://drive.google.com/uc?export=download&id=${planilhas.find(planilha => planilha.month === monthTrated).code || codePlanilhaDefault}`;
      return window.location.hostname === "gabriersdev.github.io" ? `/cca/assets/docs/MODELO ${monthTrated + 1} - APURACAO.xlsx` : `/assets/docs/MODELO ${monthTrated + 1} - APURACAO.xlsx`;
    } else {
      return null;
    }
  }

  const updateLinkPlanilha = () => {
    // const month = moment().now().get('month');
    let month = new Date().getMonth();
    // let month = ('0' + new Date().getMonth());
    // month = month.slice(month.length > 2? 1 : 0, month.length > 2? 3 : 2);

    const regex = RegExp(/\d{1,2}/);

    if (regex.test(regex.exec(month))) {
      const ret = getURLPlanilhaPerMonth(regex.exec(month)[0]);
      if (!ret) {
        console.log('Não foi possível recuperar o link da tabela de apuração para o mês atual. Parâmetro incorreto.');
      }
      return ret;
    } else {
      return null;
    }
  }

  function funcoesBase() {
    verificarInputsRecarregamento();
    renderTooltips();
    renderPopover();
    renderResumo();
    renderPendencias();
    clickCopiar();
    clickLimparProcesso();
    clickIncluirProponente();
    clickRemoverProponente();
    clickRemoverRenda();
    clickAddInformacoes();
    clickVisibilidadeSenha();
    clickAddDevolucaoFID();
    submitAddDevolucaoFID();
    submitInformarRestricoes();
    edicaoInputNome();
    escutaEventoInput();
    clickImportarPendencias();
    clickAcionarModal();
    clickLimparTudoSecao();
    clickEnviarDados();

    const modalGerarTexto = document.querySelector('#modal-gerar-texto-ia');
    const formGerarTexto = document.querySelector('#form-gerar-texto-ia');
    if (modalGerarTexto && formGerarTexto) {
      formGerarTexto.addEventListener('submit', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();

        const textPrompt = e.target.querySelector('textarea#txt-gerar-texto-ia');
        const btn = e.target.querySelector('button[type="submit"]');
        const btnClassBase = [...btn.classList].filter(c => c !== 'btn-primary');

        if (!textPrompt.value) {
          alert('O campo de texto para do prompt deve ser preenchido.');
          return;
        } else if (textPrompt.value.length > 200) {
          alert('O prompt suporta até 200 caracteres. Ajuste o texto.');
          return;
        }

        btn.textContent = 'Criando...';
        btn.classList.value = [...btnClassBase, 'btn-secondary'].join(' ');
        btn.disabled = true;

        fetch(window.location.hostname !== 'localhost' ? 'https://gabriers.up.railway.app/api/text-generator' : 'http://localhost:8001/api/text-generator/', {
          method: 'POST', headers: {
            'Accept': 'application/json', 'Content-Type': 'application/json'
          }, body: JSON.stringify({
            // Adiciona instrução ao prompt para não criar textos imensos
            words: `${textPrompt.value}. Gere o texto com conciso, objetivo e não muito grande.`, temperature: 0.5
          })
        }).then(res => res.json()).then(text => {
          if (!text) {
            alert('Não foi possível criar o texto. Tente novamente ou contacte o administrador');
            return;
          }
          setTimeout(() => {
            btn.textContent = 'Criado!';
            btn.classList.value = [...btnClassBase, 'btn-success'].join(' ');

            setTimeout(() => {
              btn.textContent = 'Enviar';
              btn.classList.value = [...btnClassBase, 'btn-primary'].join(' ');
              btn.disabled = false;
            }, 1000);

            document.querySelector('[data-content="relatorio"]').value += text;
            $(modalGerarTexto).modal('hide');
            setTimeout(() => {
              textPrompt.focus()
            }, 500);
          }, 1000);
        }).catch(err => {
          console.error(err);
          setTimeout(() => {
            btn.textContent = 'Ocorreu um erro!';
            btn.classList.value = [...btnClassBase, 'btn-danger'].join(' ');

            setTimeout(() => {
              btn.textContent = 'Enviar';
              btn.classList.value = [...btnClassBase, 'btn-primary'].join(' ');
              btn.disabled = false;
            }, 1000);
          }, 1000);
        });
      });
    }

    $('[data-action="exibir-informacoes"]').on('click', (evento) => {
      evento.preventDefault();
      document.querySelector('.modal-informacoes-pagina').showModal();
    })

    $('[data-action=fechar-modal-dialog]').on('click', (evento) => {
      evento.target.closest('dialog').close();
    })

    $('[data-action="carregar-outros-projetos"]').ready(() => {
      if (outrosProjetosExibicao.length > 0) {
        outrosProjetosExibicao.toSorted((a, b) => a.nome.localeCompare(b.nome)).toSpliced(4).forEach((projeto) => {
          $('[data-action="carregar-outros-projetos"]').append(`<li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="${projeto.link}">${projeto.nome}</a></li>`)
        })
      } else {
        $('[data-action="carregar-outros-projetos"]').append(`<li>Acesse o <a data-link="github-dev">GitHub</a> e conheça outros projetos do desenvolvedor.</li>`)
      }
    })

    $('[data-set-setting]').on('click', (evento) => {
      const settings = new Settings();

      evento.preventDefault();
      const setting = evento.target.dataset.setSetting;
      switch (setting) {
        case 'alterar-analista':
          const actualAnalyst = settings.getOption('analyst') || '';
          const resp = prompt('Alterar analista para:', actualAnalyst);

          if (resp) {
            if (resp.length > 0 && (resp !== actualAnalyst)) {
              settings.setOption('analyst', resp);
            }
          }
          break;

        case 'alterar-id-analista':
          const actualIDAnalyst = settings.getOption('id-analyst') || '';
          const respID = prompt('Alterar ID do analista para:', actualIDAnalyst);

          if (respID) {
            if (respID.length > 0 && (respID !== actualIDAnalyst)) {
              settings.setOption('id-analyst', respID);
            }
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

    if (document.title === 'Confirmação de dados - CCA') {
      const btnRecuperarDados = $('[data-action="recuperar-dados"]');
      const toast = $('#toast-feedback');
      let retorno = 'Ocorreu um erro';

      if (btnRecuperarDados) {
        let icon = 'error';
        let text = 'Ocorreu um erro.'

        $(btnRecuperarDados).click((evento) => {
          evento.preventDefault();
          let local = localStorage.getItem('cca');

          try {
            local = JSON.parse(local);

            if (!isEmpty(local)) {
              if (local["data-campos-storage"]["relatório"]) {
                $('[data-content="relatorio"]').val(local["data-campos-storage"]["relatório"]);
              }

              if (local["data-campos-storage"]["pendências"]) {
                $('[data-content="pendencias"]').val(local["data-campos-storage"]["pendências"]);
              }

              icon = 'success';
              retorno = 'Dados recuperados!';
              text = 'O campo de relatório e-ou pendência foi atualizado conforme o que foi salvo da última vez';
            } else {
              icon = 'warning';
              retorno = 'Não há dados salvos';
              text = 'Não há registros salvos do campo de relatório ou o do campo de pendência';
            }
          } catch (error) {
            icon = 'error';
            retorno = 'Não foi possível recuperar os dados. Consulte o console';
            text = 'Os campos de relatório e pendências não foram alterados';
            console.log('Não foi possível recuperar os dados', error.message);
          }

          // Feedback ao usuário
          SwalAlert('aviso', icon, retorno, text);
        });
      }

      let click113 = false;
      let click66 = false;

      document.addEventListener('keyup', (evento) => {
        const code = evento.keyCode;
        // evento.preventDefault();
        if (!isEmpty(code)) {
          if (code === 45) {
            acaoClickIncluirProponente()
          } else if (code === 113) {
            click113 = true;

            setTimeout(() => {
              click113 = false;
            }, 1000)
          } else if (code === 68 && click113) {
            // Baixar arquivo de dados
            clickDownload({dataset: {download: 'baixar-dados'}}, evento);
          } else if (code === 70 && click113) {
            // Ir para Acompanhar FID
            $('[data-element="input-URL-acompanhar-FID"]').focus();
          } else if (code === 80 && click113) {
            // Baixar arquivo de pendências
            clickDownload({dataset: {download: 'baixar-pendencias'}}, evento);
          } else if (code === 82 && click113) {
            // Baixar arquivo de relatório
            clickDownload({dataset: {download: 'baixar-relatorio'}}, evento);
          } else if (code === 86 && click113) {
            acionarDevolucaoFID();
          } else if (code === 73 && click113) {
            acionarModalAddInformacoes();
          } else if (code === 66) {
            click66 = true;

            setTimeout(() => {
              click66 = false;
            }, 1000)
          } else if (code === 17 && click66) {
            const data = {
              "relatório": $('[data-content="relatorio"]').val().trim(),
              "pendências": $('[data-content="pendencias"]').val().trim()
            };

            if (isEmpty(data["relatório"]) && isEmpty(data["pendências"])) {
              retorno = 'Campos vazios! Preencha-os primeiro';
            } else {
              try {
                let local = localStorage.getItem('cca');

                try {
                  // Parse do localStorage OK
                  local = JSON.parse(local);
                  local["data-campos-storage"] = data;
                  localStorage.setItem('cca', JSON.stringify(local));

                  if (JSON.stringify(local) === localStorage.getItem('cca')) {
                    retorno = 'Dados salvos com sucesso';
                  } else {
                    retorno = 'Dados parcialmente salvos. Consulte o console';
                    console.log('Os dados armazenados localmente não são iguais aos dados capturados. Verifique.');
                  }
                } catch (error) {
                  // Não foi possível fazer o parse do localStorage, tentando alterar a variável
                  localStorage.setItem('cca', JSON.stringify({"data-campos-storage": data}));

                  if (JSON.stringify({"data-campos-storage": data}) === localStorage.getItem('cca')) {
                    retorno = 'Dados salvos com sucesso';
                  } else {
                    throw new Error('Tentativa de salvar no localStorage falhou.')
                  }
                }
              } catch (error) {
                retorno = 'Não foi possível salvar os dados. Consulte o console';
                console.log('Não foi possível salvar os dados', error.message);
              }
            }

            if (toast) {
              const body = $(toast).find('.toast-body');
              $(body).text(retorno);
              $('#toast-feedback').toast('show');
            }
          }
        }
      });
    }

    const linksFaceis = document.querySelector('.links-faceis-confirmacao');
    if (!isEmpty(linksFaceis)) {
      [conteudos.consultas.find(e => e.titulo === 'CIWEB') || 0, conteudos.consultas.find(e => e.titulo === 'CADMUT') || 0, conteudos.consultas.find(e => e.titulo === 'Consulta CNPJ') || 0, conteudos.consultas.find(e => e.titulo === 'Situação Cadastral') || 0, conteudos.arquivos.find(e => e.titulo === 'Tabela de Apuração') || 0, conteudos.consultas.find(e => e.titulo === 'Tempo de Serviço') || 0, {
        link: 'https://gist.github.com/gabriersdev/17a5f0b905d4faffbd2f0ae490d56cc7',
        sistema: 'GitHub Gist',
        titulo: 'Snippets para Análise de Crédito'
      } || 0,].forEach(conteudo => {
        const link = conteudo.link
        try {
          $('.links-faceis-confirmacao [data-element="area-content"]').append(`<a class="card" href="${link.includes('https') ? link : updateLinkPlanilha()}" target="_blank" data-item="card-link-facil" rel="noreferrer noopener" data-toggle="tooltip" data-placement="top" title="Clique para abrir ->"><div class="card-header">${conteudo.sistema}<i class="bi bi-arrow-up-right-square" data-icon="icone"></i></div><div class="card-body"><b>${conteudo.titulo}</b></div></a>`);
        } catch (error) {
        }
      });

      document.querySelectorAll('[data-item="card-link-facil"]').forEach(link => {
        $(link).on('mousemove focus', () => {
          link.querySelector('[data-icon="icone"]').classList.value = 'bi bi-arrow-up-right-square-fill';
        })

        $(link).on('mouseout blur', () => {
          link.querySelector('[data-icon="icone"]').classList.value = 'bi bi-arrow-up-right-square';
        })
      })
    }

    const btnCarregarPendencias = document.querySelector('[data-action="carregar-pendencias"]');
    !isEmpty(btnCarregarPendencias) ? btnCarregarPendencias.onclick = carregarPendencias : '';

    function carregarPendencias(evento) {
      evento.preventDefault();
      $(evento.target).tooltip('hide');

      textAreasEditados(false);
      if (renderPendencias()) {
        feedbackButton(btnCarregarPendencias, {
          html: '<i class="bi bi-check2"></i>', classe: 'btn btn-success', html_retorno: btnCarregarPendencias.innerHTML
        });
      } else {
        feedbackButton(btnCarregarPendencias, {
          html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-danger', html_retorno: btnCarregarPendencias.innerHTML
        });
      }
    }

    const modal = document.querySelector('#modal-devolucao-fid');
    if (!isEmpty(modal)) {
      modal.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => {
          resizeTextArea(textarea);
        })
      })
    }

    $('[data-form="checklist-analise-internalizada"] input[type=checkbox]').on('input', (event) => {
      try {
        const label = event.target.closest('div.form-group').querySelector('label');
        if (event.target.checked) {
          label.innerHTML = `<s>${label.textContent}</s>`
        } else {
          label.innerHTML = `${label.textContent}`
        }
      } catch (error) {

      }
    })

    $('[data-action="calcular-percentual"], #modal-calcular-percentual .nav-item a.nav-link').on('click', (evento) => {
      evento.preventDefault();

      const percentuais = {
        parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
        financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
        rendaNecessaria: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-renda-necessaria"]').classList.contains('active'),
      }

      setTimeout(() => {
        if (percentuais.parcela) {
          // console.log("Percentual de parcela");
          $('#modal-calcular-percentual input[name=renda-bruta-total]').focus();
        } else if (percentuais.financiamento) {
          // console.log("Percentual de financiamento");
          $('#modal-calcular-percentual input[name=valor-de-compra-e-venda]').focus();
        } else if (percentuais.rendaNecessaria) {
          // console.log("Percentual de condicionamento");
          $('#modal-calcular-percentual input[name=percentual-condicionamento]').focus();
        }
      }, 500)
    });

    $('#modal-calcular-percentual form').on('submit', (evento) => {
      evento.preventDefault();
      let saida = {};
      let identificador;

      const percentuais = {
        parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
        financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
        rendaNecessaria: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-renda-necessaria"]').classList.contains('active'),
      }

      function BRLToFLoat(value) {
        return parseFloat(value.replace("R$ ", "").replaceAll(".", "").replace(",", "."));
      }

      if (percentuais.parcela) {
        identificador = 'percent-parcela';
        const renda = evento.target.querySelector('input[name=renda-bruta-total]').value;
        const parcela = evento.target.querySelector('input[name=parcela-liberada]').value;

        const percentual = parseFloat((BRLToFLoat(parcela) / BRLToFLoat(renda)).toFixed(15));
        const inteiro = (percentual * 100);

        if (inteiro > 30 && isFinite(percentual)) {
          saida.message = `Comprometimento de ${(percentual * 100).toFixed(2) + "%"}. Verifique os valores informados.`;
          saida.type = 'warning';
        } else if (!isFinite(percentual)) {
          saida.message = "Renda bruta total informada é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        } else if (inteiro <= 0) {
          saida.message = "Parcela informada é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        } else {
          if (!isNaN(percentual)) {
            saida.message = `Percentual: ~ ${(percentual * 100).toFixed(2) + "%"}<br>Fração liberada: ${percentual}`;
            saida.type = 'primary';
          } else {
            saida.message = "Verifique os valores informados.";
            saida.type = 'danger';
          }
        }
      } else if (percentuais.financiamento) {
        identificador = 'percent-financiamento';
        const valorImovel = evento.target.querySelector('input[name=valor-de-compra-e-venda]').value;
        const valorFinanciado = evento.target.querySelector('input[name=valor-financiado]').value;

        const percentual = (BRLToFLoat(valorFinanciado) / BRLToFLoat(valorImovel)).toFixed(15);
        const inteiro = (percentual * 100);

        if (inteiro > 90 && isFinite(percentual)) {
          saida.message = `Cota de ${(percentual * 100).toFixed(2) + "%"}. Verifique os valores informados.`;
          saida.type = 'warning';
        } else if (!isFinite(percentual)) {
          saida.message = "Valor de compra e venda informado é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        } else if (inteiro <= 0) {
          saida.message = "Valor financiado informado é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        } else {
          if (!isNaN(percentual)) {
            saida.message = `Cota: ~ ${(percentual * 100).toFixed(2) + "%"}<br>Fração liberada: ${percentual}`;
            saida.type = 'primary';
          } else {
            saida.message = "Verifique os valores informados.";
            saida.type = 'danger';
          }
        }
      } else if (percentuais.rendaNecessaria) {
        identificador = 'renda-necessaria';
        const percentualCondicionamento = parseFloat(evento.target.querySelector('input[name="percentual-condicionamento"]').value.replaceAll(',', '.'));
        const parcelaNecessaria = BRLToFLoat(evento.target.querySelector('input[name="parcela-necessaria"]').value);

        if (percentualCondicionamento > 0 && percentualCondicionamento <= 30 && parcelaNecessaria > 0 && isFinite(percentualCondicionamento) && isFinite(parcelaNecessaria) && !isNaN(percentualCondicionamento) && !isNaN(parcelaNecessaria)) {
          saida.message = `Necessário uma renda de ${((parcelaNecessaria * 100) / (percentualCondicionamento)).toLocaleString('pt-BR', {
            style: 'currency', currency: 'BRL'
          })} para atingir a parcela necessária de acordo com o percentual de condicionamento informado.`;
          saida.type = 'primary';
        } else {
          if (percentualCondicionamento <= 0) {
            saida.message = "Percentual de condicionamento informado é igual a zero. Verifique os valores informados.";
            saida.type = 'warning';
          } else if (percentualCondicionamento > 30) {
            saida.message = "Percentual de condicionamento informado é maior que 30%. Verifique os valores informados.";
            saida.type = 'warning';
          } else if (parcelaNecessaria <= 0) {
            saida.message = "Parcela necessária informada é igual a zero. Verifique os valores informados.";
            saida.type = 'warning';
          } else {
            saida.message = "Verifique os valores informados.";
            saida.type = 'danger';
          }
        }
      }

      $(`#modal-calcular-percentual [data-tab="${identificador}"] div.percent-retorno`).html(`<div class="alert mt-2 mb-0 alert-${saida.type} none">${saida.message.toString()}</div>`);

      $(`#modal-calcular-percentual [data-tab="${identificador}"] div.percent-retorno div.alert`).fadeIn(500);
    })

    // Funcionalidade de seleção de elementos de opção de fácil acesso
    const selecoes = Object.freeze(conteudos.selecoes);

    if (!isEmpty(document.querySelector('.selecao-multiplas-opcoes'))) {
      selecoes.toSorted((a, b) => a.name.localeCompare(b.name)).filter((e) => !isEmpty(e.name)).forEach((selecao) => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const input = document.createElement('input');
        input.dataset.valueFormComp = selecao.value;
        input.classList.value = 'btn-check';
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', selecao.id);
        input.setAttribute('name', selecao.id);
        formGroup.appendChild(input);

        const btn = document.createElement('label');
        btn.classList.value = 'btn btn-outline-primary';
        btn.setAttribute('for', selecao.id);
        btn.textContent = selecao.name;
        formGroup.appendChild(btn);

        document.querySelector('.selecao-multiplas-opcoes').appendChild(formGroup);
      })

      $('.selecao-multiplas-opcoes label.btn').on('click', (event) => {
        event.target.closest('div.form-group').querySelector('input').checked = event.target.classList.contains('checked');
      })

      document.querySelectorAll('.selecao-multiplas-opcoes input').forEach((input) => {
        input.addEventListener('input', atualizarBtn);
        // input.addEventListener('change', atualizarBtn);

        // Estilizar o label quando o input está sob foco
        input.addEventListener('focus', (evento) => {
          evento.target.parentElement.querySelector('label').classList.remove('btn-outline-primary');
          evento.target.parentElement.querySelector('label').classList.add('btn-primary');
        })

        // Estilizar o label quando o input perde o foco
        input.addEventListener('blur', (evento) => {
          evento.target.parentElement.querySelector('label').classList.remove('btn-primary');
          evento.target.parentElement.querySelector('label').classList.add('btn-outline-primary');
        })

        function atualizarBtn() {
          const btn = input.closest('div.form-group').querySelector('label.btn');
          if (input.checked) {
            btn.classList.add('checked');
          } else {
            btn.classList.remove('checked');
          }
        }
      });
    }
  }

  function atualizar() {
    renderTooltips();
    renderPopover();
    renderPendencias();
    escutaEventoInput();
    atualizarNumerosProponentes();
    setAutocomplete(new Settings().getOption('autocomplete'));
  }

  const renderTooltips = () => {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  const renderPopover = () => {
    $(document).ready(function () {
      $('[data-bs-toggle="popover"]').popover();
    });
  }

  const renderFeedbacks = (proponente) => {
    const feedbacks =
      [
        proponente.querySelector('[data-content="feedback-endereco"]'),
        proponente.querySelector('[data-content="feedback-renda"]')
      ];

    const elementos =
      [
        proponente.querySelector('[data-input="tipo_endereco"]'),
        proponente.querySelectorAll('[data-input="tipo_renda"]')
      ];

    feedbacks.forEach((feedback, index) => {
      let mensagem = '';
      switch (feedback.dataset.content.trim().toLowerCase()) {
        case 'feedback-endereco':
          if (isEmpty(elementos[index].value)) {
            mensagem = 'Necessário apresentar comprovante de endereço.';
          } else {
            switch (elementos[index].value.trim().toLowerCase()) {
              case 'fatura de serviço':
              case 'boleto de cobrança':
                if (!proponente.querySelector('[data-input="endereco_valido"]').checked) {
                  mensagem = 'Necessário apresentar documento atualizado.'
                }
                break;

              case 'irpf':
              case 'contrato de aluguel':
                mensagem = 'Documento não é aceito para os produtos CCFGTS e PMCMV.';
                break;

              case 'outro':
              default:
                mensagem = 'Verifique o Manual Normativo do Produto sobre a utilização deste documento.'
                break;
            }
          }

          break;

        case 'feedback-renda':
          const tipos_rendas = [];
          elementos[index].forEach(elemento => {
            tipos_rendas.push(elemento.value.trim().toLowerCase());
          })

          //Verifica se existem valores vazios
          if (tipos_rendas.findIndex(e => e === '') !== -1) {
            mensagem += 'Proponente sem renda.\n';
          }
          if (tipos_rendas.includes('contracheque/hollerith') || tipos_rendas.includes('irpf')) {
            proponente.querySelectorAll('[data-input="renda_valida"]').forEach(renda_valida => {
              if (!renda_valida.checked) {
                mensagem += 'Necessário apresentar documento atualizado.\n';
              }
            })
          }
          if (tipos_rendas.includes('renda informal')) {
            mensagem += 'Renda informal.\n';
          }
          if (tipos_rendas.includes('contrato de aluguel') || tipos_rendas.includes('extratos bancários')) {
            mensagem += 'Necessário formalizar a renda.\n'
          }
          if (tipos_rendas.includes('outro')) {
            mensagem += 'Verifique o Manual Normativo do Produto sobre a utilização deste documento.\n'
          }

          break;
      }

      feedback.innerHTML = mensagem.replaceAll('\n', '<br>');
    })
  }

  const renderPendencias = () => {
    try {
      if (!textAreasEditados()) {
        const txt = document.querySelector('[data-content="pendencias"]');
        if (!isEmpty(txt)) {
          txt.value = '';
          const pendencias = [];

          const proponentes = document.querySelectorAll('.accordion-item');
          if (!isEmpty(proponentes) && proponentes.length > 0) {
            proponentes.forEach((proponente, index) => {
              const inputs = proponente.querySelectorAll('[data-element="input"]');

              const elementos = {
                valores: {
                  nome: get('nome'),
                  cpf: get('cpf'),
                  data_nascimento: get('data_nascimento'),
                  email: get('email'),
                  telefone: get('telefone'),
                },
                some(parametro) {
                  const retorno = [];
                  for (const [key, value] of Object.entries(this.valores)) {
                    if (value === parametro) {
                      retorno.push(key);
                    }
                  }
                  return retorno.length > 0;
                },
                search(parametro) {
                  const retorno = [];
                  for (const [key, value] of Object.entries(this.valores)) {
                    if (Array.isArray(value)) {
                      value.forEach((v) => {
                        if (v === parametro && !retorno.includes(key)) {
                          if (key !== 'fgts') retorno.push(key)
                        }
                      })
                    } else {
                      if (value === parametro) key !== 'fgts' ? retorno.push(key) : '';
                    }
                  }
                  return retorno;
                }
              }

              if (elementos.some('')) {
                pendencias.push({
                  proponente: `PROPONENTE ${index + 1} - ${!isEmpty(elementos.valores.nome[0]) ? elementos.valores.nome[0].toUpperCase() + ':' : ''}`,
                  pendente: elementos.search('').join().replaceAll('_', ' ').toUpperCase().replaceAll(',', '\n')
                });
              }

              function get(id) {
                const saida = [];
                inputs.forEach(input => {
                  if (input.type === 'checkbox' && input.dataset.input === `${id}`) {
                    input.checked ? saida.push(true) : saida.push('');
                  } else {
                    input.dataset.input === `${id}` ? saida.push(input.value) : '';
                  }
                })
                return saida;
              }

              renderFeedbacks(proponente);
            })

            txt.value = '';

            pendencias.forEach((pendencia, index) => {
              index !== 0 ? txt.value += '\n\n' : 'a';
              txt.value += `${pendencia.proponente}\n${pendencia.pendente}`
            })
            resizeTextArea(txt);
          }
        }
      }
      return true;
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar renderizar as pendências.');
    }
  }

  const renderResumo = () => {
    const resumo = document.querySelector('[data-content="resumo"]');
    const accordion_group = document.querySelector('.accordion');
    const nomes = [];

    if (!isEmpty(accordion_group)) {
      accordion_group.querySelectorAll('[data-information="nome-proponente"]').forEach((nome, index) => {
        nomes.push(nome.textContent);
      })

      const quantidade_proponentes = accordion_group.querySelectorAll('.accordion-item').length;
      const texto = `### Processo iniciado em ${moment().format('DD/MM/YYYY')}, com ${quantidade_proponentes > 0 ? quantidade_proponentes + ' proponente(s): ' : 'nenhum proponente.'} ${quantidade_proponentes > 0 ? nomes.join().replaceAll(',', ', ') + '.' : ''} ###`;

      resumo.textContent = `${texto}`
    }
  }

  function listarProponentesPendencias() {
    try {
      document.querySelector('[data-content="pendencias"]').value = '';
      (document.querySelectorAll('.card-body-header [data-content="nome"]').forEach((nome, index) => {
        const nomeApresentacao = nome.textContent.trim() === 'Nome do cliente' ? `PROPONENTE ${index + 1} -` : `PROPONENTE ${index + 1} - ${nome.textContent.trim().toUpperCase()}:`;
        document.querySelector('[data-content="pendencias"]').value += index !== 0 ? `\n\n${nomeApresentacao}` : nomeApresentacao;
        textAreasEditados(true);
      }))
    } catch (error) {
      console.warn('Ocorreu um erro ao tentar listar apenas os nomes dos proponentes na listagem de pendências.')
    }
  }

  window.listarProponentesPendencias = listarProponentesPendencias;

  let textAreasForamEditados = false;
  let downloadTxtFile = false;

  function textAreasEditados(condicao) {
    if (isEmpty(condicao) && !typeof condicao !== 'boolean') return textAreasForamEditados;

    textAreasForamEditados = condicao;
    return condicao;
  }

  function txtFileHasDownloaded(condicao) {
    if (isEmpty(condicao) && !typeof condicao !== 'boolean') return downloadTxtFile;

    downloadTxtFile = condicao;
    return condicao;
  }
})();
