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

- **Hook para rotas específicas**: O fastify recomenda criar os arquivos dentro de `src/pre-handlers/arquivo-handler.ts`, mas podemos também usar
por questão de preferência criar em `src/middlewares/arquivo-handle.ts`, essas funções podem
ser usadas antes da execução do handler que é a função da rota

`src/middlewares/check-session-id-exists.ts`
```js
import {FastifyReply, FastifyRequest} from "fastify";

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if(!sessionId) {
    return reply.status(401).send({ 'error': 'Unauthorized!' })
  }
}
```

`src/routes/transactions.ts` - Por rota específica
```js
app.get('/',
        {
         preHandler: [ checkSessionIdExists ] // aqui fica o preHandler, chame as funções dentro do array
        },
        async (request, reply) => {
          const { sessionId } = request.cookies
 
          const transactions = await knex('transactions')
                  .where('id', sessionId)
                  .select()
 
          return { transactions }
        })
```

- **Hook para grupo de rotas**: Para definir um hook para um grupo de rotas específica
`src/routes/transactions.ts` use o método `addHook`, no primeiro parâmetro especifique `'preHandler'` e no segundo a `função`
```js
app.addHook('preHandler', async (request, reply) => {
  console.log(`[${request.method}] ${request.url}]`)
})
```

- **Hook global para rotas**: Para definir um hook global para todas as rotas, ele deve ser chamado
antes da criação das rotas, ou seja, antes do pluggin de cada rota em `src/server.ts`
```js
import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

const app = fastify()

app.register(cookie)

// Criando o hook aqui
app.addHook('preHandler', async (request, reply) => {
 console.log(`[${request.method}] ${request.url}]`)
})

app.register(transactionsRoutes, {
 prefix: 'transactions',
})

app
  .listen({
   port: env.PORT,
  })
  .then(() => {
   console.log('HTTP server running.')
  })

```

### Lidando com Cookies no Fastify

- **O que é?**: É uma forma de manter contexto em requisições, é utilizado principalmente
por redes sociais, você não precisa estar logado para a rede social saber quem é você no
contexto das requisições.
```shell
npm i @fastify/cookie
```

- **Ordem**: É necessário cadastrar o módulo de cookie antes das rotas que vão usar ele, veja o exemplo em `src/server.ts`
```js
import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from "./routes/transactions";
import cookie from "@fastify/cookie" // Importanto do cookie do fastify

const app = fastify()

app.register(cookie) // Cadastrando o uso de cookie antes da rota

app.register(transactionsRoutes, {
  prefix: 'transactions',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running.')
  })

```

- **Definições de cookies**: Primeiro parâmetro é o `nome`, segundo ser `valor` e terceiro é um `objeto`
indicando `path` em qual rotas vão poder acessar ele, `'/'` indica todas, `maxAge` o tempo de expiração em segundos.
```js
reply.cookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
  })
```

### Testes

- **Testes Unitários**: Como o próprio nome já diz, eles testam exclusivamente uma unidade da aplicação,
por exemplo, uma função de conversão de data, você vai executar a função e passar na data no
parâmetro e será testado exclusivamente isso, não será testado onde ela foi chamada. Geralmente são os testes mais usados


- **Testes de Integração**: São testes de comunicação entre duas ou mais unidades, por exemplo, será testado
uma função que chama uma função que chama outra função


- **Testes e2e - ponta a ponta**: São testes que simulam o usuário utilizando nossa aplicação. O usuário mencionado
é o client, portanto ele irá fazer chamadas HTTP, websockets, no final das contas verificam se as portas de entradas
da nossa aplicação está funcionando, desde a rota até o banco de dados


- **Como criar um teste**: Instale o vitest e crie os arquivos de teste com a estenção `spec.ts` ou `test.ts` em `test/arquivo-de-teste.spec.ts`
```shell
npm i vitest -D
```

1. `test/example.spec.ts` import as funções e crie o teste usando o `test()` o primeiro
parâmetro é a descrição do teste e no segundo é a `função` com a chamada HTTP e a `validação` usando o `expect` especificando o que
é esperado
```js
import { expect, test } from 'vitest'

test('O usuário consegue criar uma nova transação', () => {
  // fazer a chamada HTTP para criar uma nova transação

  const responseStatusCode = 201;

  expect(responseStatusCode).toEqual(201)
})
```

2. Comando para rodar o teste
```shell
npx vitest
```

Referência: [Vitest | Get Started](https://vitest.dev/)

- **Utilizando o supertest**

1. Versão JavaScript
```shell
npm i supertest -D
```

2. Versão TypeScript
```shell
npm i -D @types/supertest
```

3. Como criar um teste
```ts
import { test, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import { app } from '../src/app'

// espera o app estar pronto para rodar os testes
beforeAll(async () => {
 await app.ready()
})

// fecha o app após os testes serem finalizados
afterAll(async () => {
 await app.close()
})

test('O usuário consegue criar uma nova transação', async () => {
 await supertest(app.server)
   .post('/transactions')
   .send({
    title: 'Nova request',
    amount: 1000,
    type: 'credit'
   })
   .expect(201)
})
```

- **Categorizando testes**
```ts
import { test, describe } from 'vitest'

describe('Transactions routes', () => {
  // Conteúdo aqui
})
```

- **Uso convencional de it**: Ao invés de usar o test, podemos também usar o it, esse é o método convencional
porque ele faz parte da descrição
```ts
import { id } from 'vitest'

it('should be possible to create a transaction', async () => {
  // Conteúdo aqui
})
```

### Executando scripts de terminal dentro do Node

- **execSync**

```ts
import {execSync} from 'child_process'

execSync('npx knex migrate:latest')
```