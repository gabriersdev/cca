import { conteudos } from './conteudos.js';
import { SwalAlert, isEmpty, copiar, sanitizarCPF, primeiroNome, resizeTextArea, capitalize, cumprimentoHorario, verificarSeFIDvalido, feedbackInfo, feedbackButton } from './utilitarios.js';
import { renderPendencias, renderResumo, renderTooltips } from './funcoes-render.js';
import { atualizar, escutaEventoInput, verificarInputsRecarregamento } from './funcoes-base.js';
import { atualizarNumerosProponentes } from './funcoes-de-conteudo.js';

const clickAcionarModal = () => {
  document.querySelectorAll('[data-action="acionar-modal"]').forEach(botao => {
    botao.addEventListener('click', (evento) => {
      const modal_nome = evento.target.getAttribute('data-bs-target') || evento.target.closest('button').getAttribute('data-bs-target');
      if(!isEmpty(modal_nome)){
        setTimeout(() => {
          const inputs = document.querySelector(modal_nome).querySelectorAll('input')
          const texts_areas = document.querySelector(modal_nome).querySelectorAll('textarea');
          
          if(!isEmpty(inputs) && inputs.length > 0){
            inputs[0].focus();
          }else if(!isEmpty(texts_areas) && texts_areas.length > 0){
            texts_areas[0].focus();
          }
        }, 500)
      }
    })
  })
}

const clickIncluirRenda = (botao) => {
  const proponente = botao.closest('[data-identify]');
  const div = document.createElement('div');
  div.classList.value = `input-group mt-2 mb-2`;
  div.dataset.element = "renda";
  let length = null;
  try{length = proponente.querySelectorAll('[data-element="renda"]').length}catch(error){}
  div.innerHTML = `${conteudos.secao_rendas(!isEmpty(length) ? length + 1 : 1)}`;
  proponente.querySelector('[data-element="area_rendas"]').appendChild(div);
  
  try{
    if(botao.closest('[data-element="secao_rendas"]').querySelector('[data-element="area_rendas"]').querySelector(`div.alert.alert-primary`) !== null){
      botao.closest('[data-element="secao_rendas"]').querySelector('[data-element="area_rendas"]').querySelector(`div.alert.alert-primary`).remove();
    }
  }catch(error){}
  
  escutaEventoInput();
  clickRemoverRenda(div);
  renderPendencias();
  renderTooltips();
}

window.clickIncluirRenda = clickIncluirRenda;

const clickRemoverRenda = (elemento) => {
  if(!isEmpty(elemento)){
    acao(elemento.querySelector('[data-action="remover-renda"]'));
  }else{
    document.querySelectorAll('[data-action="remover-renda"]').forEach(botao => {
      acao(botao);
      renderPendencias();
    })
  }
  
  function acao(botao){
    removeEventListener('click', botao);
    botao.addEventListener('click', (evento) => {
      try{
        if(elemento.closest('[data-element="area_rendas"]').querySelectorAll('[data-element="renda"]').length - 1 === 0){
          $(elemento.closest('[data-element="area_rendas"]')).html(`<div class="alert alert-primary mt-2 mb-2">Proponente sem renda</div>`);
        }
      }catch(error){
        try{
          if(evento.target.closest('[data-element="area_rendas"]').querySelectorAll('[data-element="renda"]').length - 1 === 0){
            $(evento.target.closest('[data-element="area_rendas"]')).html(`<div class="alert alert-primary mt-2 mb-2">Proponente sem renda</div>`);
          }
        }catch(error){}
      }
      
      evento.preventDefault();
      $(botao).tooltip('dispose')
      botao.closest('[data-element="renda"]').remove();
    })
  }
}

const clickIncluirProponente = () => {
  const botao = document.querySelector('[data-action="incluir-proponente"]');
  if(!isEmpty(botao)){
    botao.addEventListener('click', (evento) => {
      acaoClickIncluirProponente();
    })
  }
}

const acaoClickIncluirProponente = () => {
  const div = document.createElement('div');
  div.classList.value = `accordion-item`;
  div.innerHTML = `${conteudos.accordion_item(document.querySelectorAll('.accordion-item').length + 1)}`;
  document.querySelector('.accordion').appendChild(div);
  
  renderResumo();
  renderPendencias();
  clickRemoverRenda();
  clickRemoverProponente();
  escutaEventoInput();
  atualizar();
}

