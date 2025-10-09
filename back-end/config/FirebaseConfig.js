const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Caminho para o JSON da service account
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve('./config/firebase-service-account.json'), 'utf8')
);

// Inicializa o Firebase Admin se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Exporta auth, firestore e messaging em CommonJS
const auth = admin.auth();
const db = admin.firestore();
const messaging = admin.messaging();

module.exports = { auth, db, messaging };
