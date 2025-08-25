# teste-dm

## Rodando localmente

### docker compose

```bash
docker compose up
```

Aplicação disponível em http://localhost:8080

Nesse compose um seed roda toda vez que é iniciado, criando um usuário (email: admin@admin.com, senha: admin), 100 colaboradores, e um número variável de atestados.

### docker compose pra bancos, node pra backend/frontend

```bash
yarn install
yarn dev
docker compose up mongodb redis
```

Aplicação disponível em http://localhost:3000

### testes

```bash
npm test
```

## Contexto

### Descrição

Aplicação fullstack em monorepo usando React como framework pro frontend e NestJS pro backend. MongoDB cmo banco de dados principal e Redis como cache.

### Porque não VueJS?

Como havia conversado com o Thiago no dia 18, eu tenho conhecimento de Vue e não tenho qualquer problema em pegar pra dar aquela relembrada, mas pra um teste assim eu gastaria muito boa parte do tempo somente com isso, e não seria ideal pra um teste assim.

### Contratempos

Eu odeio desculpinhas. Aqui vão as minhas:

Dos 5 dias que tive pra fazer o teste, só consegui usar 2 1/2, por conta de compromissos já existentes, mas eu sabia que mesmo assim entregaria algo com qualidade. E tá aqui.

Então vai uma listinha com coisas que acabei tendo que sacrificar:

- react ao invés de vueJs
- testes frontend (até iria correr e fazer uns e2e com playwright, mas ia ficar muito mal feito na correria)
- ordenação por data dos atestados - eu simplesmente passei por cima disso quando fiz meu plano pra completar o projeto, só vi agora quando tô repassando a lista e escrevendo esse readme
- retry nas chamadas pra API da OMS - seriam hooks do axios que eu já usei uma vez no passado, ia relembrar, acabou ficando por último e já acabou o prazo

Espero que não perca muitos pontos só por isso. Gostaria de repassar o projeto com quem for fazer o review, se possível.

## Desenvolvimento

### Requisitos

- node 22+, dev com 24.6.0
- yarn 1, dev com 1.22.22
- docker, dev com 28.3.3
- docker compose, dev com 2.39.2
- não sei se roda 100% em windows, não há nada específico de linux no repo

### Arquitetura de repo

Monorepo com packages sendo transpilados durante dev - tudo em `./internal` serve aos `./apps`: schemas de validação, mensagens de erro, configs de biome e typescript, tipo Result, etc.

Usei [turborepo](https://github.com/vercel/turborepo) com npm workspaces, o que funciona bem nas versões recentes do node. Houve um problema com resolução de dependências do front, mas uma remoção seguida de reinstalação resolveu.

Tanto os packages quanto o backend são transpilados com [vite](https://github.com/vitejs/vite) ao invés de `tsc` ou algo mais comum pro backend como tsup ou esbuild. Funciona da mesma forma e eu gosto do controle que tenho, e a experiência com frontend ajuda a manter as configs sempre padronizadas.

### Backend

#### Tecnologia

- nestjs
- mongodb pros dados principais
- redis pra cache
- [better-auth](https://github.com/better-auth/better-auth) como framework de autenticação - faz tudo ser tão fácil e mais seguro do que fazer na unha
- prisma como orm, muito melhor que mongoose e typeorm
- zod pra validação e tipos de DTO

#### Cache

O [cache manager](https://docs.nestjs.com/techniques/caching) do próprio nest junto ao adaptador [@keyv/redis] faz caching dos endpoints ser quase trivial, mas chegar nessa combinação que foi o problema. Documentação do nest não é exatamente a melhor.

Tanto o token da OMS quanto qualquer chamada pra lá são guardadas nesse cache - a token pelo tempo expiração que vem de lá (1h) e os dados da OMS por 24h.

#### Integração com OMS

Foi menos complicado do que pensei, mas deixei passar na implementação de retry - foi falta de tempo, não escolha. Priorizei o cache e a integração com o banco de dados.

A token é atualizada quando expira, sendo a tova também guardada em cache.

### Frontend

#### Tecnologia

- react
- [mantine](https://github.com/mantinedev/mantine) com um pouco de [tailwind](https://github.com/tailwindlabs/tailwindcss) pra componentes prontos e/ou estilização.
- [fuse.js](https://github.com/krisk/fuse) pra fuzzy search, o que queimou parte significante do meu tempo no frontend...
- [swr](https://github.com/vercel/swr) é imbatível em questão de simplicidade e funcionalidade pra requests
- [wouter](https://github.com/molefrog/wouter) router simples que basicamente é o que react-router era antes de virar mega-projeto

#### Integração com backend

A rota pro backend dentro do front é simplificada (`/api`), o que é facilitado durante dev pelo devServer do vite, e em prod pelo nginx.

A autenticação é toda controlada pelo backend que envia um cookie de session, fazendo com que o frontend tenha fluxo simplificado: verifica o endpoint `/auth/me`, e segue em frente.

### Outros

#### Containers

O compose está configurado pra subir os bancos, subir o backend, o frontend, e finalmente uma instância do nginx pra agir como proxy reverso, roteando as chamadas do SPA pro container do frontend, e as chamadas pra `/api` pro backend.

Ele é o único container exposto pra fora do docker, na porta 8080.

#### Qualidade

- testes unitários (backend) com [vitest](https://github.com/vitest-dev/vitest)
- lint/format com [biome](https://github.com/biomejs/biome)
- typecheck em tudo
- uso dessas ferramentas de forma automatizada com [lint-staged](https://github.com/lint-staged/lint-staged) pra rodar nos arquivos staged e [husky](https://github.com/typicode/husky) pra chamar nos hooks do git

Eu sei que foi solicitado o uso de eslint e prettier, mas [biome](https://biomejs.dev) atende a todos os padrões de lint e format, já é robusto e estável o suficiente pra qualquer tipo de projeto, e é muito mais rápido (não que lint e format sejam tarefas necessariamente lentas, mas...).

A configuração do .vscode sugere e já habilita o uso da extensão pra rodar ao salvar.

### Por fim

Obrigado pela oportunidade. Espero que gostem.

Até!

![CI/CD](./cicd.jpg)
