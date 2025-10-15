# Configuração do EmailJS para Newsletter

## Passo 1: Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

## Passo 2: Adicionar Serviço de Email

1. No dashboard, vá em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. Copie o **Service ID** (ex: service_abc123)

## Passo 3: Criar Template de Email

1. Vá em "Email Templates"
2. Clique em "Create New Template"
3. Configure o template com os seguintes campos:

**Subject (Assunto):**
```
Bem-vindo à Newsletter CuidaFast!
```

**Content (Conteúdo):**
```
Olá {{to_name}},

{{message}}

Fique atento às nossas próximas novidades!

Atenciosamente,
Equipe CuidaFast
```

4. Copie o **Template ID** (ex: template_xyz789)

## Passo 4: Obter Public Key

1. Vá em "Account" > "General"
2. Copie sua **Public Key** (ex: user_abc123xyz)

## Passo 5: Atualizar o Código

No arquivo `index.html`, as credenciais já estão configuradas:

```javascript
emailjs.init("7gj__sONoSGkZ9_oW"); // Public Key já configurada
```

E também:

```javascript
emailjs.send('service_rvy4k5h', 'template_fwvasqi', templateParams) // Service e Template já configurados
```

**✅ Configuração Atual:**
- **Public Key:** `7gj__sONoSGkZ9_oW`
- **Service ID:** `service_rvy4k5h`
- **Template ID:** `template_fwvasqi`

**Observação:** Se você quiser usar suas próprias credenciais do EmailJS, substitua os valores acima pelos seus.

## Passo 6: Testar

1. Abra o `index.html` no navegador
2. Role até a seção "Fique por dentro!"
3. Preencha nome e email
4. Clique em "Enviar"
5. Verifique se o email foi recebido

## Limites do Plano Gratuito

- 200 emails por mês
- Perfeito para testes e pequenos projetos

## Alternativa: Usar apenas localStorage (sem envio real)

Se preferir não configurar o EmailJS agora, você pode comentar a linha de envio e apenas salvar no localStorage:

```javascript
// emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
//   .then(...)

// Apenas salvar localmente
alert('✅ Cadastro realizado com sucesso!');
let subscribers = JSON.parse(localStorage.getItem('cuidafast_newsletter') || '[]');
subscribers.push({ name, email, date: new Date().toISOString() });
localStorage.setItem('cuidafast_newsletter', JSON.stringify(subscribers));
newsletterForm.reset();
```
