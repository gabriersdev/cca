import { isEmpty } from "./utilitarios.js";

// Array com opções de fácil seleção
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

// Array com dados de links que serão usados no sistema
const consultas = [
  {
    "tag": "cadastro",
    "titulo": "Pesquisa Cadastral",
    "sistema": "SICAQ",
    "link": "https://caixaaqui.caixa.gov.br/caixaaqui/CaixaAquiController"
  },
  {
    "tag": "cadastro",
    "titulo": "CNIS",
    "sistema": "INSS",
    "link": "https://cnisnet.inss.gov.br/"
  },
  {
    "tag": "cadastro",
    "titulo": "Restitução IRPF",
    "sistema": "Receita Federal",
    "link": "https://www.restituicao.receita.fazenda.gov.br/"
  },
  {
    "tag": "cadastro",
    "titulo": "Simulador SIOPI",
    "sistema": "SIOPI",
    "link": "https://www8.caixa.gov.br/siopiinternet-web/simulaOperacaoInternet.do?method=inicializarCasoUso&isVoltar=true"
  },
  {
    "tag": "cadastro",
    "titulo": "Simulador Portal",
    "sistema": "Portal de Empreendimentos",
    "link": "https://www.portaldeempreendimentos.caixa.gov.br/simulador/"
  },
  {
    "tag": "cadastro",
    "titulo": "Busca CEP",
    "sistema": "Correios",
    "link": "https://buscacepinter.correios.com.br/app/endereco/index.php"
  },
  {
    "tag": "cadastro",
    "titulo": "Situação Cadastral",
    "sistema": "Receita Federal",
    "link": "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp"
  },
  {
    "tag": "cadastro",
    "titulo": "CND Pessoa Física",
    "sistema": "Receita Federal",
    "link": "https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pf/emitir/"
  },
  {
    "tag": "cadastro",
    "titulo": "CND Pessoa Jurídica",
    "sistema": "Receita Federal",
    "link": "https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pj/emitir/"
  },
  {
    "tag": "cadastro",
    "titulo": "CIWEB",
    "sistema": "Portal",
    "link": "https://www.portaldeempreendimentos.caixa.gov.br/sso/menu"
  },
  {
    "tag": "cadastro",
    "titulo": "CADMUT",
    "sistema": "SICDM",
    "link": "https://www.cadastromutuarios.caixa.gov.br/"
  },
  {
    "tag": "cadastro",
    "titulo": "Consulta CNPJ",
    "sistema": "Receita Federal",
    "link": "https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp"
  },
  {
    "tag": "dossiê",
    "titulo": "Consulta FGTS",
    "sistema": "SIOPI",
    "link": "https://habitacao.caixa.gov.br/siopiweb-web/siopientrada.do"
  },
  {
    "tag": "dossiê",
    "titulo": "FGTS",
    "sistema": "CIWEB",
    "link": "https://www.ciweb.caixa.gov.br/sso/"
  },
  {
    "tag": "dossiê",
    "titulo": "Conformidade",
    "sistema": "SICTD",
    "link": "https://digitalizar.caixa.gov.br/sictd-digitalizar/"
  },
  {
    "tag": "útil",
    "titulo": "Calculadora IRRF",
    "sistema": "iDinheiro",
    "link": "https://www.idinheiro.com.br/calculadoras/calculadora-imposto-de-renda/"
  },
  {
    "tag": "útil",
    "titulo": "Calculadora INSS",
    "sistema": "iDinheiro",
    "link": "https://www.idinheiro.com.br/calculadoras/calculadora-inss/"
  },
  {
    "tag": "útil",
    "titulo": "Tempo de Serviço",
    "sistema": "GitHub",
    "link": "https://gabrieszin.github.io/calculadora-tempo-de-servico/"
  },
  {
    "tag": "útil",
    "titulo": "Municípios RMBH",
    "sistema": "Agência RMBH",
    "link": "http://www.agenciarmbh.mg.gov.br/mapa-conheca-os-municipios/"
  }
];

Object.seal(consultas);

