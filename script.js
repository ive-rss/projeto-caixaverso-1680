const CHAVE_CLIENTES = "clientes_db";
const CHAVE_OPERADOR = "operador_atual";

const formCliente = document.getElementById("formCliente");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoPlano = document.getElementById("plano");
const campoBusca = document.getElementById("buscaCliente");
const listaClientes = document.getElementById("listaClientes");
const listaVazia = document.getElementById("listaVazia");
const erroEmail = document.getElementById("erroEmail");
const mensagemStatus = document.getElementById("mensagemStatus");
const operadorAtual = document.getElementById("operadorAtual");

let clientes = carregarClientes();

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

  const botaoRemover = document.createElement("button");
  botaoRemover.classList.add("botao-remover");
  botaoRemover.type = "button";
  botaoRemover.textContent = "Remover";

  botaoRemover.addEventListener("click", function () {
    removerCliente(cliente.id);
  });

  card.appendChild(nome);
  card.appendChild(email);
  card.appendChild(plano);
  card.appendChild(botaoRemover);

  return card;
}

function buscaCliente(cliente, termoBusca) {
  const conteudo = `${cliente.nome} ${cliente.email} ${cliente.plano}`.toLowerCase();
  return conteudo.includes(termoBusca);
}

function renderizarClientes() {
  const termoBusca = campoBusca.value.trim().toLowerCase();
  const clientesFiltrados = clientes.filter(function (cliente) {
    return buscaCliente(cliente, termoBusca);
  });

  listaClientes.innerHTML = "";

  clientesFiltrados.forEach(function (cliente) {
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
  clientes = clientes.filter(function (cliente) {
    return cliente.id !== id;
  });

  salvarClientes();
  renderizarClientes();
}

formCliente.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = campoNome.value.trim();
  const email = campoEmail.value.trim();
  const plano = campoPlano.value;

  if (!nome || !email || !plano || !validarEmail()) {
    mensagemStatus.textContent = "";
    return;
  }

  const novoCliente = {
    id: Date.now(),
    nome: nome,
    email: email,
    plano: plano
  };

  clientes.push(novoCliente);
  salvarClientes();
  renderizarClientes();

  formCliente.reset();
  campoEmail.classList.remove("campo-erro");
  mensagemStatus.textContent = "Cliente salvo com sucesso.";
});

campoEmail.addEventListener("blur", validarEmail);
campoEmail.addEventListener("input", function () {
  mensagemStatus.textContent = "";
});

campoBusca.addEventListener("input", renderizarClientes);

configurarOperador();
renderizarClientes();
