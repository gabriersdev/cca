import { text_areas_editados } from '../script.js';
import { conteudos } from './conteudos.js';
import { clickRemoverRenda, clickIncluirProponente, clickRemoverProponente, clickCopiar, clickLimparProcesso, clickAddInformacoes, clickVisibilidadeSenha, clickAddDevolucaoFID, submitAddDevolucaoFID, clickImportarPendencias, submitInformarRestricoes, clickAcionarModal, clickLimparTudoSecao, clickEnviarDados, acaoClickIncluirProponente, clickDownload, acionarDevolucaoFID, acionarModalAddInformacoes } from './funcoes-click.js'
import { edicaoInputNome, atualizarNumerosProponentes, edicaoInputCPF, edicaoInputEmail, edicaoInputData, edicaoTextAreaRelatorio, edicaoTextAreaPendencias, edicaoTextAreaRestricoes } from './funcoes-de-conteudo.js';
import { renderTooltips, renderPopover, renderPendencias, renderResumo } from './funcoes-render.js';
import { isEmpty, resizeTextArea } from './utilitarios.js';
import { id_arquivos } from './confirmacao.js';

/* Verificar funcionamento desta função */
const verificarInputsRecarregamento = (funcao) => {
  if(true){
    if(isEmpty(funcao)){
      if(document.title.trim() == 'Confirmação de dados - CCA' && true){
        window.onbeforeunload = async (evento) => {
          evento.preventDefault();
          await document.querySelectorAll('[data-element="input"]').forEach(elemento => {
            if(!isEmpty(elemento.value)){
              return 'Tem certeza que deseja sair?';
            }
          })
        }
      }
    }else{
      // console.log('aqui');
      window.onbeforeunload = '';
    }
  }
}

const escutaEventoInput = () => {
  const inputs = document.querySelectorAll('[data-element="input"]');
  inputs.forEach(elemento => {
    tratamentoCampos(elemento);
    // removeEventListener('input', elemento);
    if(elemento.dataset.input == "nome"){
      edicaoInputNome();
    }
    else if(elemento.dataset.input == 'cpf'){
      edicaoInputCPF(elemento)
    }
    else if(elemento.dataset.input == 'email'){
      edicaoInputEmail(elemento);
    }
    else if(elemento.dataset.input == 'data_nascimento'){
      edicaoInputData(elemento)
    }
    else if(elemento.dataset.content == 'relatorio'){
      edicaoTextAreaRelatorio(elemento)
    }
    else if(elemento.dataset.content == 'pendencias'){
      edicaoTextAreaPendencias(elemento)
      elemento.addEventListener('keypress', (evento) => {
        text_areas_editados(true);
      })
      elemento.addEventListener('input', (evento) => {
        text_areas_editados(true);
      })
    }
    else if(elemento.dataset.content == 'text-restricoes'){
      edicaoTextAreaRestricoes(elemento);
    }
    if(elemento.tagName.toLowerCase() !== 'textarea'){
      elemento.addEventListener('input', () => { renderPendencias(); });
    }
  })
}

