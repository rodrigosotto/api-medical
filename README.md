# API Medical 🏥

API REST para gerenciamento de médicos e pacientes, construída com Fastify, Prisma ORM e PostgreSQL.

## 🚀 Tecnologias

- **Fastify** - Framework web de alta performance
- **Prisma ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas TypeScript-first
- **JWT** - Autenticação via tokens
- **Docker** - Containerização da aplicação
- **Swagger/Scalar** - Documentação interativa da API

## ✨ Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD de usuários
- ✅ Rotas protegidas com middleware
- ✅ Controle de acesso baseado em roles (médico/paciente)
- ✅ Validação de dados com Zod
- ✅ Documentação interativa (Swagger UI)
- ✅ Arquitetura modular e escalável

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação e Configuração

### 1️⃣ Clone o repositório

```bash
git clone <seu-repositorio>
cd api-medical
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_URL="postgresql://seunome:000000@postgres:5432/medicaldb?schema=public"
```

### 4️⃣ Suba o banco de dados com Docker

```bash
docker-compose up -d postgres
```

### 5️⃣ Execute as migrations do Prisma

```bash
npm run migrate
```

### 6️⃣ Inicie a aplicação

**Modo desenvolvimento (local):**

```bash
npm run dev
```

**Modo Docker (produção):**

```bash
docker-compose up -d
```

## 📚 Acessando a Documentação

Após iniciar a aplicação, acesse a documentação interativa:

```
http://localhost:3001/docs
```

## 🔐 Testando a API

### 1. Criar um usuário

```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. João Silva",
    "email": "joao@medical.com",
    "password": "senha123",
    "type": "medico"
  }'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@medical.com",
    "password": "senha123"
  }'
```

### 3. Acessar rota protegida

```bash
# Salvar o token em uma variável
TOKEN=$(curl -s -X POST http://localhost:3001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@medical.com","password":"senha123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Usar o token para acessar o dashboard
curl -X GET http://localhost:3001/doctors/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 📁 Estrutura do Projeto

```
api-medical/
├── src/
│   ├── config/           # Configurações (env, swagger)
│   ├── plugins/          # Plugins do Fastify (prisma, jwt, cors)
│   ├── middlewares/      # Middlewares (authenticate, checkRole)
│   ├── schemas/          # Validações Zod
│   ├── services/         # Lógica de negócio
│   ├── controllers/      # Handlers de requisições
│   ├── routes/           # Definição de rotas
│   ├── app.ts            # Ponto de entrada
│   └── server.ts         # Configuração do servidor
├── prisma/
│   └── schema.prisma     # Schema do banco de dados
├── docker-compose.yml    # Configuração Docker
├── Dockerfile            # Build da aplicação
└── package.json
```

## 🛠️ Scripts Disponíveis

```bash
npm run dev        # Inicia em modo desenvolvimento
npm run build      # Compila o TypeScript
npm start          # Inicia a aplicação compilada
npm run migrate    # Executa migrations do Prisma
npm run generate   # Gera o Prisma Client
npm run lint       # Executa o linter
npm test           # Executa os testes
```

## 🐳 Docker

### Subir toda a aplicação (API + Banco):

```bash
docker-compose up -d
```

### Rebuild completo:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Ver logs:

```bash
docker-compose logs -f api
```

### Parar containers:

```bash
docker-compose down
```

## 📖 Endpoints Principais

| Método | Endpoint              | Descrição          | Autenticação        |
| ------ | --------------------- | ------------------ | ------------------- |
| POST   | `/login`              | Login de usuário   | ❌                  |
| POST   | `/users`              | Criar usuário      | ❌                  |
| GET    | `/users`              | Listar usuários    | ❌                  |
| GET    | `/profile`            | Ver perfil         | ✅                  |
| PUT    | `/profile`            | Atualizar perfil   | ✅                  |
| GET    | `/doctors/dashboard`  | Dashboard médico   | ✅ (role: medico)   |
| GET    | `/patients/dashboard` | Dashboard paciente | ✅ (role: paciente) |

## 🔒 Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação.

1. Faça login em `/login` com email e senha
2. Receba o token JWT na resposta
3. Envie o token no header `Authorization: Bearer <token>` nas rotas protegidas

## 👥 Roles e Permissões

- **medico**: Acesso ao dashboard de médicos
- **paciente**: Acesso ao dashboard de pacientes

## 📝 Licença

ISC

## 👨‍💻 Autor

Jefferson Sotto
