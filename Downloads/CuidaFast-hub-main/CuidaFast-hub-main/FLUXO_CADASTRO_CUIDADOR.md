# Fluxo de Cadastro do Cuidador - CuidaFast

## 📋 Visão Geral

O cadastro do cuidador é dividido em **4 etapas** sequenciais para coletar todas as informações necessárias.

---

## 🔄 Fluxo Completo

```
ETAPA 1: Cadastro Inicial
   ↓
ETAPA 2: Complemento de Cadastro
   ↓
ETAPA 3: Seleção de Tipo de Serviço
   ↓
ETAPA 4: Envio de Documentos
   ↓
Dashboard do Cuidador
```

---

## 📝 Detalhamento das Etapas

### **ETAPA 1: Cadastro Inicial**

**Página:** `cadastro.html`

**Campos:**
- ✅ Nome completo
- ✅ Email
- ✅ Senha
- ✅ Confirmação de senha
- ✅ Telefone
- ✅ Tipo de conta: **Cuidador**

**Opções de cadastro:**
- Cadastro manual (email/senha)
- Cadastro rápido com Google (pega foto automaticamente)

**Ao finalizar:**
- Dados salvos no `localStorage` (`cuidafast_user`)
- Redireciona para → `cadastroComplementoCuidador.html`

---

### **ETAPA 2: Complemento de Cadastro**

**Página:** `cadastroComplementoCuidador.html`

**Campos:**
- ✅ CPF (com máscara: 000.000.000-00)
- ✅ Data de Nascimento
- ✅ **Foto de Perfil** (apenas se NÃO cadastrou com Google)
  - Upload de imagem
  - Preview em tempo real
  - Validação: máx 5MB, formatos JPG/PNG

**Lógica da foto:**
```javascript
if (!userData.photoURL) {
  // Mostra campo de upload
  photoUploadGroup.style.display = 'block';
} else {
  // Usa foto do Google automaticamente
  console.log('Usando foto do Google');
}
```

**Ao clicar em "Continuar":**
- Dados mesclados com os existentes
- Foto salva (se fez upload) ou mantém foto do Google
- Redireciona para → `cadastrocuidadortipo.html`

---

### **ETAPA 3: Seleção de Tipo de Serviço**

**Página:** `cadastrocuidadortipo.html`

**Opções (múltipla escolha):**
- ✅ Cuidador de Idosos
- ✅ Cuidador de Pet (petwalker, petsitter)
- ✅ Cuidador Infantil

**Validação:**
- Deve selecionar **pelo menos 1** tipo de serviço

**Dados salvos:**
```javascript
{
  servicosOferecidos: ['idoso', 'pet'], // Array
  tipoServico: 'idoso, pet' // String para exibição
}
```

**Ao clicar em "Continuar":**
- Serviços salvos no perfil do cuidador
- Redireciona para → `enviardocumentoscuidador.html`

---

### **ETAPA 4: Envio de Documentos**

**Página:** `enviardocumentoscuidador.html`

**Documentos solicitados:**
- ✅ RG (Frente)
- ✅ RG (Verso)
- ✅ Comprovante de Residência
- ✅ Certificado de Conclusão de Curso (opcional)
- ✅ Atestado de Antecedentes Criminais (opcional)

**Funcionalidades:**
- Upload de múltiplos arquivos
- Preview dos documentos enviados
- Validação de formatos aceitos

**Ao clicar em "Finalizar Cadastro":**
- Documentos salvos (Base64 no localStorage)
- `cadastroCompleto: true`
- Redireciona para → `dashboard-cuidador.html`

---

## 🎯 Estrutura de Dados Final

Após completar todas as etapas, o objeto do cuidador terá:

```javascript
{
  // ETAPA 1: Cadastro Inicial
  nome: 'Maria Santos Silva',
  email: 'maria@email.com',
  senha: 'hash_da_senha',
  telefone: '(11) 99999-9999',
  tipo: 'cuidador',
  photoURL: 'https://google.com/photo.jpg', // ou Base64 do upload
  
  // ETAPA 2: Complemento
  cpf: '123.456.789-00',
  dataNascimento: '1990-05-15',
  cadastroComplementoCompleto: true,
  
  // ETAPA 3: Tipo de Serviço
  servicosOferecidos: ['idoso', 'pet'],
  tipoServico: 'idoso, pet',
  
  // ETAPA 4: Documentos
  documentos: {
    rgFrente: 'data:image/jpeg;base64,...',
    rgVerso: 'data:image/jpeg;base64,...',
    comprovanteResidencia: 'data:image/jpeg;base64,...',
    certificado: 'data:image/jpeg;base64,...',
    antecedentes: 'data:image/jpeg;base64,...'
  },
  cadastroCompleto: true,
  
  // Metadados
  createdAt: '2024-10-15T10:00:00Z',
  updatedAt: '2024-10-15T10:30:00Z'
}
```

---

## 📊 Fluxo Visual Detalhado

