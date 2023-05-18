import { isEmpty } from "./utilitarios.js";

const accordion_item = (indice) => {
  !isEmpty(indice) ? indice = document.querySelectorAll('.accordion-item').length + 1 : '';
  const conteudo = `<div data-identify="${indice}"> <h2 class="accordion-header"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${indice}" aria-expanded="${indice == 1? 'true' : 'false'}" aria-controls="panelsStayOpen-collapse${indice}"> <span>Proponente ${indice} - <b data-content="nome">Nome do cliente</b></span> </button> </h2> <div id="panelsStayOpen-collapse${indice}" class="accordion-collapse collapse ${indice == 1 ? 'show' : ''}"> <div class="accordion-body"> <div class="card-body"> <div class="card-body-header d-flex justify-content-between align-items-center mt-2 mb-4"> <b class="" data-content="nome">Nome do cliente</b> <div> <button class="btn btn-outline-secondary" data-action="remover-proponente">Remover proponente</button> <button class="btn btn-outline-primary" data-download="baixar-dados" onclick="clickDownload(this)" data-toggle="tooltip" data-placement="top" title="Baixar" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="form-floating mt-2 mb-1"> <input type="text" class="form-control" placeholder="Nome" data-element="input" data-input="nome" required> <label for="floatingInput">Nome</label> </div> <div class="row mt-2 mb-1"> <div class="col"> <div class="form-floating invalido"> <input type="text" class="form-control" placeholder="123.456.789-09" data-element="input" data-input="cpf" required> <label for="floatingInput">CPF <span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> </div> </div> <div class="col"> <div class="form-floating invalido"> <input type="text" class="form-control" placeholder="01/01/2000" data-element="input" data-input="data_nascimento" required> <label for="floatingInput">Data de Nascimento&nbsp;<span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> </div> </div> </div> <div class="row mt-2 mb-1"> <div class="col-sm-7"> <div class="form-floating invalido"> <input type="email" class="form-control" placeholder="name@example.com" data-element="input" data-input="email" required> <label for="floatingInput">E-mail <span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> </div> </div> <div class="col"> <div class="form-floating"> <input type="tel" class="form-control" placeholder="(31) 99999-9999" data-element="input" data-input="telefone" required> <label for="floatingInput">Telefone</label> </div> </div> </div> <div class="mb-2"> <br><b>Endereço</b> <div class="input-group mt-2 mb-2"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="endereco" required> </div> <input type="text" list="tipos-comprovantes-endereco" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Endereço" data-element="input" data-input="tipo_endereco"> <datalist name="" id="tipos-comprovantes-endereco"> <option value="Fatura de serviço"></option> <option value="Boleto de cobrança"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Outro"></option> </datalist> <!-- <button class="input-group-text btn btn-outline-secondary"><i class="bi bi-trash"></i></button> --> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-renda-valido" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="endereco_valido" required> <label for="comprovante-renda-valido" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de endereço é válido para a análise de crédito quando ele foi emitido a partir do últimos 3 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div> </div> <span class="text-muted" data-content="feedback-endereco"></span> </div> <div class="mb-2" data-element="secao_rendas"> <br><b>Renda</b> <div data-element="area_rendas"><div class="input-group mt-2 mb-2" data-element="renda"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda" required> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> </datalist> <button class="input-group-text btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-endereco-valido-${indice}" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda_valida" required> <label for="comprovante-endereco-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div></div> </div><button class="btn btn-outline-secondary" data-action="incluir_renda" onclick="clickIncluirRenda(this)">Incluir renda</button> <span class="text-muted d-block mt-2" data-content="feedback-renda"></span> </div> <br> <div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="comprovante-de-estado-civil-enviado" data-element="input" data-input="comprovante_estado_civil" required><label class="form-check-label" for="comprovante-de-estado-civil-enviado" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante de Estado Civil" data-bs-content="Certidão de Casamento, de Nascimento ou União Estável.">Enviou Comprovante de Estado Civil&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div><div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="possui-fgts-e-usara" data-element="input" data-input="fgts"><label class="form-check-label" for="possui-fgts-e-usara" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Uso de FGTS" data-bs-content="Verificar as regras para a utilização do benefício conforme o produto.">Possui 36 meses de FGTS, poderá e irá fazer uso&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div> </div> </div> </div> </div>`;
  return conteudo;
}

const secao_rendas = (indice) => {
  return `<div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda" required> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> </datalist> <button class="input-group-text btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-renda-valido-${indice}" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda_valida" required> <label for="comprovante-renda-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div>`
};

