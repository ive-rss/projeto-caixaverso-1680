const CHAVE_CLIENTES = "clientes_db";
const CHAVE_OPERADOR = "operador_atual";

const formCliente = document.getElementById("formCliente");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoPlano = document.getElementById("plano");
const campoCep = document.getElementById("cep");
const campoLogradouro = document.getElementById("logradouro");
const campoBairro = document.getElementById("bairro");
const campoCidade = document.getElementById("cidade");
const campoUf = document.getElementById("uf");
const campoBusca = document.getElementById("buscaCliente");
const listaClientes = document.getElementById("listaClientes");
const listaVazia = document.getElementById("listaVazia");
const erroEmail = document.getElementById("erroEmail");
const erroCep = document.getElementById("erroCep");
const mensagemStatus = document.getElementById("mensagemStatus");
const operadorAtual = document.getElementById("operadorAtual");
const botaoSalvar = document.getElementById("botaoSalvar");

let clientes = carregarClientes();
let ultimoCepConsultado = "";

function carregarClientes() {
  const dadosSalvos = localStorage.getItem(CHAVE_CLIENTES);

  if (!dadosSalvos) {
    return [];
  }

  return JSON.parse(dadosSalvos);
}

function salvarClientes() {
  localStorage.setItem(CHAVE_CLIENTES, JSON.stringify(clientes));
}

function configurarOperador() {
  let operador = sessionStorage.getItem(CHAVE_OPERADOR);

  if (!operador) {
    operador = prompt("Informe o nome do operador:");
    operador = operador && operador.trim() ? operador.trim() : "Visitante";
    sessionStorage.setItem(CHAVE_OPERADOR, operador);
  }

  operadorAtual.textContent = operador;
}

function emailValido(email) {
  return email.includes("@");
}

function validarEmail() {
  if (!campoEmail.value.trim() || emailValido(campoEmail.value)) {
    campoEmail.classList.remove("campo-erro");
    erroEmail.textContent = "";
    return true;
  }

  campoEmail.classList.add("campo-erro");
  erroEmail.textContent = "Informe um e-mail valido com @.";
  return false;
}

function limparCep(cep) {
  return cep.replace(/\D/g, "");
}

function limparEndereco() {
  campoLogradouro.value = "";
  campoBairro.value = "";
  campoCidade.value = "";
  campoUf.value = "";
}

function preencherEndereco(endereco) {
  campoLogradouro.value = endereco.logradouro || "";
  campoBairro.value = endereco.bairro || "";
  campoCidade.value = endereco.localidade || "";
  campoUf.value = endereco.uf || "";
}

function enderecoPreenchido() {
  return (
    campoLogradouro.value.trim() &&
    campoBairro.value.trim() &&
    campoCidade.value.trim() &&
    campoUf.value.trim()
  );
}

function simularProcessamento() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
}

async function buscarEndereco(cepInformado) {
  const cep = limparCep(cepInformado);

  if (cep.length !== 8 || cep === ultimoCepConsultado) {
    return;
  }

  ultimoCepConsultado = cep;
  erroCep.textContent = "";
  mensagemStatus.textContent = "Carregando endereço...";
  limparEndereco();

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

    if (!resposta.ok) {
      throw new Error("Erro ao consultar CEP");
    }

    const endereco = await resposta.json();

    if (endereco.erro) {
      throw new Error("CEP inválido ou não encontrado.");
    }

    preencherEndereco(endereco);
    mensagemStatus.textContent = "";
  } catch (erro) {
    erroCep.textContent =
      erro.message === "CEP inválido ou não encontrado."
        ? erro.message
        : "Erro ao consultar CEP";
    mensagemStatus.textContent = "";
    ultimoCepConsultado = "";
    limparEndereco();
  }
}

