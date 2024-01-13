const isEmpty = (valor) => {
  if(typeof valor == 'string'){
    return valor == undefined || valor == null || valor.length <= 0;
  }else if(Array.isArray(valor)){
    return valor.length <= 0;
  }else{
    return valor == undefined || valor == null
  }
}

const capitalize = (valor) => {
  if(Array.isArray(valor.split(' '))){
    const texto = new Array();
    valor.split(' ').forEach(palavra => {
      if(palavra.toUpperCase() == 'CPF,'){
        texto.push('CPF,');
      }else{
        texto.push(palavra.charAt(0).toUpperCase() + palavra.substr(1, palavra.length));
      }
    })
    return texto.join(' ');
  }else{
    return valor.charAt(0).toUpperCase() + valor.substr(1, valor.length);
  }
}

const atualizarDatas = () => {
  const dataAtual = new Date();
  document.querySelectorAll("[data-ano-atual]").forEach(area => {
    area.textContent = `${dataAtual.getFullYear()}`;
  })
} 

const cumprimentoHorario = () => {
  const hora = moment().hour();
  if(hora >= 0 && hora < 12){
    return 'bom dia';
  }else if(hora >= 12 && hora < 18){
    return 'boa tarde';
  }else{
    return 'boa noite';
  }
}

function atribuirLinks(){
  const linkElementos = document.querySelectorAll('[data-link]');
  
  linkElementos.forEach(link => {
    switch(link.dataset.link.toLowerCase().trim()){
      case 'arquivos':
      if(document.title == 'Confirmação de dados - CCA'){
        link.href = './arquivos/index.html';
        link.setAttribute('target', '_blank');
      }else if(document.title == 'Arquivos - CCA'){
        link.href = '#';
        window.scrollTo({top: 0, behavior: 'smooth'});
        link.removeAttribute('target');
      }else{
        link.href = '../arquivos/index.html';
        link.setAttribute('target', '_blank');
      }
      break;
      
      case 'confirmacao':
      if(document.title == 'Confirmação de dados - CCA'){
        link.href = '#';
        window.scrollTo({top: 0, behavior: 'smooth'});
        link.removeAttribute('target');
      }else{
        link.href = '../index.html';
        link.setAttribute('target', '_blank');
      }
      break;
      
      case 'desligamento':
      if(document.title == 'Confirmação de dados - CCA'){
        link.href = './desligamento/index.html';
        link.setAttribute('target', '_blank');
      }else if(document.title == 'Desligamento - CCA'){
        link.href = '#';
        window.scrollTo({top: 0, behavior: 'smooth'});
        link.removeAttribute('target');
      }else{
        link.href = '../desligamento/index.html';
        link.setAttribute('target', '_blank');
      }
      break;
      
      case 'consultas':
      if(document.title == 'Confirmação de dados - CCA'){
        link.href = './consultas/index.html';
        link.setAttribute('target', '_blank');
      }else if(document.title == 'Consulta de dados - CCA'){
        link.href = '#';
        window.scrollTo({top: 0, behavior: 'smooth'});
        link.removeAttribute('target');
      }else{
        link.href = '../consultas/index.html';
        link.setAttribute('target', '_blank');
      }
      break;
      
      case 'github-dev':
      link.href = 'https://github.com/gabrieszin';
      break;
      
      case 'github-projeto':
      link.href = 'https://github.com/gabrieszin/cca';
      break;
    }
    
    if(link.classList.contains('dropdown-item')){
      link.removeAttribute('target')
    }

    link.setAttribute('rel', 'noopener noreferrer');
  })
}

const controleFechamentoModal = () => {
  const modais = document.querySelectorAll('.modal');
  modais.forEach(modal => {
    const btnFecha = modal.querySelector('[data-modal-fecha]');
    btnFecha.addEventListener('click', () => {
      $('#' + modal.id).modal('hide');
    })
  })
}

function sanitizarString(string, substr){
  if(typeof string == 'string'){
    if(!isEmpty(substr) && Array.isArray(substr) && substr.length == 2){
      string = string.replaceAll(substr[0], substr[1]);
    }else{
      const substituir = [
        {
          original: '-',
          subst: ''
        },
        {
          original: '(',
          subst: ''
        },
        {
          original: ')',
          subst: ''
        },
        {
          original: ' ',
          subst: ''
        },
      ]
      
      substituir.forEach(substituicao => {
        string = string.replace(substituicao.original, substituicao.subst)
      })
    }
    
    return string.trim();
  }else{
    console.log('O tipo do parâmetro passado não é uma string.');
    return null;
  }
}

