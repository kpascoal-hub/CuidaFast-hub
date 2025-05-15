// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Ação ao clicar no botão
document.getElementById('btnGoogle').addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then(result => {
      const user = result.user;
      alert("Login com Google: " + user.displayName);
    })
    .catch(error => {
      console.error(error);
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