// Array com dados de arquivos que serão usados no sistema
const arquivos = [
  {
    "tag": "cadastro",
    "titulo": "Relatório",
    "sistema": "Word",
    "link": "Relatório"
  },
  {
    "tag": "cadastro",
    "titulo": "Tabela de Apuração",
    "sistema": "Excel",
    "link": "Tabela de Apuração"
  },
  {
    "tag": "dossiê",
    "titulo": "Capa",
    "sistema": "Word",
    "link": "Capa"
  },
  {
    "tag": "dossiê",
    "titulo": "Ateste",
    "sistema": "Word",
    "link": "Ateste"
  },
  {
    "tag": "dossiê",
    "titulo": "Checklist",
    "sistema": "Word",
    "link": "Checklist"
  },
  {
    "tag": "validação",
    "titulo": "Validação de Pesquisa",
    "sistema": "Word",
    "link": "Validação de Pesquisa"
  }
];

Object.seal(arquivos);

const accordion_item = (indice) => {
  !isEmpty(indice) ? indice = document.querySelectorAll('.accordion-item').length + 1 : '';
  const conteudo = `<div data-identify="${indice}"> <h2 class="accordion-header"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${indice}" aria-expanded="${indice == 1? 'true' : 'false'}" aria-controls="panelsStayOpen-collapse${indice}"> <span>Proponente ${indice} - <b data-content="nome" data-information="nome-proponente">Nome do cliente</b></span> </button> </h2> <div id="panelsStayOpen-collapse${indice}" class="accordion-collapse collapse ${indice == 1 ? 'show' : ''}"> <div class="accordion-body"> <div class="card-body"> <div class="card-body-header d-flex justify-content-between align-items-center mt-2 mb-4"> <b class="" data-content="nome">Nome do cliente</b> <div> <button class="btn btn-secondary" data-action="remover-proponente">Remover proponente</button> <button class="btn btn-primary" data-download="baixar-dados" onclick="clickDownload(this, event)" data-toggle="tooltip" data-placement="top" title="Baixar" type="button" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="form-floating mt-3 mb-1" data-node="card"> <input type="text" class="form-control" placeholder="Nome" maxlength="75" data-element="input" data-input="nome" data-copiar="texto" id="input-nome-${indice}" required> <label for="input-nome-${indice}">Nome</label> <button class="" data-action="copiar" type="button" data-toggle="tooltip" data-placement="top" title="Copiar" onclick="acaoClickCopiar(this)" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button></div> <div class="row mt-3 mb-1"> <div class="col"> <div class="form-floating invalido" data-node="card"> <input type="text" class="form-control" placeholder="01/01/2000" data-element="input" data-input="data_nascimento" data-copiar="texto" id="input-data-nasc-${indice}" name="input-data-nasc-${indice}" required> <label for="input-data-nasc-${indice}">Data de Nascimento&nbsp;<span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> <button class="" data-action="copiar" type="button" data-toggle="tooltip" data-placement="top" title="Copiar" onclick="acaoClickCopiar(this)" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button></div> </div> <div class="col"> <div class="form-floating invalido" data-node="card"> <input type="text" class="form-control" placeholder="123.456.789-09" data-element="input" data-input="cpf" data-copiar="texto" id="input-CPF-${indice}" name="input-CPF-${indice}" required> <label for="input-CPF-${indice}">CPF <span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> <button class="" data-action="copiar" type="button" data-toggle="tooltip" data-placement="top" title="Copiar" onclick="acaoClickCopiar(this)" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button></div> </div> </div> <div class="row mt-3 mb-1"> <div class="col-sm-7"> <div class="form-floating invalido"> <input type="email" class="form-control" placeholder="name@example.com" data-element="input" data-input="email" id="input-email-${indice}" name="input-email-${indice}" required> <label for="input-email-${indice}">E-mail <span class="feedback_dado"><i class="bi bi-x-circle"></i>&nbsp;Inválido</span></label> </div> </div> <div class="col"> <div class="form-floating"> <input type="tel" class="form-control" placeholder="(31) 99999-9999" data-element="input" data-input="telefone" id="input-telefone-${indice}" name="input-telefone-${indice}" required> <label for="input-telefone-${indice}">Telefone</label> </div> </div> </div> <div class="mb-2"> <br><b>Endereço</b> <div class="input-group mt-3 mb-2"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Comprovante de endereço" data-element="input" data-input="endereco" id="endereco-cli-${indice}" name="endereco-cli-${indice}" required> </div> <input type="text" list="tipos-comprovantes-endereco" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Endereço" data-element="input" data-input="tipo_endereco" id="tipo-endereco-cli-${indice}" name="tipo-endereco-cli-${indice}"> <datalist name="" id="tipos-comprovantes-endereco"> <option value="Fatura de serviço"></option> <option value="Boleto de cobrança"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Outro"></option> </datalist> <!-- <button class="input-group-text btn btn-secondary"><i class="bi bi-trash"></i></button> --> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-renda-valido" type="checkbox" value="" aria-label="Comprovante de renda" data-element="input" data-input="endereco_valido" required> <label for="comprovante-renda-valido" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de endereço é válido para a análise de crédito quando ele foi emitido a partir do últimos 3 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div> </div> <span class="text-muted" data-content="feedback-endereco"></span> </div> <div class="mb-2" data-element="secao_rendas"> <br><b class="d-block mb-1">Renda</b> <div data-element="area_rendas"><div class="input-group mt-2 mb-2" data-element="renda"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Comprovante de renda" data-element="input" data-input="renda" id="comp-renda-cli-${indice}" name="comp-renda-cli-${indice}" required> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda" id="tipo-renda-cli-${indice}" name="tipo-renda-cli-${indice}"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> <option value="Renda informal"></option> </datalist> <button class="input-group-text btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-endereco-valido-${indice}" type="checkbox" value="" aria-label="Comprovante de endereço" data-element="input" data-input="renda_valida" required> <label for="comprovante-endereco-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div></div> </div><button class="btn btn-secondary" data-action="incluir_renda" onclick="clickIncluirRenda(this)">Incluir renda</button> <span class="text-muted d-block mt-3" data-content="feedback-renda"></span> </div> <br> <div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="comprovante-de-estado-civil-enviado" data-element="input" data-input="comprovante_estado_civil" required><label class="form-check-label" for="comprovante-de-estado-civil-enviado" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante de Estado Civil" data-bs-content="Certidão de Casamento, de Nascimento ou União Estável.">Enviou Comprovante de Estado Civil&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div><div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="possui-fgts-e-usara" data-element="input" data-input="fgts"><label class="form-check-label" for="possui-fgts-e-usara" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Uso de FGTS" data-bs-content="Verificar as regras para a utilização do benefício conforme o produto.">Possui 36 meses de FGTS, poderá e irá fazer uso&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div> </div> </div> </div> </div>`;
  return conteudo;
}

