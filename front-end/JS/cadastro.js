
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_ZTNiWWOD1wk8nnbkIPZXlakr0ezQnrc",
  authDomain: "cuidafasta-hub.firebaseapp.com",
  projectId: "cuidafasta-hub",
  storageBucket: "cuidafasta-hub.appspot.com",
  messagingSenderId: "376865099896",
  appId: "1:376865099896:web:6e2547c4731a6626965d8d",
  measurementId: "G-KDHEPLER7P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const btnGoogle = document.getElementById("btnGoogle");

btnGoogle.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuário autenticado:", user);
    })
    .catch((error) => {
      console.error("Erro no login com Google:", error);
    });
});
