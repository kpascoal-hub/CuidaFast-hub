# 🔧 Instruções para Adicionar as Rotas de Perfil

## 📋 Arquivos Criados

Foram criados os seguintes arquivos no backend:

1. **`controllers/perfilController.js`** - Controller com a lógica de negócio
2. **`routes/perfilRoutes.js`** - Definição das rotas da API
3. **`EXEMPLO_USO_PERFIL_API.md`** - Documentação de uso

---

## ⚙️ Como Integrar no Backend

### Passo 1: Adicionar as rotas no `app.js`

Abra o arquivo `back-end/api/app.js` e adicione a seguinte linha:

**Localização:** Após a linha 7 (onde estão os outros imports de rotas)

```javascript
const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes'); // ← ADICIONAR ESTA LINHA
```

**Localização:** Após a linha 21 (onde estão as outras rotas registradas)

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes); // ← ADICIONAR ESTA LINHA
```

### Resultado Final do `app.js`:

```javascript
// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const moment = require('moment-timezone');

const authRoutes = require('./routes/authRoutes');
const perfilRoutes = require('./routes/perfilRoutes'); // ← NOVO

const app = express();

moment.tz.setDefault('America/Sao_Paulo');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/perfil', perfilRoutes); // ← NOVO

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/teste', (req, res) => res.json({ ok: true, mensagem: 'API funcionando corretamente!' }));

// ... resto do código
```

---

## 🧪 Testar se Funcionou

### 1. Reiniciar o servidor:

```bash
cd back-end/api
npm start
# ou
node server.js
```

### 2. Testar a rota de teste:

Abra o navegador ou use curl:

```bash
curl http://localhost:3000/api/perfil/
```

**Resposta esperada:**
```json
{
  "ok": true,
  "rota": "perfil funcionando!"
}
```

### 3. Testar buscar cuidador (exemplo):

```bash
curl http://localhost:3000/api/perfil/cuidador/1
```

---

## 📝 Adicionar Método no UsuarioModel (se necessário)

Se o método `updateFotoPerfil` não existir no `UsuarioModel.js`, adicione:

**Arquivo:** `back-end/api/models/UsuarioModel.js`

```javascript
static async updateFotoPerfil(id, fotoUrl) {
  const [result] = await db.query(
    'UPDATE usuario SET foto_perfil = ? WHERE id = ?',
    [fotoUrl, id]
  );
  return result.affectedRows;
}
```

---

## 🌐 Endpoints Disponíveis

Após adicionar as rotas, os seguintes endpoints estarão disponíveis:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/perfil/` | Teste da rota |
| GET | `/api/perfil/cuidador/:id` | Buscar perfil de cuidador |
| GET | `/api/perfil/cliente/:id` | Buscar perfil de cliente |
| GET | `/api/perfil/buscar?email=xxx&tipo=cuidador` | Buscar por email |
| GET | `/api/perfil/cuidadores` | Listar todos os cuidadores |
| PUT | `/api/perfil/foto` | Atualizar foto de perfil |

---

## 🔄 Migrar Frontend para Usar a API

### Exemplo: Página `perfilCuidadorPublico.html`

**Antes (localStorage - INSEGURO):**

```javascript
const caregiverData = localStorage.getItem(`caregiver_${email}`);
const caregiver = JSON.parse(caregiverData);
```

**Depois (API - SEGURO):**

```javascript
// Obter ID do cuidador da URL
const urlParams = new URLSearchParams(window.location.search);
const cuidadorId = urlParams.get('id'); // Agora usa ID

// Buscar dados do backend
async function carregarPerfil() {
  try {
    const response = await fetch(`http://localhost:3000/api/perfil/cuidador/${cuidadorId}`);
    
    if (!response.ok) {
      throw new Error('Cuidador não encontrado');
    }
    
    const caregiver = await response.json();
    
    // Preencher página com os dados
    document.getElementById('caregiverName').textContent = caregiver.nome;
    document.getElementById('caregiverAvatar').src = caregiver.foto_perfil || '../assets/images.webp';
    document.getElementById('caregiverBio').textContent = caregiver.descricao;
    document.getElementById('caregiverEmail').textContent = caregiver.email;
    // ... etc
    
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    alert('Erro ao carregar perfil do cuidador');
    window.location.href = 'homeCliente.html';
  }
}

// Carregar ao abrir a página
carregarPerfil();
```

---

## 🔐 Segurança Implementada

### O que foi protegido:

✅ **Dados sensíveis não são mais expostos no frontend**
- Senha (hash)
- CPF, RG
- Dados bancários
- Ganhos totais
- Histórico completo

✅ **Backend controla quais dados são públicos**
- Apenas informações necessárias são retornadas
- Fácil adicionar autenticação depois

✅ **Separação de responsabilidades**
- Frontend: Apresentação
- Backend: Lógica e segurança

---

## 🎯 Próximos Passos Recomendados

### 1. Adicionar Autenticação JWT (Opcional)

Para rotas que precisam de autenticação:

```javascript
const authMiddleware = require('../middleware/authMiddleware');

// Rota protegida
router.put('/foto', authMiddleware, perfilController.atualizarFotoPerfil);
```

### 2. Adicionar Validação de Dados

```javascript
const { body, validationResult } = require('express-validator');

router.put('/foto', [
  body('userId').isInt().withMessage('userId inválido'),
  body('fotoUrl').isURL().withMessage('URL inválida'),
], perfilController.atualizarFotoPerfil);
```

### 3. Adicionar Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requisições
});

app.use('/api/perfil', limiter);
```

---

## ❓ Troubleshooting

### Erro: "Cannot find module './routes/perfilRoutes'"

**Solução:** Verifique se o arquivo `perfilRoutes.js` está em `back-end/api/routes/`

### Erro: "Cannot find module '../controllers/perfilController'"

**Solução:** Verifique se o arquivo `perfilController.js` está em `back-end/api/controllers/`

### Erro: "Cannot find module '../models/CuidadorModel'"

**Solução:** Verifique se os models existem em `back-end/api/models/`

### Erro 404 ao acessar `/api/perfil/`

**Solução:** 
1. Verifique se adicionou as rotas no `app.js`
2. Reinicie o servidor
3. Verifique se o servidor está rodando na porta correta

---

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do servidor
2. Teste cada endpoint individualmente
3. Consulte a documentação em `EXEMPLO_USO_PERFIL_API.md`

---

## ✅ Checklist de Implementação

- [ ] Arquivos criados (controller, routes, docs)
- [ ] Rotas adicionadas no `app.js`
- [ ] Servidor reiniciado
- [ ] Rota de teste funcionando (`/api/perfil/`)
- [ ] Frontend migrado para usar a API
- [ ] Dados sensíveis removidos do localStorage
- [ ] Testes realizados

---

**Pronto! Agora seu sistema está mais seguro e profissional.** 🎉
