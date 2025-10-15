# 📚 Documentação - API de Perfis

## 🔒 Segurança Implementada

Esta API foi criada para **proteger dados sensíveis** dos usuários. Ao invés de expor todos os dados no frontend via localStorage, agora os dados são gerenciados pelo backend.

### ✅ O que foi implementado:

1. **Controller (`perfilController.js`)**: Gerencia a lógica de negócio
2. **Routes (`perfilRoutes.js`)**: Define os endpoints da API
3. **Filtragem de dados**: Apenas dados públicos são retornados

---

## 🚀 Como Usar no Frontend

### 1️⃣ Buscar Perfil de Cuidador

**Endpoint:** `GET /api/perfil/cuidador/:id`

**Exemplo de uso no JavaScript:**

```javascript
// Buscar perfil do cuidador por ID
async function buscarPerfilCuidador(cuidadorId) {
  try {
    const response = await fetch(`http://localhost:3000/api/perfil/cuidador/${cuidadorId}`);
    
    if (!response.ok) {
      throw new Error('Cuidador não encontrado');
    }
    
    const perfil = await response.json();
    console.log('Perfil do cuidador:', perfil);
    
    // Usar os dados para preencher a página
    document.getElementById('caregiverName').textContent = perfil.nome;
    document.getElementById('caregiverAvatar').src = perfil.foto_perfil;
    document.getElementById('caregiverBio').textContent = perfil.descricao;
    // ... etc
    
    return perfil;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    alert('Erro ao carregar perfil do cuidador');
  }
}

// Usar na página
const urlParams = new URLSearchParams(window.location.search);
const cuidadorId = urlParams.get('id'); // Agora usa ID ao invés de email
buscarPerfilCuidador(cuidadorId);
```

---

### 2️⃣ Buscar Perfil de Cliente

**Endpoint:** `GET /api/perfil/cliente/:id`

**Exemplo de uso:**

```javascript
async function buscarPerfilCliente(clienteId) {
  try {
    const response = await fetch(`http://localhost:3000/api/perfil/cliente/${clienteId}`);
    
    if (!response.ok) {
      throw new Error('Cliente não encontrado');
    }
    
    const perfil = await response.json();
    console.log('Perfil do cliente:', perfil);
    
    return perfil;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
  }
}
```

---

### 3️⃣ Buscar Perfil por Email

**Endpoint:** `GET /api/perfil/buscar?email=xxx&tipo=cuidador`

**Exemplo de uso:**

```javascript
async function buscarPerfilPorEmail(email, tipo) {
  try {
    const url = `http://localhost:3000/api/perfil/buscar?email=${encodeURIComponent(email)}&tipo=${tipo}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Perfil não encontrado');
    }
    
    const perfil = await response.json();
    return perfil;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

// Exemplo de uso
const perfil = await buscarPerfilPorEmail('cuidador@email.com', 'cuidador');
```

---

### 4️⃣ Listar Todos os Cuidadores

**Endpoint:** `GET /api/perfil/cuidadores`

**Com filtros:** `GET /api/perfil/cuidadores?especialidade=idoso&cidade=São Paulo&valorMax=50`

**Exemplo de uso:**

```javascript
async function listarCuidadores(filtros = {}) {
  try {
    // Construir query params
    const params = new URLSearchParams();
    if (filtros.especialidade) params.append('especialidade', filtros.especialidade);
    if (filtros.cidade) params.append('cidade', filtros.cidade);
    if (filtros.valorMax) params.append('valorMax', filtros.valorMax);
    
    const url = `http://localhost:3000/api/perfil/cuidadores?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar cuidadores');
    }
    
    const data = await response.json();
    console.log(`Encontrados ${data.total} cuidadores`);
    
    // Renderizar lista
    data.cuidadores.forEach(cuidador => {
      console.log(`${cuidador.nome} - R$ ${cuidador.valor_hora}/hora`);
    });
    
    return data.cuidadores;
  } catch (error) {
    console.error('Erro ao listar cuidadores:', error);
    return [];
  }
}

