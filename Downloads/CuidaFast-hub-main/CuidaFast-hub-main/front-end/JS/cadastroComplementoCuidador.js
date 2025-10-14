// cadastroComplementoCuidador.js - Complemento de cadastro para cuidadores

document.addEventListener('DOMContentLoaded', function() {
  console.log('[cadastroComplementoCuidador] Página carregada');

  // Máscaras para os campos
  const cpfInput = document.getElementById('cpf');
  const telefoneInput = document.getElementById('telefone');

  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      e.target.value = value;
    });
  }

  // Formulário
  const form = document.getElementById('complementForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('[cadastroComplementoCuidador] Formulário submetido');

      // Pegar dados existentes do localStorage
      const existingData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
      console.log('[cadastroComplementoCuidador] Dados existentes:', existingData);

      // Validar se tem dados existentes
      if (!existingData.email) {
        alert('❌ Erro: Dados do cadastro inicial não encontrados. Por favor, faça o cadastro novamente.');
        window.location.href = 'cadastro.html';
        return;
      }

      // Coletar novos dados
      const cpf = document.getElementById('cpf').value;
      const dataNascimento = document.getElementById('dataNascimento').value;

      // Validações
      if (!cpf || !dataNascimento) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      // Validar CPF (11 dígitos)
      const cpfLimpo = cpf.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        alert('CPF inválido. Digite 11 dígitos.');
        return;
      }

      // Mesclar dados: mantém tudo que já existia + adiciona novos campos
      const updatedData = {
        ...existingData, // Mantém nome, email, tipo, photoURL, etc
        cpf: cpf,
        dataNascimento: dataNascimento,
        cadastroComplementoCompleto: true,
        updatedAt: new Date().toISOString(),
      };

      // Salvar dados atualizados
      localStorage.setItem('cuidafast_user', JSON.stringify(updatedData));
      
      // Atualizar também na lista de usuários
      atualizarUsuarioNaLista(updatedData);
      
      console.log('[cadastroComplementoCuidador] Dados mesclados e salvos:', updatedData);
      alert('✅ Dados salvos com sucesso!');
      
      // Redirecionar para dashboard do cuidador
      window.location.href = 'dashboard-cuidador.html';
    });
  }
});

/**
 * Atualiza o usuário na lista de cadastrados
 */
function atualizarUsuarioNaLista(userData) {
  let usuarios = [];
  
  const usuariosExistentes = localStorage.getItem('cuidafast_usuarios');
  if (usuariosExistentes) {
    try {
      usuarios = JSON.parse(usuariosExistentes);
    } catch (error) {
      console.error('[cadastroComplementoCuidador] Erro ao carregar lista:', error);
      usuarios = [];
    }
  }

  // Procurar usuário por email
  const index = usuarios.findIndex(u => u.email === userData.email);
  if (index !== -1) {
    // Atualizar usuário existente
    usuarios[index] = userData;
    localStorage.setItem('cuidafast_usuarios', JSON.stringify(usuarios));
    console.log('[cadastroComplementoCuidador] Usuário atualizado na lista');
  }
}
