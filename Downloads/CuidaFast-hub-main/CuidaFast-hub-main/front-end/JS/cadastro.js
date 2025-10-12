import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";


const firebaseConfig = {
  apiKey: "AIzaSyBsiC8RaCd-6bwuThixa1ZxFkK4JhHgfjk",
  authDomain: "cuidafast-hub-af250.firebaseapp.com",
  projectId: "cuidafast-hub-af250",
  storageBucket: "cuidafast-hub-af250.firebasestorage.app",
  messagingSenderId: "263800638065",
  appId: "1:263800638065:web:9b655c9d3e3acea160e9d0",
  measurementId: "G-701M8B5CZC"
};


const app = initializeApp(firebaseConfig);
getAnalytics(app);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const btnGoogle = document.getElementById("btnGoogle");
btnGoogle.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      console.log("Usuário logado com Google:", user);
      
      // Determinar tipo de usuário
      let tipoUsuario = '';
      if (btnCuidador.classList.contains("active")) {
        tipoUsuario = 'cuidador';
      } else if (btnCliente.classList.contains("active")) {
        tipoUsuario = 'cliente';
      } else {
        alert("Selecione um tipo de usuário antes de continuar.");
        return;
      }

      // Criar objeto de usuário com dados do Google
      const userData = {
        nome: user.displayName || 'Usuário',
        email: user.email,
        telefone: user.phoneNumber || '',
        tipo: tipoUsuario,
        dataCadastro: new Date().toISOString(),
        primeiroNome: (user.displayName || 'Usuário').split(' ')[0],
        photoURL: user.photoURL || ''
      };

      // Salvar no localStorage
      localStorage.setItem('cuidafast_user', JSON.stringify(userData));
      localStorage.setItem('cuidafast_isLoggedIn', 'true');

      alert(`Bem-vindo, ${userData.nome}!`);

      setTimeout(() => {
        if (tipoUsuario === 'cuidador') {
          location.assign("../HTML/enviardocumentoscuidador.html");
        } else {
          // Cliente vai para página de complemento
          location.assign("../HTML/cadastroComplemento.html");
        }
      }, 100);
    })
    .catch(error => {
      console.error("Erro no login com Google:", error);
      alert("Erro no login com Google: " + error.message);
    });
});
const btnCuidador = document.getElementById('btn-cuidador');
const btnCliente = document.getElementById('btn-cliente');
const form = document.querySelector('form'); 
const btnSubmit = document.querySelector("button[type='submit']");

window.addEventListener('DOMContentLoaded', () => {
  btnCliente.classList.add('active');
  btnCliente.classList.remove('inactive');
  btnCuidador.classList.remove('active');
  btnCuidador.classList.add('inactive');
  if (btnSubmit) btnSubmit.textContent = "Continuar"; 
});
function ativarCuidador() {
  btnCuidador.classList.add('active');
  btnCuidador.classList.remove('inactive');
  btnCliente.classList.remove('active');
  btnCliente.classList.add('inactive');
  if (btnSubmit) btnSubmit.textContent = "Continuar";
}

function ativarCliente() {
  btnCliente.classList.add('active');
  btnCliente.classList.remove('inactive');
  btnCuidador.classList.remove('active');
  btnCuidador.classList.add('inactive');
  if (btnSubmit) btnSubmit.textContent = "Continuar";
}

btnCuidador.addEventListener('click', ativarCuidador);
btnCliente.addEventListener('click', ativarCliente);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Capturar dados do formulário
  const nome = document.querySelector('input[type="text"]').value.trim();
  const email = document.querySelector('input[type="email"]').value.trim();
  const telefone = document.querySelector('input[type="tel"]').value.trim();
  const senha = document.querySelector('input[type="password"]').value.trim();

  // Validar campos obrigatórios
  if (!nome || !email || !senha) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Determinar tipo de usuário
  let tipoUsuario = '';
  if (btnCuidador.classList.contains("active")) {
    tipoUsuario = 'cuidador';
  } else if (btnCliente.classList.contains("active")) {
    tipoUsuario = 'cliente';
  } else {
    alert("Selecione um tipo de usuário antes de continuar.");
    return;
  }

  // Criar objeto de usuário
  const userData = {
    nome: nome,
    email: email,
    telefone: telefone,
    tipo: tipoUsuario,
    dataCadastro: new Date().toISOString(),
    primeiroNome: nome.split(' ')[0]
  };

  // Salvar no localStorage
  localStorage.setItem('cuidafast_user', JSON.stringify(userData));
  localStorage.setItem('cuidafast_isLoggedIn', 'true');

  console.log('Usuário cadastrado:', userData);

  // Redirecionar para página de complemento ou documentos
  if (tipoUsuario === 'cuidador') {
    window.location.href = "../HTML/enviardocumentoscuidador.html";
  } else {
    // Cliente vai para página de complemento (data de nascimento e endereço)
    window.location.href = "../HTML/cadastroComplemento.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.classList.remove('ph-fill');
      icon.classList.add('ph');
    });
    icon.addEventListener('mouseleave', () => {
      icon.classList.add('ph-fill');
      icon.classList.remove('ph');
    });
  });
});



