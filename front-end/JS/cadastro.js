// Importações do Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getAuth } from "firebase/auth";


// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();
// Inicializa Firebase
const cadastro = initializeApp(firebaseConfig);
const auth = getAuth(cadastro);
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
