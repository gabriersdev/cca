import { text_areas_editados } from '../script.js';
import { conteudos } from './conteudos.js';
import { clickRemoverRenda, clickIncluirProponente, clickRemoverProponente, clickCopiar, clickLimparProcesso, clickAddInformacoes, clickVisibilidadeSenha, clickAddDevolucaoFID, submitAddDevolucaoFID, clickImportarPendencias, submitInformarRestricoes, clickAcionarModal, clickLimparTudoSecao, clickEnviarDados, acaoClickIncluirProponente, clickDownload, acionarDevolucaoFID, acionarModalAddInformacoes } from './funcoes-click.js'
import { edicaoInputNome, atualizarNumerosProponentes, edicaoInputCPF, edicaoInputEmail, edicaoInputData, edicaoTextAreaRelatorio, edicaoTextAreaPendencias, edicaoTextAreaRestricoes, setTheme, setAutocomplete } from './funcoes-de-conteudo.js';
import { renderTooltips, renderPopover, renderPendencias, renderResumo } from './funcoes-render.js';
import { SwalAlert, feedbackButton, isEmpty, resizeTextArea, verificarSeFIDvalido } from './utilitarios.js';
import { outrosProjetosExibicao } from './dados.js';
import { Settings } from '../classes/Settings.js';

const verificarInputsRecarregamento = () => {
  if(true){
    window.onbeforeunload = (evento) => {
      // Há o que preservar
      // TODO - Adicionar monitoramento de campos editados que são inicializados com conteúdo (pendências, análise internalizada, etc.)
      if(Array.from($('input, textarea')).filter(e => e.checked === undefined ? e.value !== "R$ 0,00" && e.value.trim().length > 0 : '').length > 0){
        evento.preventDefault();
      }else{
        // Não há o que preservar
      }
    }
  }
}