function criarCardCliente(cliente) {
  const card = document.createElement("article");
  card.classList.add("card-cliente", `plano-${cliente.plano.toLowerCase()}`);

  const nome = document.createElement("h3");
  nome.textContent = cliente.nome;

  const email = document.createElement("p");
  email.textContent = cliente.email;

  const plano = document.createElement("span");
  plano.classList.add("plano");
  plano.textContent = cliente.plano;

  const endereco = document.createElement("p");
  endereco.classList.add("endereco-cliente");
  endereco.textContent = cliente.cep
    ? `${cliente.logradouro || "Logradouro não informado"}, ${cliente.bairro || "bairro não informado"} - ${cliente.cidade || "cidade não informada"}/${cliente.uf || "UF"} | CEP ${cliente.cep}`
    : "Endereço não informado.";

  const botaoRemover = document.createElement("button");
  botaoRemover.classList.add("botao-remover");
  botaoRemover.type = "button";
  botaoRemover.textContent = "Remover";

  botaoRemover.addEventListener("click", () => {
    removerCliente(cliente.id);
  });

  card.appendChild(nome);
  card.appendChild(email);
  card.appendChild(plano);
  card.appendChild(endereco);
  card.appendChild(botaoRemover);

  return card;
}

function buscaCliente(cliente, termoBusca) {
  const conteudo =
    `${cliente.nome} ${cliente.email} ${cliente.plano} ${cliente.cep} ${cliente.logradouro} ${cliente.bairro} ${cliente.cidade} ${cliente.uf}`.toLowerCase();
  return conteudo.includes(termoBusca);
}

function renderizarClientes() {
  const termoBusca = campoBusca.value.trim().toLowerCase();
  const clientesFiltrados = clientes.filter((cliente) => {
    return buscaCliente(cliente, termoBusca);
  });

  listaClientes.innerHTML = "";

  clientesFiltrados.forEach((cliente) => {
    const card = criarCardCliente(cliente);
    listaClientes.appendChild(card);
  });

  listaVazia.classList.toggle("visivel", clientesFiltrados.length === 0);

  if (clientes.length === 0) {
    listaVazia.textContent = "Nenhum cliente cadastrado.";
  } else {
    listaVazia.textContent = "Nenhum cliente encontrado.";
  }
}

function removerCliente(id) {
  clientes = clientes.filter((cliente) => {
    return cliente.id !== id;
  });

  salvarClientes();
  renderizarClientes();
}

formCliente.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const plano = campoPlano.value;
  const cep = limparCep(campoCep.value);
  const emailEstaValido = validarEmail();
  const enderecoEstaPreenchido = enderecoPreenchido();

  if (
    !nome ||
    !email ||
    !plano ||
    cep.length !== 8 ||
    !enderecoEstaPreenchido ||
    !emailEstaValido
  ) {
    mensagemStatus.textContent = "";
    erroCep.textContent =
      cep.length === 8 && enderecoEstaPreenchido
        ? ""
        : "Informe um CEP válido para carregar o endereço.";
    return;
  }

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = "Salvando...";
  mensagemStatus.textContent = "";

  try {
    await simularProcessamento();

    const novoCliente = {
      id: Date.now(),
      nome: nome,
      email: email,
      plano: plano,
      cep: cep,
      logradouro: campoLogradouro.value.trim(),
      bairro: campoBairro.value.trim(),
      cidade: campoCidade.value.trim(),
      uf: campoUf.value.trim(),
    };

    clientes.push(novoCliente);
    salvarClientes();
    renderizarClientes();

    formCliente.reset();
    campoEmail.classList.remove("campo-erro");
    erroCep.textContent = "";
    ultimoCepConsultado = "";
    mensagemStatus.textContent = "Cliente salvo com sucesso.";
  } catch (erro) {
    mensagemStatus.textContent =
      "Não foi possível salvar o cliente. Tente novamente.";
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = "Salvar";
  }
});

campoEmail.addEventListener("blur", validarEmail);
campoEmail.addEventListener("input", () => {
  mensagemStatus.textContent = "";
});

campoCep.addEventListener("blur", () => {
  buscarEndereco(campoCep.value);
});

campoCep.addEventListener("input", () => {
  const cep = limparCep(campoCep.value);
  mensagemStatus.textContent = "";
  erroCep.textContent = "";

  if (cep.length < 8) {
    ultimoCepConsultado = "";
    limparEndereco();
    return;
  }

  buscarEndereco(campoCep.value);
});

campoBusca.addEventListener("input", renderizarClientes);

configurarOperador();
renderizarClientes();
