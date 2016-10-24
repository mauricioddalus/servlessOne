Serverless 1.0.2
==========

Como utilizar o [Serverless](https://github.com/serverless/serverless) para o 
desenvolvimento de sistemas serverless.

## 1. Preparação

1. Instalar o Node.JS na mesma versão que a Amazon utiliza. Verificar em 
   <http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html>.

2. Instalar o aws-sdk globalmente (npm -g), na mesma versão que a Amazon
   utiliza. Verificar em <http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html>.

3. Instalar o [CLI da AWS](https://aws.amazon.com/cli/).

4. Configurar o CLI com a sua conta que acessa a conta da Amazon onde será
   implementado a função Lambda:
   `aws configure`

5. Setar a variável de ambiente **AWS_REGION** para a região onde a função
   Lambda será executada.

    Linux: export AWS_REGION="xxx"  

    Windows: set AWS_REGION=xxx

6. Setar a variável de ambiente **NODE_PATH** com o diretório global dos
   módulos do Node.JS

    Linux: export NODE_PATH="xxx"
   
    Windows: set NODE_PATH=xxx
   
    Utilizar o comando `npm list -g` para descobrir qual é este diretório.

7. Instalar o `serverless` globalmente. Utilizar a última versão (1.0.2).

8. Instalar o `ws-lambda-local` globalmente (npm install -g aws-lambda-local). 
   O pacote npm possibilita a execução local das funções lambda. Documentação
   <https://www.npmjs.com/package/aws-lambda-local>.

Se você não configurar o perfil do seu shell para carregar as variáveis de
ambiente automaticamente, lembrar de reconfigurar todas as vezes que abrir
uma nova sessão do shell.


## 2. Preparando o desenvolvimento de uma API

### 2.1. Preparando um projeto novo

1. Criar o projeto
    
```shell
serverless create --template aws-nodejs --name my-special-service --path <pasta do serviço>
```

  O AWS CLI irá utilizar o perfil default para criação do serviço.
  Ao final do processo 3 arquivos serão criados:

        root/
        +-- serverless.yml   Possui as configurações do serverless
        +-- handler.js       Função lambda que será executada
        +-- event.json       Arquivo com configuração da chamada de teste 


2. Iniciar um repositório no git `git init`
   
    No package.json, alterar:

        * description
        * author: Dedalus
        * license: UNLICENSED
        * private: true
        * repository

    No package.json, inserir:

        "jshintConfig": {
            "esversion": 6,
            "node": true
        }

    É necessária a instalação global do jshint `npm install -g jshint`.

3. Criar uma pasta **functions**

    Todo o desenvolvimento será nesta pasta, é necessário mover os arquivos criados pelo serverless
    para dentro dessa pasta.

4. Criar os arquivos de configuração do ambiente Node.JS na pasta **functions**:

    * **package.json**

            {
                "name": "<nome_da_api>",
                "version": "0.0.1",
                "description": "<descrição>",
                "jshintConfig": {
                    "esversion": 6,
                    "node": true
                }
            }

5. Criar a pasta **docs**:

    Colocar a documentação do projeto dentro da pasta e criar um README.md
    com explicação sobre cada documento.

6. Criar arquivo **tasks.md**:

    Contém as tarefas do projeto.

Todas as bibliotecas do Node.JS que serão instaladas deverão ser realizadas
dentro da pasta **functions**.

Recomenda-se a seguinte hierarquia de pastas:

    root/
    |
    +-- functions/
    |   +-- node_modules/
    |   +-- função/
    |   |   +-- handler.js
    |   |   +-- evet.json
    |   +-- util/
    |   +-- package.json
    |   +-- serverless.yml
    +-- tests/
    |   +-- node_modules/
    |   +-- package.json
    +-- docs/
    |   +-- README.md
    +-- scripts/
    +-- README.md
    +-- tasks.md
    +-- package.json

### 2.2. Configurando um projeto de um repositório clonado

Não é necessária a instalação do projeto após o clone na versão 1.0.X do Serverless, apenas é necessária
a verificação de variáveis de ambiente `${env:variavel}` e variáveis de linha de comando `${opt:variavel}` 
no arquivo de configuração do serverless `serverless.yml`.


## 3. Configurando o serverless

As configurações são feitas no arquivo serverless.yml.

### 3.1. Configurações básicas

    service: <nome da api>

    provider:
    name: aws
    runtime: <tipo de execução 'nodejs 4.3', 'python'>
    region:  <região 'us-east-1 '>
    stage:   <estágio 'dev','test','prod' >

    #Variáveis
    db_test: test_table 
    version: v1

    # define os diretórios/arquivos que não serão incluidos no pacote .zip
    package:
    exclude:
        - .git
        - .gitignore
        - resources/items/.json
        - resources/item/.json
        - serverless-doc.md
        - serverless*
        - test/**
        - node_modules/**



### 3.2. Criando uma nova função Lambda

A criação de funções é manual, dois arquivos devem ser criados dentro de uma nova pasta no diretório functions

`função.js`   Contem a função que será executada pelo lambda
`evento.json` Contem os parametros que serão enviados para a função no `sls invoke`

    Exemplo de projeto:

        root/
        |
        +-- functions/
              +-- MyFunction/
                  +-- evento.json
                  +-- função.js

Conteudo do arquivo função.js:
    
    'use strict';

    module.exports.main = (event, context, callback) => {

        return context.succeed({
            "statusCode": 200,
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify('ok')
        });
    };

Após a criação da função é necessário configurar o Serverless `serverless.yml` para identificar as novas funções:

    functions:
    MyFunction:
        name: ${self:service}-${self:provider.stage}-myFunction
        description: Função para criação de items em ambiente de ${self:provider.stage}
        handler: MyFunction/função.main
        memorySize: 128 
        timeout: 10
        events:
        - http:
            path: ${self:provider.stage}/${self:provider.version}/items
            method: POST


### 3.3. Testes da função Lambda

O Serverless 1.0.2 não possue teste local, é necessário fazer o deploy e então executar o comando invoke 

```shell
serverless deploy -f <nome_da_função>
```

```shell
serverless invoke -f <nome_da_função> 
```

Observação: o teste será executado com as suas credenciais, de acordo com o
perfil especificado na criação do projeto.

Para contornar o problema foi recomendada a instalação do pacote npm `ws-lambda-local` que possibilita a execução local das funções lambda:

```shell
lambda-local -f <caminho/nome_da_função>  -e <caminho/nome_do_evento>
```

### 3.4. Permissões para função Lambda

Se a função Lambda precisa acessar algum serviço da Amazon AWS, a permissão
para acesso deverá estar configurado na Role da função Lambda.

Esta configuração é realizada no arquivo `serverless.yml`, que contém
o modelo CloudFormation para o projeto.

      iamRoleStatements:
        - Effect: "Allow"
        Action:
            - "dynamodb:*"
        Resource: [
            { "Fn::Join": [ ":", [
                "arn:aws:dynamodb",
                { "Ref": "AWS::Region" },
                { "Ref": "AWS::AccountId" },
                "table/${self:provider.db_test}"
                ] ] },
            { "Fn::Join": [ ":",[
                "arn:aws:dynamodb",
                { "Ref": "AWS::Region" },
                { "Ref": "AWS::AccountId" },
                "table/${self:provider.db_test}/*"
                ] ] }
        ]

Ao ser realizado alguma alteração no arquivo, deve-se aplicar a
alteração na Amazon, com o comando:

```shell
serverless deploy
```

### 3.5. Instalação da função Lambda na AWS

```shell
serverless deploy -f <nome_da_função>
```

### 3.6. Definindo variáveis

As váriaveis podem possuem 3 tipos

* **Variáveis de ambiente**: ${env:variavel} é definida no perfil do usuário `export variavel='valor'`

* **Variáveis do CLI**: ${opt:variavel} é definida na chamada do serverless: `sls deploy --variavel valor`

* **Variáveis Custom**: ${self:variavel} é definida dentro do `serverless.yml` 