const consultas = [
  { tag: 'cadastro', titulo: 'Pesquisa Cadastral', sistema: 'SICAQ', link: 'https://caixaaqui.caixa.gov.br/caixaaqui/CaixaAquiController' }, 
  { tag: 'cadastro', titulo: 'CNIS', sistema: 'INSS', link: 'https://cnisnet.inss.gov.br/' },
  { tag: 'cadastro', titulo: 'Restitução IRPF', sistema: 'Receita Federal', link: 'https://www.restituicao.receita.fazenda.gov.br/' },
  { tag: 'cadastro', titulo: 'Simulador SIOPI', sistema: 'SIOPI', link: 'https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true' },
  { tag: 'cadastro', titulo: 'Simulador Portal', sistema: 'Portal de Empreendimentos', link: 'https://www.portaldeempreendimentos.caixa.gov.br/simulador/' },
  { tag: 'cadastro', titulo: 'Busca CEP', sistema: 'Correios', link: 'xxxx.xa.x' }, 
  { tag: 'cadastro', titulo: 'Situação Cadastral', sistema: 'Receita Federal', link: 'https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp' },
  { tag: 'cadastro', titulo: 'CND Pessoa Física', sistema: 'Receita Federal', link: 'https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pf/emitir/' },
  { tag: 'cadastro', titulo: 'CND Pessoa Jurídica', sistema: 'Receita Federal', link: 'https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pj/emitir/' },
  { tag: 'dossiê', titulo: 'CIWEB', sistema: 'Portal', link: '#' },
  { tag: 'dossiê', titulo: 'CADMUT', sistema: 'SICDM', link: 'https://www.cadastromutuarios.caixa.gov.br/' },
  { tag: 'dossiê', titulo: 'Consulta FGTS', sistema: 'SIOPI', link: 'https://habitacao.caixa.gov.br/siopiweb-web/siopientrada.do' },
  { tag: 'dossiê', titulo: 'FGTS', sistema: 'CIWEB', link: 'https://www.ciweb.caixa.gov.br/sso/' },
  { tag: 'dossiê', titulo: 'Conformidade', sistema: 'SICTD', link: 'https://digitalizar.caixa.gov.br/sictd-digitalizar/' },
]

const rodape = ` <div class="container"> <footer class="pt-4 my-md-5 pt-md-5 border-top"> <div class="row"> <div class="col-12 col-md"> <small class="d-block text-muted">Desenvolvido por</small> <a href="" data-link="github-dev"><h5 class="bold">Gabriel Ribeiro</h5></a><br> <small class="d-block text-muted">&copy; <span data-ano-atual=''>2023</span></small> <small class="d-block mb-3 text-muted">Todos os direitos reservados.</small> </div> <div class="col-6 col-md"> <h5>Recursos</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="confirmacao">Confirmação</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="consultas">Consultas</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Navegação</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="confirmacao">Confirmação</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="consultas">Consultas</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Sobre</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-dev">Desenvolvedor</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-projeto">GitHub</a></li> </ul> </div> </div> </footer><br> </div>`;

const conteudo_pagina_confirmacao = `<div class="container mt-5"> <hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Confirmação <br> de dados</h3><div class="hgroup-acoes"><button type="button" class="btn btn-light">Exportar&nbsp;<i class="bi bi-file-earmark-arrow-up"></i></button><button type="button" class="btn btn-light">Importar&nbsp;<i class="bi bi-file-earmark-arrow-down"></i></button>&nbsp;<button class="btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="Limpar" data-action="limpar-processo"><i class="bi bi-arrow-clockwise"></i></button></div></hgroup> <div class="card" data-node="card"> <div class="card-header d-flex justify-content-between align-items-center"> <b>Resumo</b> <button class="btn btn-outline-secondary" data-action="copiar" data-toggle="tooltip" data-placement="top" title="Copiar" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button> </div> <div class="card-body" data-content="resumo" data-copiar="texto"> ### Processo iniciado em 00/00/0000, com 3 proponentes: Nome Proponente 1, Nome Proponente 2 e Nome Proponente 2. ### </div> </div><br> <div class="accordion" id="accordionPanelsStayOpenExample"> </div> <button class="btn btn-primary mt-3" data-action="incluir-proponente">Incluir proponente</button> </div> <div class="container mb-5"> <div class="mt-1 mb-2" data-node="card"> <br> <div class="d-flex align-items-center justify-content-between"> <b>Relatório</b> <div> <button class="btn btn-outline-secondary" data-action="copiar" data-toggle="tooltip" data-placement="top" title="Copiar" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button> <button class="btn btn-outline-primary" data-download="baixar-relatorio" onclick="clickDownload(this)" data-toggle="tooltip" data-placement="top" title="Baixar" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="input-group mt-2 mb-2"> <div class="form-floating"> <textarea class="form-control" placeholder="Observações sobre o processo" id="floatingTextarea-1" style="height: 100px" data-element="input" data-content="relatorio" data-copiar="texto"></textarea> <label for="floatingTextarea-1">Observações sobre o processo</label> </div> </div> </div> <div class="mt-1 mb-2" data-node="card"> <br> <div class="d-flex align-items-center justify-content-between"> <b>Pendências</b> <div> <button class="btn btn-outline-secondary" data-action="copiar" data-toggle="tooltip" data-placement="top" title="Copiar" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button> <button class="btn btn-outline-primary" data-download="baixar-pendencias" onclick="clickDownload(this)" data-toggle="tooltip" data-placement="top" title="Baixar" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="input-group mt-2 mb-2"> <div class="form-floating"> <textarea class="form-control" placeholder="Pendências" id="floatingTextarea-2" style="height: 100px" data-element="input" data-content="pendencias" data-copiar="texto"></textarea> <label for="floatingTextarea-2">Documentos e informações pendentes</label> </div> </div> <span class="text-muted">Preenchido automaticamente. Você pode editar.</span> </div> </div>`;

const conteudo_pagina_consultas = `<div class="container mt-5 mb-5"><hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Consultas</h3></hgroup><div class="card"><div class="card-header"><b>Consultas</b></div><div class="card-body"><div data-content="area-consultas"></div></div></div></div>`;

const conteudo_pagina_arquivos = `<div class="container mt-5 mb-5"><hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Arquivos</h3></hgroup><div class="card"><div class="card-header"><b>Arquivos</b></div><div class="card-body"><div data-content="area-arquivos"></div></div></div></div>`;

export const conteudos = {
  accordion_item,
  secao_rendas,
  consultas,
  rodape,
  conteudo_pagina_confirmacao,
  conteudo_pagina_consultas,
  conteudo_pagina_arquivos
}