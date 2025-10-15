# Sistema de Contratação de Serviços - CuidaFast

## 🎯 Visão Geral

O sistema de contratação permite que clientes contratem cuidadores diretamente pelo perfil, criando solicitações de serviço que os cuidadores podem aceitar ou recusar.

## 📋 Fluxo Completo de Contratação

### 1. **Cliente Visualiza Perfil do Cuidador**

**Página:** `perfilCuidadorPublico.html`

**Como acessar:**
- Cliente faz login
- Busca cuidadores em `homeCliente.html`
- Clica em "Ver Perfil" de um cuidador

**O que o cliente vê:**
- ✅ Foto do cuidador
- ✅ Nome e especialidade
- ✅ Avaliações e rating
- ✅ Informações de contato
- ✅ Localização
- ✅ **Botão "Contratar Cuidador"**

---

### 2. **Cliente Solicita Contratação**

**Ação:** Cliente clica em "Contratar Cuidador"

**O que acontece:**
1. Sistema verifica se cliente está logado
2. Abre modal de contratação
3. Cliente preenche:
   - **Tipo de serviço** (Idoso, Criança ou Pet)
   - **Observações** (opcional)
4. Cliente clica em "Confirmar Contratação"

**Resultado:**
- ✅ Serviço criado com status **"pendente"**
- ✅ Salvo no `localStorage` (`cuidafast_servicos`)
- ✅ Cliente recebe mensagem de sucesso
- ✅ Cliente é redirecionado para `homeCliente.html`

**Dados salvos:**
```javascript
{
  id: 'srv_1729012345_abc123',
  cuidadorEmail: 'cuidador@email.com',
  clienteEmail: 'cliente@email.com',
  clienteNome: 'João Silva',
  tipo: 'idoso',
  status: 'pendente',
  dataContratacao: '2024-10-15T10:30:00Z',
  observacoes: 'Preciso de cuidados especiais...'
}
```

---

### 3. **Cuidador Recebe Notificação**

**Página:** `dashboard-cuidador.html`

**O que o cuidador vê:**
- ✅ Badge no ícone de notificações com número de solicitações pendentes
- ✅ Exemplo: 🔔 **3** (3 solicitações pendentes)

**Como funciona:**
```javascript
// Badge atualizado automaticamente
const servicosPendentes = ServicosManager.getServicosCuidador(email)
  .filter(s => s.status === 'pendente');

badge.textContent = servicosPendentes.length; // Mostra "3"
```

---

### 4. **Cuidador Visualiza Solicitações**

**Página:** `solicitacoesServicos.html`

**Como acessar:**
- Cuidador clica no ícone de notificações 🔔
- Ou acessa diretamente a URL

**O que o cuidador vê:**

**Tabs:**
- 📋 **Pendentes** - Solicitações aguardando resposta
- ✅ **Aceitos** - Serviços aceitos/em andamento
- ✔️ **Concluídos** - Serviços finalizados
- 📑 **Todos** - Todas as solicitações

**Informações de cada solicitação:**
- Nome e email do cliente
- Data da solicitação
- Tipo de serviço
- Observações do cliente
- Status atual
- ID do serviço

---

### 5. **Cuidador Aceita ou Recusa**

#### **Opção A: Aceitar Serviço**

**Ação:** Cuidador clica em "Aceitar Serviço"

**O que acontece:**
1. Confirmação: "Deseja aceitar esta solicitação?"
2. Status muda para **"aceito"**
3. Data de início é registrada
4. **Estatísticas do dashboard são atualizadas automaticamente**
5. Cliente é notificado (futuro: implementar notificação real)

**Resultado:**
```javascript
{
  status: 'aceito',
  dataInicio: '2024-10-15T11:00:00Z'
}
```

**Dashboard atualizado:**
- ✅ +1 serviço aceito
- ✅ Estatísticas recalculadas

#### **Opção B: Recusar Serviço**

**Ação:** Cuidador clica em "Recusar"

**O que acontece:**
1. Confirmação: "Deseja recusar? Ação irreversível"
2. Status muda para **"cancelado"**
3. Serviço removido das pendentes

---

### 6. **Cuidador Conclui Serviço**

**Quando:** Após aceitar e realizar o serviço

**Ação:** Cuidador clica em "Concluir Serviço"

**O que acontece:**
1. Sistema solicita: "Digite o valor do serviço (R$):"
2. Cuidador informa o valor (ex: 250.00)
3. Status muda para **"concluido"**
4. Data de conclusão é registrada
5. Valor é salvo
6. **Estatísticas do dashboard são atualizadas automaticamente**

**Resultado:**
```javascript
{
  status: 'concluido',
  dataConclusao: '2024-10-15T15:00:00Z',
  valorPago: 250.00
}
```

**Dashboard atualizado:**
- ✅ +1 serviço concluído
- ✅ +R$ 250,00 na receita total
- ✅ Estatísticas recalculadas

---

### 7. **Cliente Avalia Serviço** (Futuro)

**Quando:** Após conclusão do serviço

**O que acontece:**
1. Cliente recebe solicitação de avaliação
2. Cliente dá nota (1-5 estrelas) e comentário
3. Avaliação é salva no serviço
4. **Média de avaliações do cuidador é recalculada**

**Resultado:**
```javascript
{
  avaliacao: {
    nota: 5,
    comentario: 'Excelente profissional!',
    data: '2024-10-15T16:00:00Z'
  }
}
```

**Dashboard atualizado:**
- ✅ Média de avaliações recalculada
- ✅ +1 avaliação recebida

---

## 🔄 Fluxo Visual

