# Troubleshooting - Problemas no Cadastro

## 🔍 Problema: "Não está cadastrando depois que coloco as informações"

### Possíveis Causas e Soluções

---

## ✅ **Correções Aplicadas**

### 1. **Event Listeners não eram adicionados corretamente**

**Problema:**
- Os elementos eram selecionados antes do DOM estar pronto
- Event listeners não eram registrados

**Solução aplicada:**
```javascript
// ANTES (ERRADO)
const form = document.querySelector('form'); // Executado antes do DOM
form.addEventListener('submit', ...); // Falha se form for null

// DEPOIS (CORRETO)
let form;
window.addEventListener('DOMContentLoaded', () => {
  form = document.getElementById('form-cadastro'); // Após DOM carregar
  form.addEventListener('submit', handleFormSubmit);
});
```

### 2. **Seletor do formulário incorreto**

**Problema:**
- Formulário tem ID `form-cadastro`
- Código usava `document.querySelector('form')`

**Solução aplicada:**
```javascript
// ANTES
const form = document.querySelector('form');

// DEPOIS
const form = document.getElementById('form-cadastro');
```

### 3. **Logs adicionados para debug**

Agora o console mostra:
```
[Cadastro] Formulário submetido
[Cadastro] Dados capturados: { nome: "...", email: "...", ... }
[Cadastro] Tipo de usuário: cuidador
[Cadastro] Usuário cadastrado: { ... }
[Cadastro] Redirecionando para complemento cuidador...
```

---

## 🧪 **Como Testar se Está Funcionando**

### Teste 1: Cadastro Manual

1. Abra `cadastro.html`
2. **Abra o Console do navegador** (F12 → Console)
3. Selecione "Cuidador" ou "Cliente"
4. Preencha:
   - Nome: Seu Nome
   - Email: email@teste.com
   - Telefone: (11) 99999-9999
   - Senha: 123456
5. Clique em "Continuar"

**Resultado esperado:**
- Console mostra: `[Cadastro] Formulário submetido`
- Alert: "✅ Cadastro realizado com sucesso!"
- Redireciona para página de complemento

### Teste 2: Cadastro com Google

1. Abra `cadastro.html`
2. Abra o Console (F12)
3. Selecione "Cuidador" ou "Cliente"
4. Clique no ícone do Google
5. Faça login com sua conta Google

**Resultado esperado:**
- Console mostra: `[Cadastro] Login com Google iniciado`
- Alert: "✅ Bem-vindo(a), Seu Nome!"
- Redireciona para página de complemento

---

## 🔧 **Verificações Adicionais**

### 1. Verificar se JavaScript está carregando

**No Console:**
```javascript
// Digite e pressione Enter
console.log('Teste');
```

Se aparecer "Teste", o console está funcionando.

### 2. Verificar se elementos existem

**No Console:**
```javascript
document.getElementById('form-cadastro')
document.getElementById('btn-cuidador')
document.getElementById('btn-cliente')
```

Todos devem retornar elementos HTML, não `null`.

### 3. Verificar localStorage

**No Console:**
```javascript
// Ver usuário cadastrado
console.log(localStorage.getItem('cuidafast_user'));

// Ver lista de usuários
console.log(localStorage.getItem('cuidafast_usuarios'));
```

Deve mostrar os dados salvos.

### 4. Limpar dados antigos (se necessário)

**No Console:**
```javascript
// Limpar tudo
localStorage.clear();
location.reload();
```

---

## 🐛 **Erros Comuns e Soluções**

### Erro 1: "Cannot read property 'addEventListener' of null"

**Causa:** Elemento não encontrado no DOM

**Solução:**
1. Verifique se o ID está correto no HTML
2. Certifique-se de que o script carrega após o DOM

### Erro 2: "form is not defined"

**Causa:** Variável não foi inicializada

**Solução:** Já corrigido na última atualização

### Erro 3: Nada acontece ao clicar em "Continuar"

**Causa:** Event listener não foi registrado

**Solução:**
1. Abra o Console
2. Digite: `document.getElementById('form-cadastro')`
3. Se retornar `null`, o ID está errado

### Erro 4: Redireciona mas não salva dados

**Causa:** localStorage não está funcionando

