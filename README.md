# Endpoints do serviço

| Método | Endpoint           | Responsabilidade                                |
| ------ | ------------------ | ----------------------------------------------- |
| POST   | /movies            | Criar um novo filme                             |
| GET    | /movies            | Listar todos os filmes                          |
| PATCH  | /movies/&lt;id&gt; | Atualiza os dados de um filme de forma dinâmica |
| DELETE | /movies/&lt;id&gt; | Deleta um filme                                 |

## **Tabela**

A tabela deve seguir as seguintes especificações:

- **Nome da tabela**: movies.
- **Colunas da tabela**:
  - **id**: inteiro, auto incrementável e chave primária.
  - **name**: string, tamanho máximo 50, única e chave obrigatória.
  - **description**: texto.
  - **duration**: inteiro e chave obrigatória.
  - **price**: inteiro e chave obrigatória.

## Requisitos do Serviço

Esse serviço precisa possuir uma API REST para que os demais serviços consigam criar, listar, atualizar e deletar filmes de um banco de dados.

- O banco de dados deve ser **PostgreSQL**.
- O diagrama sobre a tabla de ver feito.

### **POST: /movies**

- Deve ser possível criar um filme contendo os seguintes dados:
  - **name**: string.
  - **description**: string.
  - **duration**: inteiro.
  - **price**: inteiro.

**_Regras de negócio_**

- Caso de sucesso:
  - **Envio**: Um objeto contendo os dados do filme a ser criado.
  - **Retorno**: Um objeto contendo os dados do filme criado.
  - **Status**: 201 CREATED.

**Exemplo de envio**:

```json
{
  "name": "exemplo",
  "duration": 100,
  "price": 74
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "exemplo",
  "duration": 100,
  "description": null,
  "price": 74
}
```

- Não deve ser possível criar um filme com um nome já existente:
  - **Envio**: Um objeto contendo um nome já existente.
  - **Retorno**: Um objeto contendo uma mensagem de erro.
  - **Status**: 409 UNIQUE.

**Exemplo de envio**:

```json
{
  "name": "exemplo",
  "duration": 100,
  "price": 74
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie already exists."
}
```

### **GET: /movies**

- Deve ser possível listar todos os filmes armazenados no banco de dados.

**_Regras de negócio_**

- Deve conter paginação utilizando os query params **page** e **perPage**.
- Deve conter ordenação utilizando os query params **sort** e **order**.

- Query Params:
  - **page** e **perPage**:
    - Por padrão, **page** deve ser **1** e **perPage** deve ser **5**.
    - Se **page** ou **perPage** forem valores negativos ou não forem números, deve utilizar os valores padrões.
    - Se **perPage** for maior que **5**, deve utilizar o valor padrão.
  - **sort** e **order**:
    - Valores possíveis para **sort**: "**price**" e "**duration**".
    - Valores possíveis para **order**: "**asc**" e "**desc**". Padrão é **asc**,
    - Se apenas **order** for enviado, a ordenação não deve ser feita.
    - Se apenas **sort** for enviado, a ordenação deve ser feita seguindo o padrão de **order**.
    - Se o valor enviado de **sort** e **order** não forem os valores possíveis, a ordenação não deve ser feita.
    - Caso os valores enviados forem os valores possíveis, deve ordenar seguindo a coluna e a clausula.
- Objeto de paginação:

  - previousPage: Uma string representando qual a URL da página anterior.
    - Caso não exista, deve retornar **null**.
  - nextPage: Uma string representando qual a URL da próxima página.
    - Caso não exista, deve retornar **null**.
  - count: Quantidade de valores retornados.
  - data: Um array contendo os filmes armazenados no banco de dados.

- Caso de sucesso:
  - **Retorno**: Objeto de paginação.
  - **Status**: 200 OK.
  - Exemplo de retorno:

```json
{
  "previousPage": null,
  "nextPage": "http://localhost:3000/movies?page=2&perPage5",
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "exemplo",
      "duration": 120,
      "description": null,
      "price": 50,
      "discount": 0,
      "stock": 0
    },
    {
      "id": 2,
      "name": "exemplo 2",
      "duration": 180,
      "description": "exemplo",
      "price": 200,
      "discount": 5,
      "stock": 5
    }
    //...
  ]
}
```

### **PATCH: /movies/&lt;id&gt;**