```
┌─────────────────────────────────────────────────────────────┐
│                    CADASTRO DO CUIDADOR                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ETAPA 1: Cadastro Inicial (cadastro.html)                   │
├─────────────────────────────────────────────────────────────┤
│ • Nome completo                                              │
│ • Email                                                      │
│ • Senha                                                      │
│ • Telefone                                                   │
│ • Tipo: Cuidador                                            │
│                                                              │
│ [Opção] Cadastro rápido com Google                         │
│   → Pega foto automaticamente                               │
│                                                              │
│ [Botão: Cadastrar] ──────────────────────────────────────┐  │
└──────────────────────────────────────────────────────────┼──┘
                                                           │
                                                           ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 2: Complemento (cadastroComplementoCuidador.html)     │
├─────────────────────────────────────────────────────────────┤
│ • CPF (máscara: 000.000.000-00)                             │
│ • Data de Nascimento                                         │
│                                                              │
│ [Condicional] Foto de Perfil                                │
│   SE cadastrou com Google:                                  │
│     → Usa foto do Google (automático)                       │
│   SE cadastrou manual:                                      │
│     → Mostra campo de upload                                │
│     → Preview da foto                                       │
│     → Validação: 5MB, JPG/PNG                              │
│                                                              │
│ [Botão: Continuar] ──────────────────────────────────────┐  │
└──────────────────────────────────────────────────────────┼──┘
                                                           │
                                                           ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 3: Tipo de Serviço (cadastrocuidadortipo.html)        │
├─────────────────────────────────────────────────────────────┤
│ Selecione os serviços que você oferece:                     │
│                                                              │
│ ☐ Cuidador de Idosos                                        │
│   Cuidados especializados para pessoas idosas               │
│                                                              │
│ ☐ Cuidador de Pet                                           │
│   Petwalker, petsitter                                      │
│                                                              │
│ ☐ Cuidador Infantil                                         │
│   Serviços de cuidados infantil                             │
│                                                              │
│ Validação: Mínimo 1 selecionado                            │
│                                                              │
│ [Botão: Continuar] ──────────────────────────────────────┐  │
└──────────────────────────────────────────────────────────┼──┘
                                                           │
                                                           ↓
┌─────────────────────────────────────────────────────────────┐
│ ETAPA 4: Documentos (enviardocumentoscuidador.html)         │
├─────────────────────────────────────────────────────────────┤
│ Envie seus documentos:                                       │
│                                                              │
│ • RG (Frente) ........................... [Upload] [✓]      │
│ • RG (Verso) ............................ [Upload] [✓]      │
│ • Comprovante de Residência ............. [Upload] [✓]      │
│ • Certificado de Curso (opcional) ....... [Upload] [ ]      │
│ • Antecedentes Criminais (opcional) ..... [Upload] [ ]      │
│                                                              │
│ [Preview dos documentos enviados]                           │
│                                                              │
│ [Botão: Finalizar Cadastro] ─────────────────────────────┐  │
└──────────────────────────────────────────────────────────┼──┘
                                                           │
                                                           ↓
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD DO CUIDADOR (dashboard-cuidador.html)             │
├─────────────────────────────────────────────────────────────┤
│ • Estatísticas de serviços                                  │
│ • Solicitações pendentes                                    │
│ • Receita total                                             │
│ • Avaliações                                                │
│                                                              │
│ Cadastro completo! ✅                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Validações em Cada Etapa

| Etapa | Validações |
|-------|------------|
| **1. Cadastro Inicial** | Email válido, senha mínima, telefone formatado, tipo selecionado |
| **2. Complemento** | CPF com 11 dígitos, data válida, foto < 5MB (se upload) |
| **3. Tipo de Serviço** | Pelo menos 1 serviço selecionado |
| **4. Documentos** | RG frente/verso e comprovante obrigatórios |

---

## 💾 Persistência de Dados

**LocalStorage Keys:**
- `cuidafast_user` - Dados do usuário logado
- `cuidafast_usuarios` - Lista de todos os usuários cadastrados

**Atualização:**
Cada etapa **mescla** os novos dados com os existentes usando spread operator:
```javascript
const updatedData = {
  ...existingData, // Mantém dados anteriores
  cpf: cpf,        // Adiciona novos dados
  dataNascimento: dataNascimento
};
```

---

## 🚀 Como Testar o Fluxo Completo

1. **Acesse:** `cadastro.html`
2. **Preencha:** Nome, email, senha, telefone
3. **Selecione:** Tipo de conta = Cuidador
4. **Clique:** Cadastrar
5. **Preencha:** CPF e data de nascimento
6. **Upload:** Foto de perfil (se não usou Google)
7. **Clique:** Continuar
8. **Selecione:** Pelo menos 1 tipo de serviço
9. **Clique:** Continuar
10. **Upload:** RG (frente/verso) e comprovante
11. **Clique:** Finalizar Cadastro
12. **Resultado:** Dashboard do cuidador carregado ✅

---

## ⚠️ Importante

- ✅ Cada etapa valida os dados antes de prosseguir
- ✅ Dados são salvos incrementalmente (não perde informações)
- ✅ Foto do Google é priorizada sobre upload manual
- ✅ Documentos são salvos em Base64 (localStorage)
- ⚠️ Para produção, migrar documentos para storage real (Firebase Storage, AWS S3, etc.)

---

## 📁 Arquivos Envolvidos

| Arquivo | Descrição |
|---------|-----------|
| `cadastro.html` | Etapa 1: Cadastro inicial |
| `cadastroComplementoCuidador.html` | Etapa 2: Complemento |
| `cadastroComplementoCuidador.js` | Lógica da etapa 2 |
| `cadastrocuidadortipo.html` | Etapa 3: Tipo de serviço |
| `cadastrocuidadortipo.js` | Lógica da etapa 3 |
| `enviardocumentoscuidador.html` | Etapa 4: Documentos |
| `dashboard-cuidador.html` | Destino final |

---

## 🎯 Próximas Melhorias

1. **Barra de Progresso**
   - Mostrar "Etapa 2 de 4" em cada página
   - Indicador visual de progresso

2. **Validação em Tempo Real**
   - Validar CPF enquanto digita
   - Verificar se email já existe

3. **Preview de Documentos**
   - Mostrar miniaturas dos documentos enviados
   - Permitir remover e reenviar

4. **Salvamento Automático**
   - Salvar rascunho a cada campo preenchido
   - Permitir retomar cadastro incompleto

5. **Notificação de Aprovação**
   - Após envio de documentos, aguardar aprovação
   - Notificar quando conta for aprovada
