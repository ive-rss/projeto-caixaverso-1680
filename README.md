# Dashboard de Clientes

Projeto de estudos com HTML, CSS e JavaScript puro.

O objetivo é praticar manipulação do DOM, eventos de formulário, persistência no navegador e fluxo assíncrono com consumo de API externa.

## Funcionalidades

- Cadastro de clientes com nome, e-mail, tipo de plano e endereço.
- Consulta automática de endereço pelo CEP usando a API ViaCEP.
- Feedback visual de carregamento ao buscar o CEP.
- Botão "Salvar" desabilitado e com texto "Salvando..." durante o processamento.
- Simulação de validação assíncrona com `new Promise()` e `setTimeout`.
- Listagem de clientes em cards criados dinamicamente pelo JavaScript.
- Remoção de clientes cadastrados.
- Filtro de busca em tempo real.
- Persistência dos clientes no `LocalStorage`, na chave `clientes_db`.
- Identificação do operador atual usando `SessionStorage`.

## Campos do cliente

Cada cliente salvo possui:

- `id`
- `nome`
- `email`
- `plano`
- `cep`
- `logradouro`
- `bairro`
- `cidade`
- `uf`

## Planos

Os clientes podem ser cadastrados em três planos:

- Gold
- Silver
- Bronze

Cada plano possui uma cor visual própria no card do cliente.

## Fluxo de cadastro

1. O usuário preenche nome, e-mail, plano e CEP.
2. Ao informar um CEP com 8 dígitos ou sair do campo, o sistema consulta a ViaCEP.
3. Os campos de logradouro, bairro, cidade e UF são preenchidos automaticamente.
4. Ao salvar, o botão é desabilitado e mostra "Salvando...".
5. O sistema aguarda uma Promise customizada de 2 segundos.
6. O cliente é salvo no `LocalStorage` e renderizado na tela.
7. Ao recarregar a página, os clientes salvos são reconstruídos automaticamente.

## Estrutura

```text
.
|-- index.html
|-- style.css
|-- script.js
`-- README.md
```

## Como executar

Abra o arquivo `index.html` diretamente no navegador.

Não é necessário instalar dependências nem iniciar servidor, pois o projeto usa apenas HTML, CSS e JavaScript puro.

Para a consulta de CEP funcionar, é necessário estar conectado à internet.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage
- SessionStorage
- ViaCEP

## Conceitos praticados

- `document.createElement()`
- `appendChild()`
- `addEventListener()`
- Eventos `submit`, `blur`, `input` e `click`
- `fetch()`
- `async/await`
- `try/catch/finally`
- `new Promise()`
- `setTimeout()`
- `classList`
- `JSON.stringify()`
- `JSON.parse()`
- `localStorage`
- `sessionStorage`