const secao_rendas = (indice) => {
  return `<div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Comprovante de renda" data-element="input" data-input="renda" id="comp-renda-cli-${indice}" name="comp-renda-cli-${indice}" required> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Comprovante de renda" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda" id="tipo-renda-cli-${indice}" name="tipo-renda-cli-${indice}"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> </datalist> <button class="input-group-text btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-renda-valido-${indice}" type="checkbox" value="" aria-label="Comprovante de renda" data-element="input" data-input="renda_valida" required> <label for="comprovante-renda-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div>`
};

const rodape = `<div class="container"> <footer class="pt-4 my-md-5 pt-md-5 border-top"> <div class="row"> <div class="col-12 col-md"> <small class="d-block text-muted">Desenvolvido por</small> <a href="" data-link="github-dev"><h5 class="bold">Gabriel Ribeiro</h5></a><br> <small class="d-block text-muted">&copy; <span data-ano-atual=''>2023</span></small> <small class="d-block mb-3 text-muted">Todos os direitos reservados.</small> </div> <div class="col-6 col-md"> <h5>Recursos</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="confirmacao">Confirmação</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="consultas">Consultas</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="arquivos">Arquivos</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="desligamento">Desligamento</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Navegação</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="confirmacao">Confirmação</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="consultas">Consultas</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="arquivos">Arquivos</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" rel="noreferrer noopener" href="#" data-link="desligamento">Desligamento</a></li> </ul> </div> <div class="col-6 col-md"> <h5>Sobre</h5><br> <ul class="list-unstyled text-small"> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-dev">Desenvolvedor</a></li> <li class="mb-1"><a class="link-secondary text-decoration-none" href="#" data-link="github-projeto">GitHub</a></li> </ul> </div> </div> </footer><br> </div>`;

