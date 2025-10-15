# Sistema de Serviços e Estatísticas - CuidaFast

## 📋 Visão Geral

O sistema de serviços permite rastrear todos os serviços realizados pelos cuidadores e atualizar automaticamente as estatísticas no dashboard.

## 🎯 Funcionalidades Implementadas

### 1. **Gerenciamento de Serviços**

Cada serviço possui:
- **ID único**: Identificador do serviço
- **Cuidador**: Email do cuidador responsável
- **Cliente**: Email e nome do cliente
- **Tipo**: idoso, criança ou pet
- **Status**: pendente, aceito, em_andamento, concluido, cancelado
- **Datas**: Contratação, início e conclusão
- **Valor**: Valor pago pelo serviço
- **Avaliação**: Nota (1-5) e comentário

### 2. **Estatísticas Automáticas**

O dashboard do cuidador exibe:
- ✅ Total de serviços realizados
- ✅ Serviços por status (pendentes, aceitos, em andamento, concluídos, cancelados)
- ✅ Receita total acumulada
- ✅ Média de avaliações
- ✅ Total de avaliações recebidas

### 3. **Atualização em Tempo Real**

Sempre que um serviço é:
- Aceito
- Iniciado
- Concluído
- Avaliado

As estatísticas do cuidador são **automaticamente atualizadas** no dashboard.

## 🚀 Como Usar

### Para Testar o Sistema

1. **Acesse a página de teste:**
   ```
   front-end/HTML/testeServicos.html
   ```

2. **Faça login como cuidador** (ou use o email de um cuidador cadastrado)

3. **Criar um serviço:**
   - Preencha o formulário com:
     - Email do cuidador
     - Email do cliente
     - Nome do cliente
     - Tipo de serviço
   - Clique em "Criar Serviço"

4. **Aceitar o serviço:**
   - Na lista de "Serviços Pendentes"
   - Clique em "Aceitar Serviço"
   - As estatísticas serão atualizadas automaticamente

5. **Concluir o serviço:**
   - Clique em "Concluir Serviço"
   - O sistema irá:
     - Marcar como concluído
     - Adicionar um valor aleatório (R$ 100-600)
     - Adicionar uma avaliação (4-5 estrelas)
     - Atualizar as estatísticas

6. **Ver as estatísticas:**
   - Vá para o dashboard do cuidador
   - As estatísticas estarão atualizadas com dados reais

## 📊 Integração com o Dashboard

### Arquivos Modificados

1. **`servicosManager.js`** - Gerenciador de serviços
2. **`dashboard-cuidador.js`** - Carrega estatísticas reais
3. **`dashboard-cuidador.html`** - Importa o servicosManager

### Como Funciona

```javascript
// 1. Criar serviço
const servico = ServicosManager.criarServico(
  'cuidador@email.com',
  'cliente@email.com',
  'João Silva',
  'idoso'
);

// 2. Aceitar serviço (atualiza estatísticas)
ServicosManager.aceitarServico(servico.id, 'cuidador@email.com');

// 3. Concluir serviço (atualiza estatísticas)
ServicosManager.concluirServico(servico.id, 'cuidador@email.com', 250.00);

// 4. Avaliar serviço (atualiza média de avaliações)
ServicosManager.avaliarServico(servico.id, 5, 'Excelente!');

// 5. Ver estatísticas
const stats = ServicosManager.getEstatisticasCuidador('cuidador@email.com');
console.log(stats);
```

## 🔄 Fluxo de um Serviço

```
1. PENDENTE
   ↓ (Cliente solicita serviço)
   
2. ACEITO
   ↓ (Cuidador aceita)
   ↓ Estatísticas atualizadas: +1 serviço aceito
   
3. EM_ANDAMENTO
   ↓ (Serviço iniciado)
   
4. CONCLUÍDO
   ↓ (Serviço finalizado)
   ↓ Estatísticas atualizadas: +1 concluído, +R$ valor, média atualizada
   
5. AVALIADO
   ↓ (Cliente avalia)
   ↓ Estatísticas atualizadas: média de avaliações recalculada
```

## 📝 Exemplo Prático

### Cenário: Primeiro Serviço de um Cuidador

**Estado Inicial:**
```javascript
{
  totalServicos: 0,
  servicosConcluidos: 0,
  receitaTotal: 0,
  mediaAvaliacoes: 0,
  totalAvaliacoes: 0
}
```

**Após criar e concluir 1 serviço:**
```javascript
{
  totalServicos: 1,
  servicosConcluidos: 1,
  receitaTotal: 250.00,
  mediaAvaliacoes: 5.0,
  totalAvaliacoes: 1
}
```

**Dashboard mostrará:**
- ✅ 1 serviço realizado
- ✅ R$ 250,00 arrecadado
- ✅ 5.0 de avaliação média
- ✅ 1 avaliação recebida

## 🎨 Personalização

### Adicionar Novos Tipos de Serviço

Edite `servicosManager.js`:
```javascript
// Aceita: 'idoso', 'crianca', 'pet', 'especial', etc.
const servico = ServicosManager.criarServico(
  cuidadorEmail,
  clienteEmail,
  clienteNome,
  'especial' // Novo tipo
);
```

### Adicionar Novos Status

Edite a estrutura do serviço para incluir novos status personalizados.

## 🔍 Debugging

Para ver os serviços salvos:
```javascript
// No console do navegador
console.log(localStorage.getItem('cuidafast_servicos'));
```

Para ver as estatísticas de um cuidador:
```javascript
const stats = ServicosManager.getEstatisticasCuidador('email@cuidador.com');
console.log(stats);
```

Para resetar todos os serviços:
```javascript
localStorage.removeItem('cuidafast_servicos');
```

## ⚠️ Importante

- As estatísticas são calculadas **automaticamente** sempre que um serviço muda de status
- Os dados são salvos no **localStorage** do navegador
- Para produção, considere migrar para um banco de dados real (Firebase, MongoDB, etc.)
- O sistema funciona offline, mas os dados são locais ao navegador

## 🎯 Próximos Passos

Para integrar com um sistema real de contratação:

1. Quando um cliente clicar em "Contratar Cuidador", criar um serviço pendente
2. Notificar o cuidador sobre a nova solicitação
3. Permitir que o cuidador aceite/recuse na página de notificações
4. Ao aceitar, atualizar o status e as estatísticas
5. Ao concluir, solicitar avaliação do cliente
6. Atualizar dashboard automaticamente

## 📧 Newsletter

O sistema de newsletter também foi implementado com:
- ✅ Envio de email real via EmailJS
- ✅ Salvamento de inscritos no localStorage
- ✅ Validação de campos
- ✅ Feedback visual durante envio

Ver `EMAILJS_SETUP.md` para instruções de configuração.
