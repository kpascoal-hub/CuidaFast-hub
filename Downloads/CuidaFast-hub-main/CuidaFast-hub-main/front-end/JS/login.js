// login.js - Sistema de login para o modal do index.html

document.addEventListener('DOMContentLoaded', function() {
  console.log('[Login] Sistema de login inicializado');

  // Selecionar o formulário de login
  const loginModal = document.getElementById('loginModal');
  if (!loginModal) {
    console.warn('[Login] Modal de login não encontrado');
    return;
  }

  const loginForm = loginModal.querySelector('form');
  if (!loginForm) {
    console.warn('[Login] Formulário de login não encontrado');
    return;
  }

  // Adicionar IDs aos campos para facilitar o acesso
  const emailInput = loginForm.querySelector('input[type="text"]');
  const passwordInput = loginForm.querySelector('input[type="password"]');

  if (emailInput) emailInput.id = 'login-email';
  if (passwordInput) passwordInput.id = 'login-password';

  // Event listener para o formulário de login
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('[Login] Tentativa de login iniciada');

    const email = emailInput.value.trim();
    const senha = passwordInput.value.trim();

    // Validar campos
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Tentar fazer login
    const loginResult = realizarLogin(email, senha);

    if (loginResult.success) {
      // Login bem-sucedido
      console.log('[Login] Login bem-sucedido:', loginResult.userData);
      
      // Fechar modal
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Mostrar mensagem de sucesso
      alert(`Bem-vindo(a), ${loginResult.userData.primeiroNome || loginResult.userData.nome}!`);

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        if (loginResult.userData.tipo === 'cuidador') {
          window.location.href = 'front-end/HTML/dashboard-cuidador.html';
        } else if (loginResult.userData.tipo === 'cliente') {
          window.location.href = 'front-end/HTML/homeCliente.html';
        } else {
          console.error('[Login] Tipo de usuário desconhecido:', loginResult.userData.tipo);
          alert('Erro: Tipo de usuário não identificado.');
        }
      }, 500);
    } else {
      // Login falhou
      console.warn('[Login] Falha no login:', loginResult.message);
      alert(loginResult.message);
      
      // Limpar senha
      passwordInput.value = '';
      passwordInput.focus();
    }
  });

  // Verificar se já está logado
  verificarSessaoAtiva();
});

/**
 * Realiza o login verificando as credenciais no localStorage
 */
function realizarLogin(email, senha) {
  console.log('[Login] Verificando credenciais para:', email);

  // Buscar todos os usuários cadastrados
  const usuarios = buscarTodosUsuarios();
  console.log('[Login] Total de usuários encontrados:', usuarios.length);

  // Procurar usuário com email correspondente
  const usuario = usuarios.find(u => 
    u.email.toLowerCase() === email.toLowerCase()
  );

  if (!usuario) {
    return {
      success: false,
      message: 'E-mail não encontrado. Verifique seus dados ou cadastre-se.'
    };
  }

  // Verificar senha (em produção, use hash!)
  // Por enquanto, como não temos senha salva, vamos aceitar qualquer senha
  // ou verificar se a senha está salva no objeto
  if (usuario.senha && usuario.senha !== senha) {
    return {
      success: false,
      message: 'Senha incorreta. Tente novamente.'
    };
  }

  // Login bem-sucedido
  // Salvar sessão ativa
  localStorage.setItem('cuidafast_user', JSON.stringify(usuario));
  localStorage.setItem('cuidafast_isLoggedIn', 'true');

  return {
    success: true,
    userData: usuario
  };
}

/**
 * Busca todos os usuários cadastrados no localStorage
 * Como estamos usando apenas 'cuidafast_user', vamos buscar esse único usuário
 * Em um sistema real, teríamos uma lista de usuários
 */
function buscarTodosUsuarios() {
  const usuarios = [];

  // Buscar usuário atual (se existir)
  const usuarioAtual = localStorage.getItem('cuidafast_user');
  if (usuarioAtual) {
    try {
      const userData = JSON.parse(usuarioAtual);
      usuarios.push(userData);
    } catch (error) {
      console.error('[Login] Erro ao parsear usuário:', error);
    }
  }

  // Em um sistema real, buscaríamos de um banco de dados
  // Por enquanto, vamos simular buscando de uma chave específica
  const usuariosCadastrados = localStorage.getItem('cuidafast_usuarios');
  if (usuariosCadastrados) {
    try {
      const lista = JSON.parse(usuariosCadastrados);
      if (Array.isArray(lista)) {
        usuarios.push(...lista);
      }
    } catch (error) {
      console.error('[Login] Erro ao parsear lista de usuários:', error);
    }
  }

  return usuarios;
}

/**
 * Verifica se já existe uma sessão ativa
 */
function verificarSessaoAtiva() {
  const isLoggedIn = localStorage.getItem('cuidafast_isLoggedIn');
  const userData = localStorage.getItem('cuidafast_user');

  if (isLoggedIn === 'true' && userData) {
    try {
      const user = JSON.parse(userData);
      console.log('[Login] Sessão ativa detectada para:', user.nome);
      
      // Opcional: Redirecionar automaticamente se já estiver logado
      // Descomente as linhas abaixo se quiser redirecionar automaticamente
      /*
      if (user.tipo === 'cuidador') {
        window.location.href = 'front-end/HTML/dashboard-cuidador.html';
      } else if (user.tipo === 'cliente') {
        window.location.href = 'front-end/HTML/homeCliente.html';
      }
      */
    } catch (error) {
      console.error('[Login] Erro ao verificar sessão:', error);
    }
  }
}

/**
 * Função auxiliar para salvar usuário na lista de cadastrados
 * Deve ser chamada no cadastro.js
 */
function salvarUsuarioNaLista(userData) {
  let usuarios = [];
  
  const usuariosExistentes = localStorage.getItem('cuidafast_usuarios');
  if (usuariosExistentes) {
    try {
      usuarios = JSON.parse(usuariosExistentes);
    } catch (error) {
      console.error('[Login] Erro ao carregar lista de usuários:', error);
    }
  }

  // Verificar se usuário já existe (por email)
  const index = usuarios.findIndex(u => u.email === userData.email);
  if (index !== -1) {
    // Atualizar usuário existente
    usuarios[index] = userData;
  } else {
    // Adicionar novo usuário
    usuarios.push(userData);
  }

  localStorage.setItem('cuidafast_usuarios', JSON.stringify(usuarios));
  console.log('[Login] Usuário salvo na lista. Total:', usuarios.length);
}

// Exportar função para uso em outros arquivos
if (typeof window !== 'undefined') {
  window.salvarUsuarioNaLista = salvarUsuarioNaLista;
}