const html_funcoes_nao_implementadas = `
<button type="button" class="btn btn-light">Exportar&nbsp;<i class="bi bi-file-earmark-arrow-up"></i></button><button type="button" class="btn btn-light">Importar&nbsp;<i class="bi bi-file-earmark-arrow-down"></i></button>&nbsp;&nbsp;<button class="btn btn-danger mt-3" data-action="incluir-vendedor">Incluir vendedor</button>
`;

const checklistAnaliseInternalizada = `<div class="card mt-3"><div class="card-header">Checklist</div><div class="card-body d-block"><form data-form="checklist-analise-internalizada"><div class="form-group"><input type="checkbox" class="form-check-input" id="item-checklist-1">&nbsp;<label for="item-checklist-1">Renda embasada e comprovada</label></div><div class="form-group"><input type="checkbox" class="form-check-input" id="item-checklist-2">&nbsp;<label for="item-checklist-2">Ocupação e atividade laboral informada</label></div><div class="form-group"><input type="checkbox" class="form-check-input" id="item-checklist-3">&nbsp;<label for="item-checklist-3">Simulação correta e conferida</label></div></form></div></div></div>`;

const conteudo_pagina_confirmacao = `
<div class="container mt-5"> <hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Confirmação <br> de dados</h3><div class="hgroup-acoes"><button class="btn btn-info" data-action="exibir-informacoes" data-toggle="tooltip" data-placement="top" title="Informações" type="button" data-bs-custom-class="custom-tooltip"><i class="bi bi-info-circle"></i></button><button class="btn btn-secondary" data-action="enviar-dados" data-toggle="tooltip" data-placement="top" title="Enviar dados para capa" type="button" data-bs-custom-class="custom-tooltip"><small>-></small><i class="bi bi-file-earmark-binary-fill"></i></button><button class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Limpar" data-action="limpar-processo"><i class="bi bi-arrow-clockwise"></i></button></div></hgroup> <div class="card" data-node="card"> <div class="card-header d-flex justify-content-between align-items-center"> <b>Resumo</b> <div><button class="btn btn-secondary" data-action="copiar" type="button" data-toggle="tooltip" data-placement="top" title="Copiar" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button> <button class="btn btn-secondary" data-action="copiar" data-action-target="copiar-nomes" type="button" data-toggle="tooltip" data-placement="top" title="Copiar nome(s)" data-bs-custom-class="custom-tooltip">N_</button></div> </div> <div class="card-body" data-content="resumo" data-copiar="texto"> ### Processo iniciado em 00/00/0000, com 3 proponentes: Nome Proponente 1, Nome Proponente 2 e Nome Proponente 2. ### </div> </div><br> <div class="accordion" id="accordionPanelsStayOpenExample"> </div> <button class="btn btn-primary mt-3" data-action="incluir-proponente">Incluir proponente</button> </div> <div class="container mb-5"> <form class="mt-1 mb-2" data-node="card" data-element="area-relatorio"> <br> <div class="d-flex align-items-center justify-content-between"> <div><b>Relatório</b>&nbsp;<button class="ms-1 btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Add. dados" data-action="add-informacoes" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-text"></i></button>&nbsp;<button class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Add. devolução do FID" data-action="add-devolucao-fid"><i class="bi bi-chat-square-text-fill"></i></button><button type="button" class="ms-1 btn btn-secondary"  data-toggle="tooltip" data-placement="top" title="Calcular percentual" data-action="calcular-percentual" data-bs-custom-class="custom-tooltip" data-bs-target="#modal-calcular-percentual" data-bs-toggle="modal" ><i class="bi bi-calculator-fill"></i></button>&nbsp;</div> <div> <button type="reset" class="btn btn-info" data-toggle="tooltip" data-placement="left" title="Limpar tudo nesta seção" data-action="limpar-tudo-secao"><i class="bi bi-arrow-clockwise"></i></button> <button type="reset" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Limpar"><i class="bi bi-arrow-clockwise"></i></button>&nbsp;<button class="btn btn-secondary" data-action="copiar" data-toggle="tooltip" data-placement="top" title="Copiar" type="button" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button>&nbsp;<button class="btn btn-primary" data-download="baixar-relatorio" type="button" onclick="clickDownload(this, event)" data-toggle="tooltip" data-placement="top" title="Baixar" type="button" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="input-group mt-2 mb-2"> <div class="" style="width: 100%"> <textarea class="form-control" placeholder="Observações sobre o processo" id="textarea-1" style="height: 100px; width: 100% !important" data-element="input" data-content="relatorio" data-copiar="texto" spellcheck="true"></textarea> </div> </div> </form> <form class="mt-1 mb-2" data-node="card" data-element="area-pendencias"> <br> <div class="d-flex align-items-center justify-content-between"> <b>Pendências</b> <div> <button class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Carregar pendências" data-action="carregar-pendencias"><i class="bi bi-robot"></i></button> <button type="reset" ondblclick="listarProponentesPendencias()" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="Limpar"><i class="bi bi-arrow-clockwise"></i></button>&nbsp;<button class="btn btn-secondary" data-action="copiar" type="button" data-toggle="tooltip" data-placement="top" title="Copiar" data-bs-custom-class="custom-tooltip"><i class="bi bi-clipboard"></i></button> <button class="btn btn-primary" data-download="baixar-pendencias" type="button" onclick="clickDownload(this, event)" data-toggle="tooltip" data-placement="top" title="Baixar" type="button" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="input-group mt-2 mb-2"> <div class="" style="width: 100%"> <textarea class="form-control" placeholder="Pendências" id="textarea-2" style="height: 100px; width: 100% !important" data-element="input" data-content="pendencias" data-copiar="texto" spellcheck="true"></textarea> </div> </div> <span class="text-muted">Preenchido automaticamente. Você pode editar.</span> </form><br> <form class="mt-1 mb-2"><div class="card"><div class="card-header d-flex justify-content-between align-items-center"><b>Acompanhar o FID</b></div><div class="card-body"><div class="input-group"><label for="input-URL-acompanhar-FID" class="input-group-text" style="border-color: #A7ACB1; border-style: dashed;">Link</label><input type="URL" data-element="input-URL-acompanhar-FID" name="input-URL-acompanhar-FID" id="input-URL-acompanhar-FID" class="form-control" style="border-color: #A7ACB1; border-style: dashed;" required><button class="btn btn-secondary" type="submit" style="border-color: #A7ACB1;" data-toggle="tooltip" data-placement="top" title="Baixar" data-download="baixar-acompanhar-fid" onclick="clickDownload(this, event)"><i class="bi bi-file-arrow-down"></i></button></div><div class="" data-element="retorno-link-fid"></div></div></div></form><section class="card mt-4 mb-4" data-content="secao-controlada"><div class="card-header d-flex justify-content-between align-center"><b>Análise Internalizada</b><span class="text-muted span">Clique para abrir</span></div><div class="card-body none"><div class="info alert alert-secondary">Rascunho para enviar processo para internalização</div><form action="" method="GET" data-form="analise-internalizada" class="form-btn-copy-float"><button type="button" class="btn-copy-float"><i class="bi bi-clipboard2"></i></button><textarea data-form="conteudo-texto" style="height: calc(30 * 1rem)" id="conteudo-texto" name="conteudo-texto" contenteditable="true" class="form-control">Prezados, bom dia! \n\nGentileza realizar análise de crédito internalizada, [dado(s) do(s) cliente(s)]:\n\n[Sobre o processo]\n\nEmpreendimento: \nValor de compra e venda: \nModalidade: \nTabela de amortização: \nCota: \nPrazo de amortização: \nRenda: \n\n[Dados dos proponentes] \n\n[Renda dos proponentes] \n</textarea></form>${checklistAnaliseInternalizada}</section><!-- Área que os links de fácil acesso serão carregados --><div class="mt-5 links-faceis-confirmacao"></div></div>`;

