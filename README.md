# Dashboard de Clientes

Projeto de estudos com HTML, CSS e JavaScript puro.

O objetivo é praticar manipulação do DOM, eventos de formulário e persistência de dados no navegador usando `LocalStorage` e `SessionStorage`.

## Funcionalidades

- Cadastro de clientes com nome, e-mail e tipo de plano.
- Validação visual do e-mail ao sair do campo.
- Listagem de clientes em cards criados dinamicamente pelo JavaScript.
- Remoção de clientes cadastrados.
- Filtro de busca em tempo real.
- Persistência dos clientes no `LocalStorage`.
- Identificação do operador atual usando `SessionStorage`.

## Planos

Os clientes podem ser cadastrados em três planos:

- Gold
- Silver
- Bronze

Cada plano possui uma cor visual própria no card do cliente.

## Estrutura

```text
.
├── docs/
│   └── caixaverso-trabalho-pt1.md
├── index.html
├── style.css
├── script.js
└── README.md
```

## Como executar

Abra o arquivo `index.html` diretamente no navegador.

Não é necessário instalar dependências nem iniciar servidor, pois o projeto usa apenas HTML, CSS e JavaScript puro.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- SessionStorage

## Conceitos praticados

- `document.createElement()`
- `appendChild()`
- `addEventListener()`
- Eventos `submit`, `blur`, `input` e `click`
- `classList`
- `JSON.stringify()`
- `JSON.parse()`
- `localStorage`
- `sessionStorage`
