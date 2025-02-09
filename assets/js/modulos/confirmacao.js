import {isEmpty, limparEFocar} from "./utilitarios.js";

export {
    verificacao
}

// Array com chaves para download de arquivos
const conteudos = [
    {conteudo: 'Relatório', attr: '1Kag8jI9LcxlPqQ0kfZWst2vdJZxqKGbE'},
    {conteudo: 'Tabela de Apuração', attr: '1KgxJDvJ8kQTj4pbFsm-QU07jiK1y3pqC'},
    {conteudo: 'Capa', attr: '1KhLItphiOYq_7tifvPkHIY9BWLwO0zht'},
    {conteudo: 'Ateste', attr: '1Khdf60TPOtAcqVOdXv4wd7z5lID7T-wO'},
    {conteudo: 'Validação de Pesquisa', attr: '1KXflnhCgrQ3BRFqC6mtyP94IbX51bMA-'},
    {conteudo: 'Checklist', attr: '1KcCOWhqkAiZQpAk60K02cpjS2RgSBOGS'},
    {
        conteudo: 'Carta de Descontinuidade de Renda',
        link: {
            "target": window.location.hostname === "gabriersdev.github.io" ? "https://gabriersdev.github.io/cca/assets/docs/Carta_de_Descontinuidade_de_Renda.pdf" : "/assets/docs/Carta_de_Descontinuidade_de_Renda.pdf",
            "rel": "noopener noreferrer"
        }
    },
    {
        conteudo: 'Carta de Cancelamento',
        link: {
            "target": window.location.hostname === "gabriersdev.github.io" ? "https://gabriersdev.github.io/cca/assets/docs/Carta_de_Cancelamento.pdf" : "/assets/docs/Carta_de_Cancelamento.pdf",
            "rel": "noopener noreferrer"
        }
    },
    {
        conteudo: 'Declaração de Estado Civil',
        link: {
            "target": window.location.hostname === "gabriersdev.github.io" ? "https://gabriersdev.github.io/cca/assets/docs/Declaracao_de_Estado_Civil.pdf" : "/assets/docs/Declaracao_de_Estado_Civil.pdf",
            "rel": "noopener noreferrer"
        }
    },
]

export const id_arquivos = {conteudos}

function verificacao(evento, elemento, referencia) {
    evento.preventDefault();
    const input = elemento.parentElement.querySelectorAll('input')[0];

    let encrypted = CryptoJS.AES.encrypt(elemento.parentElement.querySelector('#senha-arquivo').value, "ZX5I8Q9HUWMQP0VD3I379CSUCC9Q9T");

    let descrypted = CryptoJS.AES.decrypt(encrypted, "ZX5I8Q9HUWMQP0VD3I379CSUCC9Q9T");
    let visible = descrypted.toString(CryptoJS.enc.Utf8);

    try {
        const attr = conteudos.find(e => e.conteudo == referencia);
        let download_id = null;
        if (!isEmpty(attr)) {
            download_id = attr.attr;
        }

        if (!isEmpty(visible) && typeof (visible) === 'string' && visible.length >= 6 && visible.length <= 8) {
            if (visible.slice(0)[0] == '0' && visible.slice(0)[1] == '6' && visible.slice(0)[2] == '3' && visible.slice(0)[3] == '7' && visible.slice(0)[4] == '6' && visible.slice(0)[5] == '3' && visible.slice(0)[6] == '7') {
                feedback(elemento, 'btn btn-success mt-3', 'Tudo certo!');
                setTimeout(() => {
                    const modal = document.querySelector('#modal-confirmar-senha');
                    $(modal).modal('hide');
                    if (!isEmpty(download_id)) {
                        window.open(`https://drive.google.com/uc?export=download&id=${download_id}`, '_blank', 'noopener noreferrer nofollow');
                    } else if (conteudos.find(e => e.conteudo == referencia).link) {
                        console.log(window.location.origin, conteudos.find(e => e.conteudo == referencia).link.target)
                        window.open(`${window.location.origin + conteudos.find(e => e.conteudo == referencia).link.target}`, '_blank', 'noopener noreferrer nofollow');
                    }
                }, 450);
            } else {
                feedback(elemento, 'btn btn-danger mt-3', 'Oops... senha incorreta!');
            }
        } else {
            feedback(elemento, 'btn btn-danger mt-3', 'Oops... senha incorreta!');
        }
    } catch (erro) {
        feedback(elemento, 'btn btn-danger mt-3', 'Oops... ocorreu um erro!');
    }

    limparEFocar(input);
}

function feedback(elemento, classe, HTML) {
    elemento.setAttribute('class', classe);
    elemento.innerHTML = HTML;

    setTimeout(() => {
        elemento.setAttribute('class', 'btn btn-outline-primary mt-3');
        elemento.innerHTML = 'Enviar';
    }, 500);
}