const conteudo_pagina_consultas = `<main><div class="container mt-5 mb-5"><hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Consultas</h3></hgroup><div class="card"><div class="card-header d-flex align-items-center justify-content-between"><b>Consultas</b><form data-form="pesquisa"><div class="input-group"><input type="search" list="list-pesquisa-pagina-consultas" id="pesquisa-pagina-consultas" name="pesquisa-pagina-consultas" class="form-control" placeholder="Pesquise" required><datalist id="list-pesquisa-pagina-consultas"></datalist><button type="submit" onclick="pesquisaConteudo(event)" class="btn btn-light"><i class="bi bi-search"></i></button></div></form></div><div class="card-body"><div data-content="area-consultas"></div></div></div></div></main>`;

const conteudo_pagina_arquivos = `<div class="container mt-5 mb-5"><hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Arquivos</h3></hgroup><div class="card"><div class="card-header"><b>Arquivos</b></div><div class="card-body"><div data-content="area-arquivos"></div></div></div><div class="card mt-4"><div class="card-header"><b>Links</b></div><div class="card-body"><div data-content="area-arquivos"><div class="arquivos"><a class="content" target="_blank" rel="noreferrer noopener" href="https://gabrieszin.github.io/capa-de-dossies/"><span class="content-tag">Capa</span><div class="content-principal"><h5>Capa de dossiê</h5><span>GitHub</span></div></a><a class="content" target="_blank" rel="noreferrer noopener" href="https://gabrieszin.github.io/ateste-processo/"><span class="content-tag">Capa</span><div class="content-principal"><h5>Ateste</h5><span>GitHub</span></div></a><a class="content" target="_blank" rel="noreferrer noopener" href="https://gabrieszin.github.io/damp/"><span class="content-tag">DAMP</span><div class="content-principal"><h5>Declaração de Enquadramento</h5><span>GitHub</span></div></a></div></div></div></div></div></div>`;

