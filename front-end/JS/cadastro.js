import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
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