// Exemplo de uso com filtros
const cuidadores = await listarCuidadores({
  especialidade: 'idoso',
  cidade: 'São Paulo',
  valorMax: 50
});
```

---

### 5️⃣ Atualizar Foto de Perfil

**Endpoint:** `PUT /api/perfil/foto`

**Exemplo de uso:**

```javascript
async function atualizarFotoPerfil(userId, fotoUrl) {
  try {
    const response = await fetch('http://localhost:3000/api/perfil/foto', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        fotoUrl: fotoUrl
      })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar foto');
    }
    
    const data = await response.json();
    console.log('Foto atualizada:', data.fotoUrl);
    
    return data;
  } catch (error) {
    console.error('Erro ao atualizar foto:', error);
  }
}
```

---

## 🔐 Dados Retornados

### Perfil de Cuidador (Público)

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "(11) 99999-9999",
  "foto_perfil": "https://...",
  "data_cadastro": "2025-01-15",
  "tipos_cuidado": "idoso,crianca",
  "descricao": "Cuidadora experiente...",
  "valor_hora": 45.00,
  "especialidades": "Alzheimer, Parkinson",
  "experiencia": "5 anos",
  "avaliacao": 4.8,
  "horarios_disponiveis": "Segunda a Sexta, 8h-18h",
  "idiomas": "Português, Inglês",
  "formacao": "Técnica em Enfermagem",
  "local_trabalho": "São Paulo, SP"
}
```

### Perfil de Cliente (Público)

```json
{
  "id": 2,
  "nome": "João Santos",
  "foto_perfil": "https://...",
  "data_cadastro": "2025-01-10",
  "endereco": "São Paulo, SP",
  "preferencias": "Cuidador com experiência em idosos"
}
```

---

## ❌ Dados NÃO Retornados (Protegidos)

Para **segurança**, os seguintes dados **NUNCA** são retornados pela API:

- ❌ Senha (hash)
- ❌ CPF
- ❌ RG
- ❌ Dados bancários
- ❌ Endereço completo (apenas cidade/estado)
- ❌ Ganhos totais do cuidador
- ❌ Histórico completo de contratações
- ❌ Dados de pagamento

---

## 🔧 Configuração no Backend

### 1. Adicionar as rotas no `app.js` ou `server.js`:

```javascript
const perfilRoutes = require('./routes/perfilRoutes');

// Adicionar as rotas
app.use('/api/perfil', perfilRoutes);
```

### 2. Testar as rotas:

```bash
# Testar se a rota está funcionando
curl http://localhost:3000/api/perfil/

# Buscar cuidador por ID
curl http://localhost:3000/api/perfil/cuidador/1

# Listar todos os cuidadores
curl http://localhost:3000/api/perfil/cuidadores
```

---

## 📝 Migração do Frontend

### Antes (INSEGURO ❌):

```javascript
// Dados expostos no localStorage
const caregiver = JSON.parse(localStorage.getItem(`caregiver_${email}`));
// Todos os dados sensíveis acessíveis no frontend!
```

### Depois (SEGURO ✅):

```javascript
// Dados buscados do backend via API
const caregiver = await fetch(`/api/perfil/cuidador/${id}`).then(r => r.json());
// Apenas dados públicos retornados!
```

---

## 🎯 Benefícios

1. ✅ **Segurança**: Dados sensíveis protegidos no backend
2. ✅ **Controle**: Backend decide quais dados expor
3. ✅ **Escalabilidade**: Fácil adicionar autenticação/autorização
4. ✅ **Manutenção**: Lógica centralizada no backend
5. ✅ **Performance**: Pode adicionar cache facilmente

---

## 🚨 Próximos Passos (Recomendado)

1. **Adicionar autenticação JWT** nas rotas que precisam
2. **Implementar rate limiting** para evitar abuso
3. **Adicionar validação de dados** com express-validator
4. **Implementar cache** para melhorar performance
5. **Adicionar logs** de acesso aos perfis

---

## 📞 Suporte

Se tiver dúvidas sobre como usar a API, consulte:
- `perfilController.js` - Lógica de negócio
- `perfilRoutes.js` - Definição das rotas
- Este arquivo - Exemplos de uso
