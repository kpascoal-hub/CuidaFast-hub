import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { app } from '../firebase-init.js';

const auth = getAuth(app);
const db = getFirestore(app);

// -----------------------------
// 🔒 Verificação de autenticação
// -----------------------------
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = 'cadastro.html';
    return;
  }

  // Se já completou o cadastro, redireciona
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists() && userDoc.data().cadastroCompleto) {
    window.location.href = 'homeCliente.html';
  }
});

// -----------------------------
// 🧭 Função para buscar CEP
// -----------------------------
function buscarCEP(cepDigitado) {
  const cepInput = document.getElementById('cep');
  const btnBuscar = document.getElementById('btnBuscarCep');
  const id = cepDigitado || cepInput.value;
  const cepLimpo = id.replace(/\D/g, '');

  if (!id || cepLimpo.length !== 8) {
    alert('CEP inválido. Digite um CEP com 8 dígitos.');
    return;
  }

  const originalHTML = btnBuscar.innerHTML;

  // Feedback visual
  btnBuscar.disabled = true;
  btnBuscar.innerHTML = '<i class="ph ph-spinner ph-spin"></i>';
  btnBuscar.style.opacity = '0.6';

  console.log('🔎 Buscando CEP:', cepLimpo);

  fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    .then(response => {
      if (!response.ok) throw new Error('Erro ao buscar CEP na API');
      return response.json();
    })
    .then(data => {
      console.log('📦 Resposta ViaCEP:', data);

      if (data.erro) throw new Error('CEP não encontrado');

      document.getElementById('rua').value = data.logradouro || '';
      document.getElementById('bairro').value = data.bairro || '';
      document.getElementById('cidade').value = data.localidade || '';
      document.getElementById('estado').value = data.uf || '';

      // Feedback de sucesso
      btnBuscar.innerHTML = '<i class="ph ph-check"></i>';
      setTimeout(() => {
        btnBuscar.innerHTML = originalHTML;
        btnBuscar.disabled = false;
        btnBuscar.style.opacity = '1';
      }, 2000);

      document.getElementById('numero').focus();
    })
    .catch(error => {
      console.error('❌ Erro ao buscar CEP:', error);
      alert(error.message || 'Erro ao buscar CEP. Verifique sua conexão e tente novamente.');
      btnBuscar.innerHTML = originalHTML;
      btnBuscar.disabled = false;
      btnBuscar.style.opacity = '1';
    });
}

// -----------------------------
// ⚙️ Eventos e formatações
// -----------------------------
document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ DOM carregado - Inicializando eventos...');

  // Formatar CEP
  const cepInput = document.getElementById('cep');
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 5) {
        value = value.slice(0, 5) + '-' + value.slice(5, 8);
      }
      e.target.value = value;
    });

    // Buscar CEP ao sair do campo
    cepInput.addEventListener('blur', (e) => {
      const cep = e.target.value.replace(/\D/g, '');
      if (cep.length === 8) buscarCEP(cep);
    });
  }

  // Botão buscar CEP
  const btnBuscarCep = document.getElementById('btnBuscarCep');
  if (btnBuscarCep) {
    btnBuscarCep.addEventListener('click', (e) => {
      e.preventDefault();
      const cep = document.getElementById('cep').value;
      if (cep && cep.trim() !== '') buscarCEP(cep);
      else alert('Por favor, digite um CEP primeiro.');
    });
  } else {
    console.error('🚫 Botão btnBuscarCep não encontrado!');
  }

  // Formatar CPF
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      e.target.value = value;
    });
  }
});

// -----------------------------
// 💾 Submeter formulário
// -----------------------------
document.getElementById('form-complemento').addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    dataNascimento: document.getElementById('dataNascimento').value,
    cpf: document.getElementById('cpf').value,
    endereco: {
      cep: document.getElementById('cep').value,
      rua: document.getElementById('rua').value,
      numero: document.getElementById('numero').value,
      complemento: document.getElementById('complemento').value,
      bairro: document.getElementById('bairro').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
    },
    cadastroCompleto: true,
    updatedAt: new Date().toISOString(),
  };

  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Salvando...';

  try {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, 'users', user.uid), formData, { merge: true });
    }

    // Salvar localmente também
    const userData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
    Object.assign(userData, formData);
    localStorage.setItem('cuidafast_user', JSON.stringify(userData));

    alert('Cadastro completado com sucesso!');
    window.location.href = 'homeCliente.html';
  } catch (error) {
    console.error('⚠️ Erro ao salvar dados:', error);

    try {
      const userData = JSON.parse(localStorage.getItem('cuidafast_user') || '{}');
      Object.assign(userData, formData);
      localStorage.setItem('cuidafast_user', JSON.stringify(userData));

      alert('Dados salvos localmente. Cadastro completado!');
      window.location.href = 'homeCliente.html';
    } catch (localError) {
      alert('Erro ao completar cadastro. Tente novamente.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="ph ph-check-circle"></i> Finalizar Cadastro';
    }
  }
});
