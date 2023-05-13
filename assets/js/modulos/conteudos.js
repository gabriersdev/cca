const accordion_item = (indice) => {
  const conteudo = `<div data-identify="${indice}"> <h2 class="accordion-header"> <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${indice}" aria-expanded="${indice == 1? 'true' : 'false'}" aria-controls="panelsStayOpen-collapse${indice}"> <span>Proponente ${indice} - <b data-content="nome">Nome do cliente</b></span> </button> </h2> <div id="panelsStayOpen-collapse${indice}" class="accordion-collapse collapse ${indice == 1 ? 'show' : ''}"> <div class="accordion-body"> <div class="card-body"> <div class="card-body-header d-flex justify-content-between align-items-center mt-2 mb-4"> <h5 class="" data-content="nome">Nome do cliente</h5> <div> <button class="btn btn-outline-secondary" data-action="remover-proponente">Remover proponente</button> <button class="btn btn-outline-primary" data-download="baixar-dados" onclick="clickDownload(this)" data-toggle="tooltip" data-placement="top" title="Baixar" data-bs-custom-class="custom-tooltip"><i class="bi bi-file-earmark-arrow-down"></i></button> </div> </div> <div class="form-floating mt-2 mb-1"> <input type="text" class="form-control" placeholder="Nome" data-element="input" data-input="nome" required> <label for="floatingInput">Nome</label> </div> <div class="row mt-2 mb-1"> <div class="col"> <div class="form-floating"> <input type="text" class="form-control" placeholder="123.456.789-09" data-element="input" data-input="cpf" required> <label for="floatingInput">CPF</label> </div> </div> <div class="col"> <div class="form-floating"> <input type="text" class="form-control" placeholder="01/01/2000" data-element="input" data-input="data_nascimento" required> <label for="floatingInput">Data de Nascimento</label> </div> </div> </div> <div class="row mt-2 mb-1"> <div class="col-sm-7"> <div class="form-floating"> <input type="email" class="form-control" placeholder="name@example.com" data-element="input" data-input="email" required> <label for="floatingInput">E-mail</label> </div> </div> <div class="col"> <div class="form-floating"> <input type="tel" class="form-control" placeholder="(31) 99999-9999" data-element="input" data-input="telefone" required> <label for="floatingInput">Telefone</label> </div> </div> </div> <div class="mb-2"> <br><b>Endereço</b> <div class="input-group mt-2 mb-2"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="endereco" required> </div> <input type="text" list="tipos-comprovantes-endereco" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Endereço" data-element="input" data-input="tipo_endereco"> <datalist name="" id="tipos-comprovantes-endereco"> <option value="Fatura de serviço"></option> <option value="Boleto de cobrança"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Outro"></option> </datalist> <!-- <button class="input-group-text btn btn-outline-secondary"><i class="bi bi-trash"></i></button> --> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-renda-valido" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="endereco_valido" required> <label for="comprovante-renda-valido" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de endereço é válido para a análise de crédito quando ele foi emitido a partir do últimos 3 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div> </div> <span class="text-muted" data-content="feedback-endereco">[Feedback do comp. de endereço]</span> </div> <div class="mb-2" data-element="secao_rendas"> <br><b>Renda</b> <div data-element="area_rendas"><div class="input-group mt-2 mb-2" data-element="renda"> <div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda" required> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> </datalist> <button class="input-group-text btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-endereco-valido-${indice}" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda_valida" required> <label for="comprovante-endereco-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div></div> </div><button class="btn btn-outline-secondary" data-action="incluir_renda" onclick="clickIncluirRenda(this)">Incluir renda</button> <span class="text-muted d-block mt-2" data-content="feedback-renda">[Feedback da renda]</span> </div> <br> <div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="comprovante-de-estado-civil-enviado" data-element="input" data-input="comprovante_estado_civil" required><label class="form-check-label" for="comprovante-de-estado-civil-enviado" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante de Estado Civil" data-bs-content="Certidão de Casamento, de Nascimento ou União Estável.">Enviou Comprovante de Estado Civil&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div><div class="form-check mb-2"><input class="form-check-input" type="checkbox" value="" id="possui-fgts-e-usara" data-element="input" data-input="fgts"><label class="form-check-label" for="possui-fgts-e-usara" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Uso de FGTS" data-bs-content="Verificar as regras para a utilização do benefício conforme o produto.">Possui 36 meses de FGTS, poderá e irá fazer uso&nbsp;<i class="bi bi-info-circle text-secondary"></i></label></div> </div> </div> </div> </div>`;
  return conteudo;
}

const secao_rendas = (indice) => {
  return `<div class="input-group-text"> <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input" data-input="renda"> </div> <input type="text" list="tipos-comprovantes-renda-${indice}" class="form-control" aria-label="Text input with checkbox" placeholder="Comprovante de Renda" data-element="input" data-input="tipo_renda"> <datalist name="" id="tipos-comprovantes-renda-${indice}"> <option value="Contracheque/Hollerith"></option> <option value="IRPF"></option> <option value="Contrato de Aluguel"></option> <option value="Extratos Bancários"></option> <option value="Outro"></option> </datalist> <button class="input-group-text btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="Remover" data-bs-custom-class="custom-tooltip" data-action="remover-renda"><i class="bi bi-trash"></i></button> <div class="input-group-text"> <input class="form-check-input mt-0" id="comprovante-endereco-valido-${indice}" type="checkbox" value="" aria-label="Checkbox for following text input" data-element="input"> <label for="comprovante-endereco-valido-${indice}" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-title="Comprovante válido" data-bs-content="O comprovante de renda é válido para a análise de crédito quando ele foi emitido a partir do últimos 2 meses.">&nbsp;&nbsp;Comprovante válido&nbsp;<i class="bi bi-info-circle text-secondary"></i></label> </div>`
};

const consultas = [
  { tag: 'cadastro', titulo: 'Pesquisa Cadastral', sistema: 'SICAQ', link: 'xxxx.xx.x' }, 
  { tag: 'cadastro', titulo: 'CNIS', sistema: 'INSS', link: 'xxxx.xa.x' }, 
  { tag: 'cadastro', titulo: 'Busca CEP', sistema: 'Correios', link: 'xxxx.xa.x' }, 
  { tag: 'cadastro', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
  { tag: 'cadastro', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
  { tag: 'cadastro', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
  { tag: 'dossiê', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
  { tag: 'dossiê', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
  { tag: 'dossiê', titulo: 'Restituição IRPF', sistema: 'Receita Federal', link: 'xxxx.xa.x' },
]

export const conteudos = {
  accordion_item,
  secao_rendas,
  consultas
}