async function SwalAlert(tipo, icon, title, text, mensagem){
  tipo = tipo.toLowerCase().trim();
  if(tipo == 'confirmacao'){
    const dialog = await Swal.fire({
      icon: icon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Sim',
      focusCancel: true
    })
    
    return new Promise((resolve, reject) => {
      resolve({isConfirmed: dialog.isConfirmed})
    })
  }
  
  else if(tipo == 'aviso'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    })
  }
  
  else if(tipo == 'error'){
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      footer: mensagem
    }) 
  }
}

function resizeTextArea(textarea){
  if(window.screen.height > 875 && window.screen.width > 1366){
    while( 
      $(textarea).outerHeight() < textarea.scrollHeight +
      parseFloat($(textarea).css("borderTopWidth")) +
      parseFloat($(textarea).css("borderBottomWidth")) && $(textarea).height() < 500
    )
    {
      $(textarea).height($(textarea).height() + 1);
    };
  }
  // const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
  // textarea.style.height = `${initialHeight}px`;
  // const scrollHeight = textarea.scrollHeight;
  // const newHeight = textarea.scrollHeight - initialHeight;
  // const t = newHeight < scrollHeight ? (scrollHeight + newHeight) < initialHeight ? initialHeight : scrollHeight : newHeight;
  // textarea.style.height = `${t}px`;
  // console.log(initialHeight, scrollHeight, newHeight, t)
}

const copiar = async (valor) => {
  await navigator.clipboard.writeText(valor);
}

function sanitizarCPF(cpf){
  return sanitizarNumero(cpf);
}

function primeiroNome(nome){
  const nome_separado = nome.trim().split(' ');
  return nome_separado[0];
}

function verificarCPF(cpf){
  cpf = cpf.replace(/\D/g, '');
  
  switch (cpf){
    case '00000000000':
    resultado = false
    break;
    case '11111111111':
    resultado = false
    break;
    case '22222222222':
    resultado = false
    break;
    case '33333333333':
    resultado = false
    break;
    case '44444444444':
    resultado = false
    break;
    case '55555555555':
    resultado = false
    break;
    case '66666666666':
    resultado = false
    break;
    case '77777777777':
    resultado = false
    break;
    case '88888888888':
    resultado = false
    break;
    case '99999999999':
    resultado = false
    break;
    default: 
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var resultado = true;
    [9,10].forEach(function(j){
      var soma = 0, r;
      cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
        soma += parseInt(e) * ((j+2)-(i+1));
      });
      r = soma % 11;
      r = (r <2)?0:11-r;
      if(r != cpf.substring(j, j+1)) resultado = false;
    });
  }
  
  return resultado;
}

const verificarEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
}

const verificarData = (data) => {
  if(data.replaceAll('/', '').length == 8){
    const data_moment = moment(data, "DD/MM/YYYY");
    const mais_18 = (moment().get('DD/MM/YYYY').diff(data_moment.get('DD/MM/YYY'), 'years') >= 18);
    const menos_75 = (moment().get('DD/MM/YYYY').diff(data_moment.get('DD/MM/YYY'), 'years') < 75);
    
    if(!mais_18){
      SwalAlert('aviso', 'warning', 'Proponente menor de 18 anos!');
    }else if(!menos_75){
      SwalAlert('aviso', 'warning', 'Proponente com idade superior a 75 anos!');
    }
    
    return data_moment._isValid && mais_18 && menos_75;
  }
  return false;
}

function ordernarString(array){
  return array.slice(0).sort(function(a, b){let x = a.titulo.toLowerCase(); let y = b.titulo.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0;})
}

function limparEFocar(input, comando){
  if(!isEmpty(comando)){
    switch(comando){
      case 'clear':
      input.value = '';
      break;
      case 'focus':
      input.focus();
      break;
      default:
      // Ação não implementada
      break;
    }
  }else{
    input.focus();
    input.value = '';
  }
}

const sanitizarNumero = (valor) => {
  return !isEmpty(valor) ? valor.replace(/\D/g, '') : valor;
}

const criarEBaixarArquivo = (conteudo, nome_arquivo, ext) => {
  try{
    let blob = new Blob([`${JSON.parse(conteudo)}`], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${nome_arquivo.toUpperCase()}.${ext}`);
  }catch(error){
    console.warn('Framework File Saver necessário');
    throw new Error(error);
  }
}

const splitArray = (array, [initial, final]) => {
  return array.filter((item, index) => index >= initial && index <= final);
}

export{
  isEmpty,
  capitalize,
  atualizarDatas,
  atribuirLinks,
  controleFechamentoModal,
  sanitizarString,
  SwalAlert,
  resizeTextArea,
  copiar,
  sanitizarCPF,
  primeiroNome,
  verificarCPF,
  verificarEmail,
  verificarData,
  ordernarString,
  limparEFocar,
  cumprimentoHorario,
  sanitizarNumero,
  criarEBaixarArquivo,
  splitArray
}