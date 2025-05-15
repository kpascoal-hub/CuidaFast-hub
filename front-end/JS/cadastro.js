// Importa os módulos do Firebase (modo "module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Funções
document.getElementById('btnRegister').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then(userCredential => {
      alert("Usuário registrado com sucesso!");
    })
    .catch(error => {
      alert("Erro: " + error.message);
    });
});

document.getElementById('btnLogin').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, senha)
    .then(userCredential => {
      alert("Login realizado com sucesso!");
    })
    .catch(error => {
      alert("Erro: " + error.message);
    });
});

// Monitorar autenticação
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Usuário logado:", user.email);
  } else {
    console.log("Usuário deslogado");
  }
});