**Solução:**
1. Verifique se o navegador permite localStorage
2. Não use modo anônimo/privado
3. Limpe o cache do navegador

---

## 📋 **Checklist de Verificação**

Antes de reportar um problema, verifique:

- [ ] Console do navegador está aberto (F12)
- [ ] Não há erros em vermelho no console
- [ ] Selecionou "Cuidador" ou "Cliente"
- [ ] Preencheu todos os campos obrigatórios
- [ ] Navegador permite localStorage
- [ ] Não está em modo anônimo
- [ ] JavaScript está habilitado

---

## 🔍 **Debug Passo a Passo**

### 1. Abrir Console

**Chrome/Edge:** F12 ou Ctrl+Shift+I
**Firefox:** F12 ou Ctrl+Shift+K

### 2. Ir para aba "Console"

### 3. Tentar cadastrar

### 4. Ver mensagens no console

**Se aparecer:**
```
[Cadastro] Formulário submetido
[Cadastro] Dados capturados: ...
[Cadastro] Tipo de usuário: cuidador
[Cadastro] Usuário cadastrado: ...
```

✅ **Está funcionando!**

**Se NÃO aparecer nada:**
- Event listener não foi registrado
- Verifique se o arquivo JS está carregando

**Se aparecer erro em vermelho:**
- Copie o erro completo
- Procure a linha do erro no código

---

## 📊 **Estrutura de Dados Esperada**

Após cadastro bem-sucedido, o localStorage deve ter:

```javascript
// cuidafast_user
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "(11) 99999-9999",
  "senha": "123456",
  "tipo": "cuidador",
  "dataCadastro": "2024-10-15T11:30:00.000Z",
  "primeiroNome": "Maria"
}

// cuidafast_usuarios (array)
[
  {
    "nome": "Maria Silva",
    "email": "maria@email.com",
    ...
  }
]
```

---

## 🚀 **Teste Rápido**

Cole no Console e pressione Enter:

```javascript
// Teste completo
(function() {
  console.log('=== TESTE DE CADASTRO ===');
  
  // 1. Verificar elementos
  const form = document.getElementById('form-cadastro');
  const btnCuidador = document.getElementById('btn-cuidador');
  const btnCliente = document.getElementById('btn-cliente');
  
  console.log('Formulário:', form ? '✅ Encontrado' : '❌ Não encontrado');
  console.log('Botão Cuidador:', btnCuidador ? '✅ Encontrado' : '❌ Não encontrado');
  console.log('Botão Cliente:', btnCliente ? '✅ Encontrado' : '❌ Não encontrado');
  
  // 2. Verificar localStorage
  const user = localStorage.getItem('cuidafast_user');
  console.log('Usuário salvo:', user ? '✅ Sim' : '❌ Não');
  
  if (user) {
    console.log('Dados:', JSON.parse(user));
  }
  
  console.log('=== FIM DO TESTE ===');
})();
```

**Resultado esperado:**
```
=== TESTE DE CADASTRO ===
Formulário: ✅ Encontrado
Botão Cuidador: ✅ Encontrado
Botão Cliente: ✅ Encontrado
Usuário salvo: ✅ Sim (ou ❌ Não se ainda não cadastrou)
=== FIM DO TESTE ===
```

---

## 📞 **Ainda com Problemas?**

Se após todas as correções ainda não funcionar:

1. **Limpe completamente o cache:**
   - Chrome: Ctrl+Shift+Delete → Limpar tudo
   - Recarregue: Ctrl+F5

2. **Teste em modo anônimo:**
   - Ctrl+Shift+N (Chrome)
   - Ctrl+Shift+P (Firefox)

3. **Teste em outro navegador:**
   - Chrome, Firefox, Edge

4. **Verifique a versão do arquivo:**
   - Certifique-se de que está usando a versão atualizada do `cadastro.js`

5. **Copie o erro completo do console:**
   - Inclua a mensagem de erro
   - Inclua o número da linha
   - Inclua o nome do arquivo

---

## ✅ **Arquivos Corrigidos**

- ✅ `cadastro.js` - Event listeners corrigidos
- ✅ Logs de debug adicionados
- ✅ Seletores corrigidos
- ✅ Inicialização após DOM carregar

**Versão:** 15/10/2024 - 08:48
