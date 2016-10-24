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

Execute o comando abaixo, no diretório do projeto:

```shell
serverless project init -n <nome do projeto> -s <estágio> -r <região> -c
```

Onde:

* **nome do projeto**: nome que aparecerá no API Gateway. Pode-se usar um
    nome de projeto existente para continuar um desenvolvimento.

* **estágio**: o estágio que estará sendo desenvolvido.

* **região**: região onde será realizado a implementação.

Crie as variáveis do projeto:

```shell
serverless variables set -t <tipo> -r <região> -s <estágio> -k <key> -v <value>
```

Onde:

* **tipo**: tipo da varipavel, que pode ser: common, stage ou region.

* **região**: região onde será realizado a implementação.

* **estágio**: o estágio que estará sendo desenvolvido.

* **key**: nome da variável.

* **value**: valor da variável.


## 3. Operações com o serverless

### 3.1. Criando um novo estágio

Execute o comando abaixo para criar um novo estágio:

```shell
serverless project init -n <nome do projeto> -s <estágio> -r <região> -c
```

Onde:

* **nome do projeto**: nome que aparecerá no API Gateway, o mesmo nome já
    sendo utilizado para criar um novo estágio no mesmo API Gateway.

* **estágio**: o estágio que estará sendo desenvolvido.

* **região**: região onde será realizado a implementação. Utilizar o mesmo dos
    outros estágios.


### 3.2. Criando uma nova função Lambda

Executar o comando:

```shell
serverless function create -r nodejs4.3 -t endpoint functions/<nome_da_função>
```

Modificar o arquivo **s-function.json** criado de acordo com a necessidade do
projeto, com atenção à:

* description

* handler

    O **handler** deverá ser baseado no diretório da função. Adicionar o diretório
    da função no **handler**.
  
    Por exemplo, se a hierarquia ficou:
    
        root/
        |
        +-- functions/
              +-- MyFunction/
                  +-- handler.js
  
    **handler** deverá ser: `MyFunction/handler.handler`

* timeout

* memorySize

### 3.3. Testes da função Lambda

Teste local poderá ser feito com o comando

```shell
serverless function run <nome_da_função>
```

Observação: o teste será executado com as suas credenciais, de acordo com o
perfil especificado na criação do projeto.

### 3.4. Permissões para função Lambda

Se a função Lambda precisa acessar algum serviço da Amazon AWS, a permissão
para acesso deverá estar configurado na Role da função Lambda.

Esta configuração é realizada no arquivo `s-resources-cf.json`, que contém
o modelo CloudFormation para o projeto.

O item **IamPolicyLambda** contém as autorizações de acesso para as funções
Lambda do projeto.

Uma autorização padrão é o acesso ao banco de dados configurado no DynamoDB.
Esta permissão pode ser configurado com um **statement** adicional no 
**IamPolicyLambda**, com o seguinte formato:

    {
        "Effect": "Allow",
        "Action": ["dynamodb:*"],
        "Resource": [
            {"Fn::Join": [":", ["arn:aws:dynamodb", {"Ref": "AWS::Region"}, {"Ref": "AWS::AccountId"}, "table/<nome_tabela>"]]},
            {"Fn::Join": [":", ["arn:aws:dynamodb", {"Ref": "AWS::Region"}, {"Ref": "AWS::AccountId"}, "table/<nome_tabela>/*"]]},
            ...
        ]
    }    

Onde:

* **<nome_tabela>** é o nome da base no DynamoDB que será utilizada. Exemplo: 
    `dev_brands`.

As 2 linhas de definições de tabela devem ser repetidas para todas as tabelas
de todos os estágios, por exemplo, para as tabelas `dev_brands` e 
`test_brands`. 

Ao ser realizado alguma alteração no `s-resources-cf.json`, deve-se aplicar a
alteração na Amazon, com o comando:

```shell
serverless resources deploy
```

### 3.5. Instalação da função Lambda na AWS

```shell
serverless function deploy <nome_da_função>
```

### 3.6. Deploy do API Gateway

Verificar os seguintes itens no arquivo **s-function.json**:

* endpoints[0].path

    O **path** é em relação ao estágio que será criado no futuro.

* endpoints[0].method

* endpoints[0].requestParameters

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/method/#requestParameters>.

* endpoints[0].requestModels

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/method/#requestModels>.

* endpoints[0].requestTemplates

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/#requestTemplates>.

    Pode ser em JSON.

* endpoints[0].responses

* endpoints[0].responses.*.statusCode

* endpoints[0].responses.*.responseParameters

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/method-response/#responseParameters>.

* endpoints[0].responses.*.responseModels

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/method-response/#responseModels>.

* endpoints[0].responses.*.responseTemplates

    Verificar os valores em <https://docs.aws.amazon.com/apigateway/api-reference/resource/integration-response/#responseTemplates>.

    Pode ser em JSON.

Observações:

* Os modelos deverão ser criados manualmente no API Gateway antes do deploy

* requestTemplates é o mapeamento da entrada para o **event** do Lambda

* responseTemplates é o mapeamento do resultado do Lambda para o retorno do
  http

* É recomendado a criação dos templates no arquivo **s-templates.json** na raiz
  do projeto e referenciá-los com `$${nome_do_template}`.

Para realizar o deploy do endpoint:

```shell
serverless endpoint deploy <path>~<method>
```

* **path**: o path na URL da função, como definido em `endpoints[0].path`

* **method**: o método, como definido em `endpoints[0].method`

### 3.7. Definindo variáveis

Algumas variáveis podem ser definidas nos arquivos de metadados
correspondentes.

Os arquivos de definição de variáveis encontram-se em:

    _meta/variables

Os seguintes arquivos existem:

* **s-variables-common.json**: para definir variáveis a serem utilizadas em
    qualquer estágio e região

* **s-variables-<estágio>.json**: para definir variáveis a serem utilizadas somente
    no estágio especificado

* **s-variables-<estágio>-<região>.json**: para definir variáveis a serem utilizadas
    somente no estágio e região espeficados. <região> não contem os '-', i.e.
    us-east-1 = useast1