const clickRemoverProponente = () => {
  const botao = document.querySelectorAll('[data-action="remover-proponente"]');
  botao.forEach(botao => {
    removeEventListener('click', botao);
    botao.addEventListener('click', async (evento) => {
      SwalAlert('confirmacao', 'question', 'Tem certeza que deseja remover?', 'Esta ação não poderá ser desfeita').then((retorno) => {
        if(retorno.isConfirmed){
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
    if(!isEmpty(btn)){
      acaoClickCopiar(btn)
    }
  })
}

const acaoClickCopiar = (btn) => {
  try{
    btn.addEventListener('click', () => {
      let e = null;
      let html_retorno = null;
      if(isEmpty(btn.dataset.actionTarget) && btn.dataset.actionTarget !== 'copiar-nomes'){
        const elemento = btn.closest('[data-node="card"]').querySelector('[data-copiar="texto"]');
        e = elemento.value || elemento.innerText;
        
        const data_input = elemento.dataset.input;
        
        if(!isEmpty(data_input) && data_input.trim().toLowerCase() == 'nome'){
          e = e.toUpperCase();
        }
        
        else if(!isEmpty(data_input) && data_input.trim().toLowerCase() == 'cpf'){
          e = (sanitizarCPF(e));
        }
      }else{
        e = new Array();
        document.querySelectorAll('[data-input="nome"]').forEach(nome => {
          !isEmpty(nome.value) ? e.push(nome.value.toUpperCase()) : '';
        })
        e = e.join(', ');
        html_retorno = 'N_'
      }
      
      copiar(e).then(() => {
        if(btn.getAttribute('onclick')){
          feedbackButton(btn, {html: '<i class="bi bi-check2"></i>', classe: 'btn btn-outline-success', html_retorno: html_retorno});
        }else{
          feedbackButton(btn, {html: '<i class="bi bi-check2"></i>', classe: 'btn btn-success', html_retorno: html_retorno});
        }
      });
    })
  }catch(error){
    if(btn.getAttribute('onclick')){
      feedbackButton(btn, {html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-outline-danger'});
    }else{
      feedbackButton(btn, {html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-danger', html_retorno: html_retorno});
    }
  }
}
window.acaoClickCopiar = acaoClickCopiar;

// TODO - Definir origin para ação de download de acompanhamento de FID
const clickDownload = (elemento, evento) => {
  evento.preventDefault();
  const saida = new Array();
  const proponentes = document.querySelectorAll('.accordion-item');
  const primeirosNomes = new Array();
  
  proponentes.forEach((proponente) => {
    !isEmpty(proponente.querySelector('[data-input="nome"]').value.trim()) ? primeirosNomes.push(primeiroNome(proponente.querySelector('[data-input="nome"]').value.trim())) : '';
  })
  
  switch(elemento.dataset.download){
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
    try{
      const link = new URL(document.querySelector('#input-URL-acompanhar-FID').value);
      const split = link.search.split('codigo=');
      const FID = split[1].split("=")[0].split("&")[0];

      const valido = [
        link.origin.toLowerCase() == 'https://portalsafi.direcional.com.br', 
        link.pathname.toLowerCase() == '/fluxo', 
        link.search.includes("codigo"),
        split.length == 2, 
        typeof (parseInt(FID) === "number") && !isNaN(parseInt(split[1]))
      ]

      if(verificarSeFIDvalido(FID) && valido.every(e => e == true)){
        reportar(true);
        criarEBaixarHTMLAcompanhamento(parseInt(FID), `Acompanhe o FID ${parseInt(FID)}`);
      }else{
        reportar(false, 'O link informado para o FID não é válido');
      }
      
    }catch(error){
      reportar(false, 'O link informado para o FID não é válido');
    }
    
    function reportar(condicao, texto){
      const retorno = document.querySelector('[data-element="retorno-link-fid"]');
      if(!condicao){
        retorno.setAttribute('class', 'alert alert-danger mt-3 mb-0');
        retorno.innerText = texto;
      }else{
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
    saida.push(`PROPONENTE ${index + 1}\n` +`NOME: ${!isEmpty(nome) ? nome.toUpperCase() : ''}\n` + `CPF: ${sanitizarCPF(proponente.querySelector('[data-input="cpf"]').value.trim())}\n` + `DT NASC: ${proponente.querySelector('[data-input="data_nascimento"]').value.trim()}\n` + `TELEFONE: ${proponente.querySelector('[data-input="telefone"]').value.replaceAll('-', '').trim()}\n` + `EMAIL: ${proponente.querySelector('[data-input="email"]').value.trim()}\n\n`)
  });
  criarEBaixarTXT(JSON.stringify(saida.join('\n')), `DADOS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`);
}

const baixarRelatorio = (primeirosNomes) => {
  //Selecionar conteúdo no textarea de relatório
  const relatorio = document.querySelector('[data-content="relatorio"]').value;
  criarEBaixarTXT(JSON.stringify(relatorio), `RELATORIO${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`);
}

const baixarPendencias = (primeirosNomes) => {
  //Selecionar conteúdo no textarea de pendências
  const pendencias = document.querySelector('[data-content="pendencias"]').value;
  criarEBaixarTXT(JSON.stringify(pendencias), `PENDENCIAS${!isEmpty(primeirosNomes) ? ' - ' + primeirosNomes.join(', ') : ''}`);
}

const criarEBaixarTXT = (conteudo, nome) => {
  let blob = new Blob([`${JSON.parse(conteudo)}`], {type: "text/plain;charset=utf-8"});
  saveAs(blob, `${nome.toUpperCase()}.txt`);
}

const criarEBaixarJSON = (conteudo, nome) => {
  let blob = new Blob([`${JSON.stringify(conteudo)}`], {type: "text/plain;charset=utf-8"});
  saveAs(blob, `${nome.toUpperCase()}.json`);
}

const criarEBaixarHTMLAcompanhamento = (FID, nome) => {
  let blob = new Blob([`${conteudos.HTMLacompanharFID(String(FID), `https://portalsafi.direcional.com.br/Fluxo?codigo=${FID}`)}`], {type: "text/plain;charset=utf-8"});
  saveAs(blob, `${nome.trim()}.html`);
}

function clickLimparProcesso(){
  const btn = document.querySelector('[data-action="limpar-processo"]');
  
  if(!isEmpty(btn)){
    btn.addEventListener('click', (evento) => {
      evento.preventDefault();
      
      SwalAlert('confirmacao', 'question', 'Tem certeza que deseja limpar todo o processo?', 'Esta ação não poderá ser desfeita').then((retorno) => {
        if(retorno.isConfirmed){
          verificarInputsRecarregamento('clear');
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
          
          document.querySelectorAll('[data-input]').forEach(input => {
            if(input.tagName.toLowerCase() == 'textarea' || input.tagName.toLowerCase() == 'input' && input.getAttribute('type') == 'text'){
              input.value = '';
            }else if(input.tagName.toLowerCase() == 'input' && input.getAttribute('type') == 'checkbox'){
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
          
          document.querySelectorAll('.accordion-item').forEach(item => { item.remove() });
          renderResumo();
          atualizarNumerosProponentes();
          renderPendencias();
        }
      });
    })
  }
}

function clickAddInformacoes(){
  const modal = document.querySelector('#modal-informacoes-adicionais');
  if(!isEmpty(modal)){
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
      
      textarea.value += 
      `FID: ${dados.fid}\n` +
      `GERENTE: ${!isEmpty(dados.gerente) ? dados.gerente.trim().toUpperCase() : ''}\n` +
      `EMPREENDIMENTO: ${!isEmpty(dados.empreendimento) ? dados.empreendimento.trim().toUpperCase() : ''}\n` + 
      `VALOR IMÓVEL: ${dados.valor}\n`;
      
      !isEmpty(dados.add_data_hora) ? dados.add_data_hora ? textarea.value += `\n## ${moment().format('DD/MM/YYYY HH:mm')} - ${!isEmpty(dados.analista.value) ? dados.analista.value.toUpperCase().trim() : '[ANALISTA]'} ##\n` : ''  : '';
      
      resizeTextArea(textarea);
      $(modal).modal('hide');
      
      setTimeout(() => {
        textarea.focus()
      }, 500);
    })
  }
}

function acionarModalAddInformacoes(){
  const modal = document.querySelector('#modal-informacoes-adicionais');
  // console.log('aqui')
  $(modal).modal('show');
  setTimeout(() => {
    modal.querySelector('[data-input="id-fid"]').focus();
  }, 500)
}

function clickVisibilidadeSenha(){
  const botao = document.querySelector('[data-action="btn-visibilidade-senha"]');
  if(!isEmpty(botao)){
    botao.addEventListener('click', (evento) => {
      evento.preventDefault();
      const input = botao.parentElement.querySelectorAll('input')[0];
      input.setAttribute('type', input.type == 'text' ? 'password' : 'text');
    })
  }
}

function clickAddDevolucaoFID(){
  const botao = document.querySelector('[data-action="add-devolucao-fid"]');
  if(!isEmpty(botao)){
    botao.addEventListener('click', (evento) => {
      evento.preventDefault();
      acionarDevolucaoFID();
    })
  }
}

function acionarDevolucaoFID(){
  const modal = document.querySelector('#modal-devolucao-fid');
  // SwalAlert('aviso', 'error', 'Desculpe. Esta função ainda não foi implementada.', '');
  $(modal).modal('show');
  
  setTimeout(() => {
    modal.querySelectorAll('input')[0].focus();
  }, 500);
}

function submitAddDevolucaoFID(){
  const modal = document.querySelector('#modal-devolucao-fid');
  if(!isEmpty(modal)){
    modal.querySelector('form').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const form = evento.target;
      const finac = form.querySelector('#dev-financ-NPMCMV').checked ? 'NPMCMV' : form.querySelector('#dev-financ-SBPE').checked ? 'SBPE' : form.querySelector('#dev-financ-PROCOTISTA').checked ? 'Pró-cotista' : '';
      
      const subsidio_valido = !isEmpty(form.querySelector('#dev-subsidio').value.trim()) && form.querySelector('#dev-subsidio').value.trim() !== 'R$ 0,00';
      
      const FGTS_valido = !isEmpty(form.querySelector('#dev-FGTS').value.trim()) && form.querySelector('#dev-FGTS').value.trim() !== 'R$ 0,00';
      
      const analista = form.querySelector('#dev-analista').value.trim();
      
      const complemento = { tela_endividamento: '', FGTS_solicitado: '', verificacao_FGTS: '', autorizacao_FGTS: '', aviso_IRPF: '', restricao_externa: '', prejuizo_scr: '', dividas_vencidas: '', pendencia_cef: '' }
      
      evento.target.querySelectorAll('.selecao-multiplas-opcoes input[type=checkbox]').forEach(input => {
        // console.log(input, input.dataset.valueFormComp, input.checked)
        complemento[input.getAttribute('id').replaceAll('-', '_')] = input.checked ? input.dataset.valueFormComp.toString() : '';
        // console.log(complemento[input.getAttribute('id').replaceAll('-', '_')])
      })
      
      const dev = {
        renda: `Renda: ${form.querySelector('#dev-renda').value.trim()}. `,
        parcela: `Parcela ${form.querySelector('#dev-status-parcela-aprovado').checked ? 'aprovada' : 'possível'}: ${form.querySelector('#dev-parcela').value}. `,
        situacao: `${form.querySelector('#dev-tabela-price').checked ? 'PRICE' : 'SAC'}. `,
        modalidade: `${finac}. `,
        prazo: `${form.querySelector('#dev-prazo').value} meses. `,
        primeira: `1ª parcela: ${form.querySelector('#dev-parcela-1').value} - Seguro ${capitalize(form.querySelector('#dev-seguro').value.trim())}. `,
        subsidio: `${subsidio_valido ? 'Subsídio: ' + form.querySelector('#dev-subsidio').value.trim() + '. ' : ''}`,
        finaciamento: `Valor de financiamento: ${form.querySelector('#dev-valor-de-financiamento').value.trim()}. `,
        taxa: `Taxa de juros: ${form.querySelector('#dev-taxa-juros').value.substr(0, 4).trim()}% a.a. `,
        FGTS: `${FGTS_valido ? '## FGTS: ' + form.querySelector('#dev-FGTS').value.trim() + '. ' : ''}`,
        pendencias: `${!isEmpty(form.querySelector('#dev-pendencias').value.trim()) ? '## Pendência(s): ' + form.querySelector('#dev-pendencias').value.trim() + '. ' : ''}`,
        restricoes: `${!isEmpty(form.querySelector('#dev-restricoes').value.trim()) ? '## Restrição(s): ' + form.querySelector('#dev-restricoes').value.trim() + '. ' : ''}`,
        analista: `${!isEmpty(analista) ? '## ' + analista.toUpperCase() : ''}`
      }
      
      let devolucao = dev.renda + dev.parcela + complemento.tela_endividamento + complemento.dividas_vencidas + complemento.pendencia_cef + complemento.prejuizo_scr + complemento.restricao_externa + dev.situacao + dev.modalidade + dev.prazo + dev.primeira + dev.subsidio + dev.finaciamento + dev.taxa + complemento.FGTS_solicitado + complemento.verificacao_FGTS + complemento.autorizacao_FGTS + dev.FGTS + dev.pendencias + complemento.aviso_IRPF + dev.restricoes + dev.analista;
      
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

function clickImportarPendencias(){
  const botao = document.querySelector('[data-action="importar-pendencias"]');
  if(!isEmpty(botao)){
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

function submitInformarRestricoes(){
  $('#modal-informar-restricoes form').submit((evento) => {
    evento.preventDefault();
    const text_area = evento.target.querySelector('#text-restricoes');
    let valor_text_area = evento.target.querySelector('#text-restricoes').value;
    
    if(!isEmpty(valor_text_area) && valor_text_area.trim().length > 0){
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
    }else{
      // Informar que o campo está em branco
      text_area.value = '';
      text_area.focus();
    }
  })
}

function clickLimparTudoSecao(){
  $('[data-action="limpar-tudo-secao"]').each((index, botao) => {
    $(botao).click((evento) => {
      // Implementado apenas para limpar os inputs/textareas dos modais da seção de relatório
      
      const elementos_nomes = [
        'modal-informacoes-adicionais',
        'modal-devolucao-fid',
        'modal-informar-restricoes',
        'modal-calcular-percentual'
      ]
      
      try{
        elementos_nomes.forEach(elemento => {
          const formulario = document.querySelectorAll(`#${elemento} form`);
          
          formulario.forEach(form => {
            const [inputs, textareas, inputs_checks] = [form.querySelectorAll(`input`), form.querySelectorAll(`textarea`), form.querySelectorAll(`.form-check-input`)]
          
            if(!isEmpty(inputs)){
              inputs.forEach(input => {
                input.value = '';
              })
            }
            
            if(!isEmpty(textareas)){
              textareas.forEach(textarea => {
                textarea.value = '';
              })
            }
            
            if(!isEmpty(inputs_checks)){
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
      }catch(error){
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
      const saida = new Array();
      
      if(!nomes.every(nome => nome == undefined) && !CPFs.every(CPF => CPF == undefined)){
        if(nomes[0] !== undefined){
          if(!isEmpty(nomes[0].value)){
            saida.push(`nome_1=${sanitizarStringParaURL(nomes[0].value)}`);
          }
        }
        
        if(CPFs[0] !== undefined){
          if(!isEmpty(CPFs[0].value)){
            saida.push(`CPF_1=${sanitizarStringParaURL(CPFs[0].value)}`);
          }
        }
        
        if(nomes[1] !== undefined){
          if(!isEmpty(nomes[1].value)){
            saida.push(`nome_2=${sanitizarStringParaURL(nomes[1].value)}`);
          }
        }
        
        if(CPFs[1] !== undefined){
          if(!isEmpty(CPFs[1].value)){
            saida.push(`CPF_2=${sanitizarStringParaURL(CPFs[1].value)}`);
          }
        }
      }
      
      if(!isEmpty(saida)){
        window.open(`https://gabrieszin.github.io/capa-de-dossies?${saida.join('&')}`)
      }else{
        SwalAlert('error', 'warning', 'Necessário preencher os dados básicos do(s) proponente(s)');
      }
      
      function sanitizarStringParaURL(string){
        if(!isEmpty(string)){
          return string.trim().toLowerCase().replaceAll(' ', '-');
        }else{
          return '';
        }
      }
    })
  })
}

// TODO: separar funções de click - há um excesso de funções e chamadas de funções
export {
  clickAcionarModal,
  clickIncluirRenda,
  clickRemoverRenda,
  clickIncluirProponente,
  clickRemoverProponente,
  clickCopiar,
  clickLimparProcesso,
  clickAddInformacoes,
  clickVisibilidadeSenha,
  clickAddDevolucaoFID,
  submitAddDevolucaoFID,
  clickImportarPendencias,
  submitInformarRestricoes,
  clickLimparTudoSecao,
  clickEnviarDados,
  acaoClickIncluirProponente,
  clickDownload,
  acionarModalAddInformacoes,
  acionarDevolucaoFID
}