const tratamentoCampos = (input) => {
  $(document).ready(function(){
    switch(input.dataset.input){
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
    
    switch(input.dataset.maskc){
      case 'money':
      mascararValores(input);
      break;
    }
    
    function mascararValores(input){
      // Créditos https://stackoverflow.com/questions/62894283/javascript-input-mask-currency
      // console.log(input)
      // console.log(input.value)
      
      if(isEmpty(input.value)){
        input.value = 'R$ 0,00';
      }
      
      input.addEventListener('input', () => {
        const value = input.value.replace('.', '').replace(',', '').replace(/\D/g, '')
        
        const options = { minimumFractionDigits: 2 }
        const result = new Intl.NumberFormat('pt-BR', options).format(
          parseFloat(value) / 100
          )
          
          if(isNaN(result) && result == 'NaN'){
            input.value = 'R$ 0,00';
          }else{
            input.value = 'R$ ' + result;
          }
        })
        
        input.removeAttribute('maxlength');
        
        // input.addEventListener('input', (evento) => {
        //   const value = evento.target.value;
        
        //   const split = value.trim().split(' ').filter(e => e !== ' ');
        //   const convertido = (split.map(e => parseInt(e)));
        //   let valor = (convertido.find(e => !isNaN(e))).toString();
        //   valor = '' + valor;
        //   // console.log(valor.substring(0, valor.lenght - 2) + valor.susbtring(valor.lenght - 2, valor.lenght));
        
        //   // console.log(valor);
        
        //   // console.log(SimpleMaskMoney.formatToCurrency(), { prefix: 'R$' }));
        //   // evento.target.value = 
        // })
      }
      
    });
  }
  
  function funcoesBase(){
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
    
    $('[data-action="exibir-informacoes"]').on('click', (evento) => {
      evento.preventDefault();
      document.querySelector('.modal-informacoes-pagina').showModal();
    })
    
    $('[data-action=fechar-modal-dialog]').on('click', (evento) => {
      evento.target.closest('dialog').close();
    })
    
    let click113 = false;
    
    document.addEventListener('keyup', (evento) => {
      const code = evento.keyCode;
      // evento.preventDefault();
      if(!isEmpty(code)){
        // console.log(code)
        if(code == 45){
          acaoClickIncluirProponente()
        }else if(code == 113){
          click113 = true;
          
          setTimeout(() => {
            click113 = false;
          }, 1000)
        }else if(code == 68 && click113){
          // Baixar arquivo de dados
          clickDownload({dataset: {download: 'baixar-dados'}}, evento);
        }else if(code == 70 && click113){
          // Ir para Acompanhar FID
          $('[data-element="input-URL-acompanhar-FID"]').focus();
        }else if(code == 80 && click113){
          // Baixar arquivo de pendências
          clickDownload({dataset: {download: 'baixar-pendencias'}}, evento);
        }else if(code == 82 && click113){
          // Baixar arquivo de relatório
          clickDownload({dataset: {download: 'baixar-relatorio'}}, evento);
        }else if(code == 86 && click113){
          acionarDevolucaoFID();
        }else if(code == 73 && click113){
          acionarModalAddInformacoes();
        }
      }
    })
    
    const linksFaceis = $('.links-faceis-confirmacao');
    if(!isEmpty(linksFaceis)){
      [
        conteudos.consultas.find(e => e.titulo == 'CIWEB'), 
        conteudos.consultas.find(e => e.titulo == 'CADMUT'), 
        conteudos.consultas.find(e => e.titulo == 'Consulta CNPJ'), 
        conteudos.consultas.find(e => e.titulo == 'Situação Cadastral'), 
        conteudos.arquivos.find(e => e.titulo == 'Tabela de Apuração'),
        conteudos.consultas.find(e => e.titulo == 'Tempo de Serviço'), 
      ].forEach(conteudo => {
        const link = conteudo.link
        try{
          $('.links-faceis-confirmacao').append(`<a class="card" href="${link.includes('https') ? link : `https://drive.google.com/uc?export=download&id=${(id_arquivos.conteudos.find(e => e.conteudo == link)).attr}`}" target="_blank" data-item="card-link-facil" rel="noreferrer noopener" data-toggle="tooltip" data-placement="top" title="Clique para abrir ->"><div class="card-header">${conteudo.sistema}<i class="bi bi-arrow-up-right-square" data-icon="icone"></i></div><div class="card-body"><b>${conteudo.titulo}</b></div></a>`);
        }catch(error){
          '#'
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
    
    function carregarPendencias(evento){
      evento.preventDefault();
      $(evento.target).tooltip('hide');
      
      text_areas_editados(false);
      renderPendencias();
    }
    
    const modal = document.querySelector('#modal-devolucao-fid');
    if(!isEmpty(modal)){
      modal.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', (evento) => {
          resizeTextArea(textarea);
        })
      })
    }
    
    $('[data-form="checklist-analise-internalizada"] input[type=checkbox]').on('input', (event) => {
      try{
        const label = event.target.closest('div.form-group').querySelector('label');
        if(event.target.checked){
          label.innerHTML = `<s>${label.textContent}</s>`
        }else{
          label.innerHTML = `${label.textContent}`
        }
      }catch(error){
        
      }
    })

    $('[data-action="calcular-percentual"]').on('click', (evento) => {
      evento.preventDefault();

      const percentuais = {
        parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
        financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
      }

      setTimeout(() => {
        document.querySelector(`#modal-calcular-percentual [data-tab=${percentuais.parcela ? "percent-parcela" : "percent-financiamento"}]`).querySelectorAll('input')[0].focus();
      }, 500)
    });
    
    $('#modal-calcular-percentual form').on('submit', (evento) => {
      evento.preventDefault(); 
      let saida = new Object;
      
      const percentuais = {
        parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
        financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
      }
      
      function BRLToFLoat(value) {
        return parseFloat(value.replace("R$ ", "").replaceAll(".", "").replace(",", "."));
      }

      if(percentuais.parcela){
        const renda = evento.target.querySelector('input[name=renda-bruta-total]').value;
        const parcela = evento.target.querySelector('input[name=parcela-liberada]').value;
        
        const percentual = (BRLToFLoat(parcela) / BRLToFLoat(renda)).toFixed(15);
        const inteiro = (percentual * 100);
        
        if(inteiro > 30 && isFinite(percentual)){
          saida.message = `Comprometimento de ${(percentual * 100).toFixed(2) + "%"}. Verifique os valores informados.`;
          saida.type = 'warning';
        }else if(!isFinite(percentual)){
          saida.message = "Renda bruta total informada é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else if(inteiro <= 0){
          saida.message = "Parcela informada é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else{
          if(!isNaN(percentual)){
            saida.message = `Percentual: ~ ${(percentual * 100).toFixed(2) + "%"}<br>Fração liberada: ${percentual}`;
            saida.type = 'primary';
          }else{
            saida.message = "Verifique os valores informados.";
            saida.type = 'danger';
          }
        }
      }else{
        const valorImovel = evento.target.querySelector('input[name=valor-de-compra-e-venda]').value;
        const valorFinanciado = evento.target.querySelector('input[name=valor-financiado]').value;

        const percentual = (BRLToFLoat(valorFinanciado) / BRLToFLoat(valorImovel)).toFixed(15);
        const inteiro = (percentual * 100);

        if(inteiro > 90 && isFinite(percentual)){
          saida.message = `Cota de ${(percentual * 100).toFixed(2) + "%"}. Verifique os valores informados.`;
          saida.type = 'warning';
        }else if(!isFinite(percentual)){
          saida.message = "Valor de compra e venda informado é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else if(inteiro <= 0){
          saida.message = "Valor financiado informado é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else{
          if(!isNaN(percentual)){
            saida.message = `Cota: ~ ${(percentual * 100).toFixed(2) + "%"}<br>Fração liberada: ${percentual}`;
            saida.type = 'primary';
          }else{
            saida.message = "Verifique os valores informados.";
            saida.type = 'danger';
          }
        }
      }
      
      $(`#modal-calcular-percentual [data-tab=${percentuais.parcela ? "percent-parcela" : "percent-financiamento"}] div.percent-retorno`).html(`<div class="alert mt-2 mb-0 alert-${saida.type} none">${saida.message.toString()}</div>`);

      $(`#modal-calcular-percentual [data-tab=${percentuais.parcela ? "percent-parcela" : "percent-financiamento"}] div.percent-retorno div.alert`).fadeIn(500);
    })

    // Funcionalidade de seleção de elementos de opção de fácil acesso
    const selecoes = [
      {
        name: 'Tela solicitada',
        id: 'tela-endividamento',
        value: 'Tela de comprometimento solicitada. '
      },
      {
        name: 'FGTS solicitado',
        id: 'FGTS-solicitado',
        value: 'Saldo FGTS e se tem bloqueio solicitado. '
      },
      {
        name: 'Verificação FGTS',
        id: 'verificacao-FGTS',
        value: 'Verificação do saldo FGTS, possibilidade de uso e se tem bloqueio solicitado. '
      },
      {
        name: 'Autorização FGTS',
        id: 'autorizacao-FGTS',
        value: 'Gentileza solicitar autorização para consulta à Caixa no APP do FGTS, para verificar o tempo de serviço. '
      },
      {
        name: 'Aviso IRPF',
        id: 'aviso-IRPF',
        value: 'Importante fazer a declaração tendo em vista que ela só é aceita se os rendimentos forem superiores ao mínimo obrigatório para se declarar. '
      },
      {
        name: 'Restrição Externa',
        id: 'restricao-externa',
        value: 'Proponente/grupo familiar possui restrição externa. Necessária regularização para nova avaliação da proposta. '
      },
      {
        name: 'Prejuízo no SCR',
        id: 'prejuizo-scr',
        value: 'Proponente/Grupo Familiar possui dívidas baixadas como Prejuízo no SCR. '
      },
      {
        name: 'Dívidas vencidas',
        id: 'dividas-vencidas',
        value: 'Proponente/Grupo Familiar possui dívidas vencidas no SCR. '
      },
      {
        name: 'Pendência CEF',
        id: 'pendencia-cef',
        value: 'Proponente/grupo familiar possui pendência. Procurar Agência de vinculação para detalhes. '
      },
      {
        name: '',
        id: '',
        value: ''
      }
    ]

    if(!isEmpty(document.querySelector('.selecao-multiplas-opcoes'))){
      selecoes.sort((a, b) => a.name.localeCompare(b.name)).filter((e) => !isEmpty(e.name)).forEach((selecao) => {
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
  
        function atualizarBtn(){
          // console.log(input.checked)
          const btn = input.closest('div.form-group').querySelector('label.btn');
          if(input.checked){
            btn.classList.add('checked');
          }else{
            btn.classList.remove('checked');
          }
        }
      });
    }

  }
  
  function atualizar(){
    renderTooltips();
    renderPopover();
    renderPendencias();
    escutaEventoInput();
    atualizarNumerosProponentes();
  }
  
  export {
    escutaEventoInput,
    funcoesBase,
    atualizar,
    verificarInputsRecarregamento
  }