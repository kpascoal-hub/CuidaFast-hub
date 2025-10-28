const admin = require('firebase-admin');
const fs = require('fs');
require('dotenv').config();

const servicePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

if (!fs.existsSync(servicePath)) {
  console.error("⚠️ serviceAccountKey.json não encontrado!");
  process.exit(1);
}

const serviceAccount = require(servicePath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
