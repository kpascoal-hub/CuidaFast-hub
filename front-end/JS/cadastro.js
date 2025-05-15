import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_ZTNiWWOD1wk8nnbkIPZXlakr0ezQnrc",
  authDomain: "cuidafast-hub.firebaseapp.com",
  projectId: "cuidafast-hub",
  storageBucket: "cuidafast-hub.appspot.com",
  messagingSenderId: "376865099896",
  appId: "1:376865099896:web:6e2547c4731a6626965d8d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Evento para login com Google
const btnGoogle = document.getElementById("btnGoogle");
if (btnGoogle) {
  btnGoogle.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Usuário logado:", user);
        alert(`Bem-vindo(a), ${user.displayName || "usuário"}!`);
      })
      .catch((error) => {
        console.error("Erro no login com Google:", error);
        alert("Erro no login: " + error.message);
      });
  });
} else {
  console.warn("Botão 'btnGoogle' não encontrado.");
}
