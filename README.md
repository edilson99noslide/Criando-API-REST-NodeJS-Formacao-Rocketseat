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

- **Convertendo arquivo TypeScript para JavaScript
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