```
CLIENTE                          SISTEMA                         CUIDADOR
   |                                |                                |
   |---> Ver Perfil                 |                                |
   |                                |                                |
   |---> Clicar "Contratar"         |                                |
   |                                |                                |
   |---> Preencher Modal            |                                |
   |     (Tipo + Observações)       |                                |
   |                                |                                |
   |---> Confirmar                  |                                |
   |                                |                                |
   |                        [Criar Serviço]                          |
   |                        status: pendente                         |
   |                                |                                |
   |                                |---> Badge Notificação (🔔 1)   |
   |                                |                                |
   |                                |<--- Cuidador acessa            |
   |                                |     solicitações               |
   |                                |                                |
   |                                |<--- Cuidador aceita            |
   |                                |                                |
   |                        [Atualizar Status]                       |
   |                        status: aceito                           |
   |                        [Atualizar Dashboard]                    |
   |                                |                                |
   |<--- Notificação (futuro)       |                                |
   |                                |                                |
   |                                |<--- Cuidador realiza           |
   |                                |     serviço                    |
   |                                |                                |
   |                                |<--- Cuidador conclui           |
   |                                |     (informa valor)            |
   |                                |                                |
   |                        [Atualizar Status]                       |
   |                        status: concluido                        |
   |                        valorPago: R$ 250                        |
   |                        [Atualizar Dashboard]                    |
   |                                |                                |
   |<--- Solicitar avaliação        |                                |
   |     (futuro)                   |                                |
   |                                |                                |
   |---> Avaliar (nota + comentário)|                                |
   |                                |                                |
   |                        [Salvar Avaliação]                       |
   |                        [Recalcular Média]                       |
   |                                |                                |
```

---

## 📁 Arquivos Envolvidos

### **Criados/Modificados:**

1. ✅ **`perfilCuidadorPublico.html`**
   - Modal de contratação
   - Integração com ServicosManager
   - Validação de cliente logado

2. ✅ **`solicitacoesServicos.html`** (NOVO)
   - Página para cuidador gerenciar solicitações
   - Tabs: Pendentes, Aceitos, Concluídos, Todos
   - Ações: Aceitar, Recusar, Concluir

3. ✅ **`dashboard-cuidador.html`**
   - Badge de notificações com contagem
   - Redirecionamento para solicitações
   - Estatísticas atualizadas automaticamente

4. ✅ **`servicosManager.js`**
   - Gerenciamento completo de serviços
   - Atualização automática de estatísticas

---

## 🧪 Como Testar

### **Teste Completo do Fluxo:**

1. **Criar Contas:**
   - Cadastre 1 cliente
   - Cadastre 1 cuidador

2. **Cliente Contrata:**
   - Faça login como cliente
   - Busque o cuidador em `homeCliente.html`
   - Clique em "Ver Perfil"
   - Clique em "Contratar Cuidador"
   - Preencha o modal e confirme

3. **Cuidador Recebe:**
   - Faça login como cuidador
   - Acesse `dashboard-cuidador.html`
   - Veja o badge de notificações (🔔 1)
   - Clique no ícone de notificações

4. **Cuidador Aceita:**
   - Na página de solicitações, veja a solicitação pendente
   - Clique em "Aceitar Serviço"
   - Confirme

5. **Verificar Dashboard:**
   - Volte para `dashboard-cuidador.html`
   - Veja as estatísticas atualizadas:
     - Total de serviços: 1
     - Serviços aceitos: 1

6. **Cuidador Conclui:**
   - Volte para solicitações
   - Vá para a tab "Aceitos"
   - Clique em "Concluir Serviço"
   - Digite um valor (ex: 250)

7. **Verificar Dashboard Final:**
   - Volte para `dashboard-cuidador.html`
   - Veja as estatísticas finais:
     - Serviços concluídos: 1
     - Receita total: R$ 250,00

---

## 🎨 Personalização

### **Adicionar Novos Tipos de Serviço:**

Edite `perfilCuidadorPublico.html`:
```html
<select class="form-select" id="tipoServico">
  <option value="idoso">Cuidado de Idosos</option>
  <option value="crianca">Cuidado Infantil</option>
  <option value="pet">Cuidado de Pets</option>
  <option value="especial">Cuidados Especiais</option> <!-- NOVO -->
</select>
```

### **Personalizar Modal:**

Edite os estilos inline no modal ou adicione classes CSS personalizadas.

---

## 🚀 Próximas Melhorias

1. **Notificações em Tempo Real**
   - Usar Firebase Cloud Messaging
   - Notificar cliente quando cuidador aceitar
   - Notificar cuidador quando receber nova solicitação

2. **Sistema de Mensagens Integrado**
   - Chat entre cliente e cuidador
   - Histórico de conversas

3. **Agendamento de Serviços**
   - Calendário para agendar data/hora
   - Lembretes automáticos

4. **Pagamento Online**
   - Integração com Stripe/PayPal
   - Pagamento direto na plataforma

5. **Avaliações Automáticas**
   - Solicitar avaliação após conclusão
   - Sistema de reviews e comentários

---

## ⚠️ Importante

- ✅ Sistema totalmente funcional com localStorage
- ✅ Estatísticas atualizadas automaticamente
- ✅ Badge de notificações dinâmico
- ✅ Validações de usuário logado
- ⚠️ Para produção, migrar para banco de dados real
- ⚠️ Implementar sistema de notificações real
- ⚠️ Adicionar autenticação mais robusta

---

## 📞 Suporte

Para dúvidas sobre o sistema de contratação, consulte:
- `SISTEMA_SERVICOS.md` - Documentação do gerenciador de serviços
- `testeServicos.html` - Página de testes do sistema
- Console do navegador - Logs detalhados de cada ação