- Deve ser possível atualizar um filme pelo id recebido nos parâmetros da rota.

**_Regras de negócio_**

- Deve ser possível atualizar um filme contendo os seguintes dados:

  - **name**: string.
  - **description**: string.
  - **duration**: inteiro.
  - **price**: inteiro.

- Todos os dados são opcionais.

  - O filme deve ser atualizado dinamicamente seguindo os dados enviados.

- Caso de sucesso:
  - **Envio**: Um objeto contendo os dados do filme a ser atualizado.
  - **Retorno**: Um objeto contendo os dados do filme atualizado.
  - **Status**: 200 OK.

**Exemplo de envio**:

```json
{
  "duration": 180,
  "name": "exemplo 1: PATCH",
  "description": "Atualizado!"
}
```

**Exemplo de retorno**:

```json
{
  "id": 1,
  "name": "exemplo 1: PATCH",
  "description": "Atualizado!",
  "duration": 180,
  "price": 50
}
```

- Não deve ser possível atualizar um filme caso ele não exista:
  - **Envio**: Um objeto contendo os dados do filme.
  - **Retorno**: Um objeto contendo uma mensagem de erro.
  - **Status**: 404 NOT FOUND.

**Exemplo de envio**:

```json
{
  "description": "nova descrição"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie not found."
}
```

- Não deve ser possível atualizar um filme com um nome já existente:
  - **Envio**: Um objeto contendo um nome já existente.
  - **Retorno**: Um objeto contendo uma mensagem de erro.
  - **Status**: 409 UNIQUE.

**Exemplo de envio**:

```json
{
  "name": "exemplo 1: PATCH"
}
```

**Exemplo de retorno**:

```json
{
  "message": "Movie already exists."
}
```

### **DELETE: /movies/&lt;id&gt;**

**_Regras de negócio_**

- Deve ser possível deletar um filme pelo id recebido nos parâmetros da rota.

- Caso de sucesso:

  - **Envio**: Sem envio.
  - **Retorno**: Sem retorno.
  - **Status**: 204 NO CONTENT.

- Não deve ser possível deletar um filme caso ele não exista:
  - **Envio**: Sem envio.
  - **Retorno**: Um objeto contendo uma mensagem de erro.
  - **Status**: 404 NOT FOUND.

**Exemplo de retorno**:

```json
{
  "message": "Movie not found."
}
```

### **Feature Extra: Movies**

### **Tabela**

**Rotas**

- POST - Criação do filme com categorias

  - Limite a adição apenas a 6 categorias não repetidas que ficará a sua escolha. Ou seja, setar 6 categorias padrões que serão aceitas e recusar qualquer outro tipo de entrada.
  - Cada filme pode receber uma ou mais categorias na hora da criação, porém essas categorias não podem ser repetidas no mesmo filme.

- Caso de sucesso:
  - **Retorno:** Objeto de criação.
  - **Status:** 201 CREATE.

**Exemplo de retorno:**

```json
{
  "id": 1,
  "name": "exemplo",
  "duration": 120,
  "description": null,
  "price": 50,
  "discount": 0,
  "stock": 0,
  "categories": ["Drama", "Suspense"]
}
```

GET - Filtragem baseado nas categorias

- Com o intuito de utilizarmos querys params para criar a filtragem baseado na categoria passada pelo usuário.

- Por meio do query params category:
  - Ao definir um valor para a categoria, deverá buscar dentro de todos os filmes, aqueles que se encaixam com oque foi pedido no parâmetro
- Além de retornar os filmes retorne também o valor somado do preço de todos os filmes que estão com a categoria escolhida

  - **Retorno:** Objeto de criação.
  - **Status:** 200 OK.

  **Exemplo de retorno:**

```json
{
  "count": 2,
  "totalPrice": 300,
  "filterBy": "Drama",
  "data": [
    {
      "id": 1,
      "name": "exemplo",
      "duration": 120,
      "description": null,
      "price": 50,
      "discount": 0,
      "stock": 0,
      "categories": ["Drama"]
    },
    {
      "id": 2,
      "name": "exemplo 2",
      "duration": 180,
      "description": "exemplo",
      "price": 200,
      "discount": 5,
      "stock": 5,
      "categories": ["Suspense", "Drama"]
    }
  ]
}
```
