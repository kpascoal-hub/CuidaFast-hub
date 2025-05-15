import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GithubAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_ZTNiWWOD1wk8nnbkIPZXlakr0ezQnrc",
  authDomain: "cuidafasta-hub.firebaseapp.com",
  projectId: "cuidafasta-hub",
  storageBucket: "cuidafasta-hub.appspot.com",
  messagingSenderId: "376865099896",
  appId: "1:376865099896:web:6e2547c4731a6626965d8d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GithubAuthProvider();

// Evento ao clicar no botão
document.getElementById("btnGitHub").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuário logado:", user);
      alert("Login com GitHub bem-sucedido!");
    })
    .catch((error) => {
      console.error("Erro no login:", error);
      alert("Erro no login: " + error.message);
    });
});
