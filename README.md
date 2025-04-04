# Módulo 2 - API REST Node.js

# Comandos

- **Criando o projeto**
```shell
npm init -y
```

- **Converter dependência de desenvolvimento para TypeScript**: -D indica dependência de desenvolvimento
```shell
npm i -D typescript
```

- **Criando um arquivo de configuração do TypeScript**: npm é um comando que vem instalado junto ao npm e serve para
executarmos binários, ou seja, códigos executáveis das bibliotecas que instalamos, esses arquivos executáveis ficam dentro de
`node_modules/.bin` o comando abaixo serve para criar o arquivo `tsconfig.json`
```shell
npx tsc --init
```

- **Convertendo arquivo TypeScript para JavaScript**
```shell
npx tsc path/arquivo.ts
```

- **Instalando o fastify**
```shell
npm i fastify
```

- **Instalando o pacote de types do node**: -D indica dependência de desenvolvimento
```shell
npm i -D @types/node
```

- **TSX para automatizar conversão de TypeScript para JavaScript**: **SOMENTE LOCAL!**
```shell
npx tsx path/arquivo.ts
```

- **Instalando o TSX**
```shell
npm i tsx -D
```

- **Instalando o eslint**: A Rocketseat tem um pacote pronto, para instalar ele junto use antes do -D o @rocketseat/eslint-config
```shell
npm i eslint -D
```

# Conceitos

### Difrença entre execução do js para o ts

- **JavaScript - Runtime Type Checking**: Precisa executar o código para validar os erros
- **TypeScript - Static Type Checking**: Valida os erros na hora do desenvolvimento

### Informação importante do arquivo tsconfig
`tsconfig.json`

```
// Indica a versão do JavaScript em que o TypeScript será convertido no final
{
  "target": "es2024"
}
```

### Formas de comunicação com o banco de dados

- **Drivers nativos**: Ferramentas e bibliotecas de baixo nível que permitem
 que comunicamos com o Banco de dados de uma forma não abstrata, ou seja, utilizando querys crua
- **Query builder**: Construtor de queries para facilitar as escritas da query. Configurando com o knex.js
1. Instalando o knex
```shell
npm install knex --save
```

2. Instalando o driver
```shell
npm install knex mysql2
```

3. Configurando o banco
```js
import { knex } from 'knex'

const knex = require('knex')({
 client: 'mysql',
 connection: {
  host: '127.0.0.1',
  port: 3306,
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'myapp_test',
 },
});
```

4. Criar o arquivo do `knexfile.ts` na raíz do projeto
```js
import { configDB } from "./src/database";

export default configDB
```

5. Criar o script para executar corretamente o `knexfile.ts` quando o arquivo é TypeScript
```shell
"knex": "node --loader tsx ./node_modules/.bin/knex",
```

6. Instalando dependência para o knex com ts
```
npm install --save-dev ts-node
```

7. Rodando o knex
```shell
npx knex -h
```

Referência: [Installation | knex.js](https://knexjs.org/guide/)

- **ORMS**: Mapeamento de objeto-relacional, é a relação entre os models em forma de objeto

### Manipulando o DB

- **Binários do knex**: O knex possui arquivos binários, ou seja, arquivos executáveis
responsáveis por executar uma ação, sendo eles:

1. Criar uma migrate de uma tabela
```shell
npx knex migrate:make create_documents
```