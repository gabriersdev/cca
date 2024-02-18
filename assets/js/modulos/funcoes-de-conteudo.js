import { renderResumo } from "./funcoes-render.js";
import { isEmpty, resizeTextArea, verificarCPF, verificarData, verificarEmail, capitalize, ordernarString } from "./utilitarios.js";
import { conteudos } from "./conteudos.js";

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
  const accordions_headers = document.querySelectorAll('.accordion-header').forEach((elemento, index) => {
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
  textarea.addEventListener('input', (evento) => {
    const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
    textarea.addEventListener('input', () => {
      resizeTextArea(textarea)
    });
  })
}

const edicaoTextAreaPendencias = (textarea) => {
  textarea.addEventListener('input', (evento) => {
    const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
    textarea.addEventListener('input', () => {
      resizeTextArea(textarea)
    });
  })
}

const edicaoTextAreaRestricoes = (textarea) => {
  textarea.addEventListener('input', (evento) => {
    const initialHeight = parseInt(getComputedStyle(textarea).getPropertyValue('height'));
    textarea.addEventListener('input', () => {
      resizeTextArea(textarea)
    });
  })
}

const adicionarOpcoesAutoComplete = () => {
  const opcoes = document.querySelector('[data-content="area-consultas"]').querySelectorAll('.content');
  
  const tags = new Array();
  const titulos = new Array();
  const elementos = new Array();
  const sistemas = new Array();
  
  opcoes.forEach((opcao, index) => {
    // !tags.includes(opcao.querySelector('.content-tag').textContent)? tags.push(opcao.querySelector('.content-tag').textContent) : '';
    titulos.push(opcao.querySelector('h5').textContent);
    elementos.push(opcao);
    // !sistemas.includes(opcao.querySelector('.content-principal').querySelector('span').textContent)? sistemas.push(opcao.querySelector('.content-principal').querySelector('span').textContent) : '';
  })
  
  const form = document.querySelector('form[data-form="pesquisa"]');
  
  new Array().concat(tags, titulos, sistemas).forEach((elemento, index) => {
    form.querySelector('datalist').innerHTML += `<option value="${elemento}"><option>`;
  })

  const verificarSeValorExiste = (valor) => {
    const resultados = new Array();
    new Array().concat(tags, titulos, sistemas).forEach((elemento, index) => {
      if(elemento.substr(0, (valor.trim().length)).toLowerCase() == valor.toLowerCase().trim()){
        const e = elementos[index]
        resultados.push({ tag: e.querySelector('.content-tag').textContent.toLowerCase(), titulo: e.querySelector('h5').textContent, sistema: e.querySelector('.content-principal').querySelector('span').textContent, link: e.href });
      }
    })
    return resultados;
  }
  
  const pesquisaConteudo = (evento) => {
    evento.preventDefault();
    const input = evento.target.closest('div').querySelector('input');
    const pesquisado = input.value.trim();
    const area_consultas = document.querySelector('[data-content="area-consultas"]');
    
    if(isEmpty(pesquisado)){
      input.focus();
      renderConteudosPagina(area_consultas, ordernarString(conteudos.consultas), 'consultas');
    }else{
      const resultados = verificarSeValorExiste(pesquisado);
      if(isEmpty(resultados)){
        area_consultas.innerHTML = '';
        // console.log('Sem resultados!');
        area_consultas.innerHTML += `<h5 class="text-muted titulo-consultas">Resultados para "${pesquisado}"</h5><div class="alert alert-secondary">Nenhum resultado foi encontrado para a sua busca.</div>`
      }else{
        renderConteudosPagina(area_consultas, resultados, 'consultas', `Resultados para "${pesquisado}"`);
      }
    }
  }
  window.pesquisaConteudo = pesquisaConteudo;
}

function renderConteudosPagina(area_elementos, elementos, objeto, caso){
  const tags = new Array();
  let conteudos_tag = new Array();
  area_elementos.innerHTML = '';
  
  elementos.forEach(e => {
    if(!tags.includes(e.tag) && !isEmpty(e.tag)){
      tags.push(e.tag);
    }
  })
  
  tags.sort((a, b) => a.localeCompare(b)) .forEach(tag => {
    conteudos_tag.push(elementos.filter(e => e.tag == tag))
  })
  
  if(!isEmpty(caso)){
    conteudos_tag = [elementos];
  }

  conteudos_tag.forEach((conteudo_tag, index) => {
    const titulo = document.createElement('h5');
    titulo.classList.value = `titulo-${objeto} text-muted`;
    if(!isEmpty(caso)){
      titulo.appendChild(document.createTextNode(`${(caso)}`));
    }else{
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
        link.setAttribute('href', `${origin}/assets/css/cores-${theme}.css`);
      }
    })
  } else { 
    $('html').attr('data-bs-theme', 'normal');
  }
}

const setAutocomplete = (autocomplete) => {
  if (autocomplete === true) {
    $('input, textarea').attr('autocomplete', 'on');
  } else {
    $('input, textarea').attr('autocomplete', 'off');
  }
}

export {
  edicaoInputNome,
  atualizarNumerosProponentes,
  edicaoInputCPF,
  edicaoInputEmail,
  edicaoInputData,
  edicaoTextAreaRelatorio,
  edicaoTextAreaPendencias,
  edicaoTextAreaRestricoes,
  adicionarOpcoesAutoComplete,
  renderConteudosPagina,
  setTheme,
  setAutocomplete
}