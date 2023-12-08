import { text_areas_editados } from "../script.js";
import { isEmpty, resizeTextArea } from "./utilitarios.js";

const renderTooltips = () => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

const renderPopover = () => {
  $(document).ready(function(){
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
    switch(feedback.dataset.content.trim().toLowerCase()){
      case 'feedback-endereco':
      if(isEmpty(elementos[index].value)){
        mensagem = 'Necessário apresentar comprovante de endereço.';
      }else{
        switch(elementos[index].value.trim().toLowerCase()){
          case 'fatura de serviço':
          case 'boleto de cobrança':
          if(!proponente.querySelector('[data-input="endereco_valido"]').checked){
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
      const tipos_rendas = new Array();
      elementos[index].forEach(elemento => {
        tipos_rendas.push(elemento.value.trim().toLowerCase());
      })
      
      //Verifica se existem valores vazios
      if(tipos_rendas.findIndex(e => e == '') !== -1){
        mensagem += 'Proponente sem renda.\n';
      }
      if(tipos_rendas.includes('contracheque/hollerith') || tipos_rendas.includes('irpf')){
        proponente.querySelectorAll('[data-input="renda_valida"]').forEach(renda_valida => {
          if(!renda_valida.checked){
            mensagem += 'Necessário apresentar documento atualizado.\n';
          }
        })
      }
      if(tipos_rendas.includes('renda informal')){
        mensagem += 'Renda informal.\n';
      }
      if(tipos_rendas.includes('contrato de aluguel') || tipos_rendas.includes('extratos bancários')){
        mensagem += 'Necessário formalizar a renda.\n'
      }
      if(tipos_rendas.includes('outro')){
        mensagem += 'Verifique o Manual Normativo do Produto sobre a utilização deste documento.\n'
      }
      
      break;
    }
    
    feedback.innerHTML = mensagem.replaceAll('\n', '<br>');
  })
}

const renderPendencias = () => {
  if(!text_areas_editados()){
    const txt = document.querySelector('[data-content="pendencias"]');
    if(!isEmpty(txt)){
      txt.value = '';
      const pendencias = new Array();
      
      const proponentes = document.querySelectorAll('.accordion-item');
      if(!isEmpty(proponentes) && proponentes.length > 0){
        proponentes.forEach((proponente, index) => {
          const inputs = proponente.querySelectorAll('[data-element="input"]');
          
          const elementos = {
            valores: {
              nome : get('nome'),
              cpf : get('cpf'),
              data_nascimento : get('data_nascimento'),
              email : get('email'),
              telefone : get('telefone'),
              endereco : get('endereco'),
              // tipo_endereco : get('tipo_endereco'),
              endereco_valido: get('endereco_valido'),
              renda : get('renda'),
              renda_valida: get('renda_valida'),
              // tipo_renda : get('tipo_renda'),
              comprovante_estado_civil : get('comprovante_estado_civil'),
              fgts : get('fgts'),
            },
            some(parametro){
              const retorno = new Array();
              for (const [key, value] of Object.entries(this.valores)){
                if(value == parametro){retorno.push(key);}
              }
              return retorno.length > 0 ? true : false;
            },
            search(parametro){
              const retorno = new Array();
              for (const [key, value] of Object.entries(this.valores)){
                if(Array.isArray(value)){
                  value.forEach((v, index) => {
                    if(v == parametro && !retorno.includes(key)){
                      if(key !== 'fgts'){
                        retorno.push(key)
                      };
                    }
                  })
                }else{
                  if(value == parametro){key !== 'fgts' ? retorno.push(key) : '';}
                }
              }
              return retorno;
            }
          }
          
          if(elementos.some('')){
            pendencias.push({proponente: `PROPONENTE ${index + 1} - ${!isEmpty(elementos.valores.nome[0]) ? elementos.valores.nome[0].toUpperCase() + ':' : ''}`, pendente: elementos.search('').join().replaceAll('_', ' ').toUpperCase().replaceAll(',', '\n')});
          }
          
          function get(id){
            const saida = new Array();
            inputs.forEach(input => {
              if(input.type == 'checkbox' && input.dataset.input == `${id}`){
                input.checked ? saida.push(true) : saida.push('');
              }else{
                input.dataset.input == `${id}` ? saida.push(input.value) : '';
              }
            })
            return saida;
          }
          
          renderFeedbacks(proponente);
        })
        
        txt.value = '';
        pendencias.forEach((pendencia, index) => {
          // console.log(pendencia);
          index !== 0? txt.value += '\n\n' : 'a';
          // console.log('atualizado');
          txt.value += `${pendencia.proponente}\n${pendencia.pendente}`
        })
        resizeTextArea(txt);
        // txt.textContent = `${pendencias.forEach(pendencia => {return pendencia.pendente})}`;
      }
    }
  }
}

const renderResumo = () => {
  const resumo = document.querySelector('[data-content="resumo"]');
  const accordion_group = document.querySelector('.accordion');
  const nomes = new Array();
  
  if(!isEmpty(accordion_group)){
    accordion_group.querySelectorAll('[data-information="nome-proponente"]').forEach((nome, index) => {
      nomes.push(nome.textContent);
    })
    
    const quantidade_proponentes = accordion_group.querySelectorAll('.accordion-item').length;
    const texto = `### Processo iniciado em ${moment().format('DD/MM/YYYY')}, com ${quantidade_proponentes > 0 ? quantidade_proponentes + ' proponente(s): ' : 'nenhum proponente.'} ${quantidade_proponentes > 0 ? nomes.join().replaceAll(',', ', ') + '.' : '' } ###`;
    
    resumo.textContent = `${texto}`
  }
}

function listarProponentesPendencias(){
  try{
    document.querySelector('[data-content="pendencias"]').value = '';
    (document.querySelectorAll('.card-body-header [data-content="nome"]').forEach((nome, index) => {
      const nomeApresentacao = nome.textContent.trim() === 'Nome do cliente' ? `PROPONENTE ${index + 1} -` : `PROPONENTE ${index + 1} - ${nome.textContent.trim().toUpperCase()}:`;
      document.querySelector('[data-content="pendencias"]').value += index !== 0 ? `\n\n${nomeApresentacao}` : nomeApresentacao;
      text_areas_editados(true);
    }))
  }catch(error){
    console.warn('Ocorreu um erro ao tentar listar apenas os nomes dos proponentes na listagem de pendências.')
  }
}
window.listarProponentesPendencias = listarProponentesPendencias;

export{
  renderTooltips,
  renderPopover,
  renderPendencias,
  renderResumo,
  renderFeedbacks
}
