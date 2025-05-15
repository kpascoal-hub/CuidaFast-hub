// Importações do Firebase (v9+ modular, direto do CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Suas credenciais do Firebase (copie do console do Firebase)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // ⚠️ substitua corretamente
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Função para login com o Google
document.getElementById("google-login").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Bem-vindo, ${user.displayName}`);
    })
    .catch((error) => {
      alert(`Erro: ${error.message}`);
    });
});

