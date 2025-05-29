/*import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";

// Configuração da SUA conta Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBsiC8RaCd-6bwuThixa1ZxFkK4JhHgfjk",
  authDomain: "cuidafast-hub-af250.firebaseapp.com",
  projectId: "cuidafast-hub-af250",
  storageBucket: "cuidafast-hub-af250.firebasestorage.app",
  messagingSenderId: "263800638065",
  appId: "1:263800638065:web:9b655c9d3e3acea160e9d0",
  measurementId: "G-701M8B5CZC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Autenticação
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Evento no botão do Google
const btnGoogle = document.getElementById("btnGoogle");
if (btnGoogle) {
  btnGoogle.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Usuário logado com Google:", user);
        alert(`Bem-vindo, ${user.displayName}!`);
        // Aqui você pode redirecionar ou preencher campos, se quiser
      })
      .catch((error) => {
        console.error("Erro no login com Google:", error);
        alert("Erro no login com Google: " + error.message);
      });
  });
}
const btnCuidador = document.getElementById('btn-cuidador');
const btnCliente = document.getElementById('btn-cliente');

btnCuidador.addEventListener('click', () => {
  btnCuidador.classList.add('active');
  btnCuidador.classList.remove('inactive');
  btnCliente.classList.remove('active');
  btnCliente.classList.add('inactive');
});

btnCliente.addEventListener('click', () => {
  btnCliente.classList.add('active');
  btnCliente.classList.remove('inactive');
  btnCuidador.classList.remove('active');
  btnCuidador.classList.add('inactive');
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // Impede o envio tradicional do formulário

  const isCuidador = btnCuidador.classList.contains("active");
  const isCliente = btnCliente.classList.contains("active");

  if (isCuidador) {
    window.location.href = "CadastroTipoProfissional.html";
  } else if (isCliente) {
    window.location.href = "HomeCliente.html";
  } else {
    alert("Selecione um tipo de usuário antes de continuar.");
  }
});*/

<script type="module"> import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js"; import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js"; // Configuração do Firebase const firebaseConfig = { apiKey: "AIzaSyBsiC8RaCd-6bwuThixa1ZxFkK4JhHgfjk", authDomain: "cuidafast-hub-af250.firebaseapp.com", projectId: "cuidafast-hub-af250", storageBucket: "cuidafast-hub-af250.appspot.com", messagingSenderId: "263800638065", appId: "1:263800638065:web:9b655c9d3e3acea160e9d0", measurementId: "G-701M8B5CZC" }; const app = initializeApp(firebaseConfig); getAnalytics(app); const auth = getAuth(app); const provider = new GoogleAuthProvider(); // Aguarda o DOM carregar document.addEventListener("DOMContentLoaded", () => { const btnGoogle = document.getElementById("btnGoogle"); const btnCuidador = document.getElementById("btn-cuidador"); const btnCliente = document.getElementById("btn-cliente"); const form = document.querySelector("#loginModal form"); if (btnGoogle) { btnGoogle.addEventListener("click", () => { signInWithPopup(auth, provider) .then((result) => { const user = result.user; alert(`Bem-vindo, ${user.displayName}!`); // Direcionar baseado na escolha if (btnCuidador && btnCuidador.classList.contains("active")) { window.location.href = "CadastroTipoProfissional.html"; } else if (btnCliente && btnCliente.classList.contains("active")) { window.location.href = "HomeCliente.html"; } else { alert("Selecione o tipo de usuário antes de continuar."); } }) .catch((error) => { console.error("Erro no login com Google:", error); alert("Erro no login com Google: " + error.message); }); }); } if (btnCuidador && btnCliente) { btnCuidador.addEventListener("click", () => { btnCuidador.classList.add("active"); btnCuidador.classList.remove("inactive"); btnCliente.classList.remove("active"); btnCliente.classList.add("inactive"); }); btnCliente.addEventListener("click", () => { btnCliente.classList.add("active"); btnCliente.classList.remove("inactive"); btnCuidador.classList.remove("active"); btnCuidador.classList.add("inactive"); }); } if (form) { form.addEventListener("submit", (event) => { event.preventDefault(); const isCuidador = btnCuidador && btnCuidador.classList.contains("active"); const isCliente = btnCliente && btnCliente.classList.contains("active"); // Aqui você pode pegar os dados do formulário se quiser tratar localmente const login = form.querySelector('input[name="login"]')?.value || ''; const senha = form.querySelector('input[name="senha"]')?.value || ''; if (!login || !senha) { alert("Preencha todos os campos."); return; } // Aqui você pode fazer uma requisição ao backend para validar // Exemplo: fetch("/verifica_login.php", { method: "POST", ... }) // Simulando sucesso: if (isCuidador) { window.location.href = "CadastroTipoProfissional.html"; } else if (isCliente) { window.location.href = "HomeCliente.html"; } else { alert("Selecione um tipo de usuário antes de continuar."); } }); } }); </script>
