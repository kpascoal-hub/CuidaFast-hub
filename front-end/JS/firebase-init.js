// Importa SDKs Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging.js";

// Configuração do seu projeto (já fornecida pelo Firebase)
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
const db = getFirestore(app);
const messaging = getMessaging(app);

// Função para salvar token no Firestore
async function salvarToken(token) {
  try {
    await addDoc(collection(db, "tokens"), {
      token: token,
      createdAt: new Date()
    });
    console.log("✅ Token salvo no Firestore:", token);
  } catch (e) {
    console.error("❌ Erro ao salvar token:", e);
  }
}

// Solicitar permissão e obter token
async function initFCM() {
  try {
    // 🔑 Troque pela sua VAPID KEY do Firebase Console (Configurações > Cloud Messaging)
    const token = await getToken(messaging, { 
  vapidKey: "BAMeCbsVy0Wy1fqjHxjyHcviJhGUQC4S6VhLKC9FMgB8wJIYWYzW2EaEzqR8wY1SaIKrwc0-D3aRotYl2VmHqwA" 
})/

    if (token) {
      console.log("📲 Token de notificação gerado:", token);
      salvarToken(token);
    } else {
      console.warn("⚠️ Usuário não concedeu permissão para notificações.");
    }
  } catch (error) {
    console.error("❌ Erro ao obter token:", error);
  }
}

// Receber notificações em primeiro plano
onMessage(messaging, (payload) => {
  console.log("📩 Notificação recebida em primeiro plano:", payload);

  // Exemplo: exibir alerta
  alert(`📢 ${payload.notification.title}\n${payload.notification.body}`);
});

// Inicializa FCM ao carregar
initFCM();
