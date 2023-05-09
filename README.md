# OJTracker - FrontEnd

FrontEnd do projeto de TCC OJTracker

# Pré-requisitos

- Docker 23.03 ([Linux](https://github.com/arthurbdiniz/kind-tutorial/blob/master/0-install-tools.sh))
- Docker Compose 1.29.2 ([Linux](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04))

# Como executar

- Clone o repositório:

```
git clone https://github.com/OJTracker/oj-tracker-frontend.git
```

- Navegue até a pasta do projeto:

```
cd oj-tracker-frontend
```

- Crie o arquivo `.env` com as variáveis de ambiente, cujo conteúdo deve ser:

```
REACT_APP_ATCODER_API_URL=URL da API para extração de dados do AtCoder.
REACT_APP_CODEFORCES_API_URL=URL da API para extração de dados do Codeforces.
REACT_APP_UVA_API_URL=URL da API para extração de dados do UvA Online Judge.
```

- Execute o comando para criar e executar o contêiner: `docker-compose up`. Em caso de problemas de permissão, veja as possíveis soluções neste [link](https://stackoverflow.com/questions/48957195/how-to-fix-docker-got-permission-denied-issue).

- Acesse a aplicação pela URL `http://localhost:3000`.

# Como executar via NPM

- Clone o repositório:

```
git clone https://github.com/OJTracker/oj-tracker-frontend.git
```

- Navegue até a pasta do projeto:

```
cd oj-tracker-frontend
```

- Crie o arquivo `.env` com as variáveis de ambiente, cujo conteúdo deve ser:

```
REACT_APP_ATCODER_API_URL=URL da API para extração de dados do AtCoder.
REACT_APP_CODEFORCES_API_URL=URL da API para extração de dados do Codeforces.
REACT_APP_UVA_API_URL=URL da API para extração de dados do UvA Online Judge.
REACT_APP_SPOJ_API_URL=URL da API para extração de dados do SPOJ.
```

- Execute o comando `npm install` para instalar as dependências do projeto.

- Execute o comando `npm start` para iniciar a aplicação.

- Acesse a aplicação pela URL `http://localhost:3000`.