const conteudo_pagina_desligamento = `<main><div class="container mt-5 mb-5"><hgroup class="hgroup" data-hgroup="confirmacao-cca"><h3 class="hgroup-titulo">Desligamento</h3></hgroup><div class="card mb-4"><div class="card-header"><b>Links</b></div><div class="card-body" data-content="area-links"><div class="links"><a class="content" href="https://gabrieszin.github.io/damp/" target="_blank" rel="noreferrer noopener"><span class="content-tag">Desligamento</span><div class="content-principal"><h5>Damp</h5><span>GitHub</span></div></a><a class="content" href="https://gabrieszin.github.io/ateste-processo" target="_blank" rel="noreferrer noopener"><span class="content-tag">Desligamento</span><div class="content-principal"><h5>Ateste</h5><span>GitHub</span></div></a><a class="content" href="https://gabrieszin.github.io/capa-de-dossies" target="_blank" rel="noreferrer noopener"><span class="content-tag">Desligamento</span><div class="content-principal"><h5>Capa de Dossiês</h5><span>GitHub</span></div></a><a class="content" href="https://gabrieszin.github.io/cca/desligamento/checklist-desligamento.html" onclick="event.preventDefault(); window.open(this.href, '_blank', 'width=800, height=1000')" rel="noreferrer noopener"><span class="content-tag">Desligamento</span><div class="content-principal"><h5>Checklist - Acompanhamento do Processo</h5><span>GitHub</span></div></a></div></div></div><div class="card mb-4" style="display: block;"><div class="card-header"><b>Laudo</b></div><div class="card-body"><form data-content="form-laudo" action="#" method="GET" data-action="form-laudo"><div class="form-group"><label for="matricula" class="form-label">Matrícula e Cartório</label><div class="input-group"><input type="text" class="form-control" id="matricula" name="matricula" placeholder="000000" data-input="matricula" data-element="input" required><input type="text" list="lista-cartorios" class="form-control" id="cartorio" name="cartorio" placeholder="Cartório" aria-label="Cartório" data-input="cartorio" data-element="input" required></div><datalist id="lista-cartorios"></datalist></div><div class="form-group"><label for="CEP" class="form-label">CEP</label><input type="text" class="form-control" id="CEP" name="CEP" placeholder="00000-000" data-input="cep" data-element="input" required></div><div class="form-group"><label for="numero-ou-complemento" class="form-label">N.º ou Complemento</label><input type="text" class="form-control" id="numero-ou-complemento" name="numero-ou-complemento" data-input="numero-ou-complemento" data-element="input" required></div><div class="form-group"><label for="contato" class="form-label">Contato e Telefone</label><div class="input-group"><input type="text" class="form-control" id="contato" name="contato" placeholder="" data-input="contato" data-element="input"><input type="text" class="form-control" id="telefone" name="telefone" placeholder="(31) 00000-0000" aria-label="Telefone da pessoa de contato" data-input="telefone" data-element="input"></div></div><div class="form-group"><label for="descricao" class="form-label">Descrição</label><a href="https://www.ocr2edit.com/pt/converter-para-txt" rel="noopener noreferrer" target="_blank" class="btn btn-light d-block mb-3">Converter imagem em texto <span class="seta">-></span></a><textarea name="descricao" id="descricao" cols="30" rows="10" class="form-control" style="height: 100px;" data-input="descricao" data-element="input" required spellcheck="true"></textarea></div><div class="forms-groups"><div class="form-group"><label for="valor-compra-e-venda" class="form-label">Valor de compra e venda</label><input type="text" id="valor-compra-e-venda" data-maskc="money" name="valor-compra-e-venda" class="form-control" placeholder="R$ 0.000,00" value="" data-input="valor-compra-e-venda" data-element="input" required><span class="text-secondary mt-2 d-block">O valor solicitado corresponderá a 80% do valor de compra e venda</span></div><div class="form-group mt-3"><label for="cliente" class="form-label">Cliente e CPF</label><div class="input-group"><input type="text" id="cliente" name="cliente" class="form-control" placeholder="" data-input="cliente" data-element="input"><input type="text" id="CPF" name="CPF" class="form-control" placeholder="000.000.000-00" aria-label="CPF" data-input="cpf" data-element="input"></div></div></div><button type="reset" class="btn btn-secondary">Limpar</button><button type="submit" id="botao-submit-form" name="botao-submit-form" class="btn btn-primary">Baixar arquivo</button></form></div></div><section class="card mt-4 mb-4" data-content="secao-controlada"><div class="card-header d-flex justify-content-between align-center"><b>Desligamento de Análise Internalizada</b><span class="text-muted span">Clique para abrir</span></div><div class="card-body none"><div class="alert info alert-secondary">Rascunho para enviar processo internalizado para desligamento</div><form action="" method="GET" data-form="desligamento-internalizado" class="form-btn-copy-float"><button type="button" class="btn-copy-float"><i class="bi bi-clipboard2"></i></button><textarea style="height: calc(20 * 1rem);" data-form="conteudo-texto" id="conteudo-texto" name="conteudo-texto" contenteditable="true" class="form-control"></textarea></form></div></section><div class="card mb-4 banner"><div><h5 class="title">O que achou dessa página?</h5><p class="text-muted mt-1">Conte pra gente o que você achou</p></div><a href="mailto:devgabrielribeiro@gmail.com?subject=Sobre a página de Desligamento do projeto" class="btn btn-light">Enviar um e-mail</a></div></div></main>`;

