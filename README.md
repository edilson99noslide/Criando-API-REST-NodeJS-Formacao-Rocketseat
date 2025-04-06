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

- **Extensão para ler `.env` no node**
```shell
npm i dotenv
```
```js
import 'dotenv/config'
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

2. Rodar uma migrate
```shell
npx knex migrate:latest
```

3. Rollback em uma migration
```shell
npx knex migrete:rollback
```

4. Buildando queries com Knex

Referência: [Query Builder | knex.js](https://knexjs.org/guide/query-builder.html)

5. Tipagem do knex: Crie um arquivo geralmente fica em `src/types/knex.d.ts` a extensão d.ts indica que
é um arquivo que não possui código JavaScript, somente TypeScript, o arquivo com a interface
das tipagens de tabelas do knex fica em `node_modules/knex/types/tables.d.ts`
```ts
// eslint-disable-nex-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      createdAt: string;
      session_id?: string;
    }
  }
}
```

### Validação de dados com zod

- **Instalando o zod**
```shell
npm i zod
```

- **Importando do zod**
```js
import { z } from 'zod'
```

- **Configurando o zod na aplicação**: Crie um arquivo em `src/env/index.ts`
```js
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
})

const env = envSchema.parse(process.env)
```

Referência: [Installation | zod](https://zod.dev/?id=installation)

### Criando rotas

- **Pluggin do fastify**: os arquivos referentes às rotas ficam em `src/routes/arquivoDeRota.ts` e as
funções precisam obrigatóriamente serem async, também precisa ter no parâmetro a instância do fastify

```js
import { FastifyInstance } from 'fastify'
import { knex } from "../database";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')

    return transactions
  })
}
```