const escutaEventoInput = () => {
  const inputs = Array.from(document.querySelectorAll('[data-element="input"]'));
  inputs.forEach(elemento => {
    
    tratamentoCampos(elemento);
    
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
    else if(elemento.dataset.input == 'id-fid'){
      let linkGerado;
      
      elemento.addEventListener('input', (evento) => {
        if(verificarSeFIDvalido(elemento.value)){
          // Exibir botão para ir até o link de acompanhamento
          $('[data-element="btn-ref-link-FID"]').attr('disabled', false);
          
          linkGerado = `https://portalsafi.direcional.com.br/Fluxo?codigo=${elemento.value}`;
          
          // Limpar link de acompanhamento
          $('#input-URL-acompanhar-FID').val(linkGerado);
        }else{
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
        if(evento.target.disabled === false){
          $('#modal-informacoes-adicionais').modal('hide');
          window.scrollTo({top: document.querySelector('#area-acompanhamento-fid').offsetTop, behavior: 'smooth'});
        }
      })
      
      $('[data-action="baixar-acompanhamento-FID"]').on('click', (evento) => {
        evento.preventDefault();
        if(evento.target.disabled === false){
          if(!isEmpty(linkGerado)){
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
        if(evento.target.disabled === false){;
          if(!isEmpty(linkGerado)){
            window.open(linkGerado, '_blank', 'noopener,noreferrer');
          }
        }
        
      })
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
      input.setAttribute('maxlength', 20);
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
        const result = new Intl.NumberFormat('pt-BR', options).format(parseFloat(value) / 100)
        
        if(isNaN(result) && result == 'NaN'){
          input.value = 'R$ 0,00';
        }else{
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
  const codePlanilhaDefault = '0';

  if (![null, undefined].includes(planilhas.find(planilha => planilha.month === monthTrated).code) && ![null, undefined].includes(monthTrated)) {
    return `https://drive.google.com/uc?export=download&id=${planilhas.find(planilha => planilha.month === monthTrated).code || codePlanilhaDefault}`;
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
    if(!ret){
      console.log('Não foi possível recuperar o link da tabela de apuração para o mês atual. Parâmetro incorreto.');
    }
    return ret;
  } else {
    return null;
  }
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
  
  $('[data-action="carregar-outros-projetos"]').ready(() => {
    if(outrosProjetosExibicao.length > 0){
      outrosProjetosExibicao.toSorted((a, b) => a.nome.localeCompare(b.nome)).toSpliced(4).forEach((projeto) => {
        $('[data-action="carregar-outros-projetos"]').append(`<li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="${projeto.link}">${projeto.nome}</a></li>`)
      })
    }else{
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

  if(document.title === 'Confirmação de dados - CCA'){
    const btnRecuperarDados = $('[data-action="recuperar-dados"]');
    const toast = $('#toast-feedback');
    let retorno = 'Ocorreu um erro';

    if(btnRecuperarDados){
      let icon = 'error';
      let text = 'Ocorreu um erro.'

      $(btnRecuperarDados).click((evento) => {
        evento.preventDefault();
        let local = localStorage.getItem('cca');

        try{
          local = JSON.parse(local);

          if(!isEmpty(local)){
            if(local["data-campos-storage"]["relatório"]){
              $('[data-content="relatorio"]').val(local["data-campos-storage"]["relatório"]);
            }

            if(local["data-campos-storage"]["pendências"]){
              $('[data-content="pendencias"]').val(local["data-campos-storage"]["pendências"]);
            }

            icon = 'success';
            retorno = 'Dados recuperados!';
            text = 'O campo de relatório e-ou pendência foi atualizado conforme o que foi salvo da última vez';
          }else{
            icon = 'warning';
            retorno = 'Não há dados salvos';
            text = 'Não há registros salvos do campo de relatório ou o do campo de pendência';
          }
        }catch(error){
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
      if(!isEmpty(code)){
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
        }else if(code == 66){
          click66 = true;
          
          setTimeout(() => {
            click66 = false;
          }, 1000)
        }else if(code == 17 && click66){          
          const data = {
            "relatório": $('[data-content="relatorio"]').val().trim(),
            "pendências": $('[data-content="pendencias"]').val().trim()
          };
          
          if(isEmpty(data["relatório"]) && isEmpty(data["pendências"])){
            retorno = 'Campos vazios! Preencha-os primeiro';
          }else{
            try{
              let local = localStorage.getItem('cca');
              
              try{
                // Parse do localStorage OK
                local = JSON.parse(local);
                local["data-campos-storage"] = data;
                localStorage.setItem('cca', JSON.stringify(local));
  
                if(JSON.stringify(local) === localStorage.getItem('cca')){
                  retorno = 'Dados salvos com sucesso';
                }else{
                  retorno = 'Dados parcialmente salvos. Consulte o console';
                  console.log('Os dados armazenados localmente não são iguais aos dados capturados. Verifique.');
                }
              }catch(error){
                // Não foi possível fazer o parse do localStorage, tentando alterar a variável
                localStorage.setItem('cca', JSON.stringify({"data-campos-storage": data}));
                
                if(JSON.stringify({"data-campos-storage": data}) === localStorage.getItem('cca')){
                  retorno = 'Dados salvos com sucesso';
                }else{
                  throw new Error('Tentativa de salvar no localStorage falhou.')
                }
              }
            }catch(error){
              retorno = 'Não foi possível salvar os dados. Consulte o console';
              console.log('Não foi possível salvar os dados', error.message);
            }
          }
          
          if(toast){
            const body = $(toast).find('.toast-body');
            $(body).text(retorno);
            $('#toast-feedback').toast('show');
          }
        }
      }
    });
  }
  
  const linksFaceis = document.querySelector('.links-faceis-confirmacao');
  if(!isEmpty(linksFaceis)){
    [
      conteudos.consultas.find(e => e.titulo == 'CIWEB') || 0, 
      conteudos.consultas.find(e => e.titulo == 'CADMUT') || 0, 
      conteudos.consultas.find(e => e.titulo == 'Consulta CNPJ') || 0, 
      conteudos.consultas.find(e => e.titulo == 'Situação Cadastral') || 0, 
      conteudos.arquivos.find(e => e.titulo == 'Tabela de Apuração') || 0,
      conteudos.consultas.find(e => e.titulo == 'Tempo de Serviço') || 0, 
    ].forEach(conteudo => {
      const link = conteudo.link
      try{
        $('.links-faceis-confirmacao [data-element="area-content"]').append(`<a class="card" href="${link.includes('https') ? link : updateLinkPlanilha()}" target="_blank" data-item="card-link-facil" rel="noreferrer noopener" data-toggle="tooltip" data-placement="top" title="Clique para abrir ->"><div class="card-header">${conteudo.sistema}<i class="bi bi-arrow-up-right-square" data-icon="icone"></i></div><div class="card-body"><b>${conteudo.titulo}</b></div></a>`);
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
    if(renderPendencias()){
      feedbackButton(btnCarregarPendencias, {html: '<i class="bi bi-check2"></i>', classe: 'btn btn-success', html_retorno: btnCarregarPendencias.innerHTML});
    }else{
      feedbackButton(btnCarregarPendencias, {html: '<i class="bi bi-x-lg"></i>', classe: 'btn btn-danger', html_retorno: btnCarregarPendencias.innerHTML});
    }
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
  
  $('[data-action="calcular-percentual"], #modal-calcular-percentual .nav-item a.nav-link').on('click', (evento) => {
    evento.preventDefault();
    
    const percentuais = {
      parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
      financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
      rendaNecessaria: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-renda-necessaria"]').classList.contains('active'),
    }
    
    setTimeout(() => {
      if(percentuais.parcela){
        // console.log("Percentual de parcela");
        $('#modal-calcular-percentual input[name=renda-bruta-total]').focus();
      }else if(percentuais.financiamento){
        // console.log("Percentual de financiamento");
        $('#modal-calcular-percentual input[name=valor-de-compra-e-venda]').focus();
      }else if(percentuais.rendaNecessaria){
        // console.log("Percentual de condicionamento");
        $('#modal-calcular-percentual input[name=percentual-condicionamento]').focus();
      }
    }, 500)
  });
  
  $('#modal-calcular-percentual form').on('submit', (evento) => {
    evento.preventDefault(); 
    let saida = new Object;
    let identificador;
    
    const percentuais = {
      parcela: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-parcela"]').classList.contains('active'),
      financiamento: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-percent-financiamento"]').classList.contains('active'),
      rendaNecessaria: document.querySelector('[data-bs-toggle="tab"][data-bs-target="#nav-renda-necessaria"]').classList.contains('active'),
    }
    
    function BRLToFLoat(value) {
      return parseFloat(value.replace("R$ ", "").replaceAll(".", "").replace(",", "."));
    }
    
    if(percentuais.parcela){
      identificador = 'percent-parcela';
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
    }else if(percentuais.financiamento){
      identificador = 'percent-financiamento';
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
    }else if(percentuais.rendaNecessaria){
      identificador = 'renda-necessaria';
      const percentualCondicionamento = parseFloat(evento.target.querySelector('input[name="percentual-condicionamento"]').value.replaceAll(',', '.'));
      const parcelaNecessaria = BRLToFLoat(evento.target.querySelector('input[name="parcela-necessaria"]').value);
      
      if(percentualCondicionamento > 0 && percentualCondicionamento <= 30 && parcelaNecessaria > 0 && isFinite(percentualCondicionamento) && isFinite(parcelaNecessaria) && !isNaN(percentualCondicionamento) && !isNaN(parcelaNecessaria)){
        saida.message = `Necessário uma renda de ${((parcelaNecessaria * 100) / (percentualCondicionamento)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} para atingir a parcela necessária de acordo com o percentual de condicionamento informado.`;
        saida.type = 'primary';
      }else{
        if(percentualCondicionamento <= 0){
          saida.message = "Percentual de condicionamento informado é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else if(percentualCondicionamento > 30){
          saida.message = "Percentual de condicionamento informado é maior que 30%. Verifique os valores informados.";
          saida.type = 'warning';
        }else if(parcelaNecessaria <= 0){
          saida.message = "Parcela necessária informada é igual a zero. Verifique os valores informados.";
          saida.type = 'warning';
        }else{
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
  
  if(!isEmpty(document.querySelector('.selecao-multiplas-opcoes'))){
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
      
      function atualizarBtn(){
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
  setAutocomplete(new Settings().getOption('autocomplete'));
}

export {
  escutaEventoInput,
  funcoesBase,
  atualizar,
  verificarInputsRecarregamento
}