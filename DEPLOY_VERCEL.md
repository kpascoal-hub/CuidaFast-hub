# 🚀 Guia de Deploy no Vercel - CuidaFast

## ⚠️ Problemas Corrigidos

### 1. **Banco de Dados**
- ❌ **Antes**: Código usava MySQL com credenciais hardcoded
- ✅ **Agora**: Código usa PostgreSQL do Supabase com variáveis de ambiente

### 2. **Configuração Vercel**
- ❌ **Antes**: `vercel.json` no local errado (`back-end/api/`)
- ✅ **Agora**: `vercel.json` na raiz do projeto

### 3. **Dependências**
- ❌ **Antes**: Sem `package.json`
- ✅ **Agora**: `package.json` criado com todas as dependências

---

## 📋 Pré-requisitos

### 1. Configurar Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** > **Database**
3. Copie a **Connection String (URI)** no formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Criar Tabelas no Supabase

Execute os seguintes comandos SQL no **SQL Editor** do Supabase:

```sql
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255),
  telefone VARCHAR(20),
  data_nascimento DATE,
  firebase_uid VARCHAR(255) UNIQUE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS cliente (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  endereco TEXT,
  historico_contratacoes TEXT,
  preferencias TEXT
);

-- Tabela de cuidadores
CREATE TABLE IF NOT EXISTS cuidador (
  usuario_id INTEGER PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  local_trabalho TEXT,
  experiencia TEXT,
  disponibilidade TEXT,
  certificacoes TEXT,
  avaliacao_media DECIMAL(3,2) DEFAULT 0.00
);

-- Tabela de vínculos
CREATE TABLE IF NOT EXISTS vinculo (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  cuidador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_fim TIMESTAMP,
  status VARCHAR(50) DEFAULT 'ativo'
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagem (
  id SERIAL PRIMARY KEY,
  remetente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  destinatario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lida BOOLEAN DEFAULT FALSE
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notificacao (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tokens FCM
CREATE TABLE IF NOT EXISTS token_fcm (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, token)
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamento (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  cuidador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  data_pagamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metodo_pagamento VARCHAR(50)
);

-- Tabela de consultas
CREATE TABLE IF NOT EXISTS consulta (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  cuidador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  data_consulta TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'agendada',
  observacoes TEXT
);

-- Tabela de oportunidades
CREATE TABLE IF NOT EXISTS oportunidade (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'aberta'
);

-- Tabela de tipos de serviço
CREATE TABLE IF NOT EXISTS servico_tipo (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT
);

-- Tabela de atividades do cuidador
CREATE TABLE IF NOT EXISTS atividade_cuidador (
  id SERIAL PRIMARY KEY,
  cuidador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  data_atividade TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de avaliações de consulta
CREATE TABLE IF NOT EXISTS avaliacao_consulta (
  id SERIAL PRIMARY KEY,
  consulta_id INTEGER REFERENCES consulta(id) ON DELETE CASCADE,
  avaliador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de contratações
CREATE TABLE IF NOT EXISTS contratar (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  cuidador_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
  data_contratacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'ativa'
);

-- Índices para melhor performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_firebase_uid ON usuario(firebase_uid);
CREATE INDEX idx_mensagem_remetente ON mensagem(remetente_id);
CREATE INDEX idx_mensagem_destinatario ON mensagem(destinatario_id);
CREATE INDEX idx_notificacao_usuario ON notificacao(usuario_id);
CREATE INDEX idx_vinculo_cliente ON vinculo(cliente_id);
CREATE INDEX idx_vinculo_cuidador ON vinculo(cuidador_id);
```

---

## 🔧 Configurar Variáveis de Ambiente no Vercel

1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DATABASE_URL` | `postgresql://postgres:...` | Connection String do Supabase |
| `FRONTEND_ORIGIN` | `https://seu-site.vercel.app` | URL do seu site |
| `FIREBASE_PROJECT_ID` | `seu-project-id` | ID do projeto Firebase |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\n..."` | Chave privada do Firebase |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@...` | Email do Firebase Admin |
| `NODE_ENV` | `production` | Ambiente de produção |

### Como obter as credenciais do Firebase:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Vá em **Project Settings** > **Service Accounts**
3. Clique em **Generate New Private Key**
4. Baixe o arquivo JSON
5. Use os valores do arquivo para preencher as variáveis

---

## 📦 Deploy no Vercel

### Opção 1: Via GitHub (Recomendado)

1. Faça push do código para o GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

---

## ✅ Verificar Deploy

Após o deploy, teste os endpoints:

1. **Health Check**: `https://seu-site.vercel.app/api/health`
2. **Teste API**: `https://seu-site.vercel.app/api/teste`

Ambos devem retornar `{ "ok": true }`

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'mysql2'"
- ✅ **Corrigido**: Código agora usa `pg` (PostgreSQL)

### Erro: "Connection refused"
- Verifique se a `DATABASE_URL` está correta no Vercel
- Certifique-se que o IP do Vercel está permitido no Supabase

### Erro: "CORS"
- Configure `FRONTEND_ORIGIN` com a URL correta do seu site

### Erro: "Firebase Admin"
- Verifique se todas as variáveis do Firebase estão configuradas
- A `FIREBASE_PRIVATE_KEY` deve estar entre aspas duplas

---

## 📝 Próximos Passos

1. ✅ Configurar variáveis de ambiente no Vercel
2. ✅ Criar tabelas no Supabase
3. ✅ Fazer deploy
4. ✅ Testar endpoints
5. 🔄 Configurar domínio customizado (opcional)

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Teste a conexão com o Supabase
3. Verifique se todas as variáveis de ambiente estão configuradas