const HTMLacompanharFID = (FID, link) => {
  const hoje = moment();
  return `<!DOCTYPE html> <html lang="pt-BR"><head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Acompanhe o FID ${FID}</title> <meta name="author" content="Gabriel Ribeiro"> <meta property="og:title" content="Acompanhe o FID ${FID}"> <meta property="og:description" content="Arquivo para acompanhamento do FID ${FID}. Basta abrir em um navegador que você será direcionado para o link informado para o FID."></head><body> <style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); html{ background-color: #F6F6F6; } body{ font-family: 'Inter', sans-serif; font-size: 16px; padding: 0; margin: 0; width: 100vw; min-height: 100vh; } main.main-container{ margin-block-start: 1rem; margin-block-end: 1rem; margin-inline-start: 1rem; margin-inline-end: 1rem; display: flex; align-items: center; justify-content: center; min-width: calc(100vw - 2rem); min-height: 100vh; } main.main-container .card-header{ display: flex; align-items: center; justify-content: space-between; } main.main-container .card-header .spinner-border{ border-width: 2.5px; width: 15px; height: 15px; } main.main-container .card-body{ padding: 1rem; } main .card{ width: minmax(300px, 1fr) !important; background-color: #FFF; border-radius: 5px; border: 1px solid #A7ACB1; } main .card-header{ background-color: #F6F6F6; padding: 0.65rem; border-bottom: 1px solid #A7ACB1; } /* Loader */ .progress { width: 100.8px; height: 16.8px; border-radius: 16.8px; background: repeating-linear-gradient(135deg,#4781FF 0 8.4px, #6491F4 0 16.8px) left/0% 100% no-repeat, repeating-linear-gradient(135deg,rgba(71,75,255,0.2) 0 8.4px,rgba(71,75,255,0.1) 0 16.8px) left/100% 100%; animation: progress-p43u5e 2s infinite; } @keyframes progress-p43u5e { 100% { background-size: 100% 100%; } } .visually-hidden{ visibility: hidden; } .text-right{ text-align: right; } h5{ font-size: 1.25rem; font-weight: normal; } address{ font-style: normal; } a{ text-decoration: none; outline: none; color: #000; } a:is(:hover, :focus, :active), address a b{ text-decoration: underline; } footer{ padding: 2rem 1rem; border-top: 1px solid #A7ACB1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; } footer div span:first-child{ display: block; margin-bottom: 0.25rem; } footer div span:last-child{ color: #808080; } .text-gray{ color: #808080; font-weight: 600; } .text-arial{ font-family: 'Arial', sans-serif; font-style: normal; } .text-right{ display: flex; flex-direction: column; text-wrap: wrap; word-wrap: wrap; } </style> <main class="container main-container"> <section class="card"> <div class="card-header"> <span>Aguarde!</span> <div class="progress"></div> </div> <div></div> <div></div> <div></div> </div> </div> </div> <div class="card-body"> <h5>Redirecionando para o <b>FID ${FID}</b></h5> </div> </section></main><footer> <address> &nbsp;<a href="https://github.com/gabrieszin/">Desenvolvido por <b>Gabriel Ribeiro</b></a> </address> <div class="text-right"> <span class="text-gray">Arquivo renderizado em</span> <span>${hoje.format('DD')}<i class="text-arial">/</i>${hoje.format('MM')}<i class="text-arial">/</i>${hoje.format('YYYY')} às ${hoje.format('HH:mm:ss')}</span> </div></footer> <script> const link = new URL('${link}'); const split = link.search.split('&'); try{ const valido = [ link.origin.toLowerCase() == 'https://portalsafi.direcional.com.br', link.pathname.toLowerCase() == '/fluxo', split.length == 2, split[0].search('codigo') > 0, typeof(parseInt(split[0].split('=')[1])) == 'number' ]; const FID = split[0].split('=')[1]; if(valido.every(e => e == true)){ document.querySelector('.card .card-body').innerHTML = '<h5>Redirecionando para o <b>FID ' + FID + '</b></h5>'; setTimeout(() => { try{ window.location.replace(link.href); }catch(error){ alert('Oops... Ocorreu um erro ao redirecionar para o link do FID.'); } }, 2000); }else{ reportar(false) } }catch(error){ reportar(false) } function reportar(condicao){ if(!condicao){ alert('Oops... O link informado não atende aos requisitos necessários.'); document.querySelector('.card .card-header span').innerHTML = 'Oops!'; document.querySelector('.card .card-header .spinner-border').innerHTML = '&#10005;'; document.querySelector('.card .card-body').innerHTML = '<h5>Oops... O link informado <b>não é válido</b></h5>' } } </script></body></html>`;
};

const nav = `<nav class="navbar mt-5"><div class="container container-fluid d-flex justify-content-between"><div style="display: flex; align-items: center;"><span class="navbar-icon"></span><b class="navbar-brand"></b></div><div class="btn-group dropstart" role="group"><button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Ir para</button><ul class="dropdown-menu"><li><a class="dropdown-item" href="#" data-link="confirmacao"><i class="bi bi-file-earmark-break"></i> Confirmação CCA</a></li><li><a class="dropdown-item" href="#" data-link="consultas"><i class="bi bi-file-earmark-check"></i> Consultas</a></li><li><a class="dropdown-item" href="#" data-link="arquivos"><i class="bi bi-file-earmark-medical"></i> Arquivos</a></li><li><a class="dropdown-item" href="#" data-link="desligamento"><i class="bi bi-file-earmark-text"></i> Desligamento</a></li></ul></div></div></nav>`;

export const conteudos = {
  selecoes,  
  accordion_item,
  secao_rendas,
  consultas,
  arquivos,
  rodape,
  conteudo_pagina_confirmacao,
  conteudo_pagina_consultas,
  conteudo_pagina_arquivos,
  conteudo_pagina_desligamento,
  HTMLacompanharFID,
  nav
};