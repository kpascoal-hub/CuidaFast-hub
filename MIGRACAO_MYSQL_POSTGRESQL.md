# 🔄 Migração MySQL → PostgreSQL

## ⚠️ Diferenças Importantes

O código foi atualizado para usar **PostgreSQL** (Supabase) ao invés de **MySQL**. Algumas diferenças importantes:

### 1. **Sintaxe de Placeholders**
- ❌ **MySQL**: Usa `?` como placeholder
- ✅ **PostgreSQL**: Usa `$1, $2, $3...` como placeholders

### 2. **Retorno de Queries**
- ❌ **MySQL**: Retorna `[rows, fields]` (array destructuring)
- ✅ **PostgreSQL**: Retorna `{ rows, fields }` (objeto)

### 3. **Insert ID**
- ❌ **MySQL**: `result.insertId`
- ✅ **PostgreSQL**: `RETURNING id` na query

---

## 🔧 Ajustes Necessários nos Models

Todos os arquivos em `back-end/api/models/` precisam ser ajustados. Aqui está um exemplo:

### ❌ ANTES (MySQL)
```javascript
static async getById(id) {
  const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [id]);
  return rows[0];
}

static async create(usuario) {
  const [result] = await db.query(
    'INSERT INTO usuario (nome, email) VALUES (?, ?)',
    [nome, email]
  );
  return result.insertId;
}
```

### ✅ DEPOIS (PostgreSQL)
```javascript
static async getById(id) {
  const result = await db.query('SELECT * FROM usuario WHERE id = $1', [id]);
  return result.rows[0];
}

static async create(usuario) {
  const result = await db.query(
    'INSERT INTO usuario (nome, email) VALUES ($1, $2) RETURNING id',
    [nome, email]
  );
  return result.rows[0].id;
}
```

---

## 📝 Checklist de Arquivos a Ajustar

Os seguintes arquivos precisam ter suas queries ajustadas:

- [ ] `back-end/api/models/UsuarioModel.js`
- [ ] `back-end/api/models/ClienteModel.js`
- [ ] `back-end/api/models/CuidadorModel.js`
- [ ] `back-end/api/models/MensagemModel.js`
- [ ] `back-end/api/models/NotificacaoModel.js`
- [ ] `back-end/api/models/TokenModel.js`
- [ ] `back-end/api/models/PagamentoModel.js`
- [ ] `back-end/api/models/ConsultaModel.js`
- [ ] `back-end/api/models/OportunidadeModel.js`
- [ ] `back-end/api/models/ServicoTipoModel.js`
- [ ] `back-end/api/models/AtividadeCuidadorModel.js`
- [ ] `back-end/api/models/AvaliacaoConsultaModel.js`
- [ ] `back-end/api/models/ContratarModel.js`
- [ ] `back-end/api/models/VinculoModel.js`
- [ ] `back-end/api/models/DashboardModel.js`

---

## 🤖 Padrão de Substituição

Use estes padrões para fazer a migração:

### 1. Queries SELECT
```javascript
// Antes
const [rows] = await db.query('SELECT * FROM tabela WHERE id = ?', [id]);
return rows[0];

// Depois
const result = await db.query('SELECT * FROM tabela WHERE id = $1', [id]);
return result.rows[0];
```

### 2. Queries INSERT
```javascript
// Antes
const [result] = await db.query('INSERT INTO tabela (campo) VALUES (?)', [valor]);
return result.insertId;

// Depois
const result = await db.query('INSERT INTO tabela (campo) VALUES ($1) RETURNING id', [valor]);
return result.rows[0].id;
```

### 3. Queries UPDATE
```javascript
// Antes
const [result] = await db.query('UPDATE tabela SET campo = ? WHERE id = ?', [valor, id]);
return result.affectedRows;

// Depois
const result = await db.query('UPDATE tabela SET campo = $1 WHERE id = $2', [valor, id]);
return result.rowCount;
```

### 4. Queries DELETE
```javascript
// Antes
const [result] = await db.query('DELETE FROM tabela WHERE id = ?', [id]);
return result.affectedRows;

// Depois
const result = await db.query('DELETE FROM tabela WHERE id = $1', [id]);
return result.rowCount;
```

### 5. Múltiplos Placeholders
```javascript
// Antes
'INSERT INTO tabela (a, b, c) VALUES (?, ?, ?)'

// Depois
'INSERT INTO tabela (a, b, c) VALUES ($1, $2, $3)'
```

---

## ⚡ Dica: Substituição em Massa

Você pode usar regex para ajudar na migração:

1. **Substituir destructuring**:
   - Buscar: `const \[rows\] = await db\.query`
   - Substituir: `const result = await db.query`

2. **Substituir retorno**:
   - Buscar: `return rows\[0\]`
   - Substituir: `return result.rows[0]`

3. **Substituir insertId**:
   - Buscar: `result\.insertId`
   - Substituir: `result.rows[0].id`

4. **Substituir affectedRows**:
   - Buscar: `result\.affectedRows`
   - Substituir: `result.rowCount`

---

## 🧪 Testar Após Migração

Após ajustar todos os models, teste:

1. Criar um usuário
2. Buscar usuário por ID
3. Atualizar usuário
4. Deletar usuário

```bash
# Teste local
npm install
npm start

# Teste endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/teste
```
