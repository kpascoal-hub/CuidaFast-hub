// Importa Firebase compat (precisa ser compat no service worker)
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Configuração do seu Firebase (mesma do firebase-init.js)
firebase.initializeApp({
  apiKey: "AIzaSyBsiC8RaCd-6bwuThixa1ZxFkK4JhHgfjk",
  authDomain: "cuidafast-hub-af250.firebaseapp.com",
  projectId: "cuidafast-hub-af250",
  storageBucket: "cuidafast-hub-af250.firebasestorage.app",
  messagingSenderId: "263800638065",
  appId: "1:263800638065:web:9b655c9d3e3acea160e9d0",
  measurementId: "G-701M8B5CZC"
});

// Inicializa Messaging
const messaging = firebase.messaging();

// Listener para notificações recebidas em segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Notificação recebida em segundo plano:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icone.png", // Coloque o ícone do seu app aqui
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
